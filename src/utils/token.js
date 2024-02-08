import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma/index.js";

const { TOKEN_SECRET_KEY = "asdfyiq123123@^%$&%!!#" } = process.env;

/**
 * @param {Object} userData
 * @returns {String}
 */
export const createAccessToken = (userData) => {
  return jwt.sign(userData, TOKEN_SECRET_KEY, {
    expiresIn: "12h",
  });
};

/**
 * @param {String} token
 * @returns {Object}
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, TOKEN_SECRET_KEY);
  } catch (err) {
    throw err;
  }
};

/**
 * @param {Object} userData
 * @returns {String}
 */
export const createRefreshToken = (userData) => {
  return jwt.sign(userData, TOKEN_SECRET_KEY, {
    expiresIn: "2d",
  });
};

/**
 * @param {String} token
 * @returns {Object}
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, TOKEN_SECRET_KEY);
};

export const generateTokens = async (res, userData) => {
  const accessToken = createAccessToken(userData);
  const refreshToken = createRefreshToken(userData);
  res.cookie("accessToken", accessToken);
  res.cookie("refreshToken", refreshToken);

  const user = await prisma.refreshToken.findFirst({
    where: {
      userId: userData.userId,
    },
  });

  if (user) {
    await prisma.refreshToken.update({
      where: {
        userId: userData.userId,
      },
      data: {
        refreshToken,
      },
    });
  }else{
    await prisma.refreshToken.create({
        data:{
            userId: userData.userId,
            refreshToken
        }
    })
  }

  return { accessToken, refreshToken };
};
