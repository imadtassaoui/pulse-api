import { Router } from "express";
import { httpIncreaseCartElementQuantity } from "../../controllers/cart";

export default (router: Router) => {
  return router.post("/cart/increase", httpIncreaseCartElementQuantity);
};
