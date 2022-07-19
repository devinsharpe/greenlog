import Route from "../../../utils/route";
import { add } from "date-fns";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { serialize } from "cookie";

const route = new Route();

interface PostBody {
  username: string;
  password: string;
}

route.post(
  async (req, res, { db }) => {
    const { body } = req as { body: PostBody };
    const user = await db.user.findFirst({
      where: { username: body.username.trim().toLowerCase() }
    });
    if (user) {
      const isValid = await bcrypt.compare(req.body.password, user.password);
      if (isValid) {
        const userSession = await db.userSession.create({
          data: {
            userId: user.id,
            expiresAt: add(new Date(), {
              seconds: parseInt(process.env.SESSION_TTL || "3600", 10)
            })
          }
        });
        const jwt = jsonwebtoken.sign(
          { session: userSession.id, exp: userSession.expiresAt.valueOf() },
          process.env.JWT_SECRET || "secret"
        );
        res
          .setHeader(
            "Set-Cookie",
            serialize("greenlog-auth-token", jwt, {
              path: "/",
              expires: userSession.expiresAt,
              httpOnly: true
            })
          )
          .send({ user: { ...user, password: undefined }, token: jwt });
      } else {
        res.status(401).send({
          error: "Invalid credentials",
          message: "An account with that email and password could not be found"
        });
      }
    } else {
      res.status(401).send({
        error: "Invalid credentials",
        message: "An account with that email and password could not be found"
      });
    }
  },
  {
    body: {
      type: "object",
      properties: {
        username: { type: "string" },
        password: { type: "string" }
      },
      required: ["username", "password"]
    }
  }
);

export default route.handle;
