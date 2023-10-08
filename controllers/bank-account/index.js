import { prisma } from "../../prisma/client/index.js";

export const createBankAccount = async (req, res, next) => {
  try {
    const { name, balance, userId } = req.body;
    const bankAccount = await prisma.bankAccounts.create({
      data: {
        name,
        balance,
        userId: Number(userId),
      },
    });

    res.status(201).json({
      status: true,
      message: "Bank account was created successfully",
      data: bankAccount,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBankAccounts = async (req, res, next) => {
  try {
    const bankAccounts = await prisma.bankAccounts.findMany({
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        name: true,
        accountNumber: true,
        balance: true,
        createdAt: true,
        TransactionAsReceiver: {
          select: {
            id: true,
            amount: true,
          },
        },
        TransactionAsSender: {
          select: {
            id: true,
            amount: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (bankAccounts.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Not Found",
        error: "No bank accounts were found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Bank accounts data was retrieved successfully",
      data: bankAccounts,
    });
  } catch (error) {
    next(error);
  }
};

export const getBankAccountById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bankAccount = await prisma.bankAccounts.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        accountNumber: true,
        balance: true,
        createdAt: true,
        TransactionAsReceiver: {
          select: {
            id: true,
            amount: true,
          },
        },
        TransactionAsSender: {
          select: {
            id: true,
            amount: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!bankAccount) {
      return res.status(404).json({
        status: false,
        message: `Not Found`,
        error: `Bank account was not found with id ${id}`,
      });
    }

    res.status(200).json({
      status: true,
      message: `Bank account with id: ${id} was retrieved successfully`,
      data: bankAccount,
    });
  } catch (error) {
    next(error);
  }
};
