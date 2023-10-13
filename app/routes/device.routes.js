const { authJwt, verifyUser } = require("../middlewares");
const controller = require("../controllers/device.controller");

module.exports = function(app) {
  app.get(
    '/kepecas/user/devices',
    [authJwt.verifyToken],
    controller.userDevices
  );

  app.post(
    '/kepecas/user/device',
    [authJwt.verifyToken],
    controller.deviceValidation
  );
};