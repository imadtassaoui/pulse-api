import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductsByGender,
  getProductsByGenderAndCategory,
} from "./../models/products";
import express from "express";

export const httpCreateProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const product = await req.body;
    const {
      name,
      price,
      category,
      gender,
      sizes,
      images,
      details,
      fabricAndFit,
    } = req.body;

    if (
      !name ||
      !price ||
      !category ||
      !gender ||
      !sizes ||
      !images ||
      !details ||
      !fabricAndFit
    ) {
      throw new Error("Not enough prodcut details provided");
    }

    await createProduct(product);
    return res.sendStatus(200).end();
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

export const httpGetProducts = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { gender, category } = req.params;
    console.log(gender, category);

    if (!gender) {
      const products = await getAllProducts();
      return res.status(200).json(products).end();
    }
    if (gender !== "M" && gender !== "F" && gender !== "UNISEX")
      throw new Error("Gender not specified");
    if (!category && gender === "UNISEX")
      return res
        .status(200)
        .json(await getAllProducts())
        .end();
    if (!category) {
      return res
        .status(200)
        .json(await getProductsByGender(gender))
        .end();
    }
    if (
      category !== "T-SHIRT" &&
      category !== "HOODIES" &&
      category !== "PANTS" &&
      category !== "SHORTS" &&
      category !== "HATS"
    )
      throw new Error("Unexpected category");
    if (gender === "UNISEX")
      return res
        .status(200)
        .json(await getProductsByCategory(category))
        .end();
    else
      return res
        .status(200)
        .json(await getProductsByGenderAndCategory(gender, category))
        .end();
  } catch (err) {
    console.error(err);
    return res.status(400);
  }
};

export const httpGetProductById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    return res.status(200).json(product).end();
  } catch (err) {
    return res.status(400).send(err.message);
  }
};
