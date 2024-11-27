import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";
import path from "path";

import { Database } from "sqlite";

let dbInstance: Database | null = null;

// Database initialization
async function getDb() {
  if (dbInstance) return dbInstance;

  const dbPath = path.join(process.cwd(), "database.sqlite");

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Ensure tables are created
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);

  // Check if admin exists, if not create default admin account
  const admin = await dbInstance.get("SELECT * FROM users WHERE email = ?", [
    "admin@admin",
  ]);

  if (!admin) {
    const hashedPassword = await bcrypt.hash("admin", 10);
    await dbInstance.run(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ["Admin User", "admin@admin", hashedPassword, "admin"]
    );
  }

  return dbInstance;
}

// Signup endpoint
export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    // Input validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Check if user already exists
    const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await db.run(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    return NextResponse.json({
      id: result.lastID,
      name,
      email,
      role,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
