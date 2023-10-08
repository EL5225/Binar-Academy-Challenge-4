import { Router } from "express";
import {
  createBankAccount,
  createUser,
  deleteUser,
  getAllBankAccounts,
  getBankAccountById,
  getUserById,
  getUsers,
  updateProfiles,
  createTransaction,
  getAllTransactions,
  getTransactionById,
} from "../controllers/index.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: true,
    message: "Hello! Welcome to API",
  });
});

// Users
router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser); // warning, this will also delete profile, bank account and transaction. Use with caution

// Profiles
router.put("/profiles/:id", updateProfiles);

// Bank Accounts
router.post("/accounts", createBankAccount);
router.get("/accounts", getAllBankAccounts);
router.get("/accounts/:id", getBankAccountById);

// Transactions
router.post("/transactions", createTransaction);
router.get("/transactions", getAllTransactions);
router.get("/transactions/:transaction", getTransactionById);

export default router;
