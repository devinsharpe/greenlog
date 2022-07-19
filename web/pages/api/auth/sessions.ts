import Route from "../../../utils/route";
import { sub } from "date-fns";

const route = new Route();

route.delete(async (req, res, { db }) => {
  const { count } = await db.userSession.deleteMany({
    where: {
      expiresAt: {
        lte: sub(new Date(), {
          seconds: parseInt(process.env.SESSION_TTL || "3600", 10)
        })
      }
    }
  });
  res.status(200).send({ count });
});

export default route.handle;
