import { httpCreateProduct } from "../../controllers/products";
import { Router } from "express";

export default (router: Router) => {
  return router.post("/products", httpCreateProduct);
};
