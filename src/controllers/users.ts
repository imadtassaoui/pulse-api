import { verifySessionToken } from "./../models/users";
import { authentication, random } from "../helpers/index";
import express from "express";
import {
  createUser,
  getUserByEmail,
  getUserByEmailSelected,
} from "../models/users";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new Error("Credentials not provided");

    const user = await getUserByEmailSelected(email);

    if (!user) throw new Error("User not found");

    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      throw new Error("Wrong Password");
    }
    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    await user.save();

    res.cookie("sessionToken", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    res.status(200).json(user.authentication.sessionToken).end();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password)
      throw new Error("Credentials not provided");

    const existingUser = await getUserByEmail(email);
    if (existingUser) throw new Error("User already exists");

    const salt = random();

    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
        sessionToken: authentication(salt, email),
      },
    });

    return res.status(200).json(user.authentication.sessionToken).end();
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

export const verifySession = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { sessionToken } = req.body;

    if (!sessionToken) throw new Error("Unauthorized: Missing session token");

    const user = await verifySessionToken(sessionToken);

    if (!user) throw new Error("Unauthorized: Invalid session token");

    res.status(200).send("Valid Token").end();
  } catch (err) {
    return res.status(401).send(err.message);
  }
};
