import express from "express";
import { addToCart } from "../models/cart";

export const httpAddToCart = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.params;
    const { item } = req.body;
    if (!userId) throw new Error("User ID not specified");
    if (!item) throw new Error("Item not specified");
    await addToCart(userId, item);
    return res.status(200).json(item).end();
  } catch (err) {
    return res.status(400).send(err.message);
  }
};
