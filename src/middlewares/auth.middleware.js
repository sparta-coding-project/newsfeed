// import { verifyAccessToken } from "../utils/token.js";
import { prisma } from "../utils/prisma/index.js";

export default async (req, res, next) => {
  try {
    const { userId, email } = req.session.user;


    const user = await prisma.users.findFirst({
      where: {
        userId,
        email,
      },
    });

    if (user) {
      req.locals = {};
      req.locals.user = user;
      next();
    } else {
      return res.status(401).json({ message: "인증에 실패하였습니다." });
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: error.message });
  }
};
