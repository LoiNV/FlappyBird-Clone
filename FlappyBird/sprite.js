var

_bird,
_bg,
_fg,
_pipeTop,
_pipeBottom;


function Sprite(img, x, y, width, height) {
	this.img = img;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};

Sprite.prototype.draw = function(ctx, x, y) {
	ctx.drawImage(this.img,
		this.x, this.y,               // cat tu toa do x,y trong hinh goc
		 this.width, this.height,     // do rong ,chieu cao hinh cat
		x, y, this.width, this.height // ve vao cavas tu toa do x,y,rong,cao
		);
};

function initSprites(img) {

	_bird = [
		new Sprite(img, 312, 230, 34, 24),
		new Sprite(img, 312, 256, 34, 24),
		new Sprite(img, 312, 282, 34, 24)
	];
	_bg = new Sprite(img,   0, 0, 276, 224);
	_bg.color = "#70C5CF";

	_fg = new Sprite(img, 276, 0, 224,  112);
	_pipeBottom = new Sprite(img, 502, 0, 52, 400);
	_pipeTop = new Sprite(img, 554, 0, 52, 400);
}