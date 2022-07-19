import * as dbSchema from "../schema/json-schema.json";

import Ajv, { JSONSchemaType } from "ajv";
import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";

export type Handler = (
  req: NextApiRequest,
  res: NextApiResponse,
  pkg: { db: PrismaClient }
) => Promise<void> | void;

type Methods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";

type MethodObject = {
  [key in Methods]: {
    handler: Handler;
    schema?: SchemaObject;
  };
};

type PrevalidationObject = {
  valid: boolean;
  message?: string;
};

type SchemaObject = {
  query?: Object;
  body?: Object;
  preValidation?: [
    (
      req: NextApiRequest,
      db: PrismaClient
    ) => Promise<PrevalidationObject> | PrevalidationObject
  ];
};

class Route {
  private methods: MethodObject;
  private db: PrismaClient;
  private ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true
  });

  constructor() {
    this.db = new PrismaClient();
    this.setupSchema();
    this.methods = {} as MethodObject;
  }

  handle = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req as { method: Methods };
    if (method === "OPTIONS") {
      res
        .setHeader("Allow", Object.keys(this.methods).join(","))
        .status(404)
        .end();
    } else if (typeof this.db === "undefined") {
      res.status(500).send({ error: "Database not initialized" });
    } else if (this.methods.hasOwnProperty(method)) {
      try {
        const { request, errors } = await this.processRequest(req, method);
        if (errors) {
          res.status(400).send({ errors });
        } else {
          await this.methods[method].handler(request, res, { db: this.db });
        }
      } catch (err) {
        console.log(err);
        res.status(500).send(err);
      }
    } else {
      res.status(405).end();
    }
    this.db.$disconnect();
  };

  private setupSchema() {
    const { definitions } = dbSchema as {
      $id: string;
      $schema: string;
      definitions: { [key: string]: JSONSchemaType<{}> };
    };
    Object.keys(definitions).forEach((key) => {
      this.ajv.addSchema(definitions[key], key);
    });
  }

  private validate(obj: Object, schema: JSONSchemaType<{}>) {
    const validate = this.ajv.compile({
      ...schema,
      additionalProperties: false
    });
    validate(obj);
    return validate.errors;
  }

  private async processRequest(req: NextApiRequest, methodKey: Methods) {
    const schema = this.methods[methodKey].schema;
    let errors;
    if (schema) {
      if (schema.query)
        errors = this.validate(
          req.query,
          schema.query as JSONSchemaType<unknown>
        );
      if (schema.body)
        errors = this.validate(
          req.body,
          schema.body as JSONSchemaType<unknown>
        );
      if (schema.preValidation) {
        errors = [];
        for (const preValidation of schema.preValidation) {
          const result = await preValidation(req, this.db);
          if (!result.valid) {
            errors.push(result.message);
          }
        }
      }
    }
    return { request: req, errors };
  }

  get(handler: Handler, schema?: SchemaObject) {
    this.methods.GET = { handler, schema };
  }

  patch(handler: Handler, schema?: SchemaObject) {
    this.methods.PATCH = { handler, schema };
  }

  post(handler: Handler, schema?: SchemaObject) {
    this.methods.POST = { handler, schema };
  }

  put(handler: Handler, schema?: SchemaObject) {
    this.methods.PUT = { handler, schema };
  }

  delete(handler: Handler, schema?: SchemaObject) {
    this.methods.DELETE = { handler, schema };
  }
}

export default Route;
