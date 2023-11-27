import { Router } from "express";
import { httpUpdateCartElementQuantity } from "../../controllers/cart";

export default (router: Router) => {
  return router.put("/carta", httpUpdateCartElementQuantity);
};
