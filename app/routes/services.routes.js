const { authJwt } = require("../middlewares");
const controller = require("../controllers/service.controller");

module.exports = function(app) {
  app.post(
    '/kepecas/service/distance',
    [authJwt.verifyToken],
    controller.calcDistance
  );

  app.get(
    '/kepecas/service/partner',
    [authJwt.verifyToken],
    controller.getPartner
  );

  app.get(
    '/kepecas/service/partners',
    [authJwt.verifyToken],
    controller.getAllPartners
  );
};