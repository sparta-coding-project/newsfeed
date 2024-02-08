import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { checkPW, encryptPW } from "../utils/bcrypt.js";
import { generateTokens } from "../utils/token.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, nickname, email, age, introduction, password } = req.body;

    const user = await prisma.users.findFirst({
      where: {
        username,
        email,
      },
    });

    if (user) {
      return res.status(400).json({ message: "존재하는 유저입니다." });
    } else {
      await prisma.users.create({
        data: {
          username,
          nickname,
          email,
          age,
          introduction,
          password: await encryptPW(password),
        },
      });
      return res.status(201).json({ message: "회원 가입이 완료되었습니다." });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.users.findFirst({
    where: {
      username,
    },
  });

  if (user) {
    if (checkPW(password, user.password)) {
      const tokens = await generateTokens(res, { userId: user.userId });
      return res
        .status(200)
        .json({ message: "로그인이 완료되었습니다.", data: tokens });
    } else {
      return res.status(401).json({ message: "비밀번호가 틀렸습니다." });
    }
  } else {
    return res.status(401).json({ message: "존재하지 않는 사용자입니다." });
  }
});

router.post("/signout", async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({ message: "로그아웃 되었습니다." });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "로그아웃에 실패했습니다.", error });
  }
});

export default router;
