const controller = require("../controllers/assets.controller");

module.exports = function(app) {
  app.post(
    '/kepecas/assets/servicepartner/logo/:partnerId',
    [],
    controller.servicePartnersLogo
  );
};