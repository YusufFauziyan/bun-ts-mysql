// models/userModel.ts
import db from "../config"; // Impor konfigurasi DB Anda
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

interface User extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password: string;
}

// get all users
export const getUsers = async (): Promise<User[]> => {
  const query = "SELECT * FROM User";
  const [rows] = await db.query<User[]>(query);
  return rows as User[];
};

// get user by id
export const getUserById = async (id: number): Promise<User | null> => {
  const query = "SELECT * FROM User WHERE user_id = ?";
  const [rows] = await db.query<User[]>(query, [id]);
  return rows.length ? rows[0] : null;
};

// post user
export const postUser = async (user: User): Promise<number> => {
  const { username, email, password } = user;
  const query = "INSERT INTO User (username, email, password) VALUES (?, ?, ?)";

  const [result] = await db.query<ResultSetHeader>(query, [
    username,
    email,
    password,
  ]);

  return result.insertId;
};

// put user
export const updateUserById = async (
  id: number,
  user: User
): Promise<User | null> => {
  const { username, email, password } = user;
  const query =
    "UPDATE User SET username = ?, email = ?, password = ? WHERE user_id = ?";

  const [result] = await db.query<ResultSetHeader>(query, [
    username,
    email,
    password,
    id,
  ]);

  return result.affectedRows ? user : null;
};

// delete user
export const deleteUserById = async (id: number): Promise<boolean> => {
  const query = "DELETE FROM User WHERE user_id = ?";
  const [result] = await db.query<ResultSetHeader>(query, [id]);
  return result.affectedRows > 0;
};

// check user exists
export const checkUserExists = async (email: string): Promise<boolean> => {
  const query = "SELECT * FROM User WHERE email = ?";
  const [rows] = await db.query<User[]>(query, [email]);
  return rows.length > 0;
};
