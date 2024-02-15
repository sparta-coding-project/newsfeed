export const isLoggedIn = (req, res, next) => {
  // console.log(req)
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).redirect("/login");
    // res.status(403).json({ message: "로그인이 필요합니다." });
  }
};

// 이게 둘이나 있어야 하는 로직인가?
export const isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인한 상태입니다.");
    res.redirect(`/?error=${message}`);
  }
};
