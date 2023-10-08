import { Prisma } from "@prisma/client";
import { getAllProfiles, getAllUsers } from "../../helpers/index.js";
import { prisma } from "../../prisma/client/index.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    const users = await getAllUsers();
    if (users.find((user) => user.email === email)) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Email already exists",
      });
    }

    const profiles = await getAllProfiles();
    if (profiles.find((profile) => profile.phoneNumber === phoneNumber)) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Phone number already exists",
      });
    }

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password,
        Profile: {
          create: {
            phoneNumber,
          },
        },
      },
    });

    res.status(201).json({
      status: true,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.users.findMany({
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        Profile: {
          select: {
            id: true,
            phoneNumber: true,
            identityType: true,
            identityNumber: true,
            gender: true,
            religion: true,
            address: true,
          },
        },
      },
    });

    if (users.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Not Found",
        error: "No users were found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Users data retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        email: true,
        Profile: {
          select: {
            id: true,
            phoneNumber: true,
            identityType: true,
            identityNumber: true,
            gender: true,
            religion: true,
            address: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: `User not found with id ${id}`,
      });
    }

    res.status(200).json({
      status: true,
      message: `User data retrieved successfully with id ${id}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.users.delete({
      where: {
        id: Number(id),

        Profile: {
          user: {
            id: Number(id),
          },
        },
      },
    });

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: `User not found with id ${id}`,
      });
    }

    res.status(200).json({
      status: true,
      message: `User deleted successfully with id ${id}`,
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
};
