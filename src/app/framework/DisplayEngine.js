function DisplayEngine(canvasId) {
	this.canvas = document.getElementById(canvasId);
	this.context = this.canvas.getContext('2d');
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	this.elements = [];
}

DisplayEngine.prototype.getClientWidth = function() {
	return this.filterResults (
		window.innerWidth ? window.innerWidth : 0,
		document.documentElement ? document.documentElement.clientWidth : 0,
		document.body ? document.body.clientWidth : 0
	);
}

DisplayEngine.prototype.getClientHeight = function() {
	return this.filterResults (
		window.innerHeight ? window.innerHeight : 0,
		document.documentElement ? document.documentElement.clientHeight : 0,
		document.body ? document.body.clientHeight : 0
	);
}

DisplayEngine.prototype.getScrollLeft = function() {
	return this.filterResults (
		window.pageXOffset ? window.pageXOffset : 0,
		document.documentElement ? document.documentElement.scrollLeft : 0,
		document.body ? document.body.scrollLeft : 0
	);
}

DisplayEngine.prototype.getScrollTop = function() {
	return this.filterResults (
		window.pageYOffset ? window.pageYOffset : 0,
		document.documentElement ? document.documentElement.scrollTop : 0,
		document.body ? document.body.scrollTop : 0
	);
}

DisplayEngine.prototype.filterResults = function(n_win, n_docel, n_body) {
	var n_result = n_win ? n_win : 0;
	if (n_docel && (!n_result || (n_result > n_docel)))
		n_result = n_docel;
	return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
}

DisplayEngine.prototype.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
    };
})();


DisplayEngine.prototype.add = function(element) {
	this.elements.push(element);
}

DisplayEngine.prototype.resize = function (instance) {
	console.log('resize');
	instance.canvasWidth = instance.getClientWidth();
	instance.canvasHeight = instance.getClientHeight();
	instance.canvas.setAttribute('width', instance.canvasWidth);
	instance.canvas.setAttribute('height', instance.canvasHeight);
}

DisplayEngine.prototype.init = function() {
	this.initSelf();
	this.initElements();
	this.initLoop();
}

DisplayEngine.prototype.initElements = function() {
	var _this = this;
	this.elements.forEach(function(element) {
		element.init(_this);
	})
}

DisplayEngine.prototype.initSelf = function() {
	var _this = this;

	// add listener for resize
	window.addEventListener('resize', function() {
		_this.resize(_this);
	}, false);

	// call resize once
	this.resize(this);
}

DisplayEngine.prototype.initLoop = function() {
	this.resize(this);
	this.loop(this);
}

DisplayEngine.prototype.loop = function(instance) {
	instance.update();
	instance.draw();
	this.requestAnimFrame.call(window, function() {
		instance.loop(instance);
	});
}

DisplayEngine.prototype.update = function() {
	this.updateElements();
}

DisplayEngine.prototype.updateElements = function() {
	this.elements.forEach(function(element) {
		element.update();
	});
}

DisplayEngine.prototype.draw = function() {
	this.drawElements();
}

DisplayEngine.prototype.drawElements = function() {
	var _this = this;
	this.elements.forEach(function(element) {
		element.draw(_this.context);
	})
}