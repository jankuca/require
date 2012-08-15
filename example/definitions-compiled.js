
require.install('moon/index', function (module, exports, require, global) {
  // contents of moon/index.js

  var Application = require('./Application');

  exports.create = function (app_dir) {
    return new Application(app_dir);
  };
});

require.install('moon/Application', function (module, exports, require, global) {
  // contents of moon/Application.js

  var Application = function (app_dir) {
    this.app_dir_ = app_dir;
  };

  Application.prototype.run = function () {
    // ...
    global.document.body.innerHTML = '<pre>It works!</pre>';
  };

  module.exports = Application;
});


require.install('/app/ApplicationController', function (module, exports, require, global) {
  // contents of app/ApplicationController.js

  var moon = require('moon');

  var ApplicationController = function () {
    moon.base(Controller, this);
  };
  moon.inherits(ApplicationController, Controller);

  module.exports = ApplicationController;
});


require.install('/main', function (module, exports, require, global) {
  // contents of main.js

  var moon = require('moon');

  var app = moon.create('./app');
  app.run();
});
