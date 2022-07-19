import { JSONSchemaType } from "ajv";
import Route from "../../../utils/route";
import bcrypt from "bcrypt";

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
        res.send(user);
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
