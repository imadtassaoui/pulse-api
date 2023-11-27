import { Router } from "express";
import authentication from "./authentication";
import login from "./login";
import getProducts from "./products/getProducts";
import create from "./products/create";
import product from "./products/product";
import addToCart from "./cart/add";
import token from "./token";
import search from "./products/search";
import add from "./cart/add";
import get from "./cart/get";
import update from "./cart/update";
import getCart from "./cart/get";
import _delete from "./cart/delete";
import increase from "./cart/increase";
import decrease from "./cart/decrease";

const router = Router();

export default (): Router => {
  authentication(router);
  login(router);
  token(router);
  //products routes
  getProducts(router);
  product(router);
  create(router);
  search(router);
  //cart routes
  add(router);
  get(router);
  update(router);
  _delete(router);
  increase(router);
  decrease(router);

  return router;
};
