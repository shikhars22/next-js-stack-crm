import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import clientPromise from "../../../lib/mongodb";
import { Customer, Order } from "../../customers";

type Return = {
  customers: Customer[];
};

const getCustomers = async () => {
  const mongoClient = await clientPromise;
  const data = (await mongoClient
    .db()
    .collection("customers")
    .find()
    .toArray()) as Customer[];
  return JSON.parse(JSON.stringify(data));
};

const addCustomer = async (customer: Customer): Promise<ObjectId> => {
  const mongoClient = await clientPromise;

  const response = await mongoClient
    .db()
    .collection("customers")
    .insertOne(customer);
  return response.insertedId;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Return | ObjectId | { error: string }>
) => {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "POST"],
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  if (req.method === "GET") {
    const data = await getCustomers();
    res.status(200).json({ customers: data });
  } else if (req.method === "POST") {
    // const data = await getCustomers();
    // res.status(200).json({ customers: data });
    // console.log(req.body);

    if (req.body.name && req.body.industry) {
      const customer: Customer = {
        name: req.body.name,
        industry: req.body.industry,
        orders: req.body.orders.map((order: Order) => {
          return { ...order, _id: new ObjectId() };
        }),
      };

      const insertedId = await addCustomer(customer);
      res.revalidate("/customers");
      res.revalidate("/customers" + insertedId);
      res.status(200).json(insertedId);
    } else {
      res.status(404).json({ error: "name and industry are required." });
    }
  }
};
export { getCustomers, addCustomer };
