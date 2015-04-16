var
	canvas,
	ctx,
	width,
	height,

	fgPos = 0,
	frames = 0,
	pipePos = 372,

	currentState,
	states = {
		Splash: 0
	},

	bird = {

		x: 80,
		y: 250,
		frame: 0,
		animation: [0, 1, 2, 1],

		jump: function(){

		},

		update: function(){
			this.frame += frames % 8 === 0 ? 1: 0;
			this.frame %= 4;
		},

		draw: function(ctx){
			ctx.save();
			ctx.translate(this.x, this.y);
			var i = this.animation[this.frame];
			_bird[i].draw(ctx, -_bird[i].width/2, -_bird[i].height/2);
			ctx.restore();
		}
	},
	pipes = {
		update: function(){

		},

		draw: function(ctx){

		}
	};

function main(){
	canvas = document.createElement("canvas");
	WIDTH = 320;
	HEIGHT = 480;
	canvas.style.border = "1px solid #000";

	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	ctx = canvas.getContext("2d");

	document.body.appendChild(canvas);

	var img = new Image();
	img.src = "image/sheet.png";
	img.onload = function(){
		initSprites(this);
		ctx.fillStyle = _bg.color;
		run();
	}
}
function run(){
	var loop = function(){
		update();
		render();
		window.requestAnimationFrame(loop,canvas);
	}
	window.requestAnimationFrame(loop,canvas);
}

function update(){
	frames++;
	fgPos = (fgPos - 2) % 14;
	pipePos -= 2;
	if (pipePos<= -52) {
		pipePos = 372;
	};

	bird.update();
}

function render(){
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
	_bg.draw(ctx, 0, HEIGHT - _bg.height);
	_bg.draw(ctx, _bg.width, HEIGHT - _bg.height);

	_pipeBottom.draw(ctx, pipePos, 300);
	_pipeTop.draw(ctx, pipePos, -200);

	_fg.draw(ctx, fgPos, HEIGHT - _fg.height);
	_fg.draw(ctx, fgPos+_fg.width, HEIGHT - _fg.height);

	bird.draw(ctx);
}