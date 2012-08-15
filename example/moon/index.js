
var Application = require('./Application');

exports.create = function (app_dir) {
  return new Application(app_dir);
};
