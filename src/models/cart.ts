import { CartModel } from "../db/cart";

export const addToCart = async (userId: string, item: Record<string, any>) => {
  return await CartModel.findOneAndUpdate(
    { userId },
    { $push: { items: item } },
    { new: true }
  );
};

export const getCartByUserId = async (userId: string) => {
  return await CartModel.findOne({ user: userId });
};

export const deleteCartItem = async (itemtId: string, userId: string) => {
  return await CartModel.findOneAndUpdate(
    { user: userId },
    { $pull: { items: { _id: itemtId } } },
    { new: true }
  );
};

export const getCartItemQuantity = async (itemId: string, userId: string) => {
  const cart = await getCartByUserId(userId);
  const item = cart?.items.find((item) => item._id.toString() === itemId);
  return item?.quantity;
};

export const updateCartItem = async (
  itemId: string,
  userId: string,
  quantity: number
) => {
  return await CartModel.findOneAndUpdate(
    { user: userId, "items._id": itemId },
    { $set: { "items.$.quantity": quantity } },
    { new: true }
  );
};
