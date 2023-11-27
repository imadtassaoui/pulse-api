import { httpGetProductById } from "../../controllers/products";
import { Router } from "express";

export default (router: Router) => {
  return router.get("/product/:id", httpGetProductById);
};
