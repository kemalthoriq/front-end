// lib/auth.ts
"use server"; // This directive may not be needed in Pages Router; remove if it causes issues

import { mockUsers } from "./user-data";
import { NextApiRequest, NextApiResponse } from "next";

export async function login(formData: FormData, res: NextApiResponse) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const userEntry = mockUsers.get(email);

  if (userEntry && userEntry.password === password) {
    res.setHeader(
      "Set-Cookie",
      `session=${email}; HttpOnly; ${
        process.env.NODE_ENV === "production" ? "Secure;" : ""
      } Max-Age=${60 * 60 * 24 * 7}; Path=/`
    );
    return { success: true, message: "Login berhasil!" };
  } else {
    return { success: false, message: "Email atau kata sandi salah." };
  }
}

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (mockUsers.has(email)) {
    return { success: false, message: "Email sudah terdaftar." };
  }

  if (!email || !password || !fullName) {
    return { success: false, message: "Nama lengkap, email, dan kata sandi diperlukan." };
  }

  mockUsers.set(email, {
    password: password,
    profile: {
      email: email,
      fullName: fullName,
      phoneNumber: "",
      address: "",
      dateOfBirth: "",
      kycStatus: "Belum diverifikasi",
    },
    wallet: {
      goldGram: 0,
      rupiahBalance: 0,
      bankAccounts: [],
    },
    transactions: [],
    goals: [],
    notifications: [],
    loginActivities: [],
  });

  return { success: true, message: "Registrasi berhasil! Silakan login." };
}

export async function logout(res: NextApiResponse) {
  res.setHeader("Set-Cookie", "session=; HttpOnly; Max-Age=0; Path=/");
  return { success: true, message: "Berhasil keluar." };
}

export async function getCurrentUser(req: NextApiRequest) {
  const sessionEmail = req.cookies.session;
  if (sessionEmail) {
    const userEntry = mockUsers.get(sessionEmail);
    if (userEntry) {
      return userEntry.profile;
    }
  }
  return null;
}