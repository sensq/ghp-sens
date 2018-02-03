document.write('<script type="text/javascript" src="./Tween.js"></script>');

/*
** アニメーション開始メソッド
*/
function animate() {
	requestAnimationFrame(animate);
	TWEEN.update();
}

/*
** 10秒タイマー
*/
var timer = function(){
	function init() {
		var target = document.getElementById('timer');
		var tween = new TWEEN.Tween({now: 0})
			.to({now: 10000}, 10000)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function () {
				target.value = (this.now/1000).toFixed(3);
			})
			.start();
	}
	init();
	animate();
}

/*
** 線が伸びる
*/
var bar = function(){
	function init() {
		var target = document.getElementById('bar');
		var duration = document.getElementById('barDuration').value;
		var width = {x: 50};
		var tween = new TWEEN.Tween(width)
			.to({x: 1000}, duration/2.0)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function () {
				target.style.width = width.x + 'px';
			})
			.start();
	}
	init();
	animate();
}

/*
** 回転して移動
*/
var square = function(){
	function init() {
		var target = document.getElementById('square');
		var duration = document.getElementById('squareDuration').value;
		var position = {x: 0, rotation: 0};
		var tween = new TWEEN.Tween(position)
			.to({x: 500, rotation: 360}, duration/2.0)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function () {
				target.style.left = position.x + 'px';
				target.style.webkitTransform = 'rotate(' + Math.floor(position.rotation) + 'deg)';
				target.style.MozTransform = 'rotate(' + Math.floor(position.rotation) + 'deg)';
			})
			.onComplete(function(){
				target.style.left = 0;
				target.style.top = 0;
			})
			.start();
		var tweenBack = new TWEEN.Tween(position)
			.to({x: 0, rotation: 0}, duration/2.0)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function () {
				target.style.left = position.x + 'px';
				target.style.webkitTransform = 'rotate(' + Math.floor(position.rotation) + 'deg)';
				target.style.MozTransform = 'rotate(' + Math.floor(position.rotation) + 'deg)';
			});
		tween.chain(tweenBack);
	}
	init();
	animate();
}

/*
** 中身がある場合もまったく同様の書き方で動かせる
*/
var str = function(){
	function init() {
		var target = document.getElementById('str');
		var duration = document.getElementById('strDuration').value;
		var position = {x: 0, rotation: 0};
		var tween = new TWEEN.Tween(position)
			.to({x: 500, rotation: 360}, duration/2.0)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function () {
				target.style.left = position.x + 'px';
				target.style.webkitTransform = 'rotate(' + Math.floor(position.rotation) + 'deg)';
				target.style.MozTransform = 'rotate(' + Math.floor(position.rotation) + 'deg)';
			})
			.onComplete(function(){
				target.style.left = 0;
				target.style.top = 0;
			})
			.start();
		var tweenBack = new TWEEN.Tween(position)
			.to({x: 0, rotation: 0}, duration/2.0)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function () {
				target.style.left = position.x + 'px';
				target.style.webkitTransform = 'rotate(' + Math.floor(position.rotation) + 'deg)';
				target.style.MozTransform = 'rotate(' + Math.floor(position.rotation) + 'deg)';
			});
		tween.chain(tweenBack);
	}
	init();
	animate();
}

/*
** 透過度を変えるとフェードイン/アウトが行える
*/
var translate = function(){
	function init() {
		var target = document.getElementById('translate');
		var duration = document.getElementById('translateDuration').value;
		var opacity = {value: 1};
		var tween = new TWEEN.Tween(opacity)
			.to({value: 0}, duration)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function () {
				target.style.filter = 'alpha(opacity=' + parseInt(opacity.value) + ')';
				target.style.MozOpacity = opacity.value;
				target.style.opacity = opacity.value; 
			})
			.start();
		var tweenBack = new TWEEN.Tween(opacity)
			.delay(1000)
			.to({value: 1, rotation: 0}, duration)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function () {
				target.style.filter = 'alpha(opacity=' + parseInt(opacity.value) + ')';
				target.style.MozOpacity = opacity.value;
				target.style.opacity = opacity.value; 
			});
		tween.chain(tweenBack);
	}
	init();
	animate();
}

/*
** グラデーション
*/
var gradation = function(){
	var color = {r:255, g: 0, b:0, h:0, s:255, v:255};
	function init() {
		var target = document.getElementById('gradation');
		var duration = document.getElementById('gradationDuration').value;
		var bgcolor = "";
		var init = new TWEEN.Tween(color)
			.to({h: 360}, duration)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function () {
				color.h = parseInt(color.h);
				HSV2RGB();
				bgcolor = "rgb(" + color.r + ", " + color.g + "," + color.b + ")";
				target.style.backgroundColor = bgcolor;
			})
			.start();
	}

	// HSV→RGB変換
	var HSV2RGB = function(){
		var hi, f, p, q, t;
		hi = Math.floor(color.h / 60.0) % 6;
		f  = (color.h / 60.0) - Math.floor(color.h / 60.0);
		p  = Math.round(color.v * (1.0 - (color.s / 255.0)));
		q  = Math.round(color.v * (1.0 - (color.s / 255.0) * f));
		t  = Math.round(color.v * (1.0 - (color.s / 255.0) * (1.0 - f)));
		
		switch(hi){
			case 0:
				color.r = parseInt(color.v);
				color.g = parseInt(t);
				color.b = parseInt(p);
				break;
			case 1:
				color.r = parseInt(q);
				color.g = parseInt(color.v);
				color.b = parseInt(p);
				break;
			case 2:
				color.r = parseInt(p);
				color.g = parseInt(color.v);
				color.b = parseInt(t);
				break;
			case 3:
				color.r = parseInt(p);
				color.g = parseInt(q);
				color.b = parseInt(color.v);
				break;
			case 4:
				color.r = parseInt(t);
				color.g = parseInt(p);
				color.b = parseInt(color.v);
				break;
			case 5:
				color.r = parseInt(color.v);
				color.g = parseInt(p);
				color.b = parseInt(q);
				break;
			default:
				alert("error");
		}
	}
	init();
	animate();
}

/*
** プログレスバー風
*/
var progress = function(){
	function init() {
		var target = document.getElementById('progress');
		var width = {x: 0};
		var value = "";
		var tween = new TWEEN.Tween(width)
			.delay(500)
			.to({x: 100}, 5000)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function () {
				target.style.width = width.x + '%';
				value = parseInt(width.x) + "%";
				document.getElementById('progress').innerHTML = value;
			})
			.onComplete(function(){
				document.getElementById('progress').innerHTML = "終了!!"
			})
			.start();
	}
	init();
	animate();
}
/*
** スライド風
*/
var SlideNumber = 1;
var zIndex = 1;
var slide = function(){
	function init() {
		var targetSlide = "slide" + SlideNumber;
		var target = document.getElementById(targetSlide);
		target.style.zIndex = zIndex;
		var duration = 1000;
		var position = {x: 150};
		SlideNumber++;
		zIndex++;
		var tween = new TWEEN.Tween(position)
			.to({x: 0}, duration)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function () {
				target.style.left = position.x + 'px';
			})
			.onComplete(function(){
				if(SlideNumber == 5){
					SlideNumber = 0;
				}
			})
			.start();
	}
	init();
	animate();
}

/*
** 任意の要素のオフセットを取得する関数 （描画領域のオフセット位置取得用）
** マウス座標を正しく取得するために必要
*/
function getElementPosition(element) {
	var html = document.documentElement;
    var body = document.body;
	var top = left = scrollLeft = scrollTop = 0;
	do {
		top  += element.offsetTop  || 0;
		left += element.offsetLeft || 0;
		scrollLeft = body.scrollLeft || html.scrollLeft;
		scrollTop = body.scrollTop || html.scrollTop;
		element =  element.offsetParent;
	}
	while (element);
	return {top: top, left: left, scrollLeft: scrollLeft, scrollTop: scrollTop};
};

/*
** マウスクリック移動時のイベント
*/
var moveX = moveY = 0;
document.addEventListener('click', function(e) {
	// 座標を取得＆オフセット補正
	var mouseX = e.clientX - getElementPosition(mouse).left + getElementPosition(mouse).scrollLeft;
	var mouseY = e.clientY - getElementPosition(mouse).top + getElementPosition(mouse).scrollTop;

	/* ここからイベント実装 */
	function init() {
		var target = document.getElementById('mouseObj');
		var position = {x: moveX, y:moveY, rotation: 0};
		var init = new TWEEN.Tween(position)
			.to({x: mouseX, y:mouseY, rotation:360}, 500)
			.easing(TWEEN.Easing.Back.InOut)
			.onUpdate(function () {
				target.style.left = position.x + 'px';
				target.style.top = position.y + 'px';
				target.style.webkitTransform = 'rotate(' + Math.floor(position.rotation) + 'deg)';
				target.style.MozTransform = 'rotate(' + Math.floor(position.rotation) + 'deg)';
				moveX = position.x;
				moveY = position.y;
			})
			.start();
	}
	if(mouseX >= 0 && mouseY >=0 && mouseY < 100){
		init();
		animate();
	}
}, false);

window.addEventListener('load', function (){
}, false);
