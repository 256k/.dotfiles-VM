/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _inject = __webpack_require__(2);

	var _inject2 = _interopRequireDefault(_inject);

	var _inject3 = __webpack_require__(5);

	var _inject4 = _interopRequireDefault(_inject3);

	var _inject5 = __webpack_require__(10);

	var _inject6 = _interopRequireDefault(_inject5);

	var _inject7 = __webpack_require__(11);

	var _inject8 = _interopRequireDefault(_inject7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(function () {
	  var talkToExtension = function talkToExtension(eventType, data) {
	    window.postMessage({
	      eventType: eventType,
	      data: data,
	      source: 'ddp-monitor-extension'
	    }, '*');
	  };

	  var readyStateCheckInterval = setInterval(function () {
	    var _this = this;

	    var isMeteorDefined = typeof Meteor !== 'undefined';
	    if (document.readyState === 'complete' || isMeteorDefined) {
	      clearInterval(readyStateCheckInterval);
	      if (isMeteorDefined) {
	        var i;

	        (function () {
	          var plugins = [_inject2.default, _inject4.default, _inject6.default, _inject8.default];
	          for (i = 0; i < plugins.length; i++) {
	            plugins[i].setup.call(_this, talkToExtension);
	          }

	          window.__meteor_devtools_receiveMessage = function (message) {
	            for (var i = 0; i < plugins.length; i++) {
	              plugins[i].onMessage && plugins[i].onMessage.call(this, message);
	            }
	          };
	        })();
	      }
	    }
	  }, 10);
	})();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _errorStackParser = __webpack_require__(3);

	var _errorStackParser2 = _interopRequireDefault(_errorStackParser);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = {
	  setup: function setup(talkToExtension) {
	    var getStackTrace = function getStackTrace(stackTraceLimit) {
	      var originalStackTraceLimit = Error.stackTraceLimit;
	      try {
	        Error.stackTraceLimit = stackTraceLimit || 15;
	        return _errorStackParser2.default.parse(new Error());
	      } finally {
	        Error.stackTraceLimit = originalStackTraceLimit;
	      }
	    };

	    var grabStackAndTalkToExtension = function grabStackAndTalkToExtension(message) {
	      var stackTrace = getStackTrace(15);

	      if (stackTrace && stackTrace.length !== 0) {
	        // XX: clean up first 2 traces since they refer to
	        // account for getStackTrace and grabStackAndTalkToExtension calls
	        stackTrace.splice(0, 2);
	      }

	      message.stackTrace = stackTrace;
	      talkToExtension('ddp-trace', message);
	    };

	    var oldSend = Meteor.connection._stream.send;
	    Meteor.connection._stream.send = function () {
	      oldSend.apply(this, arguments);
	      grabStackAndTalkToExtension({
	        messageJSON: arguments[0],
	        isOutbound: true
	      });
	    };

	    Meteor.connection._stream.on('message', function () {
	      grabStackAndTalkToExtension({
	        messageJSON: arguments[0],
	        isOutbound: false
	      });
	    });
	  }
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
	    'use strict';
	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

	    /* istanbul ignore next */
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('stackframe'));
	    } else {
	        root.ErrorStackParser = factory(root.StackFrame);
	    }
	}(this, function ErrorStackParser(StackFrame) {
	    'use strict';

	    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+\:\d+/;
	    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+\:\d+|\(native\))/m;
	    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code\])?$/;

	    function _map(array, fn, thisArg) {
	        if (typeof Array.prototype.map === 'function') {
	            return array.map(fn, thisArg);
	        } else {
	            var output = new Array(array.length);
	            for (var i = 0; i < array.length; i++) {
	                output[i] = fn.call(thisArg, array[i]);
	            }
	            return output;
	        }
	    }

	    function _filter(array, fn, thisArg) {
	        if (typeof Array.prototype.filter === 'function') {
	            return array.filter(fn, thisArg);
	        } else {
	            var output = [];
	            for (var i = 0; i < array.length; i++) {
	                if (fn.call(thisArg, array[i])) {
	                    output.push(array[i]);
	                }
	            }
	            return output;
	        }
	    }

	    return {
	        /**
	         * Given an Error object, extract the most information from it.
	         *
	         * @param {Error} error object
	         * @return {Array} of StackFrames
	         */
	        parse: function ErrorStackParser$$parse(error) {
	            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
	                return this.parseOpera(error);
	            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
	                return this.parseV8OrIE(error);
	            } else if (error.stack) {
	                return this.parseFFOrSafari(error);
	            } else {
	                throw new Error('Cannot parse given Error object');
	            }
	        },

	        /**
	         * Separate line and column numbers from a URL-like string.
	         *
	         * @param {String} urlLike
	         * @return {Array} 3-tuple of URL, Line Number, and Column Number
	         */
	        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
	            // Fail-fast but return locations like "(native)"
	            if (urlLike.indexOf(':') === -1) {
	                return [urlLike];
	            }

	            var locationParts = urlLike.replace(/[\(\)\s]/g, '').split(':');
	            var lastNumber = locationParts.pop();
	            var possibleNumber = locationParts[locationParts.length - 1];
	            if (!isNaN(parseFloat(possibleNumber)) && isFinite(possibleNumber)) {
	                var lineNumber = locationParts.pop();
	                return [locationParts.join(':'), lineNumber, lastNumber];
	            } else {
	                return [locationParts.join(':'), lastNumber, undefined];
	            }
	        },

	        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
	            var filtered = _filter(error.stack.split('\n'), function(line) {
	                return !!line.match(CHROME_IE_STACK_REGEXP);
	            }, this);

	            return _map(filtered, function(line) {
	                if (line.indexOf('(eval ') > -1) {
	                    // Throw away eval information until we implement stacktrace.js/stackframe#8
	                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^\()]*)|(\)\,.*$)/g, '');
	                }
	                var tokens = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').split(/\s+/).slice(1);
	                var locationParts = this.extractLocation(tokens.pop());
	                var functionName = tokens.join(' ') || undefined;
	                var fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];

	                return new StackFrame(functionName, undefined, fileName, locationParts[1], locationParts[2], line);
	            }, this);
	        },

	        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
	            var filtered = _filter(error.stack.split('\n'), function(line) {
	                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
	            }, this);

	            return _map(filtered, function(line) {
	                // Throw away eval information until we implement stacktrace.js/stackframe#8
	                if (line.indexOf(' > eval') > -1) {
	                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval\:\d+\:\d+/g, ':$1');
	                }

	                if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
	                    // Safari eval frames only have function names and nothing else
	                    return new StackFrame(line);
	                } else {
	                    var tokens = line.split('@');
	                    var locationParts = this.extractLocation(tokens.pop());
	                    var functionName = tokens.join('@') || undefined;
	                    return new StackFrame(functionName,
	                        undefined,
	                        locationParts[0],
	                        locationParts[1],
	                        locationParts[2],
	                        line);
	                }
	            }, this);
	        },

	        parseOpera: function ErrorStackParser$$parseOpera(e) {
	            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
	                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
	                return this.parseOpera9(e);
	            } else if (!e.stack) {
	                return this.parseOpera10(e);
	            } else {
	                return this.parseOpera11(e);
	            }
	        },

	        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
	            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
	            var lines = e.message.split('\n');
	            var result = [];

	            for (var i = 2, len = lines.length; i < len; i += 2) {
	                var match = lineRE.exec(lines[i]);
	                if (match) {
	                    result.push(new StackFrame(undefined, undefined, match[2], match[1], undefined, lines[i]));
	                }
	            }

	            return result;
	        },

	        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
	            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
	            var lines = e.stacktrace.split('\n');
	            var result = [];

	            for (var i = 0, len = lines.length; i < len; i += 2) {
	                var match = lineRE.exec(lines[i]);
	                if (match) {
	                    result.push(
	                        new StackFrame(
	                            match[3] || undefined,
	                            undefined,
	                            match[2],
	                            match[1],
	                            undefined,
	                            lines[i]
	                        )
	                    );
	                }
	            }

	            return result;
	        },

	        // Opera 10.65+ Error.stack very similar to FF/Safari
	        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
	            var filtered = _filter(error.stack.split('\n'), function(line) {
	                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
	            }, this);

	            return _map(filtered, function(line) {
	                var tokens = line.split('@');
	                var locationParts = this.extractLocation(tokens.pop());
	                var functionCall = (tokens.shift() || '');
	                var functionName = functionCall
	                        .replace(/<anonymous function(: (\w+))?>/, '$2')
	                        .replace(/\([^\)]*\)/g, '') || undefined;
	                var argsRaw;
	                if (functionCall.match(/\(([^\)]*)\)/)) {
	                    argsRaw = functionCall.replace(/^[^\(]+\(([^\)]*)\)$/, '$1');
	                }
	                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ?
	                    undefined : argsRaw.split(',');
	                return new StackFrame(
	                    functionName,
	                    args,
	                    locationParts[0],
	                    locationParts[1],
	                    locationParts[2],
	                    line);
	            }, this);
	        }
	    };
	}));



/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	    'use strict';
	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

	    /* istanbul ignore next */
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports === 'object') {
	        module.exports = factory();
	    } else {
	        root.StackFrame = factory();
	    }
	}(this, function () {
	    'use strict';
	    function _isNumber(n) {
	        return !isNaN(parseFloat(n)) && isFinite(n);
	    }

	    function StackFrame(functionName, args, fileName, lineNumber, columnNumber, source) {
	        if (functionName !== undefined) {
	            this.setFunctionName(functionName);
	        }
	        if (args !== undefined) {
	            this.setArgs(args);
	        }
	        if (fileName !== undefined) {
	            this.setFileName(fileName);
	        }
	        if (lineNumber !== undefined) {
	            this.setLineNumber(lineNumber);
	        }
	        if (columnNumber !== undefined) {
	            this.setColumnNumber(columnNumber);
	        }
	        if (source !== undefined) {
	            this.setSource(source);
	        }
	    }

	    StackFrame.prototype = {
	        getFunctionName: function () {
	            return this.functionName;
	        },
	        setFunctionName: function (v) {
	            this.functionName = String(v);
	        },

	        getArgs: function () {
	            return this.args;
	        },
	        setArgs: function (v) {
	            if (Object.prototype.toString.call(v) !== '[object Array]') {
	                throw new TypeError('Args must be an Array');
	            }
	            this.args = v;
	        },

	        // NOTE: Property name may be misleading as it includes the path,
	        // but it somewhat mirrors V8's JavaScriptStackTraceApi
	        // https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi and Gecko's
	        // http://mxr.mozilla.org/mozilla-central/source/xpcom/base/nsIException.idl#14
	        getFileName: function () {
	            return this.fileName;
	        },
	        setFileName: function (v) {
	            this.fileName = String(v);
	        },

	        getLineNumber: function () {
	            return this.lineNumber;
	        },
	        setLineNumber: function (v) {
	            if (!_isNumber(v)) {
	                throw new TypeError('Line Number must be a Number');
	            }
	            this.lineNumber = Number(v);
	        },

	        getColumnNumber: function () {
	            return this.columnNumber;
	        },
	        setColumnNumber: function (v) {
	            if (!_isNumber(v)) {
	                throw new TypeError('Column Number must be a Number');
	            }
	            this.columnNumber = Number(v);
	        },

	        getSource: function () {
	            return this.source;
	        },
	        setSource: function (v) {
	            this.source = String(v);
	        },

	        toString: function() {
	            var functionName = this.getFunctionName() || '{anonymous}';
	            var args = '(' + (this.getArgs() || []).join(',') + ')';
	            var fileName = this.getFileName() ? ('@' + this.getFileName()) : '';
	            var lineNumber = _isNumber(this.getLineNumber()) ? (':' + this.getLineNumber()) : '';
	            var columnNumber = _isNumber(this.getColumnNumber()) ? (':' + this.getColumnNumber()) : '';
	            return functionName + args + fileName + lineNumber + columnNumber;
	        }
	    };

	    return StackFrame;
	}));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _highlighter = __webpack_require__(6);

	var _highlighter2 = _interopRequireDefault(_highlighter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var hl;

	var __getBlazeData = function __getBlazeData(callback) {
	  if (typeof Blaze === 'undefined') {
	    return;
	  }

	  var idCnt = 0;

	  var generateId = function generateId() {
	    idCnt++;
	    return 'node-' + idCnt;
	  };

	  var cleanupData = function cleanupData(data) {
	    if (!data) {
	      return data;
	    }

	    var d = {};
	    var keys = Object.getOwnPropertyNames(data);

	    for (var i = 0; i < keys.length; i++) {
	      var serializedFieldData = null;

	      try {
	        JSON.stringify(data[keys[i]]);
	      } catch (e) {
	        serializedFieldData = data[keys[i]].toString();
	      }

	      d[keys[i]] = serializedFieldData || data[keys[i]];
	    }

	    return d;
	  };

	  var getViewFromEl = function getViewFromEl(el) {
	    var view = Blaze.getView(el);
	    var events = [];
	    var _events = view && view.template && view.template.__eventMaps || [];

	    for (var i = 0; i < _events.length; i++) {
	      var props = Object.getOwnPropertyNames(_events[i]);
	      if (props.length !== 0) {
	        events.push(props[0]);
	      }
	    }

	    return view && {
	      name: view.name,
	      data: cleanupData(view.templateInstance && view.templateInstance().data),
	      helpers: Object.getOwnPropertyNames(view.template && view.template.__helpers || {}),
	      events: events
	    };
	  };

	  var lookForViews = function lookForViews(el, parent) {
	    var view = getViewFromEl(el);

	    if (view && view.name !== parent.name) {
	      var _id = generateId();
	      var node = {
	        _id: _id,
	        name: view.name,
	        data: view.data,
	        helpers: view.helpers,
	        events: view.events,
	        children: []
	      };
	      el.setAttribute('data-blaze-inspector-id', _id);

	      for (var i = 0; i < el.childNodes.length; i++) {
	        if (el.childNodes[i].nodeType !== 1) {
	          continue;
	        }
	        lookForViews(el.childNodes[i], node);
	      }

	      parent.children.push(node);
	    } else {
	      for (var i = 0; i < el.childNodes.length; i++) {
	        if (el.childNodes[i].nodeType !== 1) {
	          continue;
	        }
	        lookForViews(el.childNodes[i], parent);
	      }
	    }
	  };

	  var data = {
	    _id: generateId(),
	    name: 'body',
	    children: []
	  };

	  lookForViews(document.querySelector('body'), data);

	  callback && callback('blaze-tree', JSON.stringify(data));
	};

	var __talkToExtension = null;

	module.exports = {
	  setup: function setup(talkToExtension) {
	    __talkToExtension = talkToExtension;
	    // XX: wait a little bit to make sure all the jazz
	    // has been rendered
	    setTimeout(function () {
	      return __getBlazeData(talkToExtension);
	    }, 2000);
	  },

	  onMessage: function onMessage(message) {
	    if (message.source !== 'blaze-inspector') {
	      return;
	    }

	    switch (message.event) {
	      case 'get-blaze-data':
	        __talkToExtension && __getBlazeData(__talkToExtension);
	        break;
	      case 'shutdown':
	        hl && hl.remove();
	        hl = null;
	        break;
	      case 'start-inspecting':
	        hl = new _highlighter2.default(window, function (node) {/*agent.selectFromDOMNode(node); */});
	        hl && hl.startInspecting();
	        break;
	      case 'hide-highlight':
	        hl && hl.hideHighlight();
	        break;
	      case 'highlight':
	        hl && hl.highlight(document.querySelector('[data-blaze-inspector-id=' + message.nodeId + ']'), 'element');
	        break;
	      default:
	        return;
	    }
	  }
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Overlay = __webpack_require__(7);
	var MultiOverlay = __webpack_require__(9);

	/**
	 * Manages the highlighting of items on an html page, as well as
	 * hover-to-inspect.
	 */

	var Highlighter = function () {
	  // _overlay: ?Overlay;
	  // _multiOverlay: ?MultiOverlay;
	  // _win: Object;
	  // _onSelect: (node: DOMNode) => void;
	  // _inspecting: boolean;
	  // _subs: Array<() => void>;
	  // _button: DOMNode;

	  function Highlighter(win, onSelect) {
	    _classCallCheck(this, Highlighter);

	    this._win = win;
	    this._onSelect = onSelect;
	    this._overlay = null;
	    this._multiOverlay = null;
	    this._subs = [];
	  }

	  _createClass(Highlighter, [{
	    key: 'startInspecting',
	    value: function startInspecting() {
	      this._inspecting = true;
	      this._subs = [
	      //captureSubscription(this._win, 'mouseover', this.onHover.bind(this)),
	      captureSubscription(this._win, 'mousedown', this.onMouseDown.bind(this)), captureSubscription(this._win, 'click', this.onClick.bind(this))];
	    }
	  }, {
	    key: 'stopInspecting',
	    value: function stopInspecting() {
	      this._subs.forEach(function (unsub) {
	        return unsub();
	      });
	      this.hideHighlight();
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
	      this.stopInspecting();
	      if (this._button && this._button.parentNode) {
	        this._button.parentNode.removeChild(this._button);
	      }
	    }
	  }, {
	    key: 'highlight',
	    value: function highlight(node, name) {
	      this.removeMultiOverlay();
	      if (!this._overlay) {
	        this._overlay = new Overlay(this._win);
	      }
	      this._overlay.inspect(node, name);
	    }
	  }, {
	    key: 'highlightMany',
	    value: function highlightMany(nodes) {
	      this.removeOverlay();
	      if (!this._multiOverlay) {
	        this._multiOverlay = new MultiOverlay(this._win);
	      }
	      this._multiOverlay.highlightMany(nodes);
	    }
	  }, {
	    key: 'hideHighlight',
	    value: function hideHighlight() {
	      this._inspecting = false;
	      this.removeOverlay();
	      this.removeMultiOverlay();
	    }
	  }, {
	    key: 'removeOverlay',
	    value: function removeOverlay() {
	      if (!this._overlay) {
	        return;
	      }
	      this._overlay.remove();
	      this._overlay = null;
	    }
	  }, {
	    key: 'removeMultiOverlay',
	    value: function removeMultiOverlay() {
	      if (!this._multiOverlay) {
	        return;
	      }
	      this._multiOverlay.remove();
	      this._multiOverlay = null;
	    }
	  }, {
	    key: 'onMouseDown',
	    value: function onMouseDown(evt) {
	      if (!this._inspecting) {
	        return;
	      }
	      evt.preventDefault();
	      evt.stopPropagation();
	      evt.cancelBubble = true;
	      this._onSelect(evt.target);
	      return;
	    }
	  }, {
	    key: 'onClick',
	    value: function onClick(evt) {
	      if (!this._inspecting) {
	        return;
	      }
	      this._subs.forEach(function (unsub) {
	        return unsub();
	      });
	      evt.preventDefault();
	      evt.stopPropagation();
	      evt.cancelBubble = true;
	      this.hideHighlight();
	    }
	  }, {
	    key: 'onHover',
	    value: function onHover(evt) {
	      if (!this._inspecting) {
	        return;
	      }
	      evt.preventDefault();
	      evt.stopPropagation();
	      evt.cancelBubble = true;
	      this.highlight(evt.target);
	    }
	  }, {
	    key: 'injectButton',
	    value: function injectButton() {
	      this._button = makeMagnifier();
	      this._button.onclick = this.startInspecting.bind(this);
	      this._win.document.body.appendChild(this._button);
	    }
	  }]);

	  return Highlighter;
	}();

	function captureSubscription(obj, evt, cb) {
	  obj.addEventListener(evt, cb, true);
	  return function () {
	    return obj.removeEventListener(evt, cb, true);
	  };
	}

	function makeMagnifier() {
	  var button = window.document.createElement('button');
	  button.innerHTML = '&#128269;';
	  button.style.backgroundColor = 'transparent';
	  button.style.border = 'none';
	  button.style.outline = 'none';
	  button.style.cursor = 'pointer';
	  button.style.position = 'fixed';
	  button.style.bottom = '10px';
	  button.style.right = '10px';
	  button.style.fontSize = '30px';
	  button.style.zIndex = 10000000;
	  return button;
	}

	module.exports = Highlighter;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var assign = __webpack_require__(8);

	var Overlay = function () {
	  function Overlay(window) {
	    _classCallCheck(this, Overlay);

	    var doc = window.document;
	    this.win = window;
	    this.container = doc.createElement('div');
	    this.node = doc.createElement('div');
	    this.border = doc.createElement('div');
	    this.padding = doc.createElement('div');
	    this.content = doc.createElement('div');

	    this.border.style.borderColor = overlayStyles.border;
	    this.padding.style.borderColor = overlayStyles.padding;
	    this.content.style.backgroundColor = overlayStyles.background;

	    assign(this.node.style, {
	      borderColor: overlayStyles.margin,
	      pointerEvents: 'none',
	      position: 'fixed'
	    });

	    this.tip = doc.createElement('div');
	    assign(this.tip.style, {
	      border: '1px solid #aaa',
	      backgroundColor: 'rgb(255, 255, 178)',
	      fontFamily: 'sans-serif',
	      color: 'orange',
	      padding: '3px 5px',
	      position: 'fixed',
	      fontSize: '10px'
	    });

	    this.nameSpan = doc.createElement('span');
	    this.tip.appendChild(this.nameSpan);
	    assign(this.nameSpan.style, {
	      color: 'rgb(136, 18, 128)',
	      marginRight: '5px'
	    });
	    this.dimSpan = doc.createElement('span');
	    this.tip.appendChild(this.dimSpan);
	    assign(this.dimSpan.style, {
	      color: '#888'
	    });

	    this.container.style.zIndex = 10000000;
	    this.node.style.zIndex = 10000000;
	    this.tip.style.zIndex = 10000000;
	    this.container.appendChild(this.node);
	    this.container.appendChild(this.tip);
	    this.node.appendChild(this.border);
	    this.border.appendChild(this.padding);
	    this.padding.appendChild(this.content);
	    doc.body.appendChild(this.container);
	  }

	  _createClass(Overlay, [{
	    key: 'remove',
	    value: function remove() {
	      if (this.container.parentNode) {
	        this.container.parentNode.removeChild(this.container);
	      }
	    }
	  }, {
	    key: 'inspect',
	    value: function inspect(node, name) {
	      var box = node.getBoundingClientRect();
	      var dims = getElementDimensions(node);

	      boxWrap(dims, 'margin', this.node);
	      boxWrap(dims, 'border', this.border);
	      boxWrap(dims, 'padding', this.padding);

	      assign(this.content.style, {
	        height: box.height - dims.borderTop - dims.borderBottom - dims.paddingTop - dims.paddingBottom + 'px',
	        width: box.width - dims.borderLeft - dims.borderRight - dims.paddingLeft - dims.paddingRight + 'px'
	      });

	      assign(this.node.style, {
	        top: box.top - dims.marginTop + 'px',
	        left: box.left - dims.marginLeft + 'px'
	      });

	      this.nameSpan.textContent = name || node.nodeName.toLowerCase();
	      this.dimSpan.textContent = box.width + 'px × ' + box.height + 'px';

	      var tipPos = findTipPos({
	        top: box.top - dims.marginTop,
	        left: box.left - dims.marginLeft,
	        height: box.height + dims.marginTop + dims.marginBottom,
	        width: box.width + dims.marginLeft + dims.marginRight
	      }, this.win);
	      assign(this.tip.style, tipPos);
	    }
	  }]);

	  return Overlay;
	}();

	function findTipPos(dims, win) {
	  var tipHeight = 20;
	  var margin = 5;
	  var top;
	  if (dims.top + dims.height + tipHeight <= win.innerHeight) {
	    if (dims.top + dims.height < 0) {
	      top = margin;
	    } else {
	      top = dims.top + dims.height + margin;
	    }
	  } else if (dims.top - tipHeight <= win.innerHeight) {
	    if (dims.top - tipHeight - margin < margin) {
	      top = margin;
	    } else {
	      top = dims.top - tipHeight - margin;
	    }
	  } else {
	    top = win.innerHeight - tipHeight - margin;
	  }

	  top += 'px';

	  if (dims.left < 0) {
	    return { top: top, left: margin };
	  }
	  if (dims.left + 200 > win.innerWidth) {
	    return { top: top, right: margin };
	  }
	  return { top: top, left: dims.left + margin + 'px' };
	}

	function getElementDimensions(element) {
	  var calculatedStyle = window.getComputedStyle(element);

	  return {
	    borderLeft: +calculatedStyle.borderLeftWidth.match(/[0-9]*/)[0],
	    borderRight: +calculatedStyle.borderRightWidth.match(/[0-9]*/)[0],
	    borderTop: +calculatedStyle.borderTopWidth.match(/[0-9]*/)[0],
	    borderBottom: +calculatedStyle.borderBottomWidth.match(/[0-9]*/)[0],
	    marginLeft: +calculatedStyle.marginLeft.match(/[0-9]*/)[0],
	    marginRight: +calculatedStyle.marginRight.match(/[0-9]*/)[0],
	    marginTop: +calculatedStyle.marginTop.match(/[0-9]*/)[0],
	    marginBottom: +calculatedStyle.marginBottom.match(/[0-9]*/)[0],
	    paddingLeft: +calculatedStyle.paddingLeft.match(/[0-9]*/)[0],
	    paddingRight: +calculatedStyle.paddingRight.match(/[0-9]*/)[0],
	    paddingTop: +calculatedStyle.paddingTop.match(/[0-9]*/)[0],
	    paddingBottom: +calculatedStyle.paddingBottom.match(/[0-9]*/)[0]
	  };
	}

	function boxWrap(dims, what, node) {
	  assign(node.style, {
	    borderTopWidth: dims[what + 'Top'] + 'px',
	    borderLeftWidth: dims[what + 'Left'] + 'px',
	    borderRightWidth: dims[what + 'Right'] + 'px',
	    borderBottomWidth: dims[what + 'Bottom'] + 'px',
	    borderStyle: 'solid'
	  });
	}

	var overlayStyles = {
	  background: 'rgba(120, 170, 210, 0.7)',
	  padding: 'rgba(77, 200, 0, 0.3)',
	  margin: 'rgba(255, 155, 0, 0.3)',
	  border: 'rgba(255, 200, 50, 0.3)'
	};

	module.exports = Overlay;

/***/ },
/* 8 */
/***/ function(module, exports) {

	/* eslint-disable no-unused-vars */
	'use strict';
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var assign = __webpack_require__(8);

	var MultiOverlay = function () {
	  function MultiOverlay(window) {
	    _classCallCheck(this, MultiOverlay);

	    this.win = window;
	    var doc = window.document;
	    this.container = doc.createElement('div');
	    doc.body.appendChild(this.container);
	  }

	  _createClass(MultiOverlay, [{
	    key: 'highlightMany',
	    value: function highlightMany(nodes) {
	      var _this = this;

	      this.container.innerHTML = '';
	      nodes.forEach(function (node) {
	        var div = _this.win.document.createElement('div');
	        var box = node.getBoundingClientRect();
	        assign(div.style, {
	          top: box.top + 'px',
	          left: box.left + 'px',
	          width: box.width + 'px',
	          height: box.height + 'px',
	          border: '2px dotted rgba(200, 100, 100, .8)',
	          boxSizing: 'border-box',
	          backgroundColor: 'rgba(200, 100, 100, .2)',
	          position: 'fixed',
	          zIndex: 10000000,
	          pointerEvents: 'none'
	        });
	        _this.container.appendChild(div);
	      });
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
	      if (this.container.parentNode) {
	        this.container.parentNode.removeChild(this.container);
	      }
	    }
	  }]);

	  return MultiOverlay;
	}();

	module.exports = MultiOverlay;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	var __cleanUpObjectProps = function __cleanUpObjectProps(obj) {
	  Object.keys(obj).forEach(function (k) {
	    if (obj[k] instanceof Date) {
	      obj[k] = obj[k].toString();
	    }
	  });
	  return obj;
	};

	var __getMinimongoCollections = function __getMinimongoCollections(callback) {
	  var data = {};
	  var collections = Meteor.connection._mongo_livedata_collections;
	  for (var i in collections) {
	    if (collections[i].name) {
	      data[collections[i].name] = collections[i].find().fetch().map(__cleanUpObjectProps);
	    }
	  }
	  callback && callback('minimongo-explorer', data);
	};

	var __talkToExtension = null;

	module.exports = {
	  setup: function setup(talkToExtension) {
	    __talkToExtension = talkToExtension;
	    Tracker.autorun(function () {
	      var collections = Meteor.connection._mongo_livedata_collections;
	      for (var i in collections) {
	        collections[i].find();
	      }
	      __getMinimongoCollections(talkToExtension);
	    });
	  },
	  onMessage: function onMessage(message) {
	    if (message.source !== 'minimongo-explorer') {
	      return;
	    }
	    if (message.event === 'get-minimongo-collections') {
	      __talkToExtension && __getMinimongoCollections(__talkToExtension);
	    }
	  }
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	var __getPackageList = function __getPackageList(callback) {
	  var collections = Package && Object.keys(Package);
	  callback && callback('security-auditor', collections);
	};

	var __testDDPMethod = function __testDDPMethod(ddpMessage) {
	  // add empty methodInvoker to avoid error message
	  Meteor.connection._methodInvokers[ddpMessage.id] = { dataVisible: function dataVisible() {} };
	  Meteor.connection._stream.send(JSON.stringify(ddpMessage));
	};

	var __talkToExtension = null;

	module.exports = {
	  setup: function setup(talkToExtension) {
	    __talkToExtension = talkToExtension;
	    __getPackageList(talkToExtension);
	  },
	  onMessage: function onMessage(message) {
	    if (message.source !== 'security-auditor') {
	      return;
	    }
	    if (message.event === 'get-package-list') {
	      __talkToExtension && __getPackageList(__talkToExtension);
	    }
	    if (message.event === 'test-collection-security') {
	      __talkToExtension && __testDDPMethod(message.ddpMessage);
	    }
	    if (message.event === 'test-method-params') {
	      __talkToExtension && __testDDPMethod(message.ddpMessage);
	    }
	  }
	};

/***/ }
/******/ ]);