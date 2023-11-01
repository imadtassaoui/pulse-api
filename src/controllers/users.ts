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

    res.sendStatus(200).json(user).end();
  } catch (err) {
    res.status(400).send("An error occurred");
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !password) throw new Error("Credentials not provided");

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.sendStatus(200).json(user).end();
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};
