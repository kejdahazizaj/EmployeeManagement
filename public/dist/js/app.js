/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(/*! process/browser.js */ "./node_modules/process/browser.js");


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");
var enhanceError = __webpack_require__(/*! ./core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var pkg = __webpack_require__(/*! ./../../package.json */ "./node_modules/axios/package.json");

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _bootstrap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bootstrap */ "./resources/js/bootstrap.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@left4code/tw-starter/dist/js/svg-loader'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@left4code/tw-starter/dist/js/accordion'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@left4code/tw-starter/dist/js/alert'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@left4code/tw-starter/dist/js/dropdown'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@left4code/tw-starter/dist/js/modal'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@left4code/tw-starter/dist/js/tab'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _chart__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chart */ "./resources/js/chart.js");
/* harmony import */ var _highlight__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./highlight */ "./resources/js/highlight.js");
/* harmony import */ var _lucide__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lucide */ "./resources/js/lucide.js");
/* harmony import */ var _tiny_slider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./tiny-slider */ "./resources/js/tiny-slider.js");
/* harmony import */ var _tippy__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./tippy */ "./resources/js/tippy.js");
/* harmony import */ var _datepicker__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./datepicker */ "./resources/js/datepicker.js");
/* harmony import */ var _tom_select__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./tom-select */ "./resources/js/tom-select.js");
/* harmony import */ var _dropzone__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./dropzone */ "./resources/js/dropzone.js");
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./validation */ "./resources/js/validation.js");
/* harmony import */ var _zoom__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./zoom */ "./resources/js/zoom.js");
/* harmony import */ var _notification__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./notification */ "./resources/js/notification.js");
/* harmony import */ var _tabulator__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./tabulator */ "./resources/js/tabulator.js");
/* harmony import */ var _calendar__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./calendar */ "./resources/js/calendar.js");
/* harmony import */ var _maps__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./maps */ "./resources/js/maps.js");
/* harmony import */ var _chat__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./chat */ "./resources/js/chat.js");
/* harmony import */ var _chat__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_chat__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _show_modal__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./show-modal */ "./resources/js/show-modal.js");
/* harmony import */ var _show_modal__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_show_modal__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var _show_slide_over__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./show-slide-over */ "./resources/js/show-slide-over.js");
/* harmony import */ var _show_slide_over__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(_show_slide_over__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var _show_dropdown__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./show-dropdown */ "./resources/js/show-dropdown.js");
/* harmony import */ var _show_dropdown__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(_show_dropdown__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var _search__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./search */ "./resources/js/search.js");
/* harmony import */ var _search__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(_search__WEBPACK_IMPORTED_MODULE_20__);
/* harmony import */ var _copy_code__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./copy-code */ "./resources/js/copy-code.js");
/* harmony import */ var _show_code__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./show-code */ "./resources/js/show-code.js");
/* harmony import */ var _show_code__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(_show_code__WEBPACK_IMPORTED_MODULE_22__);
/* harmony import */ var _side_menu__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./side-menu */ "./resources/js/side-menu.js");
/* harmony import */ var _side_menu__WEBPACK_IMPORTED_MODULE_23___default = /*#__PURE__*/__webpack_require__.n(_side_menu__WEBPACK_IMPORTED_MODULE_23__);
/* harmony import */ var _mobile_menu__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./mobile-menu */ "./resources/js/mobile-menu.js");
/* harmony import */ var _mobile_menu__WEBPACK_IMPORTED_MODULE_24___default = /*#__PURE__*/__webpack_require__.n(_mobile_menu__WEBPACK_IMPORTED_MODULE_24__);
/* harmony import */ var _side_menu_tooltip__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./side-menu-tooltip */ "./resources/js/side-menu-tooltip.js");
/* harmony import */ var _dark_mode_switcher__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./dark-mode-switcher */ "./resources/js/dark-mode-switcher.js");
/* harmony import */ var _dark_mode_switcher__WEBPACK_IMPORTED_MODULE_26___default = /*#__PURE__*/__webpack_require__.n(_dark_mode_switcher__WEBPACK_IMPORTED_MODULE_26__);
/*
 |--------------------------------------------------------------------------
 | Midone Built-in Components
 |--------------------------------------------------------------------------
 |
 | Import Midone built-in components.
 |
 */







/*
 |--------------------------------------------------------------------------
 | 3rd Party Libraries
 |--------------------------------------------------------------------------
 |
 | Import 3rd party library JS files.
 |
 */














/*
 |--------------------------------------------------------------------------
 | Custom Components
 |--------------------------------------------------------------------------
 |
 | Import JS custom components.
 |
 */














/***/ }),

/***/ "./resources/js/bootstrap.js":
/*!***********************************!*\
  !*** ./resources/js/bootstrap.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ "./resources/js/helper.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@popperjs/core'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@left4code/tw-starter/dist/js/dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
// Load plugins



 // Set plugins globally

window.helper = _helper__WEBPACK_IMPORTED_MODULE_0__["default"];
window.axios = (axios__WEBPACK_IMPORTED_MODULE_1___default());
window.Popper = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@popperjs/core'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
window.$ = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@left4code/tw-starter/dist/js/dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()); // CSRF token

var token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
  window.axios.defaults.headers.common["X-CSRF-TOKEN"] = token.content;
} else {
  console.error("CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token");
}

/***/ }),

/***/ "./resources/js/calendar.js":
/*!**********************************!*\
  !*** ./resources/js/calendar.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@fullcalendar/core'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@fullcalendar/interaction'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@fullcalendar/daygrid'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@fullcalendar/timegrid'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@fullcalendar/list'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());






(function () {
  if ($("#calendar").length) {
    if ($("#calendar-events").length) {
      new Object(function webpackMissingModule() { var e = new Error("Cannot find module '@fullcalendar/interaction'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())($("#calendar-events")[0], {
        itemSelector: ".event",
        eventData: function eventData(eventEl) {
          return {
            title: $(eventEl).find(".event__title").html(),
            duration: {
              days: parseInt($(eventEl).find(".event__days").text())
            }
          };
        }
      });
    }

    var calendar = new Object(function webpackMissingModule() { var e = new Error("Cannot find module '@fullcalendar/core'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())($("#calendar")[0], {
      plugins: [Object(function webpackMissingModule() { var e = new Error("Cannot find module '@fullcalendar/interaction'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), Object(function webpackMissingModule() { var e = new Error("Cannot find module '@fullcalendar/daygrid'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), Object(function webpackMissingModule() { var e = new Error("Cannot find module '@fullcalendar/timegrid'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), Object(function webpackMissingModule() { var e = new Error("Cannot find module '@fullcalendar/list'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())],
      droppable: true,
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
      },
      initialDate: "2021-01-12",
      navLinks: true,
      editable: true,
      dayMaxEvents: true,
      events: [{
        title: "Vue Vixens Day",
        start: "2021-01-05",
        end: "2021-01-08"
      }, {
        title: "VueConfUS",
        start: "2021-01-11",
        end: "2021-01-15"
      }, {
        title: "VueJS Amsterdam",
        start: "2021-01-17",
        end: "2021-01-21"
      }, {
        title: "Vue Fes Japan 2019",
        start: "2021-01-21",
        end: "2021-01-24"
      }, {
        title: "Laracon 2021",
        start: "2021-01-24",
        end: "2021-01-27"
      }],
      drop: function drop(info) {
        if ($("#checkbox-events").length && $("#checkbox-events")[0].checked) {
          $(info.draggedEl).parent().remove();

          if ($("#calendar-events").children().length == 1) {
            $("#calendar-no-events").removeClass("hidden");
          }
        }
      }
    });
    calendar.render();
  }
})();

/***/ }),

/***/ "./resources/js/chart.js":
/*!*******************************!*\
  !*** ./resources/js/chart.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ "./resources/js/helper.js");
/* harmony import */ var _colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./colors */ "./resources/js/colors.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }





(function () {
  "use strict"; // Chart

  if ($("#report-line-chart").length) {
    var ctx = $("#report-line-chart")[0].getContext("2d");
    var myChart = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: "# of Votes",
          data: [0, 200, 250, 200, 700, 550, 650, 1050, 950, 1100, 900, 1200],
          borderWidth: 2,
          borderColor: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.8),
          backgroundColor: "transparent",
          pointBorderColor: "transparent",
          tension: 0.4
        }, {
          label: "# of Votes",
          data: [0, 300, 400, 560, 320, 600, 720, 850, 690, 805, 1200, 1010],
          borderWidth: 2,
          borderDash: [2, 2],
          borderColor: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[400](0.6) : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[400](),
          backgroundColor: "transparent",
          pointBorderColor: "transparent",
          tension: 0.4
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 12
              },
              color: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.8)
            },
            grid: {
              display: false,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              font: {
                size: 12
              },
              color: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.8),
              callback: function callback(value, index, values) {
                return "$" + value;
              }
            },
            grid: {
              color: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.3) : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[300](),
              borderDash: [2, 2],
              drawBorder: false
            }
          }
        }
      }
    });
  }

  if ($("#report-pie-chart").length) {
    var _ctx = $("#report-pie-chart")[0].getContext("2d");

    var myPieChart = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_ctx, {
      type: "pie",
      data: {
        labels: ["31 - 50 Years old", ">= 50 Years old", "17 - 30 Years old"],
        datasets: [{
          data: [15, 10, 65],
          backgroundColor: [_colors__WEBPACK_IMPORTED_MODULE_1__["default"].pending(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].warning(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.9)],
          hoverBackgroundColor: [_colors__WEBPACK_IMPORTED_MODULE_1__["default"].pending(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].warning(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.9)],
          borderWidth: 5,
          borderColor: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].darkmode[700]() : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].white
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  if ($("#report-donut-chart").length) {
    var _ctx2 = $("#report-donut-chart")[0].getContext("2d");

    var myDoughnutChart = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_ctx2, {
      type: "doughnut",
      data: {
        labels: ["31 - 50 Years old", ">= 50 Years old", "17 - 30 Years old"],
        datasets: [{
          data: [15, 10, 65],
          backgroundColor: [_colors__WEBPACK_IMPORTED_MODULE_1__["default"].pending(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].warning(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.9)],
          hoverBackgroundColor: [_colors__WEBPACK_IMPORTED_MODULE_1__["default"].pending(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].warning(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.9)],
          borderWidth: 5,
          borderColor: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].darkmode[700]() : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].white
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        cutout: "80%"
      }
    });
  }

  if ($("#report-bar-chart").length) {
    // Fake visitor data
    var reportBarChartData = new Array(40).fill(0).map(function (data, key) {
      if (key % 3 == 0 || key % 5 == 0) {
        return Math.ceil(Math.random() * (0 - 20) + 20);
      } else {
        return Math.ceil(Math.random() * (0 - 7) + 7);
      }
    }); // Fake visitor bar color

    var reportBarChartColor = reportBarChartData.map(function (data) {
      if (data >= 8 && data <= 14) {
        return $("html").hasClass("dark") ? "#2E51BBA6" : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.65);
      } else if (data >= 15) {
        return $("html").hasClass("dark") ? "#2E51BB" : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary();
      }

      return $("html").hasClass("dark") ? "#2E51BB59" : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.35);
    });

    var _ctx3 = $("#report-bar-chart")[0].getContext("2d");

    var myBarChart = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_ctx3, {
      type: "bar",
      data: {
        labels: reportBarChartData,
        datasets: [{
          label: "Html Template",
          barThickness: 6,
          data: reportBarChartData,
          backgroundColor: reportBarChartColor
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              display: false
            },
            grid: {
              display: false
            }
          },
          y: {
            ticks: {
              display: false
            },
            grid: {
              display: false,
              drawBorder: false
            }
          }
        }
      }
    });
    setInterval(function () {
      // Swap visitor data
      var newData = reportBarChartData[0];
      reportBarChartData.shift();
      reportBarChartData.push(newData); // Swap visitor bar color

      var newColor = reportBarChartColor[0];
      reportBarChartColor.shift();
      reportBarChartColor.push(newColor);
      myBarChart.update();
    }, 1000);
  }

  if ($("#report-bar-chart-1").length) {
    var _ctx4 = $("#report-bar-chart-1")[0].getContext("2d");

    var _myChart = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_ctx4, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: "Html Template",
          barThickness: 8,
          maxBarThickness: 6,
          data: [60, 150, 30, 200, 180, 50, 180, 120, 230, 180, 250, 270],
          backgroundColor: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.9)
        }, {
          label: "VueJs Template",
          barThickness: 8,
          maxBarThickness: 6,
          data: [50, 135, 40, 180, 190, 60, 150, 90, 250, 170, 240, 250],
          backgroundColor: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].darkmode[400]() : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[300]()
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 11
              },
              color: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.8)
            },
            grid: {
              display: false,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              display: false
            },
            grid: {
              color: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].darkmode[300](0.8) : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[300](),
              borderDash: [2, 2],
              drawBorder: false
            }
          }
        }
      }
    });
  }

  if ($("#report-donut-chart-1").length) {
    var _ctx5 = $("#report-donut-chart-1")[0].getContext("2d");

    var _myDoughnutChart = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_ctx5, {
      type: "doughnut",
      data: {
        labels: ["Yellow", "Dark"],
        datasets: [{
          data: [15, 10, 65],
          backgroundColor: [_colors__WEBPACK_IMPORTED_MODULE_1__["default"].pending(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].warning(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.9)],
          hoverBackgroundColor: [_colors__WEBPACK_IMPORTED_MODULE_1__["default"].pending(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].warning(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.9)],
          borderWidth: 2,
          borderColor: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].darkmode[700]() : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].white
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        cutout: "83%"
      }
    });
  }

  if ($("#report-donut-chart-2").length) {
    var _ctx6 = $("#report-donut-chart-2")[0].getContext("2d");

    var _myDoughnutChart2 = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_ctx6, {
      type: "doughnut",
      data: {
        labels: ["Yellow", "Dark"],
        datasets: [{
          data: [15, 10, 65],
          backgroundColor: [_colors__WEBPACK_IMPORTED_MODULE_1__["default"].pending(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].warning(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.9)],
          hoverBackgroundColor: [_colors__WEBPACK_IMPORTED_MODULE_1__["default"].pending(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].warning(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.9)],
          borderWidth: 2,
          borderColor: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].darkmode[700]() : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].white
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        cutout: "83%"
      }
    });
  }

  if ($("#report-donut-chart-3").length) {
    var _ctx7 = $("#report-donut-chart-3")[0].getContext("2d");

    var _myDoughnutChart3 = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_ctx7, {
      type: "doughnut",
      data: {
        labels: ["Yellow", "Dark"],
        datasets: [{
          data: [15, 10, 65],
          backgroundColor: [_colors__WEBPACK_IMPORTED_MODULE_1__["default"].pending(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].warning(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.9)],
          hoverBackgroundColor: [_colors__WEBPACK_IMPORTED_MODULE_1__["default"].pending(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].warning(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.9)],
          borderWidth: 5,
          borderColor: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].darkmode[700]() : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[200]()
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        cutout: "82%"
      }
    });
  }

  if ($(".simple-line-chart-1").length) {
    $(".simple-line-chart-1").each(function () {
      var ctx = $(this)[0].getContext("2d");
      var myChart = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [{
            label: "# of Votes",
            data: $(this).data("random") !== undefined ? _helper__WEBPACK_IMPORTED_MODULE_0__["default"].randomNumbers(0, 5, 12) : [0, 200, 250, 200, 500, 450, 850, 1050, 950, 1100, 900, 1200],
            borderWidth: 2,
            borderColor: $(this).data("line-color") !== undefined ? $(this).data("line-color") : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.8),
            backgroundColor: "transparent",
            pointBorderColor: "transparent",
            tension: 0.4
          }]
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              ticks: {
                display: false
              },
              grid: {
                display: false,
                drawBorder: false
              }
            },
            y: {
              ticks: {
                display: false
              },
              grid: {
                display: false,
                drawBorder: false
              }
            }
          }
        }
      });
    });
  }

  if ($(".simple-line-chart-2").length) {
    $(".simple-line-chart-2").each(function () {
      var ctx = $(this)[0].getContext("2d");
      var myChart = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [{
            label: "# of Votes",
            data: $(this).data("random") !== undefined ? _helper__WEBPACK_IMPORTED_MODULE_0__["default"].randomNumbers(0, 5, 12) : [0, 300, 400, 560, 320, 600, 720, 850, 690, 805, 1200, 1010],
            borderWidth: 2,
            borderDash: [2, 2],
            borderColor: $(this).data("line-color") !== undefined ? $(this).data("line-color") : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[300](),
            backgroundColor: "transparent",
            pointBorderColor: "transparent"
          }]
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              ticks: {
                display: false
              },
              grid: {
                display: false,
                drawBorder: false
              }
            },
            y: {
              ticks: {
                display: false
              },
              grid: {
                display: false,
                drawBorder: false
              }
            }
          }
        }
      });
    });
  }

  if ($(".simple-line-chart-3").length) {
    var _ctx8 = $(".simple-line-chart-3")[0].getContext("2d");

    var _myChart2 = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_ctx8, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: "# of Votes",
          data: [0, 200, 250, 200, 700, 550, 650, 1050, 950, 1100, 900, 1200],
          borderWidth: 2,
          borderColor: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.8),
          backgroundColor: "transparent",
          pointBorderColor: "transparent",
          tension: 0.4
        }, {
          label: "# of Votes",
          data: [0, 300, 400, 560, 320, 600, 720, 850, 690, 805, 1200, 1010],
          borderWidth: 2,
          borderDash: [2, 2],
          borderColor: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].darkmode[100]() : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[400](),
          backgroundColor: "transparent",
          pointBorderColor: "transparent",
          tension: 0.4
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              display: false
            },
            grid: {
              display: false,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              display: false
            },
            grid: {
              display: false,
              drawBorder: false
            }
          }
        }
      }
    });
  }

  if ($(".simple-line-chart-4").length) {
    var _ctx9 = $(".simple-line-chart-4")[0].getContext("2d");

    var _myChart3 = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_ctx9, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: "# of Votes",
          data: [0, 200, 250, 200, 700, 550, 650, 1050, 950, 1100, 900, 1200],
          borderWidth: 2,
          borderColor: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.8),
          backgroundColor: "transparent",
          pointBorderColor: "transparent",
          tension: 0.4
        }, {
          label: "# of Votes",
          data: [0, 300, 400, 560, 320, 600, 720, 850, 690, 805, 1200, 1010],
          borderWidth: 2,
          borderDash: [2, 2],
          borderColor: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].darkmode[100]() : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[400](),
          backgroundColor: "transparent",
          pointBorderColor: "transparent",
          tension: 0.4
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              display: false
            },
            grid: {
              display: false,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              display: false
            },
            grid: {
              display: false,
              drawBorder: false
            }
          }
        }
      }
    });
  } // Chart widget page


  if ($("#vertical-bar-chart-widget").length) {
    var _ctx10 = $("#vertical-bar-chart-widget")[0].getContext("2d");

    var _myChart4 = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_ctx10, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        datasets: [{
          label: "Html Template",
          barPercentage: 0.5,
          barThickness: 6,
          maxBarThickness: 8,
          minBarLength: 2,
          data: [0, 200, 250, 200, 500, 450, 850, 1050],
          backgroundColor: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary()
        }, {
          label: "VueJs Template",
          barPercentage: 0.5,
          barThickness: 6,
          maxBarThickness: 8,
          minBarLength: 2,
          data: [0, 300, 400, 560, 320, 600, 720, 850],
          backgroundColor: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].darkmode[200]() : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[300]()
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.8)
            }
          }
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 12
              },
              color: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.8)
            },
            grid: {
              display: false,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              font: {
                size: "12"
              },
              color: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.8),
              callback: function callback(value, index, values) {
                return "$" + value;
              }
            },
            grid: {
              color: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.3) : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[300](),
              borderDash: [2, 2],
              drawBorder: false
            }
          }
        }
      }
    });
  }

  if ($("#horizontal-bar-chart-widget").length) {
    var _ctx11 = $("#horizontal-bar-chart-widget")[0].getContext("2d");

    var _myChart5 = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_ctx11, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        datasets: [{
          label: "Html Template",
          barPercentage: 0.5,
          barThickness: 6,
          maxBarThickness: 8,
          minBarLength: 2,
          data: [0, 200, 250, 200, 500, 450, 850, 1050],
          backgroundColor: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary()
        }, {
          label: "VueJs Template",
          barPercentage: 0.5,
          barThickness: 6,
          maxBarThickness: 8,
          minBarLength: 2,
          data: [0, 300, 400, 560, 320, 600, 720, 850],
          backgroundColor: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].darkmode[200]() : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[300]()
        }]
      },
      options: {
        indexAxis: "y",
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.8)
            }
          }
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: "12"
              },
              color: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.8),
              callback: function callback(value, index, values) {
                return "$" + value;
              }
            },
            grid: {
              display: false,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              font: {
                size: "12"
              },
              color: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.8)
            },
            grid: {
              color: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.3) : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[300](),
              borderDash: [2, 2],
              drawBorder: false
            }
          }
        }
      }
    });
  }

  if ($("#stacked-bar-chart-widget").length) {
    var _ctx12 = $("#stacked-bar-chart-widget")[0].getContext("2d");

    var _myChart6 = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_ctx12, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: "Html Template",
          barPercentage: 0.5,
          barThickness: 6,
          maxBarThickness: 8,
          minBarLength: 2,
          backgroundColor: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(),
          data: _helper__WEBPACK_IMPORTED_MODULE_0__["default"].randomNumbers(-100, 100, 12)
        }, {
          label: "VueJs Template",
          barPercentage: 0.5,
          barThickness: 6,
          maxBarThickness: 8,
          minBarLength: 2,
          backgroundColor: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].darkmode[200]() : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[300](),
          data: _helper__WEBPACK_IMPORTED_MODULE_0__["default"].randomNumbers(-100, 100, 12)
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.8)
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              font: {
                size: "12"
              },
              color: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.8)
            },
            grid: {
              display: false,
              drawBorder: false
            }
          },
          y: {
            stacked: true,
            ticks: {
              font: {
                size: "12"
              },
              color: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.8),
              callback: function callback(value, index, values) {
                return "$" + value;
              }
            },
            grid: {
              color: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.3) : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[300](),
              borderDash: [2, 2],
              drawBorder: false
            }
          }
        }
      }
    });
  }

  if ($("#stacked-bar-chart-1").length) {
    var _ctx13 = $("#stacked-bar-chart-1")[0].getContext("2d");

    var _myChart7 = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_ctx13, {
      type: "bar",
      data: {
        labels: _toConsumableArray(Array(16).keys()),
        datasets: [{
          label: "Html Template",
          barPercentage: 0.5,
          barThickness: 6,
          maxBarThickness: 8,
          minBarLength: 2,
          backgroundColor: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.8),
          data: _helper__WEBPACK_IMPORTED_MODULE_0__["default"].randomNumbers(-100, 100, 16)
        }, {
          label: "VueJs Template",
          barPercentage: 0.5,
          barThickness: 6,
          maxBarThickness: 8,
          minBarLength: 2,
          backgroundColor: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].darkmode[200]() : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[300](),
          data: _helper__WEBPACK_IMPORTED_MODULE_0__["default"].randomNumbers(-100, 100, 16)
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              font: {
                size: "12"
              },
              color: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.8)
            },
            grid: {
              display: false,
              drawBorder: false
            }
          },
          y: {
            stacked: true,
            ticks: {
              font: {
                size: "12"
              },
              color: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.8),
              callback: function callback(value, index, values) {
                return "$" + value;
              }
            },
            grid: {
              color: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.3) : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[300](),
              borderDash: [2, 2],
              drawBorder: false
            }
          }
        }
      }
    });
  }

  if ($("#line-chart-widget").length) {
    var _ctx14 = $("#line-chart-widget")[0].getContext("2d");

    var _myChart8 = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_ctx14, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: "Html Template",
          data: [0, 200, 250, 200, 500, 450, 850, 1050, 950, 1100, 900, 1200],
          borderWidth: 2,
          borderColor: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(),
          backgroundColor: "transparent",
          pointBorderColor: "transparent",
          tension: 0.4
        }, {
          label: "VueJs Template",
          data: [0, 300, 400, 560, 320, 600, 720, 850, 690, 805, 1200, 1010],
          borderWidth: 2,
          borderDash: [2, 2],
          borderColor: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[400](0.6) : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[400](),
          backgroundColor: "transparent",
          pointBorderColor: "transparent",
          tension: 0.4
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.8)
            }
          }
        },
        scales: {
          x: {
            ticks: _defineProperty({
              font: {
                size: "12"
              }
            }, "font", _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.8)),
            grid: {
              display: false,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              font: {
                size: "12"
              },
              color: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.8),
              callback: function callback(value, index, values) {
                return "$" + value;
              }
            },
            grid: {
              color: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.3) : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[300](),
              borderDash: [2, 2],
              drawBorder: false
            }
          }
        }
      }
    });
  }

  if ($("#donut-chart-widget").length) {
    var _ctx15 = $("#donut-chart-widget")[0].getContext("2d");

    var _myDoughnutChart4 = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_ctx15, {
      type: "doughnut",
      data: {
        labels: ["Html", "Vuejs", "Laravel"],
        datasets: [{
          data: [15, 10, 65],
          backgroundColor: [_colors__WEBPACK_IMPORTED_MODULE_1__["default"].pending(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].warning(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.9)],
          hoverBackgroundColor: [_colors__WEBPACK_IMPORTED_MODULE_1__["default"].pending(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].warning(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.9)],
          borderWidth: 5,
          borderColor: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].darkmode[700]() : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].white
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.8)
            }
          }
        },
        cutout: "80%"
      }
    });
  }

  if ($("#pie-chart-widget").length) {
    var _ctx16 = $("#pie-chart-widget")[0].getContext("2d");

    var _myPieChart = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'chart.js/auto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_ctx16, {
      type: "pie",
      data: {
        labels: ["Html", "Vuejs", "Laravel"],
        datasets: [{
          data: [15, 10, 65],
          backgroundColor: [_colors__WEBPACK_IMPORTED_MODULE_1__["default"].pending(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].warning(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.9)],
          hoverBackgroundColor: [_colors__WEBPACK_IMPORTED_MODULE_1__["default"].pending(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].warning(0.9), _colors__WEBPACK_IMPORTED_MODULE_1__["default"].primary(0.9)],
          borderWidth: 5,
          borderColor: $("html").hasClass("dark") ? _colors__WEBPACK_IMPORTED_MODULE_1__["default"].darkmode[700]() : _colors__WEBPACK_IMPORTED_MODULE_1__["default"].white
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: _colors__WEBPACK_IMPORTED_MODULE_1__["default"].slate[500](0.8)
            }
          }
        }
      }
    });
  }
})();

/***/ }),

/***/ "./resources/js/chat.js":
/*!******************************!*\
  !*** ./resources/js/chat.js ***!
  \******************************/
/***/ (() => {

(function () {
  "use strict";

  $(".chat__chat-list").children().each(function () {
    $(this).on("click", function () {
      $(".chat__box").children("div:nth-child(2)").fadeOut(300, function () {
        $(".chat__box").children("div:nth-child(1)").fadeIn(300, function (el) {
          $(el).removeClass("hidden").removeAttr("style");
        });
      });
    });
  });
})();

/***/ }),

/***/ "./resources/js/colors.js":
/*!********************************!*\
  !*** ./resources/js/colors.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ "./resources/js/helper.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var colors = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tailwindcss/colors'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));


var el = getComputedStyle(document.body);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_objectSpread(_objectSpread({}, _helper__WEBPACK_IMPORTED_MODULE_0__["default"].toRGB(colors)), {}, {
  primary: function primary() {
    var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return "rgb(".concat(el.getPropertyValue("--color-primary"), " / ").concat(opacity, ")");
  },
  secondary: function secondary() {
    var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return "rgb(".concat(el.getPropertyValue("--color-secondary"), " / ").concat(opacity, ")");
  },
  success: function success() {
    var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return "rgb(".concat(el.getPropertyValue("--color-success"), " / ").concat(opacity, ")");
  },
  info: function info() {
    var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return "rgb(".concat(el.getPropertyValue("--color-info"), " / ").concat(opacity, ")");
  },
  warning: function warning() {
    var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return "rgb(".concat(el.getPropertyValue("--color-warning"), " / ").concat(opacity, ")");
  },
  pending: function pending() {
    var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return "rgb(".concat(el.getPropertyValue("--color-pending"), " / ").concat(opacity, ")");
  },
  danger: function danger() {
    var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return "rgb(".concat(el.getPropertyValue("--color-danger"), " / ").concat(opacity, ")");
  },
  light: function light() {
    var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return "rgb(".concat(el.getPropertyValue("--color-light"), " / ").concat(opacity, ")");
  },
  dark: function dark() {
    var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return "rgb(".concat(el.getPropertyValue("--color-dark"), " / ").concat(opacity, ")");
  },
  slate: {
    50: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-slate-50"), " / ").concat(opacity, ")");
    },
    100: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-slate-100"), " / ").concat(opacity, ")");
    },
    200: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-slate-200"), " / ").concat(opacity, ")");
    },
    300: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-slate-300"), " / ").concat(opacity, ")");
    },
    400: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-slate-400"), " / ").concat(opacity, ")");
    },
    500: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-slate-500"), " / ").concat(opacity, ")");
    },
    600: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-slate-600"), " / ").concat(opacity, ")");
    },
    700: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-slate-700"), " / ").concat(opacity, ")");
    },
    800: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-slate-800"), " / ").concat(opacity, ")");
    },
    900: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-slate-900"), " / ").concat(opacity, ")");
    }
  },
  darkmode: {
    50: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-darkmode-50"), " / ").concat(opacity, ")");
    },
    100: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-darkmode-100"), " / ").concat(opacity, ")");
    },
    200: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-darkmode-200"), " / ").concat(opacity, ")");
    },
    300: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-darkmode-300"), " / ").concat(opacity, ")");
    },
    400: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-darkmode-400"), " / ").concat(opacity, ")");
    },
    500: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-darkmode-500"), " / ").concat(opacity, ")");
    },
    600: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-darkmode-600"), " / ").concat(opacity, ")");
    },
    700: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-darkmode-700"), " / ").concat(opacity, ")");
    },
    800: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-darkmode-800"), " / ").concat(opacity, ")");
    },
    900: function _() {
      var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return "rgb(".concat(el.getPropertyValue("--color-darkmode-900"), " / ").concat(opacity, ")");
    }
  }
}));

/***/ }),

/***/ "./resources/js/copy-code.js":
/*!***********************************!*\
  !*** ./resources/js/copy-code.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'toastify-js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());


(function () {
  "use strict"; // Copy original code

  $("body").on("click", ".copy-code", function () {
    var content = $(this).html();
    var self = this;
    $(self).html(content.replace("Copy example code", "Copied!"));
    setTimeout(function () {
      $(self).html(content);
    }, 1500);
    var elementId = $(this).data("target");
    $(elementId).find("textarea")[0].select();
    $(elementId).find("textarea")[0].setSelectionRange(0, 99999);
    document.execCommand("copy");
  });
})();

/***/ }),

/***/ "./resources/js/dark-mode-switcher.js":
/*!********************************************!*\
  !*** ./resources/js/dark-mode-switcher.js ***!
  \********************************************/
/***/ (() => {

(function () {
  "use strict"; // Dark mode switcher

  $(".dark-mode-switcher").on("click", function () {
    var switcher = $(this).find(".dark-mode-switcher__toggle");

    if ($(switcher).hasClass("dark-mode-switcher__toggle--active")) {
      $(switcher).removeClass("dark-mode-switcher__toggle--active");
    } else {
      $(switcher).addClass("dark-mode-switcher__toggle--active");
    }

    setTimeout(function () {
      var link = $(".dark-mode-switcher").data("url");
      window.location.href = link;
    }, 500);
  });
})();

/***/ }),

/***/ "./resources/js/datepicker.js":
/*!************************************!*\
  !*** ./resources/js/datepicker.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'dayjs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'litepicker'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




(function () {
  "use strict"; // Litepicker

  $(".datepicker").each(function () {
    var options = {
      autoApply: false,
      singleMode: false,
      numberOfColumns: 2,
      numberOfMonths: 2,
      showWeekNumbers: true,
      format: "D MMM, YYYY",
      dropdowns: {
        minYear: 1990,
        maxYear: null,
        months: true,
        years: true
      }
    };

    if ($(this).data("single-mode")) {
      options.singleMode = true;
      options.numberOfColumns = 1;
      options.numberOfMonths = 1;
    }

    if ($(this).data("format")) {
      options.format = $(this).data("format");
    }

    if (!$(this).val()) {
      var date = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'dayjs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())().format(options.format);
      date += !options.singleMode ? " - " + Object(function webpackMissingModule() { var e = new Error("Cannot find module 'dayjs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())().add(1, "month").format(options.format) : "";
      $(this).val(date);
    }

    new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'litepicker'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_objectSpread({
      element: this
    }, options));
  });
})();

/***/ }),

/***/ "./resources/js/dropzone.js":
/*!**********************************!*\
  !*** ./resources/js/dropzone.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'dropzone'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());


(function () {
  "use strict"; // Dropzone

  Object(function webpackMissingModule() { var e = new Error("Cannot find module 'dropzone'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()) = false;
  $(".dropzone").each(function () {
    var _this = this;

    var options = {
      accept: function accept(file, done) {
        console.log("Uploaded");
        done();
      }
    };

    if ($(this).data("single")) {
      options.maxFiles = 1;
    }

    if ($(this).data("file-types")) {
      options.accept = function (file, done) {
        if ($(_this).data("file-types").split("|").indexOf(file.type) === -1) {
          alert("Error! Files of this type are not accepted");
          done("Error! Files of this type are not accepted");
        } else {
          console.log("Uploaded");
          done();
        }
      };
    }

    var dz = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'dropzone'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this, options);
    dz.on("maxfilesexceeded", function (file) {
      alert("No more files please!");
    });
  });
})();

/***/ }),

/***/ "./resources/js/helper.js":
/*!********************************!*\
  !*** ./resources/js/helper.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'dayjs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }


var helpers = {
  cutText: function cutText(text, length) {
    if (text.split(" ").length > 1) {
      var string = text.substring(0, length);
      var splitText = string.split(" ");
      splitText.pop();
      return splitText.join(" ") + "...";
    } else {
      return text;
    }
  },
  formatDate: function formatDate(date, format) {
    return Object(function webpackMissingModule() { var e = new Error("Cannot find module 'dayjs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(date).format(format);
  },
  capitalizeFirstLetter: function capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  },
  onlyNumber: function onlyNumber(number) {
    if (number) {
      return number.replace(/\D/g, "");
    } else {
      return "";
    }
  },
  formatCurrency: function formatCurrency(number) {
    if (number) {
      var formattedNumber = number.toString().replace(/\D/g, "");
      var rest = formattedNumber.length % 3;
      var currency = formattedNumber.substr(0, rest);
      var thousand = formattedNumber.substr(rest).match(/\d{3}/g);
      var separator;

      if (thousand) {
        separator = rest ? "." : "";
        currency += separator + thousand.join(".");
      }

      return currency;
    } else {
      return "";
    }
  },
  timeAgo: function timeAgo(time) {
    var date = new Date((time || "").replace(/-/g, "/").replace(/[TZ]/g, " ")),
        diff = (new Date().getTime() - date.getTime()) / 1000,
        dayDiff = Math.floor(diff / 86400);
    if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) return Object(function webpackMissingModule() { var e = new Error("Cannot find module 'dayjs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(time).format("MMMM DD, YYYY");
    return dayDiff == 0 && (diff < 60 && "just now" || diff < 120 && "1 minute ago" || diff < 3600 && Math.floor(diff / 60) + " minutes ago" || diff < 7200 && "1 hour ago" || diff < 86400 && Math.floor(diff / 3600) + " hours ago") || dayDiff == 1 && "Yesterday" || dayDiff < 7 && dayDiff + " days ago" || dayDiff < 31 && Math.ceil(dayDiff / 7) + " weeks ago";
  },
  diffTimeByNow: function diffTimeByNow(time) {
    var startDate = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'dayjs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'dayjs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())().format("YYYY-MM-DD HH:mm:ss").toString());
    var endDate = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'dayjs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'dayjs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(time).format("YYYY-MM-DD HH:mm:ss").toString());
    var duration = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'dayjs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(endDate.diff(startDate));
    var milliseconds = Math.floor(duration.asMilliseconds());
    var days = Math.round(milliseconds / 86400000);
    var hours = Math.round(milliseconds % 86400000 / 3600000);
    var minutes = Math.round(milliseconds % 86400000 % 3600000 / 60000);
    var seconds = Math.round(milliseconds % 86400000 % 3600000 % 60000 / 1000);

    if (seconds < 30 && seconds >= 0) {
      minutes += 1;
    }

    return {
      days: days.toString().length < 2 ? "0" + days : days,
      hours: hours.toString().length < 2 ? "0" + hours : hours,
      minutes: minutes.toString().length < 2 ? "0" + minutes : minutes,
      seconds: seconds.toString().length < 2 ? "0" + seconds : seconds
    };
  },
  isset: function isset(obj) {
    return Object.keys(obj).length;
  },
  assign: function assign(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  delay: function delay(time) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve();
      }, time);
    });
  },
  randomNumbers: function randomNumbers(from, to, length) {
    var numbers = [0];

    for (var i = 1; i < length; i++) {
      numbers.push(Math.ceil(Math.random() * (from - to) + to));
    }

    return numbers;
  },
  replaceAll: function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, "g"), replace);
  },
  toRGB: function toRGB(colors) {
    var tempColors = Object.assign({}, colors);
    var rgbColors = Object.entries(tempColors);

    for (var _i = 0, _rgbColors = rgbColors; _i < _rgbColors.length; _i++) {
      var _rgbColors$_i = _slicedToArray(_rgbColors[_i], 2),
          key = _rgbColors$_i[0],
          value = _rgbColors$_i[1];

      if (typeof value === "string") {
        if (value.replace("#", "").length == 6) {
          (function () {
            var aRgbHex = value.replace("#", "").match(/.{1,2}/g);

            tempColors[key] = function () {
              var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
              return "rgb(".concat(parseInt(aRgbHex[0], 16), " ").concat(parseInt(aRgbHex[1], 16), " ").concat(parseInt(aRgbHex[2], 16), " / ").concat(opacity, ")");
            };
          })();
        }
      } else {
        tempColors[key] = helpers.toRGB(value);
      }
    }

    return tempColors;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (helpers);

/***/ }),

/***/ "./resources/js/highlight.js":
/*!***********************************!*\
  !*** ./resources/js/highlight.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ "./resources/js/helper.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'highlight.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'js-beautify'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());




(function () {
  "use strict"; // Highlight code

  $(".source-preview").each(function () {
    var source = $(this).find("code").html(); // First replace

    var replace = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].replaceAll(source, "HTMLOpenTag", "<");
    replace = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].replaceAll(replace, "HTMLCloseTag", ">"); // Save for copy code function

    var originalSource = $('<textarea class="absolute w-0 h-0 p-0"></textarea>').val(replace);
    $(this).append(originalSource); // Beautify code

    if ($(this).find("code").hasClass("javascript")) {
      replace = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'js-beautify'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(replace);
    } else {
      replace = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'js-beautify'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(replace);
    } // Format for highlight.js


    replace = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].replaceAll(replace, "<", "&lt;");
    replace = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].replaceAll(replace, ">", "&gt;");
    $(this).find("code").html(replace);
  });
  Object(function webpackMissingModule() { var e = new Error("Cannot find module 'highlight.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())();
})();

/***/ }),

/***/ "./resources/js/lucide.js":
/*!********************************!*\
  !*** ./resources/js/lucide.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());


(function () {
  "use strict"; // Lucide Icons

  Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
    icons: Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
    "stroke-width": 1.5,
    nameAttr: "data-lucide"
  });
  window.lucide = {
    createIcons: Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
    icons: Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())
  };
})();

/***/ }),

/***/ "./resources/js/maps.js":
/*!******************************!*\
  !*** ./resources/js/maps.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);


(function () {
  "use strict"; // Google Maps

  if ($(".report-maps").length) {
    var initMap = function initMap(el) {
      var iconBase = {
        url: $("html").hasClass("dark") ? "/dist/images/map-marker-dark.svg" : "/dist/images/map-marker.svg"
      };
      var lightStyle = [{
        elementType: "geometry",
        stylers: [{
          color: "#f5f5f5"
        }]
      }, {
        elementType: "labels.icon",
        stylers: [{
          visibility: "off"
        }]
      }, {
        elementType: "labels.text.fill",
        stylers: [{
          color: "#616161"
        }]
      }, {
        elementType: "labels.text.stroke",
        stylers: [{
          color: "#f5f5f5"
        }]
      }, {
        featureType: "administrative.land_parcel",
        elementType: "labels",
        stylers: [{
          visibility: "off"
        }]
      }, {
        featureType: "administrative.land_parcel",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#bdbdbd"
        }]
      }, {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{
          color: "#eeeeee"
        }]
      }, {
        featureType: "poi",
        elementType: "labels.text",
        stylers: [{
          visibility: "off"
        }]
      }, {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#757575"
        }]
      }, {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{
          color: "#e5e5e5"
        }]
      }, {
        featureType: "poi.park",
        elementType: "geometry.fill",
        stylers: [{
          visibility: "off"
        }]
      }, {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#9e9e9e"
        }]
      }, {
        featureType: "road",
        elementType: "geometry",
        stylers: [{
          color: "#ffffff"
        }]
      }, {
        featureType: "road.arterial",
        elementType: "labels",
        stylers: [{
          visibility: "off"
        }]
      }, {
        featureType: "road.arterial",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#757575"
        }]
      }, {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{
          color: "#dadada"
        }]
      }, {
        featureType: "road.highway",
        elementType: "labels",
        stylers: [{
          visibility: "off"
        }]
      }, {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#616161"
        }]
      }, {
        featureType: "road.local",
        stylers: [{
          visibility: "off"
        }]
      }, {
        featureType: "road.local",
        elementType: "labels",
        stylers: [{
          visibility: "off"
        }]
      }, {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#9e9e9e"
        }]
      }, {
        featureType: "transit.line",
        elementType: "geometry",
        stylers: [{
          color: "#e5e5e5"
        }]
      }, {
        featureType: "transit.line",
        elementType: "geometry.fill",
        stylers: [{
          visibility: "off"
        }]
      }, {
        featureType: "transit.station",
        elementType: "geometry",
        stylers: [{
          color: "#eeeeee"
        }]
      }, {
        featureType: "transit.station",
        elementType: "geometry.fill",
        stylers: [{
          visibility: "off"
        }]
      }, {
        featureType: "water",
        elementType: "geometry",
        stylers: [{
          color: "#c9c9c9"
        }]
      }, {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [{
          color: "#e0e3e8"
        }]
      }, {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#9e9e9e"
        }]
      }];
      var darkStyle = [{
        elementType: "geometry",
        stylers: [{
          color: "#242f3e"
        }]
      }, {
        elementType: "labels.text.fill",
        stylers: [{
          color: "#746855"
        }]
      }, {
        elementType: "labels.text.stroke",
        stylers: [{
          color: "#242f3e"
        }]
      }, {
        featureType: "administrative.land_parcel",
        elementType: "labels",
        stylers: [{
          visibility: "off"
        }]
      }, {
        featureType: "administrative.land_parcel",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#bdbdbd"
        }]
      }, {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#d59563"
        }]
      }, {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{
          color: "#eeeeee"
        }]
      }, {
        featureType: "poi",
        elementType: "labels.text",
        stylers: [{
          visibility: "off"
        }]
      }, {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#d59563"
        }]
      }, {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{
          color: "#263c3f"
        }]
      }, {
        featureType: "poi.park",
        elementType: "geometry.fill",
        stylers: [{
          visibility: "off"
        }]
      }, {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#6b9a76"
        }]
      }, {
        featureType: "road",
        elementType: "geometry",
        stylers: [{
          color: "#38414e"
        }]
      }, {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{
          color: "#212a37"
        }]
      }, {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#9ca5b3"
        }]
      }, {
        featureType: "road.arterial",
        elementType: "labels",
        stylers: [{
          visibility: "off"
        }]
      }, {
        featureType: "road.arterial",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#757575"
        }]
      }, {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{
          color: "#746855"
        }]
      }, {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{
          color: "#1f2835"
        }]
      }, {
        featureType: "road.highway",
        elementType: "labels",
        stylers: [{
          visibility: "off"
        }]
      }, {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#f3d19c"
        }]
      }, {
        featureType: "road.local",
        stylers: [{
          visibility: "off"
        }]
      }, {
        featureType: "road.local",
        elementType: "labels",
        stylers: [{
          visibility: "off"
        }]
      }, {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{
          color: "#2f3948"
        }]
      }, {
        featureType: "transit.line",
        elementType: "geometry",
        stylers: [{
          color: "#e5e5e5"
        }]
      }, {
        featureType: "transit.line",
        elementType: "geometry.fill",
        stylers: [{
          visibility: "off"
        }]
      }, {
        featureType: "transit.station",
        elementType: "geometry",
        stylers: [{
          color: "#eeeeee"
        }]
      }, {
        featureType: "transit.station",
        elementType: "geometry.fill",
        stylers: [{
          visibility: "off"
        }]
      }, {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#d59563"
        }]
      }, {
        featureType: "water",
        elementType: "geometry",
        stylers: [{
          color: "#17263c"
        }]
      }, {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [{
          color: "#171f29"
        }]
      }, {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#515c6d"
        }]
      }, {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{
          color: "#17263c"
        }]
      }];
      var lat = $(el).data("center").split(",")[0];
      var _long = $(el).data("center").split(",")[1];
      var map = new google.maps.Map(el, {
        center: new google.maps.LatLng(lat, _long),
        zoom: 10,
        styles: $("html").hasClass("dark") ? darkStyle : lightStyle,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        streetViewControl: false
      });
      var infoWindow = new google.maps.InfoWindow({
        minWidth: 400,
        maxWidth: 400
      });
      axios__WEBPACK_IMPORTED_MODULE_0___default().get($(el).data("sources")).then(function (_ref) {
        var data = _ref.data;
        var markersArray = data.map(function (markerElem, i) {
          var point = new google.maps.LatLng(parseFloat(markerElem.latitude), parseFloat(markerElem.longitude));
          var infowincontent = '<div class="font-medium">' + markerElem.name + '</div><div class="mt-1 text-gray-600">Latitude: ' + markerElem.latitude + ", Longitude: " + markerElem.longitude + "</div>";
          var marker = new google.maps.Marker({
            map: map,
            position: point,
            icon: iconBase
          });
          google.maps.event.addListener(marker, "click", function (evt) {
            infoWindow.setContent(infowincontent);
            google.maps.event.addListener(infoWindow, "domready", function () {
              $(".arrow_box").closest(".gm-style-iw-d").removeAttr("style");
              $(".arrow_box").closest(".gm-style-iw-d").attr("style", "overflow:visible");
              $(".arrow_box").closest(".gm-style-iw-d").parent().removeAttr("style");
            });
            infoWindow.open(map, marker);
          });
          return marker;
        });
        var mcOptions = {
          styles: [{
            width: 55,
            height: 46,
            textColor: "white",
            url: $("html").hasClass("dark") ? "/dist/images/map-marker-region-dark.svg" : "/dist/images/map-marker-region.svg",
            anchor: [0, 0]
          }]
        };
        new MarkerClusterer(map, markersArray, mcOptions);
      })["catch"](function (err) {
        console.log(err);
      });
    };

    $(".report-maps").each(function (key, el) {
      google.maps.event.addDomListener(window, "load", initMap(el));
    });
  }
})();

/***/ }),

/***/ "./resources/js/mobile-menu.js":
/*!*************************************!*\
  !*** ./resources/js/mobile-menu.js ***!
  \*************************************/
/***/ (() => {

(function () {
  "use strict"; // Mobile Menu

  $("#mobile-menu-toggler").on("click", function () {
    if ($(".mobile-menu").find("ul").first()[0].offsetParent !== null) {
      $(".mobile-menu").find("ul").first().slideUp();
    } else {
      $(".mobile-menu").find("ul").first().slideDown();
    }
  });
  $(".mobile-menu").find(".menu").on("click", function () {
    if ($(this).parent().find("ul").length) {
      if ($(this).parent().find("ul").first()[0].offsetParent !== null) {
        $(this).find(".menu__sub-icon").removeClass("transform rotate-180");
        $(this).parent().find("ul").first().slideUp(300, function () {
          $(this).removeClass("menu__sub-open");
        });
      } else {
        $(this).find(".menu__sub-icon").addClass("transform rotate-180");
        $(this).parent().find("ul").first().slideDown(300, function () {
          $(this).addClass("menu__sub-open");
        });
      }
    }
  });
})();

/***/ }),

/***/ "./resources/js/notification.js":
/*!**************************************!*\
  !*** ./resources/js/notification.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'toastify-js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());


(function () {
  "use strict"; // Basic non sticky notification

  $("#basic-non-sticky-notification-toggle").on("click", function () {
    Object(function webpackMissingModule() { var e = new Error("Cannot find module 'toastify-js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
      node: $("#basic-non-sticky-notification-content").clone().removeClass("hidden")[0],
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true
    }).showToast();
  }); // Basic sticky notification

  $("#basic-sticky-notification-toggle").on("click", function () {
    Object(function webpackMissingModule() { var e = new Error("Cannot find module 'toastify-js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
      node: $("#basic-non-sticky-notification-content").clone().removeClass("hidden")[0],
      duration: -1,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true
    }).showToast();
  }); // Success notification

  $("#success-notification-toggle").on("click", function () {
    Object(function webpackMissingModule() { var e = new Error("Cannot find module 'toastify-js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
      node: $("#success-notification-content").clone().removeClass("hidden")[0],
      duration: -1,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true
    }).showToast();
  }); // Notification with actions

  $("#notification-with-actions-toggle").on("click", function () {
    Object(function webpackMissingModule() { var e = new Error("Cannot find module 'toastify-js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
      node: $("#notification-with-actions-content").clone().removeClass("hidden")[0],
      duration: -1,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true
    }).showToast();
  }); // Notification with avatar

  $("#notification-with-avatar-toggle").on("click", function () {
    // Init toastify
    var avatarNotification = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'toastify-js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
      node: $("#notification-with-avatar-content").clone().removeClass("hidden")[0],
      duration: -1,
      newWindow: true,
      close: false,
      gravity: "top",
      position: "right",
      stopOnFocus: true
    }).showToast(); // Close notification event

    $(avatarNotification.toastElement).find('[data-dismiss="notification"]').on("click", function () {
      avatarNotification.hideToast();
    });
  }); // Notification with split buttons

  $("#notification-with-split-buttons-toggle").on("click", function () {
    // Init toastify
    var splitButtonsNotification = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'toastify-js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
      node: $("#notification-with-split-buttons-content").clone().removeClass("hidden")[0],
      duration: -1,
      newWindow: true,
      close: false,
      gravity: "top",
      position: "right",
      stopOnFocus: true
    }).showToast(); // Close notification event

    $(splitButtonsNotification.toastElement).find('[data-dismiss="notification"]').on("click", function () {
      splitButtonsNotification.hideToast();
    });
  }); // Notification with buttons below

  $("#notification-with-buttons-below-toggle").on("click", function () {
    // Init toastify
    Object(function webpackMissingModule() { var e = new Error("Cannot find module 'toastify-js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
      node: $("#notification-with-buttons-below-content").clone().removeClass("hidden")[0],
      duration: -1,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true
    }).showToast();
  });
})();

/***/ }),

/***/ "./resources/js/search.js":
/*!********************************!*\
  !*** ./resources/js/search.js ***!
  \********************************/
/***/ (() => {

(function () {
  "use strict";

  $(".top-bar, .top-bar-boxed").find(".search").find("input").each(function () {
    $(this).on("focus", function () {
      $(".top-bar, .top-bar-boxed").find(".search-result").addClass("show");
    });
    $(this).on("focusout", function () {
      $(".top-bar, .top-bar-boxed").find(".search-result").removeClass("show");
    });
  });
})();

/***/ }),

/***/ "./resources/js/show-code.js":
/*!***********************************!*\
  !*** ./resources/js/show-code.js ***!
  \***********************************/
/***/ (() => {

(function () {
  "use strict"; // Show code or preview

  $("body").on("change", ".show-code", function () {
    var elementId = $(this).data("target");

    if ($(this).is(":checked")) {
      $(elementId).find(".preview").hide();
      $(elementId).find(".source-code").fadeIn(200);
    } else {
      $(elementId).find(".preview").fadeIn(200);
      $(elementId).find(".source-code").hide();
    }
  });
})();

/***/ }),

/***/ "./resources/js/show-dropdown.js":
/*!***************************************!*\
  !*** ./resources/js/show-dropdown.js ***!
  \***************************************/
/***/ (() => {

(function () {
  "use strict"; // Show dropdown

  $("#programmatically-show-dropdown").on("click", function () {
    setTimeout(function () {
      var el = document.querySelector("#programmatically-dropdown");
      var dropdown = tailwind.Dropdown.getOrCreateInstance(el);
      dropdown.show();
    }, 100);
  }); // Hide dropdown

  $("#programmatically-hide-dropdown").on("click", function () {
    setTimeout(function () {
      var el = document.querySelector("#programmatically-dropdown");
      var dropdown = tailwind.Dropdown.getOrCreateInstance(el);
      dropdown.hide();
    }, 100);
  }); // Toggle dropdown

  $("#programmatically-toggle-dropdown").on("click", function () {
    setTimeout(function () {
      var el = document.querySelector("#programmatically-dropdown");
      var dropdown = tailwind.Dropdown.getOrCreateInstance(el);
      dropdown.toggle();
    }, 100);
  });
})();

/***/ }),

/***/ "./resources/js/show-modal.js":
/*!************************************!*\
  !*** ./resources/js/show-modal.js ***!
  \************************************/
/***/ (() => {

(function () {
  "use strict"; // Show modal

  $("#programmatically-show-modal").on("click", function () {
    var el = document.querySelector("#programmatically-modal");
    var modal = tailwind.Modal.getOrCreateInstance(el);
    modal.show();
  }); // Hide modal

  $("#programmatically-hide-modal").on("click", function () {
    var el = document.querySelector("#programmatically-modal");
    var modal = tailwind.Modal.getOrCreateInstance(el);
    modal.hide();
  }); // Toggle modal

  $("#programmatically-toggle-modal").on("click", function () {
    var el = document.querySelector("#programmatically-modal");
    var modal = tailwind.Modal.getOrCreateInstance(el);
    modal.toggle();
  });
})();

/***/ }),

/***/ "./resources/js/show-slide-over.js":
/*!*****************************************!*\
  !*** ./resources/js/show-slide-over.js ***!
  \*****************************************/
/***/ (() => {

(function () {
  "use strict"; // Show slide over

  $("#programmatically-show-slide-over").on("click", function () {
    var el = document.querySelector("#programmatically-slide-over");
    var slideOver = tailwind.Modal.getOrCreateInstance(el);
    slideOver.show();
  }); // Hide slide over

  $("#programmatically-hide-slide-over").on("click", function () {
    var el = document.querySelector("#programmatically-slide-over");
    var slideOver = tailwind.Modal.getOrCreateInstance(el);
    slideOver.hide();
  }); // Toggle slide over

  $("#programmatically-toggle-slide-over").on("click", function () {
    var el = document.querySelector("#programmatically-slide-over");
    var slideOver = tailwind.Modal.getOrCreateInstance(el);
    slideOver.toggle();
  });
})();

/***/ }),

/***/ "./resources/js/side-menu-tooltip.js":
/*!*******************************************!*\
  !*** ./resources/js/side-menu-tooltip.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tippy.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());


(function () {
  "use strict"; // Side menu tooltips

  var initTooltips = function tooltips() {
    $(".side-menu").each(function () {
      if (this._tippy == undefined) {
        var content = $(this).find(".side-menu__title").html().replace(/<[^>]*>?/gm, "").trim();
        Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tippy.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this, {
          content: content,
          arrow: Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tippy.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
          animation: "shift-away",
          placement: "right"
        });
      }

      if ($(window).width() <= 1260 || $(this).closest(".side-nav").hasClass("side-nav--simple")) {
        this._tippy.enable();
      } else {
        this._tippy.disable();
      }
    });
    return tooltips;
  }();

  window.addEventListener("resize", function () {
    initTooltips();
  });
})();

/***/ }),

/***/ "./resources/js/side-menu.js":
/*!***********************************!*\
  !*** ./resources/js/side-menu.js ***!
  \***********************************/
/***/ (() => {

(function () {
  "use strict"; // Side Menu

  $(".side-menu").on("click", function () {
    if ($(this).parent().find("ul").length) {
      if ($(this).parent().find("ul").first()[0].offsetParent !== null) {
        $(this).find(".side-menu__sub-icon").removeClass("transform rotate-180");
        $(this).removeClass("side-menu--open");
        $(this).parent().find("ul").first().slideUp(300, function () {
          $(this).removeClass("side-menu__sub-open");
        });
      } else {
        $(this).find(".side-menu__sub-icon").addClass("transform rotate-180");
        $(this).addClass("side-menu--open");
        $(this).parent().find("ul").first().slideDown(300, function () {
          $(this).addClass("side-menu__sub-open");
        });
      }
    }
  });
})();

/***/ }),

/***/ "./resources/js/tabulator.js":
/*!***********************************!*\
  !*** ./resources/js/tabulator.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'xlsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tabulator-tables'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());




(function () {
  "use strict"; // Tabulator

  if ($("#tabulator").length) {
    // Filter function
    var filterHTMLForm = function filterHTMLForm() {
      var field = $("#tabulator-html-filter-field").val();
      var type = $("#tabulator-html-filter-type").val();
      var value = $("#tabulator-html-filter-value").val();
      table.setFilter(field, type, value);
    }; // On submit filter form


    // Setup Tabulator
    var table = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tabulator-tables'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("#tabulator", {
      ajaxURL: "https://dummy-data.left4code.com",
      ajaxFiltering: true,
      ajaxSorting: true,
      printAsHtml: true,
      printStyled: true,
      pagination: "remote",
      paginationSize: 10,
      paginationSizeSelector: [10, 20, 30, 40],
      layout: "fitColumns",
      responsiveLayout: "collapse",
      placeholder: "No matching records found",
      columns: [{
        formatter: "responsiveCollapse",
        width: 40,
        minWidth: 30,
        hozAlign: "center",
        resizable: false,
        headerSort: false
      }, // For HTML table
      {
        title: "PRODUCT NAME",
        minWidth: 200,
        responsive: 0,
        field: "name",
        vertAlign: "middle",
        print: false,
        download: false,
        formatter: function formatter(cell, formatterParams) {
          return "<div>\n                            <div class=\"font-medium whitespace-nowrap\">".concat(cell.getData().name, "</div>\n                            <div class=\"text-slate-500 text-xs whitespace-nowrap\">").concat(cell.getData().category, "</div>\n                        </div>");
        }
      }, {
        title: "IMAGES",
        minWidth: 200,
        field: "images",
        hozAlign: "center",
        vertAlign: "middle",
        print: false,
        download: false,
        formatter: function formatter(cell, formatterParams) {
          return "<div class=\"flex lg:justify-center\">\n                            <div class=\"intro-x w-10 h-10 image-fit\">\n                                <img alt=\"Midone - HTML Admin Template\" class=\"rounded-full\" src=\"/dist/images/".concat(cell.getData().images[0], "\">\n                            </div>\n                            <div class=\"intro-x w-10 h-10 image-fit -ml-5\">\n                                <img alt=\"Midone - HTML Admin Template\" class=\"rounded-full\" src=\"/dist/images/").concat(cell.getData().images[1], "\">\n                            </div>\n                            <div class=\"intro-x w-10 h-10 image-fit -ml-5\">\n                                <img alt=\"Midone - HTML Admin Template\" class=\"rounded-full\" src=\"/dist/images/").concat(cell.getData().images[2], "\">\n                            </div>\n                        </div>");
        }
      }, {
        title: "REMAINING STOCK",
        minWidth: 200,
        field: "remaining_stock",
        hozAlign: "center",
        vertAlign: "middle",
        print: false,
        download: false
      }, {
        title: "STATUS",
        minWidth: 200,
        field: "status",
        hozAlign: "center",
        vertAlign: "middle",
        print: false,
        download: false,
        formatter: function formatter(cell, formatterParams) {
          return "<div class=\"flex items-center lg:justify-center ".concat(cell.getData().status ? "text-success" : "text-danger", "\">\n                            <i data-lucide=\"check-square\" class=\"w-4 h-4 mr-2\"></i> ").concat(cell.getData().status ? "Active" : "Inactive", "\n                        </div>");
        }
      }, {
        title: "ACTIONS",
        minWidth: 200,
        field: "actions",
        responsive: 1,
        hozAlign: "center",
        vertAlign: "middle",
        print: false,
        download: false,
        formatter: function formatter(cell, formatterParams) {
          var a = $("<div class=\"flex lg:justify-center items-center\">\n                            <a class=\"edit flex items-center mr-3\" href=\"javascript:;\">\n                                <i data-lucide=\"check-square\" class=\"w-4 h-4 mr-1\"></i> Edit\n                            </a>\n                            <a class=\"delete flex items-center text-danger\" href=\"javascript:;\">\n                                <i data-lucide=\"trash-2\" class=\"w-4 h-4 mr-1\"></i> Delete\n                            </a>\n                        </div>");
          $(a).find(".edit").on("click", function () {
            alert("EDIT");
          });
          $(a).find(".delete").on("click", function () {
            alert("DELETE");
          });
          return a[0];
        }
      }, // For print format
      {
        title: "PRODUCT NAME",
        field: "name",
        visible: false,
        print: true,
        download: true
      }, {
        title: "CATEGORY",
        field: "category",
        visible: false,
        print: true,
        download: true
      }, {
        title: "REMAINING STOCK",
        field: "remaining_stock",
        visible: false,
        print: true,
        download: true
      }, {
        title: "STATUS",
        field: "status",
        visible: false,
        print: true,
        download: true,
        formatterPrint: function formatterPrint(cell) {
          return cell.getValue() ? "Active" : "Inactive";
        }
      }, {
        title: "IMAGE 1",
        field: "images",
        visible: false,
        print: true,
        download: true,
        formatterPrint: function formatterPrint(cell) {
          return cell.getValue()[0];
        }
      }, {
        title: "IMAGE 2",
        field: "images",
        visible: false,
        print: true,
        download: true,
        formatterPrint: function formatterPrint(cell) {
          return cell.getValue()[1];
        }
      }, {
        title: "IMAGE 3",
        field: "images",
        visible: false,
        print: true,
        download: true,
        formatterPrint: function formatterPrint(cell) {
          return cell.getValue()[2];
        }
      }],
      renderComplete: function renderComplete() {
        Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
          icons: Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
          "stroke-width": 1.5,
          nameAttr: "data-lucide"
        });
      }
    }); // Redraw table onresize

    window.addEventListener("resize", function () {
      table.redraw();
      Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
        icons: Object(function webpackMissingModule() { var e = new Error("Cannot find module 'lucide'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
        "stroke-width": 1.5,
        nameAttr: "data-lucide"
      });
    });
    $("#tabulator-html-filter-form")[0].addEventListener("keypress", function (event) {
      var keycode = event.keyCode ? event.keyCode : event.which;

      if (keycode == "13") {
        event.preventDefault();
        filterHTMLForm();
      }
    }); // On click go button

    $("#tabulator-html-filter-go").on("click", function (event) {
      filterHTMLForm();
    }); // On reset filter form

    $("#tabulator-html-filter-reset").on("click", function (event) {
      $("#tabulator-html-filter-field").val("name");
      $("#tabulator-html-filter-type").val("like");
      $("#tabulator-html-filter-value").val("");
      filterHTMLForm();
    }); // Export

    $("#tabulator-export-csv").on("click", function (event) {
      table.download("csv", "data.csv");
    });
    $("#tabulator-export-json").on("click", function (event) {
      table.download("json", "data.json");
    });
    $("#tabulator-export-xlsx").on("click", function (event) {
      window.XLSX = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'xlsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
      table.download("xlsx", "data.xlsx", {
        sheetName: "Products"
      });
    });
    $("#tabulator-export-html").on("click", function (event) {
      table.download("html", "data.html", {
        style: true
      });
    }); // Print

    $("#tabulator-print").on("click", function (event) {
      table.print();
    });
  }
})();

/***/ }),

/***/ "./resources/js/tiny-slider.js":
/*!*************************************!*\
  !*** ./resources/js/tiny-slider.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tiny-slider/src/tiny-slider'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());


(function () {
  "use strict"; // Tiny Slider

  if ($(".tiny-slider").length) {
    $(".tiny-slider").each(function () {
      this.tns = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tiny-slider/src/tiny-slider'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
        container: this,
        slideBy: "page",
        mouseDrag: true,
        autoplay: true,
        controls: false,
        nav: false,
        speed: 500
      });
    });
  }

  if ($(".tiny-slider-navigator").length) {
    $(".tiny-slider-navigator").each(function () {
      $(this).on("click", function () {
        if ($(this).data("target") == "prev") {
          $("#" + $(this).data("carousel"))[0].tns.goTo("prev");
        } else {
          $("#" + $(this).data("carousel"))[0].tns.goTo("next");
        }
      });
    });
  } // Slider widget page


  if ($(".single-item").length) {
    $(".single-item").each(function () {
      Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tiny-slider/src/tiny-slider'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
        container: this,
        slideBy: "page",
        mouseDrag: true,
        autoplay: false,
        controls: true,
        nav: false,
        speed: 500
      });
    });
  }

  if ($(".multiple-items").length) {
    $(".multiple-items").each(function () {
      Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tiny-slider/src/tiny-slider'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
        container: this,
        slideBy: "page",
        mouseDrag: true,
        autoplay: false,
        controls: true,
        items: 1,
        nav: false,
        speed: 500,
        responsive: {
          600: {
            items: 3
          },
          480: {
            items: 2
          }
        }
      });
    });
  }

  if ($(".responsive-mode").length) {
    $(".responsive-mode").each(function () {
      Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tiny-slider/src/tiny-slider'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
        container: this,
        slideBy: "page",
        mouseDrag: true,
        autoplay: false,
        controls: true,
        items: 1,
        nav: true,
        speed: 500,
        responsive: {
          600: {
            items: 3
          },
          480: {
            items: 2
          }
        }
      });
    });
  }

  if ($(".center-mode").length) {
    $(".center-mode").each(function () {
      Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tiny-slider/src/tiny-slider'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
        container: this,
        mouseDrag: true,
        autoplay: false,
        controls: true,
        center: true,
        items: 1,
        nav: false,
        speed: 500,
        responsive: {
          600: {
            items: 2
          }
        }
      });
    });
  }

  if ($(".fade-mode").length) {
    $(".fade-mode").each(function () {
      Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tiny-slider/src/tiny-slider'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
        mode: "gallery",
        container: this,
        slideBy: "page",
        mouseDrag: true,
        autoplay: true,
        controls: true,
        nav: true,
        speed: 500
      });
    });
  }
})();

/***/ }),

/***/ "./resources/js/tippy.js":
/*!*******************************!*\
  !*** ./resources/js/tippy.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tippy.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



(function () {
  "use strict"; // Tooltips

  $(".tooltip").each(function () {
    var options = {
      content: $(this).attr("title")
    };

    if ($(this).data("trigger") !== undefined) {
      options.trigger = $(this).data("trigger");
    }

    if ($(this).data("placement") !== undefined) {
      options.placement = $(this).data("placement");
    }

    if ($(this).data("theme") !== undefined) {
      options.theme = $(this).data("theme");
    }

    if ($(this).data("tooltip-content") !== undefined) {
      options.content = $($(this).data("tooltip-content"))[0];
    }

    $(this).removeAttr("title");
    Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tippy.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this, _objectSpread({
      arrow: Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tippy.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
      animation: "shift-away"
    }, options));
  });
})();

/***/ }),

/***/ "./resources/js/tom-select.js":
/*!************************************!*\
  !*** ./resources/js/tom-select.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tom-select'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



(function () {
  "use strict"; // Tom Select

  $(".tom-select").each(function () {
    var options = {
      plugins: {
        dropdown_input: {}
      }
    };

    if ($(this).data("placeholder")) {
      options.placeholder = $(this).data("placeholder");
    }

    if ($(this).attr("multiple") !== undefined) {
      options = _objectSpread(_objectSpread({}, options), {}, {
        plugins: _objectSpread(_objectSpread({}, options.plugins), {}, {
          remove_button: {
            title: "Remove this item"
          }
        }),
        persist: false,
        create: true,
        onDelete: function onDelete(values) {
          return confirm(values.length > 1 ? "Are you sure you want to remove these " + values.length + " items?" : 'Are you sure you want to remove "' + values[0] + '"?');
        }
      });
    }

    if ($(this).data("header")) {
      options = _objectSpread(_objectSpread({}, options), {}, {
        plugins: _objectSpread(_objectSpread({}, options.plugins), {}, {
          dropdown_header: {
            title: $(this).data("header")
          }
        })
      });
    }

    new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tom-select'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this, options);
  });
})();

/***/ }),

/***/ "./resources/js/validation.js":
/*!************************************!*\
  !*** ./resources/js/validation.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'pristinejs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'toastify-js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());



(function () {
  "use strict";

  function onSubmit(pristine) {
    var valid = pristine.validate();

    if (valid) {
      Object(function webpackMissingModule() { var e = new Error("Cannot find module 'toastify-js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
        node: $("#success-notification-content").clone().removeClass("hidden")[0],
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true
      }).showToast();
    } else {
      Object(function webpackMissingModule() { var e = new Error("Cannot find module 'toastify-js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
        node: $("#failed-notification-content").clone().removeClass("hidden")[0],
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true
      }).showToast();
    }
  }

  $(".validate-form").each(function () {
    var pristine = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'pristinejs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this, {
      classTo: "input-form",
      errorClass: "has-error",
      errorTextParent: "input-form",
      errorTextClass: "text-danger mt-2"
    });
    pristine.addValidator($(this).find('input[type="url"]')[0], function (value) {
      var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
      var regex = new RegExp(expression);

      if (!value.length || value.length && value.match(regex)) {
        return true;
      }

      return false;
    }, "This field is URL format only", 2, false);
    $(this).on("submit", function (e) {
      e.preventDefault();
      onSubmit(pristine);
    });
  });
})();

/***/ }),

/***/ "./resources/js/zoom.js":
/*!******************************!*\
  !*** ./resources/js/zoom.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'zoom-vanilla.js/dist/zoom-vanilla.min.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());


/***/ }),

/***/ "./public/dist/css/_app.css":
/*!**********************************!*\
  !*** ./public/dist/css/_app.css ***!
  \**********************************/
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):\nModuleBuildError: Module build failed (from ./node_modules/postcss-loader/dist/cjs.js):\nError: Cannot find module 'postcss-import'\nRequire stack:\n- C:\\Users\\user\\Documents\\GitHub\\Employee\\postcss.config.js\n- C:\\Users\\user\\Documents\\GitHub\\Employee\\node_modules\\cosmiconfig\\dist\\loaders.js\n- C:\\Users\\user\\Documents\\GitHub\\Employee\\node_modules\\cosmiconfig\\dist\\ExplorerBase.js\n- C:\\Users\\user\\Documents\\GitHub\\Employee\\node_modules\\cosmiconfig\\dist\\Explorer.js\n- C:\\Users\\user\\Documents\\GitHub\\Employee\\node_modules\\cosmiconfig\\dist\\index.js\n- C:\\Users\\user\\Documents\\GitHub\\Employee\\node_modules\\postcss-loader\\dist\\utils.js\n- C:\\Users\\user\\Documents\\GitHub\\Employee\\node_modules\\postcss-loader\\dist\\index.js\n- C:\\Users\\user\\Documents\\GitHub\\Employee\\node_modules\\postcss-loader\\dist\\cjs.js\n- C:\\Users\\user\\Documents\\GitHub\\Employee\\node_modules\\webpack\\lib\\ProgressPlugin.js\n- C:\\Users\\user\\Documents\\GitHub\\Employee\\node_modules\\webpack\\lib\\index.js\n- C:\\Users\\user\\Documents\\GitHub\\Employee\\node_modules\\webpack-cli\\lib\\webpack-cli.js\n- C:\\Users\\user\\Documents\\GitHub\\Employee\\node_modules\\webpack-cli\\lib\\bootstrap.js\n- C:\\Users\\user\\Documents\\GitHub\\Employee\\node_modules\\webpack-cli\\bin\\cli.js\n- C:\\Users\\user\\Documents\\GitHub\\Employee\\node_modules\\webpack\\bin\\webpack.js\n    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:933:15)\n    at Function.Module._load (node:internal/modules/cjs/loader:778:27)\n    at Module.require (node:internal/modules/cjs/loader:1005:19)\n    at require (node:internal/modules/cjs/helpers:102:18)\n    at Object.<anonymous> (C:\\Users\\user\\Documents\\GitHub\\Employee\\postcss.config.js:3:9)\n    at Module._compile (node:internal/modules/cjs/loader:1103:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1155:10)\n    at Module.load (node:internal/modules/cjs/loader:981:32)\n    at Function.Module._load (node:internal/modules/cjs/loader:822:12)\n    at Module.require (node:internal/modules/cjs/loader:1005:19)\n    at processResult (C:\\Users\\user\\Documents\\GitHub\\Employee\\node_modules\\webpack\\lib\\NormalModule.js:758:19)\n    at C:\\Users\\user\\Documents\\GitHub\\Employee\\node_modules\\webpack\\lib\\NormalModule.js:860:5\n    at C:\\Users\\user\\Documents\\GitHub\\Employee\\node_modules\\loader-runner\\lib\\LoaderRunner.js:400:11\n    at C:\\Users\\user\\Documents\\GitHub\\Employee\\node_modules\\loader-runner\\lib\\LoaderRunner.js:252:18\n    at context.callback (C:\\Users\\user\\Documents\\GitHub\\Employee\\node_modules\\loader-runner\\lib\\LoaderRunner.js:124:13)\n    at Object.loader (C:\\Users\\user\\Documents\\GitHub\\Employee\\node_modules\\postcss-loader\\dist\\index.js:56:7)");

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/axios/package.json":
/*!*****************************************!*\
  !*** ./node_modules/axios/package.json ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"axios","version":"0.21.4","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://axios-http.com","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"jsdelivr":"dist/axios.min.js","unpkg":"dist/axios.min.js","typings":"./index.d.ts","dependencies":{"follow-redirects":"^1.14.0"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__("./resources/js/app.js");
/******/ 	// This entry module doesn't tell about it's top-level declarations so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./public/dist/css/_app.css");
/******/ 	
/******/ })()
;