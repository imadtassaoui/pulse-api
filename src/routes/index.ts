import { Router } from "express";
import authentication from "./authentication";
import login from "./login";
import getProducts from "./products/getProducts";
import create from "./products/create";
import product from "./products/product";

const router = Router();

export default (): Router => {
  authentication(router);
  login(router);
  //products routes
  getProducts(router);
  product(router);
  create(router);
  return router;
};
