var BT = window.BT || {};

BT.Renderable = function(image, cuadro, x, y, ancho, alto, angulo, velocidad) {
	
    var _this = this;
	this.x = x;
	this.y = y;
	this.angulo = angulo;
    
	var cuadros = image.height / alto;
	var archivo = image.data;
    var frameImage = new BT.Image();
    frameImage.create(ancho, alto);
	var imagen = frameImage.data;

	this.setFrame = function (newFrame) {
		newFrame = cuadros - 1 - newFrame;
		var start = newFrame * alto * ancho * 4;
		var end = (newFrame + 1) * alto * ancho * 4;
		var source = archivo.subarray(start, end);
		imagen.set(source);
	};

	this.draw = function (renderer) {
		var cosT = Math.cos(Math.PI * _this.angulo / 180);
		var sinT = Math.sin(Math.PI * _this.angulo / 180);
		var centrox = ancho / 2;
		var centroy = alto / 2;
		var coordx = Math.floor(_this.x - centrox);
		var coordy = Math.floor(_this.y - centroy);
		renderer.backup(ancho, alto, coordx, coordy);
		for(var v = 0; v < alto; v++) {
			for(var h = 0; h < ancho; h++) {
				var x1 = Math.floor((h - centrox) * cosT + (v - centroy) * sinT);
				var y1 = Math.floor((v - centroy) * cosT - (h - centrox) * sinT);
				x1 = Math.floor(x1 + ancho * 0.5);
				y1 = Math.floor(y1 + alto * 0.5);
				var offset = x1 * 4 + y1 * 4 * ancho;
				if(x1 > 0 && y1 > 0 && x1 < ancho && y1 < alto && (imagen[offset + 0] || imagen[offset + 1] || imagen[offset + 2]))
					renderer.setPixel(h + coordx, v + coordy,
						imagen[offset + 0],
						imagen[offset + 1],
						imagen[offset + 2],
						imagen[offset + 3]
					);
			}
		}
	};

	this.moveForward = function () {
		var cosT = Math.cos(Math.PI * (_this.angulo - 90) / 180);
		var sinT = Math.sin(Math.PI * (_this.angulo - 90) / 180);
		move(cosT * velocidad, sinT * velocidad);
	};

	this.rotate = function (alpha) {
		_this.angulo += alpha;
	};

	this.isCollisioning = function (renderable) {
		var margenx1 = ancho * 0.35;
		var margeny1 = alto * 0.35;
		var margenx2 = renderable.getSize()[0] * 0.35;
		var margeny2 = renderable.getSize()[1] * 0.35;
		return     _this.x + margenx1 > renderable.getPosition()[0] - margenx2 &&
			_this.x - margenx1 < renderable.getPosition()[0] + margenx2 &&
			_this.y + margeny1 > renderable.getPosition()[1] - margeny2 &&
			_this.y - margeny1 < renderable.getPosition()[1] + margeny2;
	};

	this.getSize = function () {
		return [ancho, alto];
	};

	this.getPosition = function () {
		return [_this.x, _this.y];
	};

	var move = function (h, v) {
		_this.x += h; // Las ultimas cuatro lineas evitan que
		_this.y += v; // el objeto se salga de la pantalla
		if(_this.x + ancho * 0.5 > 630) _this.x = 630 - ancho * 0.5;
		if(_this.x - ancho * 0.5 < 10) _this.x = 10 + ancho * 0.5;
		if(_this.y + alto * 0.5 > 470) _this.y = 470 - alto * 0.5;
		if(_this.y - alto * 0.5 < 10) _this.y = 10 + alto * 0.5;
	};

	this.setFrame(cuadro);
};