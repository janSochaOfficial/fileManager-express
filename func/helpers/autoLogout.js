export function autoLogout() {
  return function (req, res, next) {
    req.user = req.signedCookies.user;
    if (req.path.includes("login") || req.path.includes("register")) {
      next();
    } else if (req.user) {
      res.cookie("user", req.user, {
        signed: true,
        maxAge: 10 * 60 * 1000,
        httpOnly: true,
      });
      next();
    } else {
      res.redirect("/login");
    }
  };
}
