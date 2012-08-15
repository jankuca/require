
if (typeof process === 'undefined') {
  throw new Error('The compiler is not to be used outside node.js');
}


var fs = require('fs');
var path = require('path');
var vm = require('vm');


var argv = process.argv;

var options = {};
options.script = path.resolve(argv[2]);
options.dir = path.dirname(options.script);
options.in_place = false;

for (var i = 3, ii = argv.length; i < ii; ++i) {
  switch (argv[i]) {
  case '-d':
    options.dir = path.resolve(argv[++i]);
    break;
  case '-i':
    options.in_place = true;
    break;
  }
}


var map = {};

var context = vm.createContext({
  'require': {
    'get': function (modules) {
      Object.keys(modules).forEach(function (module_path) {
        map[module_path] = path.resolve(options.dir, modules[module_path]);
      });
    }
  }
});

var source = fs.readFileSync(options.script, 'utf8');
vm.runInContext(source, context);


var wrap = function (module_path, source) {
  return '\n' +
    'require.install("' + module_path.replace(/"/, '\"') + '", ' +
    'function (module, exports, require, global) {\n' +
    source +
    '\n});\n';
};

var output = '';
Object.keys(map).forEach(function (module_path) {
  var file_path = map[module_path];
  var source = fs.readFileSync(file_path, 'utf8');
  output += wrap(module_path, source);
});


if (options.in_place) {
  fs.writeFileSync(options.script, output, 'utf8');
} else {
  process.stdout.write(output);
}
