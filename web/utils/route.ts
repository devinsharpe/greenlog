import * as dbSchema from "../schema/json-schema.json";

import Ajv, { JSONSchemaType } from "ajv";
import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";

export type Handler = (
  req: NextApiRequest,
  res: NextApiResponse,
  pkg: { db?: PrismaClient }
) => Promise<void> | void;

type Methods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";

type MethodObject<T = {}, U = {}> = {
  [key in Methods]: {
    handler: Handler;
    schema?: SchemaObject<T, U>;
  };
};

type SchemaObject<T = {}, U = {}> = {
  query?: JSONSchemaType<T>;
  body?: JSONSchemaType<U>;
};

class Route {
  private methods: MethodObject;
  private db?: PrismaClient;
  private ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true
  });

  constructor(initDB = true) {
    if (initDB) this.db = new PrismaClient();
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
    } else if (this.methods.hasOwnProperty(method)) {
      await this.methods[method].handler(
        this.processRequest(req, this.methods[method].schema),
        res,
        { db: this.db }
      );
    } else {
      res.status(405).end();
    }
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
  }

  private processRequest(req: NextApiRequest, schema?: SchemaObject) {
    console.log("processRequest");
    if (schema && schema.query) this.validate(req.query, schema.query);
    if (req.body && schema && schema.body) this.validate(req.body, schema.body);
    return req;
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
