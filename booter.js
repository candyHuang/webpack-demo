(function(global) {
  'use strict';

  var slice = Array.prototype.slice,
    proto = {},
    booter = create(proto),
    APP_CONFIG = {
      iosAudit: {
        enable: false,
        ver: '6.9.1'
      }
    },
    PRESET_MAP = {
      vue: {
        src: 'https://cdn.bootcss.com/vue/__VERSION__/vue.min.js',
        rules: {
          '/': '2.6.10',
          'localhost:8080': '2.4.0'
        }
      },
      vant: {
        src: 'https://cdn.jsdelivr.net/npm/vant@2.2/lib/vant.min.js'
      },
      vantCss: {
        src: 'https://cdn.jsdelivr.net/npm/vant@2.2/lib/index.css'
      }
    };

  booter.version = '0.0.1';
  booter.options = {
    timeout: 15, // seconds
    entrypoints: [], // entrypoints
    presets: [], // preset deps
    alias: {}, // key - name, value - id
    deps: {
      vant: ['vue', 'vantCss']
    }, // key - id, value - name/id
    urlPattern: null, // '/path/to/resources/%s'
    maxUrlLength: 2000 // approximate value of combo url's max length (recommend 2000)
  };
  booter.cache = {}; // key - id

  /**
   *  Mix obj to global.g_config
   */
  proto.setGlobalConfig = function() {
    var config = global.g_config || {};

    debug('booter.start', 'setGlobalConfig', config);
    each(APP_CONFIG, function(value, key) {
      if (config[key] === undefined) {
        config[key] = value;
      }
    });
    global.g_config = config;
    return config;
  };

  /**
   * booter start app
   */
  proto.start = function() {
    var options = this.options;
    var names = options.presets.concat(options.entrypoints);

    debug('booter.start', names);
    this.setGlobalConfig();
    this.async(names, function() {
      debug('booter.start.success');
    });
  };

  /**
   * Mix obj to booter.options
   * @param {Object} obj
   */
  proto.config = function(obj) {
    var options = this.options;

    debug('booter.config', obj);
    // put preset into alias
    each(PRESET_MAP, function(v, k) {
      options.alias[k] = getPresetUrl;
    });
    each(obj, function(value, key) {
      var data = options[key],
        t = type(data);
      if (t === 'object') {
        each(value, function(v, k) {
          data[k] = v;
        });
      } else {
        if (t === 'array') value = data.concat(value);
        options[key] = value;
      }
    });
    return options;
  };

  /**
   * Require modules asynchronously with a callback
   * @param {string|string[]} names
   * @param {Function} [onload]
   */
  proto.async = function(names, onload) {
    if (type(names) === 'string') names = [names];
    debug('booter.async', '[' + names.join(', ') + ']');

    var reactor = new booter.Reactor(names, function() {
      var args = [];
      each(names, function(id) {
        //  args.push(require(id));
        args.push(id);
      });
      if (onload) onload.apply(booter, args);
      debug('booter.async', '[' + names.join(', ') + '] callback called');
    });
    booter.test = reactor;
    reactor.run();
  };

  /**
   * Get a defined module
   * @param {string} id
   * @returns {Object} module
   */
  proto.get = function(id) {
    debug('booter.get', '[' + id + ']');
    var options = booter.options,
      res = booter.cache[id];
    if (res) {
      return res;
    } else if (options.cache) {
      // cache TODO
    }
    return null;
  };

  /**
   * Get alias from specified name recursively
   * @param {string} name
   * @param {string|Function} [alias] - set alias
   * @returns {string} name
   */
  proto.alias = function(name, alias) {
    var aliasMap = booter.options.alias;

    if (arguments.length > 1) {
      aliasMap[name] = alias;
      return booter.alias(name);
    }

    while (aliasMap[name] && name !== aliasMap[name]) {
      switch (type(aliasMap[name])) {
        case 'function':
          name = aliasMap[name](name);
          break;
        case 'string':
          name = aliasMap[name];
          break;
      }
    }
    return name;
  };

  /**
   * Load any types of resources from specified url
   * @param {string} url
   * @param {Function|Object} [onload|options]
   */
  proto.load = function(url, options) {
    if (type(options) === 'function') {
      options = { onload: options };
      if (type(arguments[2]) === 'function') options.onerror = arguments[2];
    }
    function onerror(e) {
      clearTimeout(tid);
      clearInterval(intId);
      e = (e || {}).error || new Error('load url timeout');
      e.message = 'Error loading url: ' + url + '. ' + e.message;
      if (options.onerror) options.onerror.call(booter, e);
      else throw e;
    }
    var t = options.type || fileType(url),
      isScript = t === 'js',
      isCss = t === 'css',
      isOldWebKit = +navigator.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/, '$1') < 536,
      head = document.head,
      node = document.createElement(isScript ? 'script' : 'link'),
      supportOnload = 'onload' in node,
      tid = setTimeout(onerror, (options.timeout || 15) * 1000),
      intId,
      intTimer;

    if (isScript) {
      node.type = 'text/javascript';
      node.async = false;
      node.src = url;
    } else {
      if (isCss) {
        node.type = 'text/css';
        node.rel = 'stylesheet';
      }
      node.href = url;
    }
    node.onload = node.onreadystatechange = function() {
      if (node && (!node.readyState || /loaded|complete/.test(node.readyState))) {
        clearTimeout(tid);
        clearInterval(intId);
        node.onload = node.onreadystatechange = null;
        // if (isScript && head && node.parentNode) head.removeChild(node);
        if (options.onload) options.onload.call(booter);
        node = null;
      }
    };
    node.onerror = onerror;

    debug('booter.load', '[' + url + ']');
    head.appendChild(node);

    // trigger onload immediately after nonscript node insertion
    if (isCss) {
      if (isOldWebKit || !supportOnload) {
        debug('booter.load', "check css's loading status for compatible");
        intTimer = 0;
        intId = setInterval(function() {
          if ((intTimer += 20) > options.timeout || !node) {
            clearTimeout(tid);
            clearInterval(intId);
            return;
          }
          if (node.sheet) {
            clearTimeout(tid);
            clearInterval(intId);
            if (options.onload) options.onload.call(booter);
            node = null;
          }
        }, 20);
      }
    } else if (!isScript) {
      if (options.onload) options.onload.call(booter);
    }
  };

  proto.Reactor = function(names, callback) {
    this.length = 0;
    this.depends = {};
    this.depended = {};
    this.push.apply(this, names);
    this.callback = callback;
  };

  var rproto = booter.Reactor.prototype;

  rproto.push = function() {
    var that = this,
      args = slice.call(arguments);

    function onload() {
      if (--that.length === 0) that.callback();
    }

    each(args, function(arg) {
      var id = booter.alias(arg),
        type = fileType(id),
        res = booter.get(id),
        deps = booter.options.deps;

      if (!res) {
        res = booter.cache[id] = {
          id: id,
          loaded: false
        };
      } else if (that.depended[id] || res.loaded) return;
      if (!res.onload) res.onload = [];

      that.depended[id] = 1;
      that.push.apply(that, deps[id] || deps[arg]);

      if (type === 'css' || type === 'js') {
        (that.depends[type] || (that.depends[type] = [])).push(res);
        ++that.length;
        res.onload.push(onload);
      }
    });
  };

  function makeOnload(deps) {
    deps = deps.slice();
    return function(e) {
      if (e) error(e);
      each(deps, function(res) {
        if (!e) res.loaded = true;
        while (res.onload && res.onload.length) {
          var onload = res.onload.shift();
          onload.call(res);
        }
      });
    };
  }

  rproto.run = function() {
    var that = this,
      depends = this.depends;

    if (this.length === 0) return this.callback();
    debug('reactor.run', depends);

    each(depends.unknown, function(res) {
      booter.load(that.genUrl(res.id), function() {
        res.loaded = true;
      });
    });

    each((depends.css || []).concat(depends.js || []), function(res) {
      var onload = makeOnload([res]);
      booter.load(that.genUrl(res.id), onload);
    });
  };

  rproto.genUrl = function(ids) {
    if (type(ids) === 'string') ids = [ids];

    var url = booter.options.urlPattern;

    switch (type(url)) {
      case 'string':
        url = url.replace('%s', ids.join(','));
        break;
      case 'function':
        url = url(ids);
        break;
      default:
        url = ids.join(',');
    }

    return url;
  };

  function type(obj) {
    var t;
    if (obj == null) {
      t = String(obj);
    } else {
      t = Object.prototype.toString.call(obj).toLowerCase();
      t = t.substring(8, t.length - 1);
    }
    return t;
  }

  function each(obj, iterator, context) {
    if (typeof obj !== 'object') return;

    var i,
      l,
      t = type(obj);
    context = context || obj;
    if (t === 'array' || t === 'arguments' || t === 'nodelist') {
      for (i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === false) return;
      }
    } else {
      for (i in obj) {
        if (obj.hasOwnProperty(i)) {
          if (iterator.call(context, obj[i], i, obj) === false) return;
        }
      }
    }
  }

  function getPresetUrl(preset) {
    var conf = PRESET_MAP[preset];
    var href = global.location.href;
    var version = '';
    if (conf.rules) {
      each(conf.rules, function(value, key) {
        if (~href.indexOf(key) && key.length > version.length) {
          version = value;
        }
      });
    }
    return conf.src.replace('__VERSION__', version);
  }

  function create(proto) {
    function Dummy() {}
    Dummy.prototype = proto;
    return new Dummy();
  }

  var TYPE_RE = /\.(js|css)(?=[?&,]|$)/i;
  function fileType(str) {
    var ext = 'js';
    str.replace(TYPE_RE, function(m, $1) {
      ext = $1;
    });
    if (ext !== 'js' && ext !== 'css') ext = 'unknown';
    return ext;
  }

  var _modCache;
  function debug() {
    var flag = (global.localStorage || {}).debug,
      args = slice.call(arguments),
      style = 'color: #bada55',
      mod = args.shift(),
      re = new RegExp(
        mod.replace(/[.\/\\]/g, function(m) {
          return '\\' + m;
        })
      );
    mod = '%c' + mod;
    if ((flag && flag === '*') || re.test(flag)) {
      if (_modCache !== mod) {
        console.groupEnd(_modCache, style);
        console.group((_modCache = mod), style);
      }
      if (/string|number|boolean/.test(type(args[0]))) {
        args[0] = '%c' + args[0];
        args.splice(1, 0, style);
      }
      console.log.apply(console, args);
    }
  }

  function error() {
    if (console && type(console.error) === 'function') {
      console.error.apply(console, arguments);
    }
  }

  global.booter = booter;
  if (typeof module === 'object' && typeof module.exports === 'object') module.exports = booter;
})(this);
