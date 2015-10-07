/* global $, TweenLite */
var body, isScrolling, screens, bullets, countdownEnd;

function triangles() {
	var width = window.innerWidth + 200,
		height = window.innerHeight + 200,
		canvas = $.id('triangles'),
		ctx, points;

	if (window.devicePixelRatio > 1) {
		canvas.width = width * 2;
		canvas.height = height * 2;
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
		ctx = canvas.getContext('2d');
		ctx.scale(2,2);
	} else {
		canvas.width = width;
		canvas.height = height;
		ctx = canvas.getContext('2d');
	}

	// Create Points
	points = [];
	for (var x = 0; x < width; x = x + width / 13) {
		for (var y = 0; y < height; y = y + height / 13) {
			var px = x + Math.random() * width / 13;
			var py = y + Math.random() * height / 13;
			var p = {
				x: px,
				originX: px,
				y: py,
				originY: py
			};

			points.push(p);
		}
	}

	function getDistance(p1, p2) {
		return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
	}

	// Get 5 closest points
	for (var i = 0; i < points.length; i++) {
		var closest = [];
		var p1 = points[i];

		for (var j = 0; j < points.length; j++) {
			var p2 = points[j];
			if (!(p1 === p2)) {
				var placed = false;
				var k;

				for (k = 0; k < 5; k++) {
					if (!placed) {
						if (closest[k] === undefined) {
							closest[k] = p2;
							placed = true;
						}
					}
				}

				for (k = 0; k < 5; k++) {
					if (!placed) {
						if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
							closest[k] = p2;
							placed = true;
						}
					}
				}
			}

			p1.closest = closest;
		}
	}

	window.addEventListener('resize', function () {
		width = window.innerWidth + 200;
		height = window.innerHeight + 200;

		if (window.devicePixelRatio > 1) {
			// Do nothing
			//canvas.width = width * 2;
			//canvas.height = height * 2;
			//canvas.style.width = width + 'px';
			//canvas.style.height = height + 'px';
		} else {
			canvas.width = width;
			canvas.height = height;
		}
	});

	function shiftPoint(p) {
		TweenLite.to(p, 5+Math.random(), {x:p.originX-50+Math.random()*100,
			y: p.originY-50+Math.random()*100, ease: $.Easing.easeInOut,
			onComplete: function() {
				shiftPoint(p);
			}});
	}

	function animate() {
		ctx.clearRect(0,0,width,height);

		for (i in points) drawLines(points[i]);

		requestAnimationFrame(animate);
	}

	animate();
	for (i in points) {
		shiftPoint(points[i]);
	}

	$.add(body, 'open');

	function drawLines(p) {
		for(var i in p.closest) {
			ctx.beginPath();
			ctx.moveTo(p.x, p.y);
			ctx.lineTo(p.closest[i].x, p.closest[i].y);
			ctx.strokeStyle = 'rgba(229,119,50,1)';
			ctx.stroke();
		}
	}
}

function scrollEvents(unset) {
	if (unset) {
		body.removeEventListener('DOMMouseScroll', scrollManager, false);
		body.removeEventListener('mousewheel', scrollManager, false);
	} else {
		body.addEventListener('DOMMouseScroll', scrollManager, false);
		body.addEventListener('mousewheel', scrollManager, false);
	}
}

function doScreenScroll(active, newScreen) {
	if (newScreen && !isScrolling) {
		isScrolling = true;

		$.remove($('.active', bullets), 'active');
		$.add($.id('bullet_' + newScreen.getAttribute('id')), 'active');

		$.scrollTo({
			target: newScreen,
			parent: screens,
			duration: 1000,
			relativeToParent: true,
			callback: function () {
				$.remove(active, 'active');
				$.add(newScreen, 'active');

				isScrolling = false;

				scrollEvents();
			}
		});
	} else if (!isScrolling) {
		scrollEvents();
	}
}

function scrollManager(e) {
	var delta = e.detail || e.wheelDelta;

	if (!isScrolling) {
		var active = $('.screen.active');

		scrollEvents(true);

		if (delta < 0) doScreenScroll(active, active.nextElementSibling);
		else doScreenScroll(active, active.previousElementSibling);
	}
}

function scrollInit() {
	// Bullets
	bullets = $.id('bullets');
	var scrollableScreens = $.all('.screen', screens);

	$.array(scrollableScreens).forEach(function (el, i) {
		var li = document.createElement('li');
		li.setAttribute('data-id', el.getAttribute('id'));
		li.setAttribute('data-name', el.getAttribute('data-name'));
		li.setAttribute('id', 'bullet_' + el.getAttribute('id'));
		if (i === 0) $.add(li, 'active');
		li.addEventListener('click', function () {
			if (!$.has(this, 'active')) {
				doScreenScroll($('.screen.active'), $.id(this.getAttribute('data-id')));
			}
		});
		bullets.appendChild(li);
	});

	// Events
	scrollEvents();
}

function login() {
	var pwd = $.id('password');

	$.id('login').addEventListener('click', function () {
		var isValid = true,
			name = '',
			room = '';

		switch (pwd.value) {
			case 'elephant':
				name = 'Gill & Mike';
				room = 'elephant';
				break;
			case 'lion':
				name = 'John & Ellen';
				room = 'river';
				break;
			case 'rhino':
				name = 'Charlotte';
				room = 'elephant';
				break;
			case 'leopard':
				name = 'Megan';
				room = 'elephant';
				break;
			default :
				isValid = false;
				break;
		}

		if (isValid) {
			$.array($.all('.name')).forEach(function (el) {
				el.innerText = name;
			});
			$('.room').innerText = room;
			if (room !== 'elephant') {
				$.array($.all('.images img')).forEach(function (el) {
					el.src = el.src.replace('elephant', 'river');
				});
			}

			$.add(body, 'unlock');
			scrollInit();
		}
	});
}

function countdown() {
	var days = Math.floor(countdownEnd / 60 / 60 / 24),
		hours = Math.floor(countdownEnd / 60 / 60 % 24);

	$.id('days').innerText = (days < 10 ? '0' : '') + days;
	$.id('hours').innerText = (hours < 10 ? '0' : '') + hours;

	countdownEnd--;
}

$.ready(function () {
	body = document.body;
	screens = $.id('screens');
	countdownEnd = Math.abs((new Date(2016, 3, 26, 0, 0, 0, 0).getTime() - new Date().getTime()) / 1000);

	triangles();
	login();
	setInterval(countdown, 1000);

	addEventListener("click", function() {
		var
			el = document.documentElement
			, rfs =
				el.requestFullScreen
				|| el.webkitRequestFullScreen
				|| el.mozRequestFullScreen
			;
		rfs.call(el);
	});
});