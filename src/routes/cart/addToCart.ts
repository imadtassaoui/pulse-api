import { httpAddToCart } from "../../controllers/cart";
import { Router } from "express";

export default (router: Router) => {
  return router.post("/cart/:userId", httpAddToCart);
};
