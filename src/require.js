
function require(/* ...paths */) {
  var paths = Array.prototype.slice.call(arguments);
  var module_path = require.resolve.apply(null, paths);

  var cache = require.cache;
  if (cache[module_path]) {
    return cache[module_path].exports;
  }

  var module = require.load_(module_path);
  cache[module_path] = module;
  return module.exports;
}

require.cache = {};
require.definitions_ = {};
require.main = null;

require.install = function (module_path, module_builder) {
  delete require.cache[module_path];
  require.definitions_[module_path] = module_builder;
};

require.get = function (modules) {
  for (var module_path in modules) {
    if (modules.hasOwnProperty(module_path)) {
      var url = modules[module_path];
      var source = require.getSource_(url);
      if (source === null) {
        throw new Error('Failed to get the module ' + module_path);
      }

      var builder = new Function('module', 'exports', 'require', 'global', source);
      require.install(module_path, builder);
    }
  }
};

require.resolve = function (ref /*, ...paths */) {
  var paths = Array.prototype.slice.call(arguments, 1);

  var module_path = paths[0];
  if (module_path) {
    if (module_path[0] === '.') {
      // relative path
      if (module_path[1] === '.') {
        module_path = ref.replace(/\/?\w[\w-]*\/\w[\w-]*$/, '') + module_path.substr(2);
      } else {
        module_path = ref.replace(/\/?\w[\w-]*$/, '') + module_path.substr(1);
      }
    } else if (module_path[0] !== '/') {
      if (/\//.test(module_path[0])) {
        throw new Error('Invalid module name ' + module_path[0]);
      }
    }

    return require.resolve.apply(null, [ module_path ].concat(paths.slice(1)));
  } else {
    if (!/\//.test(ref)) {
      // root module
      return ref + '/index';
    }
    return ref;
  }
};

require.load_ = function (module_path) {
  var definition = require.definitions_[module_path];
  if (!definition) {
    throw new Error('Module ' + module_path + ' not found');
  }

  var exports = {};
  var module = { exports: exports };
  var global = (function () { return this; }());

  require.main = require.main || module;

  var scoped_require = require.bind(null, module_path);
  scoped_require.main = require.main;

  definition(module, exports, scoped_require, global);

  return module;
};

require.getSource_ = function (url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.send(null);

  if (xhr.status >= 300) {
    return null;
  }
  return xhr.responseText;
};
