import { Router } from "express";
import { httpGetCart } from "../../controllers/cart";

export default (router: Router) => {
  return router.get("/cart", httpGetCart);
};
