import { register } from "../controllers/users";
import { Router } from "express";

export default (router: Router) => {
  return router.post("/auth/register", register);
};
