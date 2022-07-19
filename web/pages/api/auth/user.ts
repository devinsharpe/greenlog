import Route from "../../../utils/route";
import { add } from "date-fns";
import bcrypt from "bcrypt";

const route = new Route();

type PostBody = {
  firstName?: string;
  lastName?: string;
  username: string;
  emailAddress: string;
  password: string;
};

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

route.post(
  async (req, res, { db }) => {
    const { body } = req as { body: PostBody };
    const oldUser = await db.user.findFirst({
      where: {
        OR: [{ username: body.username }, { emailAddress: body.emailAddress }]
      }
    });
    if (oldUser) {
      res.status(400).send({
        error: "Invalid Credentials",
        message:
          "An account with that email or username currently has an account."
      });
    } else {
      if (body.password.match(passwordRegex)) {
        const user = await db.user.create({
          data: {
            firstName: body.firstName,
            lastName: body.lastName,
            username: body.username,
            emailAddress: body.emailAddress,
            password: await bcrypt.hash(
              body.password,
              parseInt(process.env.SALT_ROUNDS || "20", 10)
            )
          }
        });
        await db.userSession.create({
          data: {
            userId: user.id,
            expiresAt: add(new Date(), {
              seconds: parseInt(process.env.SESSION_TTL || "3600", 10)
            })
          }
        });
        res.status(201).send({ ...user, password: undefined });
      } else {
        res.status(400).send({ error: "User password is not strong enough." });
      }
    }
  },
  {
    body: {
      type: "object",
      properties: {
        firstName: { type: "string" },
        lastName: { type: "string" },
        username: { type: "string" },
        emailAddress: { type: "string" },
        password: { type: "string" }
      },
      required: ["emailAddress", "username", "password"]
    }
  }
);

export default route.handle;
