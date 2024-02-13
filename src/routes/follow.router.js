import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

//팔로우 & 팔로우 취소 API
// followedId 컬럼은 만들려다 삭제함, 어차피 followingId컬럼으로 다 식별 가능
router.post(
  "/profile/:userProfile/follow",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { userProfile } = req.params;
      const { userId } = req.locals.user;

      //1-1 . 팔로우 하고자 하는 유저 확인
      const userToFollow = await prisma.posts.findFirst({
        where: { userId: +userProfile },
      });

      //1-2. 팔로우 하고자 하는 유저가 실제 존재하지 않는 경우
      if (!userToFollow)
        return res
          .status(404)
          .json({ message: "해당 유저가 존재하지 않습니다." });

      //2. 이미 팔로우한 유저인지 확인
      const checkFollowing = await prisma.follow.findFirst({
        where: {
          //2-1. 내가 팔로잉 했는지 확인
          userId: +userId,
          //2-2. 내가 팔로잉 한 사람 중에 지금 팔로잉 하려는 사람이 있는지 확인
          followingId: +userProfile,
        },
      });

      //3. 이미 팔로잉 한 사람의 경우 - 팔로우 취소
      if (checkFollowing) {
        await prisma.follow.delete({
          where: {
            followId: checkFollowing.followId,
            userId: +userId,
            followingId: +userProfile,
          },
        });
        return res.status(200).json({ message: "팔로우가 취소됐습니다." });
      } else if (!checkFollowing) {
        await prisma.follow.create({
          data: {
            userId: +userId,
            followingId: +userProfile,
          },
        });

        await prisma.follow.create;
        return res
          .status(201)
          .json({ message: "해당 유저를 팔로우 했습니다." });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
