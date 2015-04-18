var
	canvas,
	ctx,
	WIDTH,
	HEIGHT,

	fgPos = 0,
	frames = 0,
	score = 0,

	btnOK,
	sound,
	currentstate,
	states = {
		Splash: 0, Game: 1, Score: 2
	},

	bird = {

		x: 60,
		y: 0,
		width: 34,
		height: 24,

		frame: 0,
		velocity: 0,
		animation: [0, 1, 2, 1],

		rotation: 0,
		radius: 12,

		gravity: 0.25,
		_jump: 4.6,

		jump: function() {
			this.velocity = -this._jump;
			sound.play();
		},

		update: function() {
			var n = currentstate === states.Splash ? 10 : 5;
			this.frame += frames % n === 0 ? 1 : 0;
			this.frame %= this.animation.length;

			// hiệu ứng bập bênh cho con chim
			if (currentstate === states.Splash) {//màn hình chờ

				this.y = 200 + 5*Math.cos(frames/10);
				this.rotation = 0;

			} else { // bắt đầu game

				this.velocity += this.gravity;
				this.y += this.velocity; //rơi thẳng xuống

				if (this.y >= HEIGHT - _fg.height-10) {//chim rơi chạm đất
					this.y = HEIGHT - _fg.height-10;//cho chim nằm trên mặt đất
					if (currentstate === states.Game) {
						currentstate = states.Score;
					}
					// cho vận tốc rơi bằng vận tốc nhảy lên
					this.velocity = this._jump;
				}

				// chúc đầu xuống khi rơi
				if (this.velocity >= this._jump) {
					this.frame = 1;
					this.rotation = Math.min(Math.PI/2, this.rotation + 0.3);
				} else { // ngửng đầu khi nhảy
					this.rotation = -0.3;
				}
			}
		},

		draw: function(ctx) {
			ctx.save();

			ctx.translate(this.x, this.y);
			ctx.rotate(this.rotation);

			var n = this.animation[this.frame];
			// vẽ từ giữa hình sang 2 bên
			_bird[n].draw(ctx, -_bird[n].width/2, -_bird[n].height/2,this.width,this.height);

			ctx.restore();//xóa hình cũ
		}
	},
	pipes = {

		//tạo mảng ống nước
		_pipes: [],

		reset: function() {
			//cho mảng = rỗng khi reset
			this._pipes = [];
		},

		update: function() {
			// sau 100 frames thêm 1 ống nước
			if (frames % 100 === 0) {
				var _y = HEIGHT - (_pipeTop.height + _fg.height + 120 + 200 * Math.random());
				// thêm vào mảng
				this._pipes.push({
					x: 500,
					y: _y,
					width: _pipeTop.width,
					height: _pipeTop.height
				});
			}
			for (var i = 0, len = this._pipes.length; i < len; i++) {
				var p = this._pipes[i];

				if (i === 0) {
					//tăng 1 điểm khi đến ống
					score += p.x === bird.x ? 1 : 0;

					// kiểm tra va chạm

					// lấy vị trí gần nhất giữa chim và ống
					var cx  = Math.min(Math.max(bird.x, p.x), p.x+p.width);
					var cy1 = Math.min(Math.max(bird.y, p.y), p.y+p.height);
					var cy2 = Math.min(Math.max(bird.y, p.y+p.height+80), p.y+2*p.height+80);

					// chênh lệch tọa độ
					var dx  = bird.x - cx;
					var dy1 = bird.y - cy1;
					var dy2 = bird.y - cy2;

					// tính khoảng cách bằng Pytago
					var d1 = dx*dx + dy1*dy1;
					var d2 = dx*dx + dy2*dy2;

					var r = bird.radius*bird.radius;

					// va chạm
					if (r > d1 || r > d2) {
						currentstate = states.Score;
					}
				}

				// di chuyển ống từ phải sang trái
				p.x -= 2;

				if (p.x < -p.width) {         //vượt khung
					this._pipes.splice(i, 1); //xóa 1 ống vị trí i
					i--;
					len--;
				}
			}
		},

		draw: function(ctx) {
			for (var i = 0, len = this._pipes.length; i < len; i++) {
				var p = this._pipes[i];
				// vẽ ống trên
				_pipeTop.draw(ctx, p.x, p.y);
				// ống dưới cách 80
				_pipeBottom.draw(ctx, p.x, p.y+80+p.height);
			}
		}
	};

// sự kiện 'onpress'
function onpress(evt) {

	switch (currentstate) {

		case states.Splash:
			currentstate = states.Game;
			bird.jump(); // thay đổi vận tốc chim
			break;

		case states.Game:
			bird.jump();// thay đổi vận tốc chim
			break;

		case states.Score:
			// vị trí click chuột
			var mx = evt.offsetX, my = evt.offsetY;

			if (mx == null || my == null) {
				mx = evt.touches[0].clientX;
				my = evt.touches[0].clientY;
			}

			// kiểm tra click trúng hình button ko
			if (btnOK.x < mx && mx < btnOK.x + btnOK.width &&
				 btnOK.y < my && my < btnOK.y + btnOK.height)
			{
				pipes.reset();
				currentstate = states.Splash;
				score = 0;
			}
			break;

	}
}
function main(){

	WIDTH = 320;
	HEIGHT = 480;

	canvas = document.createElement("canvas");
	canvas.style.border = "1px solid #000";

	//chạy sự kiện 'onpress' khi bấm chuột
	var evt ="mousedown";
	document.addEventListener(evt, onpress);

	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	ctx = canvas.getContext("2d");

	currentstate = states.Splash;
	// thêm canvas vào document
	document.body.appendChild(canvas);

	//tạo file âm thanh
	sound = new Audio("sound/jump.wav");

	//load hình
	var img = new Image();
	img.src = "image/sheet.png";
	img.onload = function(){
		initSprites(this);
		ctx.fillStyle = _bg.color;

		//tạo nut OK
		btnOK = {
			x: (WIDTH - _buttonOk.width)/2,
			y: HEIGHT - 200,
			width: _buttonOk.width,
			height: _buttonOk.height
		}

		run();
	}
}
function run(){
	// lặp lại liên tục hàm update + render
	var loop = function(){
		update();
		render();
		window.requestAnimationFrame(loop,canvas);
	}
	window.requestAnimationFrame(loop,canvas);
}

function update(){
	frames++;
	if (currentstate !== states.Score) {
		//mặt đất di chuyển từ phải sang trái 2px 7 lần
		fgPos = (fgPos - 2) % 14;
	}
	if (currentstate === states.Game) {
		pipes.update();
	}
	bird.update();
}
//vẽ
function render(){
	//khung
	ctx.fillRect(0, 0, WIDTH, HEIGHT);

	//hình nền
	_bg.draw(ctx, 0, HEIGHT - _bg.height);
	_bg.draw(ctx, _bg.width, HEIGHT - _bg.height);

	//ống nước
	pipes.draw(ctx);

	//chim
	bird.draw(ctx);

	//mặt đất
	_fg.draw(ctx, fgPos, HEIGHT - _fg.height);
	_fg.draw(ctx, fgPos + _fg.width, HEIGHT - _fg.height);

	if (currentstate === states.Splash) {
		// hình + chữ GetReady
		_splash.draw(ctx, WIDTH/2 - _splash.width/2, HEIGHT - 300);
		_text.GetReady.draw(ctx, WIDTH/2 - _text.GetReady.width/2, HEIGHT - 380);
	}

	if (currentstate === states.Score) {
		// vẽ chữ gameover và bảng score
		_text.GameOver.draw(ctx, WIDTH/2 - _text.GameOver.width/2, HEIGHT - 400);
		_score.draw(ctx, WIDTH/2 - _score.width/2, HEIGHT - 340);
		//vẽ nut Ok
		_buttonOk.draw(ctx, btnOK.x, btnOK.y);

	}else {
		// vẽ điểm số phía trên
		_numberS.draw(ctx, 158, 20, score);

	}
}