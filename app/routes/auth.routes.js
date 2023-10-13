const { verifyUser } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.post(
    "/kepecas/auth/signup",
    [
      verifyUser.checkDuplicateEmail,
    ],
    controller.signUp
  );

  app.post("/kepecas/auth/signin", controller.signin);
  app.post("/kepecas/auth/signout", controller.signout);
};