import express from "express";
import { addToCart } from "../models/cart";
import { getUserByToken } from "../models/users";
import { getProductPrice } from "../models/products";

import { Request, Response } from "express";
import { CartModel } from "../db/cart";
import { ProductModel } from "../db/products";
import mongoose from "mongoose";

// httpGetCartController
export const httpGetCart = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const { _id } = await getUserByToken(token);

    if (!_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await CartModel.findOne({ userId: _id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.json(error.message);
  }
};

// httpAddToCart
export const httpAddToCart = async (req: Request, res: Response) => {
  try {
    const { token, productId, size, quantity } = req.body;

    const { _id } = await getUserByToken(token);

    if (!_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if ((product.sizes as Record<string, number>)[size] < quantity) {
      return res
        .status(400)
        .json({ message: "Not enough stock for the selected size" });
    }

    let cart = await CartModel.findOne({
      userId: new mongoose.Types.ObjectId(_id),
    });

    if (!cart) {
      cart = await CartModel.create({
        userId: new mongoose.Types.ObjectId(_id),
      });
    }

    const { name, images } = product;

    const existingCartItem = cart.items.find(
      (item) => String(item.product) === productId && item.size === size
    );

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      existingCartItem.totalPrice = existingCartItem.quantity * product.price;
    } else {
      cart.items.push({
        product: productId,
        size,
        quantity,
        totalPrice: product.price * quantity,
        name,
        image: images[0], // Set image to the second image from the product
      });
    }

    cart.totalPrice += product.price * quantity;

    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const httpRemoveFromCart = async (req: Request, res: Response) => {
  try {
    const { token, productId, size } = req.body;

    const { _id } = await getUserByToken(token);

    if (!_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let cart = await CartModel.findOne({
      userId: new mongoose.Types.ObjectId(_id),
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const existingCartItemIndex = cart.items.findIndex(
      (item) => String(item.product) === productId && item.size === size
    );

    if (existingCartItemIndex !== -1) {
      // Item found in the cart, remove it
      const removedItem = cart.items.splice(existingCartItemIndex, 1)[0];
      cart.totalPrice -= removedItem.totalPrice;

      await cart.save();

      return res.status(200).json(cart);
    } else {
      // Item not found in the cart
      return res.status(404).json({ message: "Item not found in the cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const httpUpdateCartElementQuantity = async (
  req: Request,
  res: Response
) => {
  try {
    const { token, productId, size, quantity } = req.body;

    const { _id } = await getUserByToken(token);
    if (!_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await CartModel.findOne({ _id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = cart.items.find(
      (item) => String(item.product) === productId && item.size === size
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in the cart" });
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    cart.totalPrice += (quantity - cartItem.quantity) * product.price;

    cartItem.quantity = quantity;

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const httpIncreaseCartElementQuantity = async (
  req: Request,
  res: Response
) => {
  try {
    const { token, productId, size } = req.body;

    const { _id } = await getUserByToken(token);

    if (!_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let cart = await CartModel.findOne({
      userId: _id,
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const existingCartItem = cart.items.find(
      (item) => String(item.product) === productId && item.size === size
    );

    const { price } = await getProductPrice(productId);

    if (existingCartItem) {
      // Increase quantity
      existingCartItem.quantity += 1;
      existingCartItem.totalPrice = existingCartItem.quantity * price;

      cart.totalPrice += price;

      await cart.save();

      return res.status(200).json(cart);
    } else {
      // Item not found in the cart
      return res.status(404).json({ message: "Item not found in the cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const httpDecreaseCartElementQuantity = async (
  req: Request,
  res: Response
) => {
  try {
    const { token, productId, size } = req.body;

    const { _id } = await getUserByToken(token);

    if (!_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let cart = await CartModel.findOne({
      userId: _id,
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const existingCartItem = cart.items.find(
      (item) => String(item.product) === productId && item.size === size
    );

    const { price } = await getProductPrice(productId);

    if (existingCartItem) {
      // Decrease quantity, but ensure it doesn't go below 1
      if (existingCartItem.quantity === 1) {
        // Remove the item from the cart
        const removedItemIndex = cart.items.findIndex(
          (item) => String(item.product) === productId && item.size === size
        );

        if (removedItemIndex !== -1) {
          const removedItem = cart.items.splice(removedItemIndex, 1)[0];
          cart.totalPrice -= removedItem.totalPrice;
        }
      } else {
        // Decrease quantity and update total price
        existingCartItem.quantity -= 1;
        existingCartItem.totalPrice = existingCartItem.quantity * price;
        cart.totalPrice -= price;
      }
      await cart.save();

      return res.status(200).json(cart);
    } else {
      // Item not found in the cart
      return res.status(404).json({ message: "Item not found in the cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
