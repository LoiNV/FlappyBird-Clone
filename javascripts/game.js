var
	canvas,
	ctx,
	WIDTH,
	HEIGHT,

	spd = 2,
	fgPos = 0,
	frames = 0,
	score = 0,
	best = 0,

	btnOK,

	sound={
		Jump: new Audio("sound/flap.mp3"),
		Fg_hit: new Audio("sound/fg_hit.mp3"),
		Pipe_hit: new Audio("sound/pipe_hit.mp3"),
		Item_eat: new Audio("sound/item_eat.mp3")
	},

	currentstate,

	states = {
		Splash: 0, Game: 1, Score: 2, Pause: 3
	},

	// chim
	bird = {

		x: 70,
		y: 0,

		frame: 0,
		velocity: 0,
		animation: [0, 1, 2, 1],

		rotation: 0,
		radius: 12,

		gravity: 0.25,
		_jump: 4.6,

		jump: function() {
			//âm thanh khi nhảy
			sound.Jump.play();
			this.velocity = -this._jump;
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
						//âm thanh khi chạm đất
						sound.Fg_hit.play();
						currentstate = states.Score;
					}

					// cho vận tốc rơi bằng vận tốc nhảy lên
					this.velocity = this._jump;
				}

				if (this.y <= 0) { //cham khung
					this.y = 20;
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
			ctx.save(); // lưu trạng thái con chim

			ctx.translate(this.x, this.y);
			ctx.rotate(this.rotation);

			var n = this.animation[this.frame];
			// vẽ con chim
			_bird[n].draw(ctx, -_bird[n].width/2, -_bird[n].height/2, 1);

			ctx.restore(); // khôi phục trạng thái con chim
		}
	},

	pipes = {

		//tạo mảng
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

				//va chạm
				if (r > d1 || r > d2) {

					//âm thanh khi va vào ống
					sound.Pipe_hit.play();
					currentstate = states.Score;
				}

				//tăng 1 điểm khi qua ống
				score += (p.x + p.width) === bird.x ? 1 : 0;

				// di chuyển ống từ phải sang trái
				p.x -= spd;
				//vượt khung
				if (p.x < -p.width) {
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
				_pipeTop.draw(ctx, p.x, p.y, 1);
				// ống dưới cách 80
				_pipeBottom.draw(ctx, p.x, p.y + 80 + p.height, 1);
			}
		}
	},

	items = {

		// tạo mảng
		_items: [],

		//item
		item:{
			x: 0,
			y: 0,
			width: 17,
			height: 12,
			radius: 6,

			frame: 0,
			animation: [0, 1, 2, 1],

			update: function() {
				this.frame += frames % 10 === 0 ? 1 : 0;
				this.frame %= this.animation.length;
			},

			draw: function(ctx) {

				ctx.save();
				ctx.translate(this.x, this.y);

				var n = this.animation[this.frame];

				_bird[n].draw(ctx, -_bird[n].width/2, -_bird[n].height/2, 0.5);

				ctx.restore();
			}
		},

		reset: function() {
			//cho mảng = rỗng khi reset
			this._items = [];
		},

		update:function(){
			//300 frames thêm 1 item
			if (frames % 300 === 0) {

				var it = this.item;
				//set vị trí giữa 2 ống nước, độ cao ngẫu nhiên
				it.y = HEIGHT - (_fg.height + 100 + 200*Math.random());
				it.x = 432;

				this._items.push(it);
			}

			// ăn item
			for(var it in this._items){
				//tính khoảng cách
				var cx = this._items[it].x - bird.x;
				var cy = this._items[it].y - bird.y;
				var d = Math.sqrt(cx*cx + cy*cy);

				//va chạm
				if (d <= 25) {

					//âm thanh khi ăn item
					sound.Item_eat.play();

					//tăng 5 điểm khi ăn
					score += 5;
					delete this._items[it];

				}else{

					this._items[it].x -= spd;
					if (this._items[it].x < -this._items[it].width) {
						delete this._items[it];
					}
				}
			}

		},

		draw:function(ctx){

			for (var it in this._items) {
				this._items[it].update();
				this._items[it].draw(ctx);
			}
		}
	};

// tạo sự kiện click 'onpress'
function onpress(evt) {
	//tọa độ click chuột toàn màn hình
	var cx = evt.clientX;
	var cy = evt.clientY;

	if (cx == 0 || cx == null || cy == 0 || cy == null) {
		//tọa độ tap trong mobile
		var cx = evt.touches[0].clientX;
		var	cy = evt.touches[0].clientY;
	}

	// tọa độ click chuột trong khung hình
	var mx = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
	var	my = evt.offsetY == undefined ? evt.layerY : evt.offsetY;

	// tọa độ tap trong mobile
	if (mx == 0 || mx == null || my == 0 || my == null) {
		var mx = evt.touches[0].clientX;
		var	my = evt.touches[0].clientY;
	}

	switch (currentstate) {

		case states.Splash:
			//kiểm tra xem có click vào khung hình hay ko
			if ((window.innerWidth - canvas.width)/2 <= cx && cx < (window.innerWidth + canvas.width)/2 &&
				(window.innerHeight - canvas.height)/2 <= cy && cy < (window.innerHeight + canvas.height)/2) {

				currentstate = states.Game;
				bird.jump(); // nhảy
			}

			break;

		case states.Game:

			// click nút pause
			if (btnPause.x < mx && mx < btnPause.x + btnPause.width &&
				btnPause.y < my && my < btnPause.y + btnPause.height)
			{
				//nút play
				_buttons.Play.draw(ctx, btnPause.x, btnPause.y, 1);

				currentstate = states.Pause; // pause game
			}else
				bird.jump();// nhảy
			break;

		case states.Score:

			// kiểm tra click trúng hình button ko
			if (btnOK.x < mx && mx < btnOK.x + btnOK.width &&
				 btnOK.y < my && my < btnOK.y + btnOK.height)
			{
				pipes.reset();
				items.reset();
				currentstate = states.Splash;
				score = 0;
			}
			break;
		case states.Pause:
			if (btnPause.x < mx && mx < btnPause.x + btnPause.width &&
				btnPause.y < my && my < btnPause.y + btnPause.height)
			{
				currentstate = states.Game;
			}
			break;
	}
}

//sự kiện ấn phím 'onkey'
function onkey(e){

	switch (currentstate) {

		case states.Splash:

			// ấn space
			if(e.keyCode == '32'){
				currentstate = states.Game;
				bird.jump(); // nhảy
			}
			break;

		case states.Game:

			// ấn P hoặc p
			if (e.keyCode == '80' || e.keyCode == '112')
			{
				//nút play
				_buttons.Play.draw(ctx, btnPause.x, btnPause.y, 1);

				currentstate = states.Pause; // pause game
			}

			if (e.keyCode == '32') {
				bird.jump();// nhảy
			}
			break;

		case states.Score:

			pipes.reset();
			items.reset();
			currentstate = states.Splash;
			score = 0;
			break;

		case states.Pause:

			if (e.keyCode == '80' || e.keyCode == '112')
			{
				currentstate = states.Game;
			}
			break;
	}
}

//main
function main(){

	canvas = document.createElement("canvas");
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;

	canvas.style.border = "1px solid #000";

	//chạy sự kiện 'onpress' khi bấm chuột
	var evt = "touchstart";
	if (WIDTH >= 450) {
		WIDTH  = 320;
		HEIGHT = 480;
		evt = "mousedown";
	}
	document.addEventListener(evt, onpress);

	//sự kiện ấn phím
	document.addEventListener("keypress", onkey);

	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	var canvasCheck = (canvas.getContext) ? true : false;
	if (!canvasCheck) {
		alert("Your browser doesn't support HTML5, please update to latest version");
	}
	ctx = canvas.getContext("2d");

	currentstate = states.Splash;

	// thêm canvas vào document
	document.body.appendChild(canvas);

	if((typeof(window.localStorage) !== "undefined")) {

		if (window.localStorage.getItem("best") != null) {
			best = window.localStorage.getItem("best");
		}else{
			best = 0;
		}

	} else {
		// IE 11 not support localStorage
		alert("Sorry! No Web Storage support...");
	}

	//load hình
	var img = new Image();
	img.src = "images/sheet.png";
	img.onload = function(){

		initSprites(this);
		//màu nền
		ctx.fillStyle = _bg.color;

		//tạo nut OK
		btnOK = {
			x: (WIDTH - _buttons.Ok.width)/2,
			y: HEIGHT - 200,
			width: _buttons.Ok.width,
			height: _buttons.Ok.height
		}
		//
		btnPause = {
			x: 25,
			y: 30,
			width: _buttons.Pause.width,
			height: _buttons.Pause.height
		}

		run();
	}
}

function run(){
	// lặp lại liên tục hàm update + render
	var loop = function(){

		// kiểm tra trạng thái tạm dừng
		if (currentstate !== states.Pause) {
			update();
			render();
		}
		window.requestAnimationFrame(loop,canvas);
	}
	window.requestAnimationFrame(loop,canvas);
}

function update(){
	frames++;
	if (currentstate !== states.Score) {
		//mặt đất di chuyển từ phải sang trái 2
		fgPos = (fgPos - spd) % 28;
	}else {
		// điểm cao nhất ,lưu vào localStorage
		best = Math.max(best, score);
		if((typeof(localStorage) !== "undefined")) {
    		window.localStorage.setItem("best", best);
		}
	}

	if (currentstate === states.Game) {
		pipes.update();
		items.update();
	}
	bird.update();
}

//vẽ
function render(){
	//khung
	ctx.fillRect(0, 0, WIDTH, HEIGHT);

	//hình nền
	_bg.draw(ctx, 0, HEIGHT - _bg.height - 30, 1);
	_bg.draw(ctx, _bg.width, HEIGHT - _bg.height - 30, 1);

	//ống nước
	pipes.draw(ctx);

	//item
	items.draw(ctx);

	//chim
	bird.draw(ctx);

	//mặt đất
	_fg.draw(ctx, fgPos, HEIGHT - _fg.height, 1);
	_fg.draw(ctx, fgPos + _fg.width, HEIGHT - _fg.height, 1);

	if (currentstate === states.Splash) {
		// hình + chữ GetReady
		_splash.draw(ctx, WIDTH/2 - _splash.width/2, HEIGHT - 300, 1);
		_text.GetReady.draw(ctx, WIDTH/2 - _text.GetReady.width/2, HEIGHT - 380, 1);
		//text
		ctx.font="14px Verdana";
		ctx.fillText("press Space to jump, P to pause/play", 30, HEIGHT - 20);
	}

	if (currentstate === states.Score) {
		// vẽ chữ gameover và bảng score
		_text.GameOver.draw(ctx, WIDTH/2 - _text.GameOver.width/2, HEIGHT - 400, 1);
		_score.draw(ctx, WIDTH/2 - _score.width/2, HEIGHT - 340, 1);

		//huy chương khi đạt điểm
		if (score < 20) {
			_medal.none.draw(ctx, WIDTH/2 - _medal.none.width/2 - 63, HEIGHT - 297, 1);
		}else{
			if (score < 50) {
				_medal.coper.draw(ctx, WIDTH/2 - _medal.coper.width/2 - 63, HEIGHT - 297, 1);
			}else{
				if(score < 100){
					_medal.silver.draw(ctx, WIDTH/2 - _medal.silver.width/2 - 63, HEIGHT - 297, 1);
				}else{
					_medal.gold.draw(ctx, WIDTH/2 - _medal.gold.width/2 - 63, HEIGHT - 297, 1);
				}
			}
		}
		//vẽ nut Ok
		_buttons.Ok.draw(ctx, btnOK.x, btnOK.y, 1);

		// điểm và điểm cao nhất
		_numberB.draw(ctx, WIDTH/2 - 47, HEIGHT - 304, score, null);
		_numberB.draw(ctx, WIDTH/2 - 47, HEIGHT - 262, best, null);

	}else {
		// vẽ điểm số phía trên
		_numberS.draw(ctx, null, 20, score, WIDTH/2);
		// nút pause
		_buttons.Pause.draw(ctx, btnPause.x, btnPause.y, 1);

	}
}