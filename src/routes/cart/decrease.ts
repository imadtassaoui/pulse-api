import { Router } from "express";
import { httpDecreaseCartElementQuantity } from "../../controllers/cart";

export default (router: Router) => {
  return router.post("/cart/decrease", httpDecreaseCartElementQuantity);
};
