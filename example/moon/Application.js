
var Application = function (app_dir) {
  this.app_dir_ = app_dir;
};

Application.prototype.run = function () {
  // ...
  global.document.body.innerHTML = '<pre>It works!</pre>';
};

module.exports = Application;
