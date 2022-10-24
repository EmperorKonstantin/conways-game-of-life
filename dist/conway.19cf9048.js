// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"conway.ts":[function(require,module,exports) {
var canvas = document.querySelector('#conway');
var width = canvas.width;
var height = canvas.height;
var context = canvas.getContext('2d');
var tileSize = 20;
var tileX = width / tileSize;
var tileY = height / tileSize;
var gamePaused = false;
var gameSpeed = 100;
context.fillStyle = 'rgb(252, 211, 77)';
context.strokeStyle = 'rgb(90, 90, 90)';
context.lineWidth = 0.5;
var gameOfLifeGrid = function gameOfLifeGrid() {
  var matrix = [];
  for (var i = 0; i < tileX; i++) {
    var row = [];
    for (var j = 0; j < tileY; j++) {
      row.push(false);
    }
    matrix.push(row);
  }
  return matrix;
};
var GRID = gameOfLifeGrid();
var clear = function clear() {
  context === null || context === void 0 ? void 0 : context.clearRect(0, 0, width, height);
};
var drawGridLines = function drawGridLines() {
  for (var i = 0; i < tileX; i++) {
    context === null || context === void 0 ? void 0 : context.beginPath();
    context === null || context === void 0 ? void 0 : context.moveTo(i * tileSize - 0.5, 0);
    context === null || context === void 0 ? void 0 : context.lineTo(i * tileSize - 0.5, height);
    context === null || context === void 0 ? void 0 : context.stroke();
  }
  for (var i = 0; i < tileY; i++) {
    context === null || context === void 0 ? void 0 : context.beginPath();
    context === null || context === void 0 ? void 0 : context.moveTo(0, i * tileSize - 0.5);
    context === null || context === void 0 ? void 0 : context.lineTo(width, i * tileSize - 0.5);
    context === null || context === void 0 ? void 0 : context.stroke();
  }
};
var drawGameOfLifeGrid = function drawGameOfLifeGrid(grid) {
  for (var i = 0; i < tileX; i++) {
    for (var j = 0; j < tileY; j++) {
      if (!grid[i][j]) {
        continue;
      }
      context === null || context === void 0 ? void 0 : context.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
    }
  }
};
var cellAlive = function cellAlive(x, y) {
  if (x < 0 || x >= tileX || y < 0 || y >= tileY) {
    return 0;
  }
  return GRID[x][y] ? 1 : 0;
};
var countNeighbours = function countNeighbours(x, y) {
  var amountOfNeighbors = 0;
  for (var _i = 0, _a = [-1, 0, 1]; _i < _a.length; _i++) {
    var i = _a[_i];
    for (var _b = 0, _c = [-1, 0, 1]; _b < _c.length; _b++) {
      var j = _c[_b];
      if (!(i === 0 && j === 0)) {
        amountOfNeighbors += cellAlive(x + i, y + j);
      }
    }
  }
  return amountOfNeighbors;
};
var computeNextGeneration = function computeNextGeneration() {
  var nextGridPositions = gameOfLifeGrid();
  for (var i = 0; i < tileX; i++) {
    for (var j = 0; j < tileY; j++) {
      if (!cellAlive(i, j)) {
        if (countNeighbours(i, j) === 3) {
          nextGridPositions[i][j] = true;
        }
      } else {
        var count = countNeighbours(i, j);
        if (count == 2 || count == 3) {
          nextGridPositions[i][j] = true;
        }
      }
    }
  }
  return nextGridPositions;
};
var drawCanvas = function drawCanvas() {
  clear();
  drawGameOfLifeGrid(GRID);
  drawGridLines();
};
var nextGeneration = function nextGeneration() {
  if (gamePaused) {
    return;
  }
  GRID = computeNextGeneration();
  drawCanvas();
};
var nextGenerationLoop = function nextGenerationLoop() {
  nextGeneration();
  setTimeout(nextGenerationLoop, gameSpeed);
};
// Canoe Pattern on Grid (Still)
GRID[5][7] = true;
GRID[5][8] = true;
GRID[6][8] = true;
GRID[7][7] = true;
GRID[8][4] = true;
GRID[8][6] = true;
GRID[9][4] = true;
GRID[9][5] = true;
// Glider Pattern on Grid (Spaceship)
GRID[1][12] = true;
GRID[2][13] = true;
GRID[0][14] = true;
GRID[1][14] = true;
GRID[2][14] = true;
// Blinker Pattern on Grid (Oscillator)
GRID[4][18] = true;
GRID[4][19] = true;
GRID[4][20] = true;
// Pulsar Pattern on Grid (Oscillator)
GRID[6][25] = true;
GRID[6][26] = true;
GRID[6][27] = true;
GRID[6][31] = true;
GRID[6][32] = true;
GRID[6][33] = true;
GRID[8][23] = true;
GRID[8][28] = true;
GRID[8][30] = true;
GRID[8][35] = true;
GRID[9][23] = true;
GRID[9][28] = true;
GRID[9][30] = true;
GRID[9][35] = true;
GRID[10][23] = true;
GRID[10][28] = true;
GRID[11][30] = true;
GRID[12][35] = true;
GRID[11][25] = true;
GRID[11][26] = true;
GRID[11][27] = true;
GRID[11][31] = true;
GRID[11][32] = true;
GRID[11][33] = true;
GRID[13][25] = true;
GRID[13][26] = true;
GRID[13][27] = true;
GRID[13][31] = true;
GRID[13][32] = true;
GRID[13][33] = true;
GRID[14][23] = true;
GRID[14][28] = true;
GRID[14][30] = true;
GRID[14][35] = true;
GRID[15][23] = true;
GRID[15][28] = true;
GRID[15][30] = true;
GRID[15][35] = true;
GRID[16][23] = true;
GRID[16][28] = true;
GRID[16][30] = true;
GRID[16][35] = true;
GRID[18][25] = true;
GRID[18][26] = true;
GRID[18][27] = true;
GRID[18][31] = true;
GRID[18][32] = true;
GRID[18][33] = true;
nextGenerationLoop();
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "34249" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","conway.ts"], null)
//# sourceMappingURL=/conway.19cf9048.js.map