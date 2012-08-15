
# require

Node.js has proven the CommonJS specification to be very good.
One of the goals of bringing JavaScript to the server is being able to share code between the server and the client.

The usual way of doing this is by using enviroment recognition techniques such as `(typeof module !== 'undefined')`. This is far from ideal. The clean way is to have no enviroment-specific code in the module source.

This is where **require** comes into play. It lets you use your CommonJS/node.js module directly in the browser without any modifications.

## Modules

The CommonJS spec gives these three modules as an example:

```js
// math.js:
exports.add = function() {
    var sum = 0, i = 0, args = arguments, l = args.length;
    while (i < l) {
        sum += args[i++];
    }
    return sum;
};
```

```js
// increment.js:
var add = require('math').add;
exports.increment = function(val) {
    return add(val, 1);
};
```

```js
// program.js:
var inc = require('increment').increment;
var a = 1;
inc(a); // 2
 
module.id == "program";
```

## Usage

The problem with require is that it has to be synchronous so that the required module can be used immediately. The modules thus have to be available (i.e. cached) when they are needed.

We need to provide the browser with all the modules before booting the application (requiring the main module).

```html
<!DOCTYPE html>
<meta charset="UTF-8">

<script src="./require/require.js"></script>
<script src="./modules.js"></script>

<body>
<script>require('/main');</script>
```

### Compiled App

The `modules.js` file includes all module definitions formatted in a way **require** understands:

```js
// modules.js:
require.install('/main', function (module, exports, require, global) {
  // contents of main.js

  var framework = require('fw');

  var app = framework.create('./app');
  app.run();
});

require.install('fw/index', function (module, exports, require, global) {
  // contents of fw/index.js

  var Application = require('./Application');

  exports.create = function (app_dir) {
    return new Application(app_dir);
  };
});
```

### Uncompiled App

The `modules.js` file can include a map of modules paths to their real locations on the server. The file is supposed to only include `require.get` calls if it is to be used with the compiler (see Integration below).

```js
// modules.js:
require.get({
  'fw/index': './fw/index.js',
  '/main': './main.js'
});
```

```js
// main.js
var framework = require('fw');

var app = framework.create('./app');
app.run();
```

```js
// fw/index.js
var Application = require('./Application');

exports.create = function (app_dir) {
  return new Application(app_dir);
};
```

Note that the files specified in the map are free of the wrapping function. **require** wraps them on its own.

## Integration

Your build script should include a step in which does it compile the `modules.js` file.

**require** includes a simple node.js-based compiler:

```bash
$ node ./compile modules.js -d ./ > modules-compiled.js
```

### Compiler Options

- d – the directory from which to read module source files
- i – edit the `modules.js` file in-place instead of streaming the output to the standard output.
