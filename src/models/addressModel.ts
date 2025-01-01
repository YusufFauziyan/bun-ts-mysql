// models/userModel.ts
import db from "../config"; // Impor konfigurasi DB Anda
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../utils/passwordUtils";

interface Address extends RowDataPacket {
  user_id: string;
  street_address: string;
  city: string;
  postal_code: string;
  phone_number: string;
  verified_phone_number: boolean;
}
