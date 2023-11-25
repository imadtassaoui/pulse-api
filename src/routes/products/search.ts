import { Router } from "express";
import { httpSearchProducts } from "../../controllers/products";

export default (router: Router) => {
  return router.get("/search/:keyword", httpSearchProducts);
};
