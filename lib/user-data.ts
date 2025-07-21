// lib/user-data.ts
import { NextApiRequest, NextApiResponse } from "next";

export type KYCStatus = "Belum diverifikasi" | "Dalam proses" | "Disetujui" | "Ditolak";

export interface UserProfile {
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  kycStatus: KYCStatus;
  kycKtpUrl?: string;
  kycSelfieUrl?: string;
}

export interface Wallet {
  goldGram: number;
  rupiahBalance: number;
  bankAccounts: BankAccount[];
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isVerified: boolean;
}

export type TransactionType =
  | "Pembelian"
  | "Penjualan"
  | "Tarik Dana"
  | "Tarik Emas Fisik"
  | "Cicilan"
  | "Top Up Rupiah";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  status: "Selesai" | "Pending" | "Gagal";
  description: string;
  invoiceUrl?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetGram: number;
  targetDate: string;
  currentGram: number;
  monthlyContribution: number;
  contributionMethod: "otomatis" | "manual";
  reminderEnabled: boolean;
  installments: { date: string; amount: number; status: "Paid" | "Pending" }[];
}

export interface Notification {
  id: string;
  type: "transaction" | "kyc" | "price_alert" | "reminder" | "system";
  message: string;
  date: string;
  isRead: boolean;
  link?: string;
}

export interface LoginActivity {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  timestamp: string;
  isCurrent: boolean;
}

export const mockUsers = new Map<
  string,
  {
    password: string;
    profile: UserProfile;
    wallet: Wallet;
    transactions: Transaction[];
    goals: Goal[];
    notifications: Notification[];
    loginActivities: LoginActivity[];
  }
>();

mockUsers.set("user@example.com", {
  password: "password",
  profile: {
    email: "user@example.com",
    fullName: "John Doe",
    phoneNumber: "081234567890",
    address: "Jl. Contoh No. 123, Jakarta",
    dateOfBirth: "1990-01-15",
    kycStatus: "Disetujui",
  },
  wallet: {
    goldGram: 5.25,
    rupiahBalance: 1500000,
    bankAccounts: [
      { id: "bank1", bankName: "Bank BCA", accountNumber: "1234567890", accountHolder: "John Doe", isVerified: true },
    ],
  },
  transactions: [
    { id: "t1", type: "Pembelian", amount: 2, date: "2024-07-01", status: "Selesai", description: "Beli 2 gram emas" },
    {
      id: "t2",
      type: "Penjualan",
      amount: 0.5,
      date: "2024-07-05",
      status: "Selesai",
      description: "Jual 0.5 gram emas",
    },
    {
      id: "t3",
      type: "Tarik Dana",
      amount: 500000,
      date: "2024-07-10",
      status: "Pending",
      description: "Tarik dana ke rekening BCA",
    },
    {
      id: "t4",
      type: "Cicilan",
      amount: 0.5,
      date: "2024-07-01",
      status: "Selesai",
      description: "Cicilan goal 'Emas 10 Gram'",
    },
  ],
  goals: [
    {
      id: "g1",
      name: "Emas 10 Gram untuk Masa Depan",
      targetGram: 10,
      targetDate: "2025-12-31",
      currentGram: 3.5,
      monthlyContribution: 0.5,
      contributionMethod: "otomatis",
      reminderEnabled: true,
      installments: [
        { date: "2024-05-01", amount: 0.5, status: "Paid" },
        { date: "2024-06-01", amount: 0.5, status: "Paid" },
        { date: "2024-07-01", amount: 0.5, status: "Paid" },
      ],
    },
  ],
  notifications: [
    {
      id: "n1",
      type: "transaction",
      message: "Pembelian 2 gram emas berhasil!",
      date: "2024-07-01T10:00:00Z",
      isRead: false,
      link: "/transactions",
    },
    {
      id: "n2",
      type: "kyc",
      message: "Verifikasi KYC Anda telah disetujui!",
      date: "2024-07-02T14:30:00Z",
      isRead: false,
      link: "/profile",
    },
    {
      id: "n3",
      type: "price_alert",
      message: "Harga emas naik 1% hari ini!",
      date: "2024-07-12T09:00:00Z",
      isRead: true,
    },
    {
      id: "n4",
      type: "reminder",
      message: "Jangan lupa bayar cicilan goal 'Emas 10 Gram' bulan ini!",
      date: "2024-07-20T08:00:00Z",
      isRead: false,
      link: "/goals",
    },
  ],
  loginActivities: [
    {
      id: "l1",
      device: "Chrome on Windows",
      location: "Jakarta, Indonesia",
      ipAddress: "192.168.1.1",
      timestamp: "2024-07-14T10:00:00Z",
      isCurrent: true,
    },
    {
      id: "l2",
      device: "Safari on iPhone",
      location: "Bandung, Indonesia",
      ipAddress: "10.0.0.5",
      timestamp: "2024-07-10T15:30:00Z",
      isCurrent: false,
    },
  ],
});

async function getUserDataFromSession(req: NextApiRequest) {
  const sessionEmail = req.cookies.session;
  if (!sessionEmail) {
    return null;
  }
  return mockUsers.get(sessionEmail);
}

export async function getUserProfile(req: NextApiRequest): Promise<UserProfile | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const userData = await getUserDataFromSession(req);
  return userData ? userData.profile : null;
}

export async function updateUserProfile(
  req: NextApiRequest,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const userData = await getUserDataFromSession(req);
  if (!userData) return { success: false, message: "Pengguna tidak ditemukan." };

  userData.profile.fullName = formData.get("fullName") as string;
  userData.profile.address = formData.get("address") as string;
  userData.profile.dateOfBirth = formData.get("dateOfBirth") as string;
  userData.profile.phoneNumber = formData.get("phoneNumber") as string;

  return { success: true, message: "Profil berhasil diperbarui." };
}

export async function uploadKycDocuments(
  req: NextApiRequest,
  formData: FormData
): Promise<{ success: boolean; message: string; kycStatus?: KYCStatus }> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const userData = await getUserDataFromSession(req);
  if (!userData) return { success: false, message: "Pengguna tidak ditemukan." };

  const ktpFile = formData.get("ktp") as File;
  const selfieFile = formData.get("selfie") as File;

  if (!ktpFile || !selfieFile) {
    return { success: false, message: "Harap unggah kedua dokumen (KTP dan Selfie)." };
  }

  userData.profile.kycKtpUrl = `/mock-ktp-${Date.now()}.jpg`;
  userData.profile.kycSelfieUrl = `/mock-selfie-${Date.now()}.jpg`;
  userData.profile.kycStatus = "Dalam proses";

  setTimeout(() => {
    if (userData) {
      userData.profile.kycStatus = "Disetujui";
      userData.notifications.push({
        id: `n${Date.now()}`,
        type: "kyc",
        message: "Verifikasi KYC Anda telah disetujui!",
        date: new Date().toISOString(),
        isRead: false,
        link: "/profile",
      });
    }
  }, 5000);

  return {
    success: true,
    message: "Dokumen KYC berhasil diunggah. Status verifikasi Anda akan diperbarui dalam 1-2 hari kerja.",
    kycStatus: "Dalam proses",
  };
}

export async function getUserWallet(req: NextApiRequest): Promise<Wallet | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const userData = await getUserDataFromSession(req);
  return userData ? userData.wallet : null;
}

export async function addBankAccount(
  req: NextApiRequest,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const userData = await getUserDataFromSession(req);
  if (!userData) return { success: false, message: "Pengguna tidak ditemukan." };

  const newAccount: BankAccount = {
    id: `bank${Date.now()}`,
    bankName: formData.get("bankName") as string,
    accountNumber: formData.get("accountNumber") as string,
    accountHolder: formData.get("accountHolder") as string,
    isVerified: false,
  };

  const otp = formData.get("otp") as string;
  if (formData.get("requireOtp") === "true") {
    if (otp !== "123456") {
      return { success: false, message: "Kode OTP tidak valid untuk verifikasi rekening." };
    }
    newAccount.isVerified = true;
  }

  userData.wallet.bankAccounts.push(newAccount);
  return { success: true, message: "Rekening bank berhasil ditambahkan." };
}

export async function withdrawFunds(
  req: NextApiRequest,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const userData = await getUserDataFromSession(req);
  if (!userData) return { success: false, message: "Pengguna tidak ditemukan." };

  const amount = Number.parseFloat(formData.get("amount") as string);
  const bankAccountId = formData.get("bankAccountId") as string;

  if (isNaN(amount) || amount <= 0 || amount > userData.wallet.rupiahBalance) {
    return { success: false, message: "Jumlah penarikan tidak valid atau saldo tidak mencukupi." };
  }

  userData.wallet.rupiahBalance -= amount;
  userData.transactions.push({
    id: `t${Date.now()}`,
    type: "Tarik Dana",
    amount: amount,
    date: new Date().toISOString().split("T")[0],
    status: "Pending",
    description: `Tarik dana Rp${amount.toLocaleString()} ke rekening ${bankAccountId}`,
  });
  userData.notifications.push({
    id: `n${Date.now()}`,
    type: "transaction",
    message: `Permintaan penarikan dana Rp${amount.toLocaleString()} berhasil diproses.`,
    date: new Date().toISOString(),
    isRead: false,
    link: "/transactions",
  });

  return {
    success: true,
    message: "Permintaan penarikan dana berhasil diproses. Dana akan tiba dalam 1-3 hari kerja.",
  };
}

export async function topUpRupiah(
  req: NextApiRequest,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const userData = await getUserDataFromSession(req);
  if (!userData) return { success: false, message: "Pengguna tidak ditemukan." };

  const amount = Number.parseFloat(formData.get("amount") as string);

  if (isNaN(amount) || amount <= 0) {
    return { success: false, message: "Jumlah top up tidak valid." };
  }

  userData.wallet.rupiahBalance += amount;
  userData.transactions.push({
    id: `t${Date.now()}`,
    type: "Top Up Rupiah",
    amount: amount,
    date: new Date().toISOString().split("T")[0],
    status: "Selesai",
    description: `Top up saldo rupiah sebesar Rp${amount.toLocaleString()}`,
  });
  userData.notifications.push({
    id: `n${Date.now()}`,
    type: "transaction",
    message: `Top up saldo rupiah Rp${amount.toLocaleString()} berhasil!`,
    date: new Date().toISOString(),
    isRead: false,
    link: "/transactions",
  });

  return { success: true, message: `Top up saldo rupiah sebesar Rp${amount.toLocaleString()} berhasil!` };
}

export async function getUserTransactions(req: NextApiRequest): Promise<Transaction[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const userData = await getUserDataFromSession(req);
  return userData ? userData.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];
}

export async function buyGold(req: NextApiRequest, formData: FormData): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const userData = await getUserDataFromSession(req);
  if (!userData) return { success: false, message: "Pengguna tidak ditemukan." };

  const gram = Number.parseFloat(formData.get("gram") as string);
  const currentGoldPricePerGram = 950000;
  const cost = gram * currentGoldPricePerGram;

  if (isNaN(gram) || gram <= 0 || cost > userData.wallet.rupiahBalance) {
    return { success: false, message: "Jumlah gram tidak valid atau saldo rupiah tidak mencukupi." };
  }

  userData.wallet.rupiahBalance -= cost;
  userData.wallet.goldGram += gram;
  userData.transactions.push({
    id: `t${Date.now()}`,
    type: "Pembelian",
    amount: gram,
    date: new Date().toISOString().split("T")[0],
    status: "Selesai",
    description: `Beli ${gram} gram emas seharga Rp${cost.toLocaleString()}`,
  });
  userData.notifications.push({
    id: `n${Date.now()}`,
    type: "transaction",
    message: `Pembelian ${gram} gram emas berhasil!`,
    date: new Date().toISOString(),
    isRead: false,
    link: "/transactions",
  });

  return { success: true, message: `Berhasil membeli ${gram} gram emas!` };
}

export async function sellGold(
  req: NextApiRequest,
  formData: FormData
): Promise<{ success: boolean; message: string; receivedRupiah?: number }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const userData = await getUserDataFromSession(req);
  if (!userData) return { success: false, message: "Pengguna tidak ditemukan." };

  const gram = Number.parseFloat(formData.get("gram") as string);
  const currentGoldPricePerGram = 940000;
  const receivedRupiah = gram * currentGoldPricePerGram;
  const destination = formData.get("destination") as string;
  const bankAccountId = formData.get("bankAccountId") as string;

  if (isNaN(gram) || gram <= 0 || gram > userData.wallet.goldGram) {
    return { success: false, message: "Jumlah gram tidak valid atau saldo emas tidak mencukupi." };
  }

  userData.wallet.goldGram -= gram;
  let transactionType: TransactionType = "Penjualan";
  let descriptionSuffix = "";

  if (destination === "bank" && bankAccountId) {
    const bankAccount = userData.wallet.bankAccounts.find((acc) => acc.id === bankAccountId);
    if (!bankAccount) {
      return { success: false, message: "Rekening bank tujuan tidak ditemukan." };
    }
    transactionType = "Tarik Dana";
    descriptionSuffix = ` ke rekening ${bankAccount.bankName} (${bankAccount.accountNumber})`;
  } else {
    userData.wallet.rupiahBalance += receivedRupiah;
    descriptionSuffix = ` ke saldo rupiah wallet`;
  }

  userData.transactions.push({
    id: `t${Date.now()}`,
    type: transactionType,
    amount: gram,
    date: new Date().toISOString().split("T")[0],
    status: "Selesai",
    description: `Jual ${gram} gram emas, terima Rp${receivedRupiah.toLocaleString()}${descriptionSuffix}`,
  });
  userData.notifications.push({
    id: `n${Date.now()}`,
    type: "transaction",
    message: `Penjualan ${gram} gram emas berhasil!`,
    date: new Date().toISOString(),
    isRead: false,
    link: "/transactions",
  });

  return { success: true, message: `Berhasil menjual ${gram} gram emas!`, receivedRupiah };
}

export async function getGoals(req: NextApiRequest): Promise<Goal[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const userData = await getUserDataFromSession(req);
  return userData ? userData.goals : [];
}

export async function createGoal(
  req: NextApiRequest,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const userData = await getUserDataFromSession(req);
  if (!userData) return { success: false, message: "Pengguna tidak ditemukan." };

  const newGoal: Goal = {
    id: `g${Date.now()}`,
    name: formData.get("name") as string,
    targetGram: Number.parseFloat(formData.get("targetGram") as string),
    targetDate: formData.get("targetDate") as string,
    currentGram: 0,
    monthlyContribution: Number.parseFloat(formData.get("monthlyContribution") as string),
    contributionMethod: (formData.get("contributionMethod") as "otomatis" | "manual") || "manual",
    reminderEnabled: formData.get("reminderEnabled") === "true",
    installments: [],
  };

  if (
    isNaN(newGoal.targetGram) ||
    newGoal.targetGram <= 0 ||
    isNaN(newGoal.monthlyContribution) ||
    newGoal.monthlyContribution <= 0
  ) {
    return { success: false, message: "Target gram dan kontribusi bulanan harus angka positif." };
  }

  userData.goals.push(newGoal);
  return { success: true, message: "Goal berhasil dibuat!" };
}

export async function updateGoal(
  req: NextApiRequest,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const userData = await getUserDataFromSession(req);
  if (!userData) return { success: false, message: "Pengguna tidak ditemukan." };

  const goalId = formData.get("id") as string;
  const goal = userData.goals.find((g) => g.id === goalId);
  if (!goal) return { success: false, message: "Goal tidak ditemukan." };

  goal.name = formData.get("name") as string;
  goal.targetGram = Number.parseFloat(formData.get("targetGram") as string);
  goal.targetDate = formData.get("targetDate") as string;
  goal.monthlyContribution = Number.parseFloat(formData.get("monthlyContribution") as string);
  goal.contributionMethod = (formData.get("contributionMethod") as "otomatis" | "manual") || "manual";
  goal.reminderEnabled = formData.get("reminderEnabled") === "true";

  if (
    isNaN(goal.targetGram) ||
    goal.targetGram <= 0 ||
    isNaN(goal.monthlyContribution) ||
    goal.monthlyContribution <= 0
  ) {
    return { success: false, message: "Target gram dan kontribusi bulanan harus angka positif." };
  }

  return { success: true, message: "Goal berhasil diperbarui!" };
}

export async function deleteGoal(
  req: NextApiRequest,
  goalId: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const userData = await getUserDataFromSession(req);
  if (!userData) return { success: false, message: "Pengguna tidak ditemukan." };

  const initialLength = userData.goals.length;
  userData.goals = userData.goals.filter((g) => g.id !== goalId);

  if (userData.goals.length < initialLength) {
    return { success: true, message: "Goal berhasil dihapus." };
  } else {
    return { success: false, message: "Gagal menghapus goal." };
  }
}

export async function getUserNotifications(req: NextApiRequest): Promise<Notification[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const userData = await getUserDataFromSession(req);
  return userData ? userData.notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];
}

export async function markNotificationAsRead(
  req: NextApiRequest,
  notificationId: string
): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const userData = await getUserDataFromSession(req);
  if (userData) {
    const notification = userData.notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      return { success: true };
    }
  }
  return { success: false };
}

export async function clearAllNotifications(req: NextApiRequest): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const userData = await getUserDataFromSession(req);
  if (userData) {
    userData.notifications = [];
    return { success: true };
  }
  return { success: false };
}

export async function updatePassword(
  req: NextApiRequest,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const userData = await getUserDataFromSession(req);
  if (!userData) return { success: false, message: "Pengguna tidak ditemukan." };

  const oldPassword = formData.get("oldPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (userData.password !== oldPassword) {
    return { success: false, message: "Kata sandi lama salah." };
  }
  if (newPassword.length < 6) {
    return { success: false, message: "Kata sandi baru minimal 6 karakter." };
  }

  userData.password = newPassword;
  return { success: true, message: "Kata sandi berhasil diubah." };
}

export async function deleteAccount(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const sessionEmail = req.cookies.session;
  if (!sessionEmail) return { success: false, message: "Pengguna tidak ditemukan." };

  mockUsers.delete(sessionEmail);
  res.setHeader("Set-Cookie", "session=; HttpOnly; Max-Age=0; Path=/");
  return { success: true, message: "Akun Anda berhasil dihapus." };
}

export async function requestPasswordReset(formData: FormData): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const email = formData.get("email") as string;
  if (!mockUsers.has(email)) {
    return { success: false, message: "Email tidak terdaftar." };
  }
  return { success: true, message: "Link reset kata sandi telah dikirim ke email Anda." };
}

export async function verifyEmail(formData: FormData): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;

  if (otp === "123456") {
    const userData = mockUsers.get(email);
    if (userData) {
      return { success: true, message: "Email berhasil diverifikasi!" };
    }
  }
  return { success: false, message: "Kode OTP tidak valid atau email tidak ditemukan." };
}

export async function getLoginActivities(req: NextApiRequest): Promise<LoginActivity[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const userData = await getUserDataFromSession(req);
  return userData ? userData.loginActivities : [];
}

export async function logoutDevice(
  req: NextApiRequest,
  activityId: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const userData = await getUserDataFromSession(req);
  if (!userData) return { success: false, message: "Pengguna tidak ditemukan." };

  userData.loginActivities = userData.loginActivities.filter((activity) => activity.id !== activityId);
  return { success: true, message: "Perangkat berhasil dikeluarkan." };
}

export async function logoutAllDevices(
  req: NextApiRequest
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const userData = await getUserDataFromSession(req);
  if (!userData) return { success: false, message: "Pengguna tidak ditemukan." };

  userData.loginActivities = userData.loginActivities.filter((activity) => activity.isCurrent);
  return { success: true, message: "Berhasil keluar dari semua perangkat lain." };
}

export async function setPriceAlert(
  req: NextApiRequest,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const userData = await getUserDataFromSession(req);
  if (!userData) return { success: false, message: "Pengguna tidak ditemukan." };

  const type = formData.get("type") as string;
  const targetPrice = Number.parseFloat(formData.get("targetPrice") as string);

  if (isNaN(targetPrice) || targetPrice <= 0) {
    return { success: false, message: "Harga target tidak valid." };
  }

  userData.notifications.push({
    id: `alert${Date.now()}`,
    type: "price_alert",
    message: `Notifikasi harga disetel: Emas ${type === "above" ? "di atas" : "di bawah"} Rp ${targetPrice.toLocaleString()}`,
    date: new Date().toISOString(),
    isRead: false,
  });

  return { success: true, message: "Notifikasi harga berhasil disetel!" };
}

export async function getPriceAlerts(req: NextApiRequest): Promise<Notification[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const userData = await getUserDataFromSession(req);
  return userData ? userData.notifications.filter((n) => n.type === "price_alert") : [];
}

export async function deletePriceAlert(
  req: NextApiRequest,
  alertId: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const userData = await getUserDataFromSession(req);
  if (!userData) return { success: false, message: "Pengguna tidak ditemukan." };

  const initialLength = userData.notifications.length;
  userData.notifications = userData.notifications.filter((n) => n.id !== alertId);

  if (userData.notifications.length < initialLength) {
    return { success: true, message: "Notifikasi harga berhasil dihapus." };
  } else {
    return { success: false, message: "Gagal menghapus notifikasi harga." };
  }
}