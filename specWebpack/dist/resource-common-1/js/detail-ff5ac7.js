webpackJsonp([3,0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
		report: function report() {
			console.log("report");
		}
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
		spin1: true,
		spin2: false
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var report = __webpack_require__(1);
	var spin = __webpack_require__(2);

	var b = "hey man!";

/***/ }
]);