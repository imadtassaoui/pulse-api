import { httpGetProducts } from "../../controllers/products";
import { Router } from "express";

export default (router: Router) => {
  return router.get("/products/:gender?/:category?", httpGetProducts);
};
