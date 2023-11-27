import { UserModel } from "../db/users";

export const getAllUsers = async () => {
  return await UserModel.find();
};

export const getUserById = async (id: string) => {
  return await UserModel.findById(id);
};

export const getUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email });
};

export const getUserByToken = async (token: string) => {
  return await UserModel.findOne({ "authentication.sessionToken": token });
};

export const getUserByEmailSelected = async (email: string) => {
  return await UserModel.findOne({ email }).select(
    "+authentication.salt +authentication.password"
  );
};

export const createUser = async (user: Record<string, any>) => {
  return await UserModel.create(user);
};

export const deleteUser = async (id: string) => {
  return await UserModel.findByIdAndDelete({ _id: id });
};

export const updateUser = async (id: string, user: Record<string, any>) => {
  return await UserModel.findByIdAndUpdate({ _id: id }, user);
};

export const verifySessionToken = async (sessionToken: string) => {
  return await UserModel.findOne({
    "authentication.sessionToken": sessionToken,
  });
};
