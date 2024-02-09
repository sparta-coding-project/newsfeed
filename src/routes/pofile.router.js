import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { checkPW, encryptPW } from "../utils/bcrypt.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

//프로필 조회 API
router.get("/profile", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.locals.user;

    const user = await prisma.users.findFirst({
      where: { userId: +userId },
      select: {
        userId: true,
        username: true,
        nickname: true,
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

//프로필 수정 API
router.patch("/profile", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.locals.user;
    const {
      username,
      nickname,
      age,
      introduction,
      password,
      password_toChange,
    } = req.body;

    //1. 불필요한 로직입니다. 비밀번호 유효성 검사는 프로필 수정을 시도하는 클라이언트가 해당 프로필을 생성했던 클라이언트가 맞는지 확인하는 과정이에요.
    //클라이언트가 보낸 password와 서버가 보유한 해당 클라이언트 계정의 password가 일치하는 지 확인하는 로직이 필요해요
    // if (password !== password2) {
    //   return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    // }

    //2. 이름을 검색하고 싶으셨던 것 같은데, 아래의 코드는 name에 해당 user의 users 정보가 모두 저장되게 됩니다.
    //그런데 이 API는 생성이 아닌, 수정을 위한 API이죠? 이 API까지 접근할 수 있었다는 건, 일반적인 상황에선 이미 user정보가 있다는 말이 됩니다.
    // 한마디로, 거의 항상 에러를 반환할 수 밖에 없는 로직입니다.
    // const name = await prisma.users.findFirst({
    //   where: { username: username },
    // });

    // if (name) {
    //     return res.status(400).json({ message: "이미 존재하는 이름입니다." });
    //   }

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

    if (!password) {
      return res.status(400).json({ message: "비밀번호를 입력해 주세요." });
    } else if (checkPW(password, user.password) === false) {
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    //클라이언트 계정 정보 수정 로직

    //비밀번호를 수정하는 경우
    if (password_toChange) {
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
    } else if (!password_toChange) {
      const updatedUser = await prisma.users.update({
        data: {
          username,
          nickname,
          age,
          introduction,
        },
        where: {
          userId: +userId,
        },
        select: {
          username: true,
          nickname: true,
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
    } else {
      throw new Error("알 수 없는 에러입니다.");
    }
  } catch (error) {
    next(error);
  }
});

export default router;
