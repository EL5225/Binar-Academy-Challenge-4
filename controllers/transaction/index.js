import { getBankAccounts } from "../../helpers/index.js";
import { prisma } from "../../prisma/client/index.js";
import { VSCreateTransaction } from "../../validation-schema/index.js";

export const createTransaction = async (req, res, next) => {
  try {
    const { sourceAccountNumber, destinationAccountNumber, amount } = req.body;

    VSCreateTransaction.parse(req.body);

    const bankAccounts = await getBankAccounts();
    const source = bankAccounts.find(
      (bankAccount) => bankAccount.accountNumber === sourceAccountNumber
    );
    const destination = bankAccounts.find(
      (bankAccount) => bankAccount.accountNumber === destinationAccountNumber
    );

    if (amount < 0) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Amount cannot be negative",
      });
    }

    if (sourceAccountNumber === destinationAccountNumber) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Source and destination account cannot be the same",
      });
    }

    if (source.balance < amount) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Insufficient funds",
      });
    }

    const transaction = await prisma.transactions.create({
      data: {
        sourceAccountNumber,
        destinationAccountNumber,
        amount,
      },
      include: {
        sourceAccount: {
          select: {
            name: true,
          },
        },
        destinationAccount: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!transaction) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Transaction failed",
      });
    }

    await prisma.bankAccounts.update({
      where: {
        accountNumber: sourceAccountNumber,
      },
      data: {
        balance: source.balance - amount,
      },
    });

    await prisma.bankAccounts.update({
      where: {
        accountNumber: destinationAccountNumber,
      },
      data: {
        balance: destination.balance + amount,
      },
    });

    res.status(200).json({
      status: true,
      message: "Transaction was successfull",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await prisma.transactions.findMany({
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        sourceAccount: {
          select: {
            name: true,
            accountNumber: true,
          },
        },
        destinationAccount: {
          select: {
            name: true,
            accountNumber: true,
          },
        },
        amount: true,
        createdAt: true,
      },
    });

    if (transactions.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Not Found",
        error: "No transactions were found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Transactions data was retrieved successfully",
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (req, res, next) => {
  try {
    const { transaction } = req.params;
    const transactionData = await prisma.transactions.findUnique({
      where: {
        id: Number(transaction),
      },
      select: {
        id: true,
        sourceAccount: {
          select: {
            name: true,
            accountNumber: true,
          },
        },
        destinationAccount: {
          select: {
            name: true,
            accountNumber: true,
          },
        },
        amount: true,
        createdAt: true,
      },
    });

    if (!transactionData) {
      return res.status(404).json({
        status: false,
        message: `Not Found`,
        error: `Transaction not found with id ${transaction}`,
      });
    }
    res.status(200).json({
      status: true,
      message: `Transaction data with id ${transaction} was retrieved successfully`,
      data: transactionData,
    });
  } catch (error) {
    next(error);
  }
};
