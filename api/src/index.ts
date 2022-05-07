import * as dotenv from "dotenv";

import { FastifyReply, FastifyRequest, fastify } from "fastify";

import authRouter from "./routes/auth";
import prismaPlugin from "./plugins/prisma";

dotenv.config();

async function main() {
  const server = fastify({ logger: true });
  server.register(require("fastify-jwt"), {
    secret: process.env.JWT_SECRET
  });
  server.register(prismaPlugin);
  server.register(authRouter);
  await server.listen(parseInt(process.env.API_PORT || "8000", 10), "0.0.0.0");
}

main()
  .then(() => {})
  .catch((err) => {
    console.log(err);
    process.exit(0);
  });

export default async (req: FastifyRequest, reply: FastifyReply) => {
  const app = await fastify({ logger: true });
  await app.ready();
  app.server.emit("request", req, reply);
};
