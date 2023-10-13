const { authJwt, verifyUser } = require("../middlewares");
const controller = require("../controllers/usercar.controller");

module.exports = function(app) {
  app.get(
    '/kepecas/usercars',
    [authJwt.verifyToken],
    controller.userCars
  );

  app.post(
    '/kepecas/usercar',
    [authJwt.verifyToken],
    controller.addCar
  );
};