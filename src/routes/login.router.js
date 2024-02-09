import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { checkPW, encryptPW } from "../utils/bcrypt.js";
import { generateTokens } from "../utils/token.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

//1. 회원가입 API
router.post("/signup", async (req, res, next) => {
  try {
    const { username, nickname, email, age, introduction, password } = req.body;

    const user = await prisma.users.findFirst({
      where: {
        username,
        email,
      },
    });

    const encryptedPW = await encryptPW(password);

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
          password: encryptedPW, //await encryptPW(password) << await은 속한 실행 컨텍스트의 최상단에 위치해야 작동함
        },
      });
      return res.status(201).json({ message: "회원 가입이 완료되었습니다." });
    }
  } catch (error) {
    return res.status(400).json({ message: error.name });
  }
});

//로그인 API
//API 자체는 문제가 없는데... 왜 이럴까
//오답노트) prisma 자체 로직이 where 절에 undefined가 있으면 해당 프로퍼티는 무시하는 듯
router.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "이메일을 입력해 주세요." });
    } else if (!password) {
      return res.status(400).json({ message: "비밀번호를 입력해 주세요." });
    }

    const user = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    //오답노트) checkPW() 함수는 비동기 함수임, 비동기 함수는 속한 실행 컨텍스트의 최상단에 위치하고 있어야 함.
    const validatedPW = await checkPW(password, user.password);
    if (user) {
      if (validatedPW) {
        const tokens = await generateTokens(res, { userId: user.userId });
        return res
          .status(200)
          .json({ message: "로그인이 완료되었습니다.", data: tokens });
      } else {
        return res.status(401).json({ message: "비밀번호가 틀렸습니다." });
      }
    } else {
      return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
    }
  } catch (error) {
    next(error);
  }
});

//로그아웃 API
router.post("/signout", authMiddleware, async (req, res, next) => {
  try {
    console.log("s", res.cookie("refreshToken"));
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({ message: "로그아웃 되었습니다." });
  } catch (error) {
    next(error);
  }
});

export default router;
