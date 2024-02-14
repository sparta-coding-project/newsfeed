import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { checkPW, encryptPW } from "../utils/bcrypt.js";
import { isLoggedIn } from "../middlewares/login.middleware.js";

const router = express.Router();

//프로필 조회 API
router.get("/profile", isLoggedIn, async (req, res, next) => {
  try {
    const { userId } = req.user;

    const user = await prisma.users.findFirst({
      where: { userId: +userId },
      select: {
        userId: true,
        username: true,
        nickname: true,
        profileImage: true,
        email: true,
        age: true,
        introduction: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
});

//타 계정 프로필 조회
router.get("/profile/:userProfile", isLoggedIn, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { userProfile } = req.params;

    const user = await prisma.users.findFirst({
      where: { userId: +userProfile },
      select: {
        nickname: true,
        profileImage: true,
        email: true,
        age: true,
        introduction: true,
      },
    });

    return res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
});

//프로필 수정 API
router.patch("/profile", isLoggedIn, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const {
      username,
      nickname,
      profileImage,
      age,
      introduction,
      password,
      password_toChange,
    } = req.body;

    //userId와 일치하는 Users 테이블 내 데이터 찾아서 가져오기
    const user = await prisma.users.findFirst({
      where: {
        userId: +userId,
      },
    });

    //데이터 자체가 존재하지 않을 경우 에러 메세지 반환
    if (!user) {
      return res
        .status(404)
        .json({ message: "내 정보 조회에 실패하였습니다." });
    }
    const validationResult = await checkPW(password, user.password);
    if (!password) {
      return res.status(400).json({ message: "비밀번호를 입력해 주세요." });
    } else if (validationResult === false) {
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    //클라이언트 계정 정보 수정 로직

    //비밀번호를 수정하는 경우
    if (password_toChange === "") {
      const updatedUser = await prisma.users.update({
        data: {
          username,
          nickname,
          profileImage,
          age,
          introduction,
        },
        where: {
          userId: +userId,
        },
        select: {
          username: true,
          nickname: true,
          profileImage: true,
          age: true,
          introduction: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.status(200).json({
        message: "프로필 수정이 완료되었습니다.",
        data: updatedUser,
      });
    } else if (password_toChange) {
      const encryptedPW = await encryptPW(password_toChange);
      const updatedUser = await prisma.users.update({
        data: {
          username,
          nickname,
          age,
          introduction,
          password: encryptedPW,
        },
        where: {
          userId: +userId,
        },
        select: {
          username: true,
          nickname: true,
          profileImage: true,
          age: true,
          introduction: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.status(200).json({
        message: "프로필 수정이 완료되었습니다.",
        data: updatedUser,
      });
      //비밀번호를 수정하지 않는 경우
    } else {
      throw new Error("알 수 없는 에러입니다.");
    }
  } catch (error) {
    next(error);
  }
});

export default router;
