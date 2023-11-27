import { ProductModel } from "../db/products";

export const createProduct = async (product: Record<string, any>) => {
  return await ProductModel.create(product);
};

export const getAllProducts = async () => {
  return await ProductModel.find();
};

export const getProductsByGender = async (gender: string) => {
  const query = { gender: { $in: [gender, "UNISEX"] } };
  return await ProductModel.find(query);
};

export const getProductsByCategory = async (category: string) => {
  return await ProductModel.find({ category });
};

export const getProductsByGenderAndCategory = async (
  gender: string,
  category: string
) => {
  const query = { gender: { $in: [gender, "UNISEX"] }, category };
  return await ProductModel.find(query);
};

export const getProductById = async (id: string) => {
  return await ProductModel.findById(id);
};

export const searchProducts = async (keyword: string) => {
  const query = { $text: { $search: keyword } };
  return await ProductModel.find(query);
};

export const getProductPrice = async (id: string) => {
  return await ProductModel.findById(id).select("price");
};
