import { prisma } from "../../prisma/client/index.js";

export const updateProfiles = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { identityType, identityNumber, gender, religion, address } =
      req.body;
    const updated = await prisma.profiles.update({
      where: {
        id: Number(id),
      },
      data: {
        identityType,
        identityNumber,
        gender,
        religion,
        address,
      },
    });

    res.status(200).json({
      status: true,
      message: `Profile updated successfully with id ${id}`,
      data: updated,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
