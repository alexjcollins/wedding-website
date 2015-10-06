/* jshint curly: false */
/* jshint -W079 */// Fuuuuuccckkkkk off jQuery
/* jshint -W082 */// I can live w/ functions in blocks

/**
 * $.js?incl=ready,selection
 *
 * Include everything:
 * all
 *
 * Include specific:
 * ajax
 * array
 * class
 * easing
 * math
 * offset
 * raf
 * ready
 * scrollTo
 * selection
 * serialize
 */

/**
 * Shorthand document.querySelector, also the base of everything else
 * @param querySelector
 * @param elem
 * @returns {*}
 */
var $ = function (querySelector, elem) {
	if (elem !== undefined) return elem.querySelector(querySelector);
	if (querySelector !== undefined) return document.querySelector(querySelector);
};

/////////////////////////
//  NodeList to Array  //
/////////////////////////
/**
 * Converts an object, specifically a NodeList, to an array
 * Allows for use of functions like forEach
 * @param nodeList
 * @returns {Array.<Object>}
 */
$.array = function (nodeList) {
	return Array.prototype.slice.call(nodeList);
};

/////////////
//  Class  //
/////////////
/**
 * Add Class
 * @param el
 * @param className
 */
$.add = function (el, className) {
	if (el !== null) {
		if (el.classList) el.classList.add(className);
		else el.className += ' ' + className;
	}
};

/**
 * Has Class
 * @param el
 * @param className
 * @returns {boolean}
 */
$.has = function (el, className) {
	if (el !== null) {
		if (el.classList) return el.classList.contains(className);
		else return new RegExp('(^| )' + className + '( |Å“)', 'gi').test(el.className);
	}
};

/**
 * Remove Class
 * @param el
 * @param className
 */
$.remove = function (el, className) {
	if (el !== null) {
		if (el.classList) el.classList.remove(className);
		else el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|Å“)', 'gi'), ' ');
	}
};

/**
 * Toggle Class
 * @param el
 * @param className
 */
$.toggle = function (el, className) {
	if (el.classList) {
		el.classList.toggle(className);
	} else {
		var classes = el.className.split(' ');
		var existingIndex = classes.indexOf(className);

		if (existingIndex >= 0)
			classes.splice(existingIndex, 1);
		else
			classes.push(className);

		el.className = classes.join(' ');
	}
};

//////////////
//  Easing  //
//////////////
/**
 * Easing Functions
 * Inspired from http://gizma.com/easing/ & Snap SVGs easing
 * Consider the t value for the range [0, 1] => [0, 1].
 * @type {Object}
 */
$.Easing = {
	// No easing, no acceleration.
	linear: function(t) {
		return t;
	},
	// Accelerating from zero velocity.
	easeInQuad: function(t) {
		return t * t;
	},
	// Decelerating to zero velocity.
	easeOutQuad: function(t) {
		return t * (2 - t);
	},
	// Acceleration until halfway, then deceleration.
	easeInOutQuad: function(t) {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	},
	// Accelerating from zero velocity.
	easeInCubic: function(t) {
		return t * t * t;
	},
	// Decelerating to zero velocity.
	easeOutCubic: function(t) {
		return (--t) * t * t + 1;
	},
	// Acceleration until halfway, then deceleration.
	easeInOutCubic: function(t) {
		return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
	},
	// Accelerating from zero velocity.
	easeInQuart: function(t) {
		return t * t * t * t;
	},
	// Decelerating to zero velocity.
	easeOutQuart: function(t) {
		return 1 - (--t) * t * t * t;
	},
	// Acceleration until halfway, then deceleration.
	easeInOutQuart: function(t) {
		return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
	},
	// Accelerating from zero velocity.
	easeInQuint: function(t) {
		return t * t * t * t * t;
	},
	// Decelerating to zero velocity.
	easeOutQuint: function(t) {
		return 1 + (--t) * t * t * t * t;
	},
	// Acceleration until halfway, then deceleration.
	easeInOutQuint: function(t) {
		return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
	},
	easeOut: function (t) {
		return Math.pow(t, 1.7);
	},
	easeIn: function (t) {
		return Math.pow(t, 0.48);
	},
	easeInOut: function (t) {
		if (t === 1) return 1;
		if (t === 0) return 0;
		var q = 0.48 - t / 1.04,
			Q = Math.sqrt(0.1734 + q * q),
			x = Q - q,
			X = Math.pow(Math.abs(x), 1 / 3) * (x < 0 ? -1 : 1),
			y = -Q - q,
			Y = Math.pow(Math.abs(y), 1 / 3) * (y < 0 ? -1 : 1);
		t = X + Y + 0.5;
		return (1 - t) * 3 * t * t + t * t * t;
	},
	backIn: function (t) {
		if (t === 1) return 1;
		var s = 1.70158;
		return t * t * ((s + 1) * t - s);
	},
	backOut: function (t) {
		if (t === 0) return 0;
		t = t - 1;
		var s = 1.70158;
		return t * t * ((s + 1) * t + s) + 1;
	},
	elastic: function (t) {
		if (t === !!t) return t;
		return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
	},
	bounce: function (t) {
		var s = 7.5625,
			p = 2.75,
			l;
		if (t < (1 / p)) {
			l = s * t * t;
		} else {
			if (t < (2 / p)) {
				t -= (1.5 / p);
				l = s * t * t + 0.75;
			} else {
				if (t < (2.5 / p)) {
					t -= (2.25 / p);
					l = s * t * t + 0.9375;
				} else {
					t -= (2.625 / p);
					l = s * t * t + 0.984375;
				}
			}
		}
		return l;
	}
};

////////////////////////
//  Element Position  //
////////////////////////
/**
 * Å“.offset() stolen from jQuery
 * @param elem
 * @param relativeToParent
 * @returns {*}
 */
$.offset = function (elem, relativeToParent) {
	if (relativeToParent) return { top: elem.offsetTop, left: elem.offsetLeft };

	var docElem, win, rect, doc;

	// Support: IE<=11+
	// Running getBoundingClientRect on a
	// disconnected node in IE throws an error
	//if ( !elem.getClientRects().length ) {
	//	return { top: 0, left: 0 };
	//}

	rect = elem.getBoundingClientRect();

	// Make sure element is not hidden (display: none)
	if ( rect.width || rect.height ) {
		doc = elem.ownerDocument;
		win = (doc !== null && doc === doc.window) ? doc : doc.nodeType === 9 && doc.defaultView;
		docElem = doc.documentElement;

		return {
			top: rect.top + win.pageYOffset - docElem.clientTop,
			left: rect.left + win.pageXOffset - docElem.clientLeft
		};
	}

	// Return zeros for disconnected and hidden elements (gh-2310)
	return rect;
};

/////////////////////////////
//  requestAnimationFrame  //
/////////////////////////////
/*
 http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 requestAnimationFrame polyfill by Erik MÃ¶ller
 fixes from Paul Irish and Tino Zijdel
 */
(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback/*, element*/) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); },
				timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());

/////////////////
//  DOM Ready  //
/////////////////
/**
 * A safe window.onload wrapper, can be used multiple times
 * @param func
 */
$.ready = function (func) {
	var oldonload = window.onload;
	if (typeof window.onload !== 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			if (oldonload) oldonload();
			func();
		};
	}
};

/////////////////
//  Scroll To  //
/////////////////
/**
 * Scroll an element to a location
 *
 * Requires $.offset & requestAnimationFrame ($.raf polyfill)
 *
 * @param opts The Options
 */
$.scrollTo = function (opts) {
	var settings = {
		target: null,
		parent: document.documentElement.scrollTop ? document.documentElement : document.body,
		duration: 600,
		relativeToParent: false,
		callback: null
	};

	for (var setting in opts) { if (opts.hasOwnProperty(setting)) settings[setting] = opts[setting] }

	if (settings.target !== 'undefined' && settings.target !== null) {

		var Y = $.offset(settings.target, !!settings.relativeToParent).top;

		var start = Date.now(),
			elem = settings.parent,
			from = elem.scrollTop;

		if(from === Y) {
			if(settings.callback) settings.callback(false);
			return; // Prevent scrolling to the Y point if already there
		}

		function scroll() {

			var currentTime = Date.now(),
				time = $.min(1, ((currentTime - start) / settings.duration)),
				easedT = $.Easing.easeInOut(time);

			elem.scrollTop = (easedT * (Y - from)) + from;

			if(time < 1) requestAnimationFrame(scroll);
			else if(settings.callback) settings.callback(true);
		}

		requestAnimationFrame(scroll);
	}
};

/////////////////
//  Selection  //
/////////////////
/**
 * Shorthand querySelectorAll
 * @param querySelector
 * @param elem
 * @returns {NodeList}
 */
$.all = function (querySelector, elem) {
	if (elem !== undefined) return elem.querySelectorAll(querySelector);
	else return document.querySelectorAll(querySelector);
};

/**
 * Shorthand document.getElementById
 * @param id
 * @returns {Element}
 */
$.id = function (id) {
	return document.getElementById(id);
};

////////////
//  Math  //
////////////
$.min = function (a,b) {
	return a < b ? a : b;
};
