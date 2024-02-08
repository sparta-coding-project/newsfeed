import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

//댓글 작성 API
router.post(
  "/postView/comment/:postId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { userId } = req.locals.user;
      const { content } = req.body;
      const { postId } = req.params;
      const comment = await prisma.comments.create({
        data: {
          userId: +userId,
          postId: +postId,
          content,
          //createdAt은 이미 default 값이 있기 때문에 다시 지정 안해도 됨
          // createdAt: new Date(),
        },
      });
      return res.status(201).redirect(`/api/postView/${postId}`);
    } catch (error) {
      next(error);
    }
  }
);

//댓글 조회 API(게시물 조회 API랑 병합할수도...)
router.get("/postView/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;
    const data = await prisma.posts.findFirst({
      where: {
        postId: +postId,
      },
      select: {
        comments: {
          select: {
            commentId: true,
            userId: true,
            postId: true,
            content: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!data.comments)
      return res.status(404).json({ message: "댓글이 존재하지 않습니다." });

    return res.status(200).json({ data: data.comments });
  } catch (error) {
    next(error);
  }
});

//댓글 수정 API
//CUD 는 라우터 경로 겹치면 commentId와 postId가 겹칠 경우 에러가 나거나, 예상치 못한게 지워질 수 있을 것 같음
router.patch(
  "/postView/comment/:commentId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { userId } = req.locals.user;
      const { commentId } = req.params;
      const { content } = req.body;

      const isExistComment = await prisma.comments.findFirst({
        where: { commentId: +commentId },
      });
      if (!isExistComment)
        return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
      if (isExistComment.userId !== userId)
        return res
          .status(401)
          .json({ message: "댓글을 수정할 권한이 없습니다." });

      const modifiedData = await prisma.comments.update({
        data: { content },
        where: { commentId: +commentId },
      });
      return res.status(200).redirect(`/api/postView/${isExistComment.postId}`);
    } catch (err) {
      next(err);
    }
  }
);

//댓글 삭제 API
//CUD 는 라우터 경로 겹치면 commentId와 postId가 겹칠 경우 에러가 나거나, 예상치 못한게 지워질 수 있을 것 같음
router.delete(
  "/postView/comment/:commentId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { userId } = req.locals.user;
      const { commentId } = req.params;
      const isExistComment = await prisma.comments.findFirst({
        where: { commentId: +commentId },
      });
      if (!isExistComment)
        return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
      if (isExistComment.userId !== userId)
        return res
          .status(401)
          .json({ message: "댓글을 삭제할 권한이 없습니다." });
      await prisma.comments.delete({
        where: { commentId: +commentId },
      });
      return res.status(200).redirect(`/api/postView/${isExistComment.postId}`);
    } catch (err) {
      next(err);
    }
  }
);
export default router;
