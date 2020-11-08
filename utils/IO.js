const FPS = 60;

let canvas = null; // HTMLCanvasElement object
let c = null; // CanvasRenderingContext2D object, used to draw graphics

function IO() {
	this.keys = {};
	this.mouse = new Vector(0, 0);
	this.mouse.pressed = false;
	this.mouse.button = null;
	this.activated = false;
};
IO.method("activate", function activate() {
	const self = this;
	this.keydown = function(event) {
		self.keys[event.code] = true;
	};
	this.keyup = function(event) {
		self.keys[event.code] = false;
	};
	this.mousedown = function(event) {
		self.mouse.pressed = true;
		self.mouse.button = (event.which === 3) ? "right" : "left";
	};
	this.mouseup = function(event) {
		self.mouse.pressed = false;
		self.mouse.button = null;
	};
	this.mousemove = function(event) {
		const canvasRect = canvas.getBoundingClientRect();
		self.mouse.x = (event.clientX - canvasRect.left) / (canvasRect.right - canvasRect.left) * canvas.width;
		self.mouse.y = (event.clientY - canvasRect.top) / (canvasRect.bottom - canvasRect.top) * canvas.height;
	};
	this.contextmenu = function(event) {
		event.preventDefault();
		return false;
	};
	document.body.addEventListener("keydown", this.keydown);
	document.body.addEventListener("keyup", this.keyup);
	document.body.addEventListener("mousedown", this.mousedown);
	document.body.addEventListener("mouseup", this.mouseup);
	document.body.addEventListener("mousemove", this.mousemove);
	document.body.addEventListener("contextmenu", this.contextmenu);

	this.activated = true;
});
IO.method("deactivate", function deactivate() {
	document.body.removeEventListener("keydown", this.keydown);
	document.body.removeEventListener("keyup", this.keyup);
	document.body.removeEventListener("mousedown", this.mousedown);
	document.body.removeEventListener("mouseup", this.mouseup);
	document.body.removeEventListener("mousemove", this.keydown);

	this.activated = false;
});
IO.method("mouseInRect", function mouseInRect(rect) {
	if(!rect.hasOwnProperties("left", "right", "top", "bottom")) {
		rect = new Rectangle(rect);
	}
	return this.mouse.x > rect.left && this.mouse.x < rect.right && this.mouse.y > rect.top && this.mouse.y < rect.bottom;
});
IO.method("clicked", function clicked() {
	return this.mouse.pressed && !utils.pastInputs.mouse.pressed;
});
IO.method("beganPressing", function beganPressing(keyCode) {
	return this.keys[keyCode] && !utils.pastInputs.keys[keyCode];
});
IO.method("pressingArrows", function pressingArrows() {
	return this.keys.ArrowLeft || this.keys.ArrowRight || this.keys.ArrowUp || this.keys.ArrowDown;
});
IO.method("pressingWASD", function pressingWASD() {
	return this.keys.KeyW || this.keys.KeyA || this.keys.KeyS || this.keys.KeyD;
});
IO.method("pressingShift", function pressingShift() {
	return this.keys.ShiftLeft || this.keys.ShiftRight;
});
IO.method("pressingCtrl", function pressingCtrl() {
	return this.keys.ControlLeft || this.keys.ControlRight;
});
IO.method("pressingAlt", function pressingAlt() {
	return this.keys.AltLeft || this.keys.AltRight;
});
IO.method("directionFromKeys", function directionFromKeys() {
	if(this.keys.ArrowLeft || this.keys.KeyA) {
		return "left";
	}
	else if(this.keys.ArrowRight || this.keys.KeyD) {
		return "right";
	}
	else if(this.keys.ArrowUp || this.keys.KeyW) {
		return "up";
	}
	else if(this.keys.ArrowDown || this.keys.KeyS) {
		return "down";
	}
	return null;
});
IO.method("matches", function matches(keyCombination) {
	if(/^(?:ctrl)? ?(?:shift)? ?(?:alt)? [\w\d]$/g.test(keyCombination)) {
		const keyRequirements = keyCombination.split(" ");
		return keyRequirements.every(requirement => {
			if(requirement === "ctrl") {
				return this.pressingCtrl();
			}
			else if(requirement === "alt") {
				return this.pressingAlt();
			}
			else if(requirement === "shift") {
				return this.pressingShift();
			}
			else if(!isNaN(parseInt(requirement))) {
				return this.keys[`Digit${requirement}`];
			}
			else {
				return this.keys[`Key${requirement.toUpperCase()}`];
			}
		});
	}
	else {
		throw new Error("Invalid key combination string.");
	}
});
IO.method("fullscreen", function fullscreen() {
	canvas.width = null, canvas.height = null;
	canvas.requestFullscreen();
	const boundingBox = canvas.getBoundingClientRect();
	canvas.width = boundingBox.width;
	canvas.height = boundingBox.height;
});
IO.updateCanvasDimensions = function updateCanvasDimensions() {
	const boundingBox = canvas.getBoundingClientRect();
	if(canvas.width !== boundingBox.width) {
		canvas.width = boundingBox.width;
	}
	if(canvas.height !== boundingBox.height) {
		canvas.height = boundingBox.height;
	}
};
IO.initCanvas = function initCanvas() {
	/* create canvas element */
	canvas = document.createElement("canvas");
	canvas.id = "canvas";
	document.body.appendChild(canvas);
	const boundingBox = canvas.getBoundingClientRect();
	canvas.width = boundingBox.width, canvas.height = boundingBox.height;
	c = canvas.getContext("2d");

	window.addEventListener("resize", () => {
		IO.updateCanvasDimensions();
	});
};
IO.initCanvas();

let io = new IO();
io.activate();
