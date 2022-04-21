/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
var __webpack_exports__ = {};
/*!*******************************************!*\
  !*** ./resources/js/ckeditor-document.js ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ckeditor/ckeditor5-build-decoupled-document'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());

$(".editor").each(function () {
  var el = this;
  Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ckeditor/ckeditor5-build-decoupled-document'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())($(el).find(".document-editor__editable")[0]).then(function (editor) {
    $(el).closest(".editor").find(".document-editor__toolbar").append(editor.ui.view.toolbar.element);
  })["catch"](function (error) {
    console.error(error);
  });
});
/******/ })()
;