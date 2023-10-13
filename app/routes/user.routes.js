const { authJwt, verifyUser } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.get(
    '/kepecas/user',
    [authJwt.verifyToken],
    controller.userInfo
  );

  app.put(
    "/kepecas/user",
    [authJwt.verifyToken, verifyUser.checkDuplicateEmail],
    controller.updateUser
  );

  app.post(
    "/kepecas/user/forgot",
    [],
    controller.sendResetPassword
  );

  app.post(
    "/kepecas/user/code",
    [],
    controller.codeValidation
  );
};