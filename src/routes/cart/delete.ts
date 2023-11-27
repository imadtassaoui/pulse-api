import { httpAddToCart, httpRemoveFromCart } from "../../controllers/cart";
import { Router } from "express";

export default (router: Router) => {
  return router.delete("/cart", httpRemoveFromCart);
};
