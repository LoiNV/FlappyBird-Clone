var

_bird,
_bg,
_fg,
_pipeTop,
_pipeBottom,
_text,
_score,
_splash,
_buttons,
_numberS,
_numberB,
_medal;


function Sprite(img, x, y, width, height) {
	this.img = img;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};

Sprite.prototype.draw = function(ctx, x, y, scale) {
	ctx.drawImage ( this.img,
					this.x, this.y,          				  // cắt từ tọa đọ x,y trong hình gốc
				 	this.width, this.height, 				  // đọ rộng, chiều cao hình cắt
					x, y, this.width*scale, this.height*scale // vẽ vào tọa độ x,y,rộng,cao
				);
};

function initSprites(img) {

	_bird = [
		new Sprite(img, 312, 230, 34, 24),
		new Sprite(img, 312, 256, 34, 24),
		new Sprite(img, 312, 282, 34, 24)
	];

	_bg = new Sprite(img, 0, 0, 276, 224);
	_bg.color = "#70C5CF";

	_fg = new Sprite(img, 276, 0, 224, 112);

	_pipeBottom = new Sprite(img, 502, 0, 52, 400);
	_pipeTop = new Sprite(img, 554, 0, 52, 400);

	_buttonOk = new Sprite(img, 238, 382, 80, 28)

	_text = {
		GameOver: new Sprite(img, 118, 272, 188, 38),
		GetReady: new Sprite(img, 118, 310, 174, 44)
	}

	_score = new Sprite(img, 276,  112, 226, 116);
	_splash = new Sprite(img, 0, 228, 118, 98);

	_medal = {
		none: new Sprite(img, 348, 228, 44, 44),
		coper: new Sprite(img, 396, 274, 44, 44),
		silver: new Sprite(img, 396, 228, 44, 44),
		gold: new Sprite(img, 348, 274, 44, 44)
	}

	_numberB = new Sprite(img, 0, 354, 12, 14);
	_numberS = new Sprite(img, 0, 376, 14, 20);


	_numberS.draw = _numberB.draw = function(ctx, x, y, num)
	{
		num = num.toString();

		var step = this.width + 2;

		x += step*(10 - num.length);

		for (var i = 0, len = num.length; i < len; i++) {
			var n = parseInt(num[i]);
			ctx.drawImage(img, step*n, this.y, this.width, this.height,
				x, y, this.width, this.height)
			x += step;
		}
	}
}