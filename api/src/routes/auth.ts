import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest
} from "fastify";

async function authRouter(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get("/", async function (req, reply) {
    reply.send({ hello: "world" });
  });

  fastify.post("/signin/", async function (req, reply) {});
}

export default authRouter;
