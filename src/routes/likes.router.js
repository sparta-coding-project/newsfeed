import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { isLoggedIn } from "../middlewares/login.middleware.js";

const router = express.Router();

//게시글 좋아요 생성&취소 API
//서비스 측면에서 생각했을 때, 리디렉션으로 처리하는 건 사용자 경험을 생각했을 때 그리 실용적이지 않을 것 같아서
//기존 방침에서 변경했습니다.
router.post(
  "/postView/:postId/likes",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = req.user;

      //좋아요를 누르고자 하는 포스트 정보 탐색
      const post = await prisma.posts.findFirst({
        where: { postId: +postId },
      });

      //해당 포스트 작성자가 좋아요를 누르고자 하는 클라이언트 유저와 동일인인지 확인
      if (post.userId === +userId)
        return res
          .status(400)
          .json({ message: "본인이 작성한 게시글에는 좋아요가 불가능합니다." });

      //해당 클라이언트 유저가 해당 게시물에 이미 좋아요를 눌렀는지 확인
      const isExistLike = await prisma.likes.findFirst({
        where: {
          userId: +userId,
          postId: +postId,
        },
      });

      //개인적으로 중괄호 없이 if문을 작성하는 건 추천드리지 않습니다. 코드 에러를 수정할 때 if문의 경계를 헷갈리는 경우가 발생할 수 있어요.
      //특히 집중이 잘 안되는 상황에서 코드 에러를 찾아 수정 할 때 실수하기 쉬워지고, 그래서 본인에게 자원이 부족한 상황일 수록 더욱 불필요하게 정신력과 체력, 시간을 더 소모하게 될 수 있습니다.

      //만약 이미 좋아요를 눌러뒀을 경우
      if (isExistLike) {
        await prisma.likes.delete({
          where: {
            likeId: isExistLike.likeId,
            userId: +userId,
            postId: +postId,
          },
        });
        return res.status(200).json({ message: "좋아요가 취소됐습니다." });
      } else if (!isExistLike) {
        const likes = await prisma.likes.create({
          data: {
            userId: +userId,
            postId: +postId,
          },
        });
        return res.status(200).json({ message: "좋아요가 등록됐습니다." });
      }
    } catch (error) {
      next(error);
    }
  }
);

//게시글 좋아요 취소 API
// router.post(
//   "/postView/:postId/likes",
//   isLoggedIn,
//   async (req, res, next) => {
//     try {
//       const { postId } = req.params;
//       const { userId } = req.locals.user;

//       const isExistLike = await prisma.likes.findFirst({
//         where: {
//           userId: +userId,
//           postId: +postId,
//         },
//       });
//       if (isExistLike.userId !== userId)
//         return res
//           .status(401)
//           .json({ message: "좋아요를 취소할 권한이 없습니다." });
//       await prisma.likes.delete({
//         where: {
//           likeId: isExistLike.likeId,
//         },
//       });
//       return res.status(200).json({ message: "좋아요가 삭제되었습니다." });
//     } catch (error) {
//       next(error);
//     }
//   }
// );

//댓글 좋아요 생성 API

//댓글 좋아요 생성&취소 API
router.post(
  "/postView/comments/:commentId/likes",
  isLoggedIn,
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
          postId: comment.postId,
          commentId: +commentId,
        },
      });

      if (isExistLike) {
        await prisma.likes.delete({
          where: {
            likeId: isExistLike.likeId,
            userId: +userId,
            postId: +isExistLike.postId,
            commentId: isExistLike.commentId,
          },
        });
        return res.status(200).json({ message: "좋아요가 취소됐습니다." });
      } else if (!isExistLike) {
        const likes = await prisma.likes.create({
          data: {
            userId: +userId,
            postId: +comment.postId,
            commentId: comment.commentId,
          },
        });
        return res.status(200).json({ message: "좋아요가 등록됐습니다." });
      }
    } catch (error) {
      next(error);
    }
  }
);

//댓글 좋아요 취소 API
// router.delete(
//   "/comments/:commentId/likes",
//   isLoggedIn,
//   async (req, res, next) => {
//     try {
//       const { commentId } = req.params;
//       const { userId } = req.locals.user;

//       const isExistLike = await prisma.likes.findFirst({
//         where: {
//           userId: +userId,
//           commentId: +commentId,
//         },
//       });
//       if (isExistLike.userId !== userId)
//         return res
//           .status(401)
//           .json({ message: "좋아요를 취소할 권한이 없습니다." });
//       await prisma.likes.delete({
//         where: {
//           likeId: isExistLike.likeId,
//         },
//       });
//       return res.status(200).json({ message: "좋아요가 삭제되었습니다." });
//     } catch (error) {
//       next(error);
//     }
//   }
// );
export default router;
