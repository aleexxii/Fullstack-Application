import { Request, Response } from "express";

const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
  } catch (error) {
    console.log(error);
  }
};

const login = async (req: Request, res: Response) => {};

const logout = (req: Request, res: Response) => {};

export { registerUser, login, logout };
