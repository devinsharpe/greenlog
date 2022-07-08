// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import Route from "../../utils/route";

const route = new Route();

route.get(
  (req, res) => {
    res.status(200).json({ name: "John Doe" });
  },
  {
    query: {
      type: "object",
      properties: {
        name: { type: "string" }
      }
    }
  }
);

route.post(
  (req, res) => {
    res.status(200).json(req.body);
  },
  {
    body: {
      type: "object",
      properties: {
        name: { type: "string" }
      }
    },
    query: {
      type: "object",
      properties: {
        name: { type: "string" }
      }
    }
  }
);

export default route.handle;
