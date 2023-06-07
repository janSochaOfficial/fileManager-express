export function autoLogout() {
  return function (req, res, next) {
    if (req.path.includes("login") || req.path.includes("register")) {
      next();
    } else if (req.signedCookies.user) {
      next();
    } else {
      res.redirect("/login");
    }
  };
}
