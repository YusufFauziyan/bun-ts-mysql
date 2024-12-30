// controllers/userController.ts
import { Request, Response } from "express";
import {
  getUsers,
  getUserByIdModel,
  postUser,
  updateUserById,
  deleteUserById,
  checkUserExists,
} from "../models/userModel"; // Pastikan model Anda benar

// Fetch all users or the logged-in user's data based on their role
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const loggedInUser = (req as any).user;

    if (!loggedInUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (loggedInUser.role === "admin") {
      const users = await getUsers();
      const usersWithoutPassword = users.map(({ password, ...user }) => user);
      res.status(200).json(usersWithoutPassword);
      return;
    }

    const user = await getUserByIdModel(loggedInUser.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// user by id
export const getUser = async (req: Request, res: Response) => {
  const id = req.params.id; // Mengambil id dari parameter URL
  try {
    const user = await getUserByIdModel(id); // Fungsi untuk mengambil data pengguna berdasarkan id
    if (user) {
      const { password, refresh_token, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword); // Mengirimkan respons dengan status 200 dan data pengguna
    } else {
      res.status(404).json({ message: "User not found" }); // Mengirimkan respons dengan status 404 jika pengguna tidak ditemukan
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// post user
export const createUser = async (req: Request, res: Response) => {
  const { password, ...user } = req.body; // Mengambil data pengguna dari body request

  try {
    // check if user exists
    const userExists = await checkUserExists(user.email); // Fungsi untuk memeriksa apakah pengguna sudah ada di database
    if (userExists) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const newUser = await postUser({ password, ...user }); // Fungsi untuk menambahkan data pengguna ke database
    res.status(201).json({ id: newUser, ...user }); // Mengirimkan respons dengan status 201 dan data pengguna yang ditambahkan
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Edit User
export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id; // Mengambil id dari parameter URL
  const user = req.body; // Mengambil data pengguna dari body request

  try {
    // check email exists
    const emailExists = await checkUserExists(user.email); // Fungsi untuk memeriksa apakah email pengguna sudah ada di database
    if (emailExists) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    // check if user exists
    const userExists = await getUserByIdModel(id); // Fungsi untuk memeriksa apakah pengguna sudah ada di database
    if (!userExists) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const updatedUser = await updateUserById(id, user); // Fungsi untuk mengupdate data pengguna berdasarkan id
    if (!updatedUser) {
      res.status(500).json({ message: "Error updating user" });
      return;
    }

    const { password, refresh_token, ...userWithoutPassword } = updatedUser;
    res.status(200).json(userWithoutPassword); // Mengirimkan respons dengan status 200 dan data pengguna yang diupdate
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id; // Mengambil id dari parameter URL

  try {
    const userExists = await getUserByIdModel(id); // Fungsi untuk memeriksa apakah pengguna sudah ada di database
    if (!userExists) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const deleted = await deleteUserById(id); // Fungsi untuk menghapus data pengguna berdasarkan id
    if (deleted) {
      res.status(200).json({ message: "User deleted successfully" }); // Mengirimkan respons dengan status 200 jika pengguna berhasil dihapus
    } else {
      res.status(500).json({ message: "Error deleting user" }); // Mengirimkan respons dengan status 500 jika terjadi kesalahan saat menghapus pengguna
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
