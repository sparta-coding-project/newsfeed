import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

//게시글 좋아요 생성 API
router.post(
  "/postView/:postId/likes",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = req.locals.user;

      const post = await prisma.posts.findFirst({
        where: { postId: +postId },
      });

      if (post.userId === +userId)
        return res
          .status(400)
          .json({ message: "본인이 작성한 게시글에는 좋아요가 불가능합니다." });

      const isExistLike = await prisma.likes.findFirst({
        where: {
          userId: +userId,
          postId: +postId,
        },
      });
      if (isExistLike)
        return res
          .status(303)
          .redirect(`/api/postView/${postId}/likes/${userId}`); //redirect

      const like = await prisma.likes.create({
        data: {
          userId: +userId,
          postId: +postId,
        },
      });
      return res.status(201).json({ message: "좋아요가 등록되었습니다." });
    } catch (error) {
      next(error);
    }
  }
);

//게시글 좋아요 취소 API
router.delete(
  "/postView/:postId/likes",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = req.locals.user;

      const isExistLike = await prisma.likes.findFirst({
        where: {
          userId: +userId,
          postId: +postId,
        },
      });
      if (isExistLike.userId !== userId)
        return res
          .status(401)
          .json({ message: "좋아요를 취소할 권한이 없습니다." });
      await prisma.likes.delete({
        where: {
          likeId: isExistLike.likeId,
        },
      });
      return res.status(200).json({ message: "좋아요가 삭제되었습니다." });
    } catch (error) {
      next(error);
    }
  }
);

//댓글 좋아요 생성 API
router.post(
  "/comments/:commentId/likes",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { userId } = req.locals.user;

      const comment = await prisma.comments.findFirst({
        where: { commentId: +commentId },
      });

      if (comment.userId === +userId)
        return res
          .status(400)
          .json({ message: "본인이 작성한 게시글에는 좋아요가 불가능합니다." });

      const isExistLike = await prisma.likes.findFirst({
        where: {
          userId: +userId,
          commentId: +commentId,
        },
      });

      if (isExistLike)
        return res
          .status(303)
          .redirect(`/api/comments/${commentId}/likes/${userId}`);

      const like = await prisma.likes.create({
        data: {
          userId: +userId,
          commentId: +commentId,
        },
      });
      return res.status(201).json({ message: "좋아요가 등록되었습니다." });
    } catch (error) {
      next(error);
    }
  }
);

//댓글 좋아요 취소 API
router.delete(
  "/comments/:commentId/likes",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { userId } = req.locals.user;

      const isExistLike = await prisma.likes.findFirst({
        where: {
          userId: +userId,
          commentId: +commentId,
        },
      });
      if (isExistLike.userId !== userId)
        return res
          .status(401)
          .json({ message: "좋아요를 취소할 권한이 없습니다." });
      await prisma.likes.delete({
        where: {
          likeId: isExistLike.likeId,
        },
      });
      return res.status(200).json({ message: "좋아요가 삭제되었습니다." });
    } catch (error) {
      next(error);
    }
  }
);
export default router;
