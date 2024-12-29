import mysql from 'mysql2';

// Membuat koneksi ke database
const db = mysql.createConnection({
  host: 'localhost',  // Gunakan localhost jika aplikasi Node.js berjalan di mesin yang sama
  port: 3306,         // Pastikan port yang digunakan adalah 3306
  user: 'root',       // Ganti dengan username MySQL Anda
  password: 'root',   // Ganti dengan password MySQL Anda
  database: 'ecommerce_db', // Ganti dengan nama database Anda
}).promise(); // Mengubah koneksi ke mode promise


export default db;
