var moon = require('moon');

var ApplicationController = function () {
  moon.base(Controller, this);
};
moon.inherits(ApplicationController, Controller);

module.exports = ApplicationController;
