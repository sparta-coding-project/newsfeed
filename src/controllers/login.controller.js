import { prisma } from "../utils/prisma/index.js";
import { generateTokens } from "../utils/token.js";
import { checkPW, encryptPW } from "../utils/bcrypt.js";
import { createEmailToken, verifyToken } from "../utils/token.js";
import { emailCodeTransporter } from "../utils/nodemailer.js";

const signin = async (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) return next(error);
    if (!user) return res.status(400).json({ message: "로그인 에러" });
    return req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next);
};

const signout = async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

const signup = async (req, res) => {
  try {
    const { username, nickname, password, email, age, introduction } = req.body;

    const user = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      return res.status(403).json({ message: "존재하는 사용자입니다." });
    } else {
      const valid = await prisma.valid.findFirst({
        where: {
          email: email,
        },
      });
      if (valid) {
        const code = createEmailToken({
          ...req.body,
          password: await encryptPW(password),
        });
        await prisma.valid.update({
          where: {
            email: email,
          },
          data: {
            code,
          },
        });
        emailCodeTransporter(code);
      } else {
        const code = createEmailToken({
          ...req.body,
          password: await encryptPW(password),
        });

        await prisma.valid.create({
          data: {
            email,
            code: code,
          },
        });
        emailCodeTransporter(code, email);
      }
      return res.status(201).json({ message: "이메일을 발송했습니다." });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
};

const emailValid = async (req, res) => {
  try {
    const { code } = req.query;

    const user = verifyToken(code);

    const valid = await prisma.valid.findFirst({
      where: {
        email: user.email,
        code,
      },
    });

    if (valid) {
      await prisma.users.create({
        data: {
          username: user.username,
          nickname: user.nickname,
          email: user.email,
          age: user.age,
          introduction: user.introduction,
          password: user.password,
        },
      });
      await prisma.valid.delete({
        where: {
          email: user.email,
        },
      });
      return res
        .status(201)
        .json({ message: "회원가입이 완료되었습니다. 로그인해주세요." });
    } else {
      return res.status(401).json({ message: "잘못된 접근입니다." });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
};

export default {
  local: {
    signup,
    emailValid,
    signin,
    signout,
  }
};
