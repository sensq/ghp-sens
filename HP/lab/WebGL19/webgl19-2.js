document.write('<script type="text/javascript" src="myTemplate.js"></script>');

// グローバル変数
var LENGTH;	// 正方形の一辺の長さ
var NUM;	// 粒子数の密度係数
var NUM_PARTICLES;	// 粒子数
var DENSITY; 	// 密度
var imgFlag = false;

/*
** ☆オブジェクトの設定
** 基本的にここをメインに書き換えていく
*/
function initObject() {
	texFloor = setTexture('mountain.jpg');
	LENGTH = 50;	// 正方形の一辺の長さ
	NUM = 0.8;	// 粒子数の密度係数
	NUM_PARTICLES = NUM*Math.pow((2 * LENGTH), 2);	// 粒子数
	DENSITY = Math.round(Math.sqrt(NUM_PARTICLES)); 	// 密度
	if(DENSITY%2 == 0){
		DENSITY = DENSITY + 1;
	}
	var height = document.getElementById('height').value;
	var bottom = -document.getElementById('bottom').value;
	// 波面
	// パーティクルのマテリアルを作成
	var mat_wave = new THREE.ParticleBasicMaterial({
		DENSITY: 1.5,
		transparent: true,
		map: setCtxTexture('●', 0xffffff, 200, null, null, 1),
		color: 0xffffff,
		vertexColors: true,
		blending: THREE.AdditiveAlphaBlending,
		depthTest: false,
	});

	// パーティクルのジオメトリ初期値を作成
	var geo_wave = new THREE.Geometry();
	var area, x, y, z;
	for(var i = 0 ; i < DENSITY ; i++) {
		for(var j = 0 ; j < DENSITY ; j++) {
			x = -LENGTH + 1.0/Math.sqrt(NUM)*j;
			z = -LENGTH + 1.0/Math.sqrt(NUM)*i;
			area = new THREE.Vector3(
				x,
				40 * Math.exp(-0.05*(x*x + z*z)),
				z
			);
			geo_wave.vertices.push(area);
			var color = new THREE.Color(0xffffff);
			color.setRGB(0, 0.2, 0.9);
			geo_wave.colors.push(color);
		};
	};

	// パーティクルを作成
	mesh_wave = new THREE.ParticleSystem(geo_wave, mat_wave);
	mesh_wave.sortParticles = false;
	mesh_wave.position = new THREE.Vector3(0, 0, -30);
	scene.add(mesh_wave);

	// マウスの衝突判定用のダミー
	var geo_dummy = new THREE.PlaneGeometry(2*LENGTH, 2*LENGTH, DENSITY-1, DENSITY-1);
	var mat_dummy = new THREE.MeshPhongMaterial({
		color: 0x999999,
		ambient: 0x333333,
		specular: 0x888888,
		transparent: true,
		opacity: 0.0,
		side: 2,
	});
	mesh_dummy = new THREE.Mesh(geo_dummy, mat_dummy);
	mesh_dummy.rotation.x = -(Math.PI/2.0);
	mesh_dummy.position = new THREE.Vector3(0, 0, -30);
	scene.add(mesh_dummy);

	// 床を作成
	if(!document.getElementById('removeFloor').checked){
		var geoFloor = new THREE.PlaneGeometry(300, 300);
		var matFloor = new THREE.MeshPhongMaterial({
			color: 0x0011cc,
			ambient: 0x999999,
			specular: 0x888888,
			map: texFloor,
			side: 0,
		});
		meshFloor = new THREE.Mesh(geoFloor, matFloor);
		meshFloor.rotation.x = -(Math.PI/2.0);
		meshFloor.position = new THREE.Vector3(0, -10, 0);
		meshFloor.castShadow = true;
		meshFloor.receiveShadow = true;
		scene.add(meshFloor);
	}else{
		mesh_wave.material.opacity = 0.7;
	}
};

/*
** ☆レンダリング
** アニメーションはここに書く
*/
function render() {
	var dt = requestAnimationFrame(render);
	controls.update(); // マウス操作用
	stats.update();

	if(!document.getElementById('stop').checked){
		updateObject.wave();
	}
	// 回転用変数
	var omega;	// 角速度[deg/frm]
	var radius;	// 半径

	// 光源
	omega = 1.5;
	radius = 50;
	Hemilight.position = new THREE.Vector3(
		radius * Math.sin(omega * 0.5 * Math.PI / 180),
		10,
		radius * Math.cos(omega * 0.5 * Math.PI / 180)
		);
	light.position = Hemilight.position;
	
	// 最終的な描画
	renderer.render(scene, camera);
};

/*
** ☆最初に一度だけ実行する関数
*/
function threeStart() {
	initThree();	// レンダラーを作成
	viewFPS();		// FPSの表示
	initCamera(0, 27, 20);	// カメラ初期化
	initScene();	// シーン初期化
	initLight();	// ライト初期化
	initObject();	// オブジェクト初期化
	renderer.clear();	// レンダラー初期化
	render();		// レンダリング
};

//========================
// ここからはボタンなどに関する記述
//========================

/*
** 個別にイベントを実行する関数を集めたクラス
** ボタン類でのイベントはできるだけこっちで書く
*/
var updateObject = (function (){
	var tempDensity;
	var initWave = true;
	var vel = [];
	// 計算開始
	this.wave = function(){
		// 初期化
		if(initWave){
			initWave = false;
			for(y=0; y<DENSITY; y++){
				for(x=0; x<DENSITY; x++){
					vel[DENSITY*y + x] = 0;
				}
			}
		}
		// 加速度
		var acceleration;
		// 位置
		var U = mesh_wave.geometry.vertices;
		// 位相速度
		var phase_velocity = document.getElementById('phase').value;
		// 減衰率
		var dump = document.getElementById('dump').value;
		
		// 波動方程式の計算
		// xとyの最初と最後を含めないことで固定端条件にする
		for(y=1; y<DENSITY - 1; y++){
			for(x=1; x<DENSITY - 1; x++){
				acceleration = U[DENSITY*y + x - 1].y
					+ U[DENSITY*y + x + 1].y
					+ U[DENSITY*(y-1) + x].y
					+ U[DENSITY*(y+1) + x].y
					- U[DENSITY*y + x].y * 4;
				acceleration = acceleration * phase_velocity;
				vel[DENSITY*y + x] = (vel[DENSITY*y + x] + acceleration) * dump;
			}
		}
		for(y=1; y<DENSITY - 1; y++){
			for(x=1; x<DENSITY - 1; x++){
				U[DENSITY*y + x].y += vel[DENSITY*y + x];
				// 固定端条件
				U[DENSITY*y + 0].y = 0;
				U[DENSITY*y + (DENSITY-1)].y = 0;
				U[DENSITY*0 + x].y = 0;
				U[DENSITY*(DENSITY-1) + x].y = 0;
			}
		}
		// 赤い十字
		var center = (DENSITY-1)/2;
		for(y=0; y<DENSITY; y++){
			for(x=0; x<DENSITY; x++){
				mesh_wave.geometry.colors[DENSITY*y + center].setHex(0xff0000);
				mesh_wave.geometry.colors[DENSITY*center + x].setHex(0xff0000);
			}
		}
		mesh_wave.geometry.verticesNeedUpdate = true;
	};
	// サイズ変更
	this.change = function(){		
		initWave = true;
		LENGTH = document.getElementById('length').value;	// 正方形の一辺の長さ
		NUM = document.getElementById('division').value;	// 粒子数の密度係数
		NUM_PARTICLES = NUM*Math.pow((2 * LENGTH), 2);	// 粒子数
		DENSITY = Math.round(Math.sqrt(NUM_PARTICLES)); 	// 密度
		mesh_wave.geometry.verticesNeedUpdate = true;
	};
	// ガウシアン
	this.gaussian = function(){
		var height = document.getElementById('height').value;
		var bottom = -document.getElementById('bottom').value;
		for(y=0; y<DENSITY; y++){
			for(x=0; x<DENSITY; x++){
				var xsize = -LENGTH + 1.0/Math.sqrt(NUM)*y;
				var zsize = -LENGTH + 1.0/Math.sqrt(NUM)*x;
				mesh_wave.geometry.vertices[DENSITY*y + x].y = height * Math.exp(bottom*(xsize*xsize + zsize*zsize));
			}
		}
		mesh_wave.geometry.verticesNeedUpdate = true;
	};
	// 逆ガウシアン
	this.gaussianInv = function(){
		var height = document.getElementById('height').value;
		var bottom = -document.getElementById('bottom').value;
		for(y=0; y<DENSITY; y++){
			for(x=0; x<DENSITY; x++){
				var xsize = -LENGTH + 1.0/Math.sqrt(NUM)*y;
				var zsize = -LENGTH + 1.0/Math.sqrt(NUM)*x;
				mesh_wave.geometry.vertices[DENSITY*y + x].y = -height * Math.exp(bottom*(xsize*xsize + zsize*zsize));
			}
		}
		mesh_wave.geometry.verticesNeedUpdate = true;
	};
	// 平面
	this.plane = function(){
		initWave = true;
		for(y=0; y<DENSITY; y++){
			for(x=0; x<DENSITY; x++){
				vel[DENSITY*y + x] = 0;
				mesh_wave.geometry.vertices[DENSITY*y + x].y = 0;
			}
		}
		tempDensity = Math.round(DENSITY/4);
		mesh_wave.geometry.verticesNeedUpdate = true;
	};
	// ランダム
	this.rand = function(){
		var height = document.getElementById('height').value/10;
		for(i=0; i<10; i++){
			var XRAND = Math.round((DENSITY-3)*Math.random() + 2);
			var YRAND = Math.round((DENSITY-3)*Math.random() + 2);
			mesh_wave.geometry.vertices[DENSITY*YRAND + XRAND].y += height;
		}
		mesh_wave.geometry.verticesNeedUpdate = true;
	};
	// 山と山（横）
	this.hpp = function(){
		this.plane();
		mesh_wave.geometry.vertices[DENSITY*tempDensity*2 + tempDensity*1].y = 20;
		mesh_wave.geometry.vertices[DENSITY*tempDensity*2 + tempDensity*3].y = 20;
		mesh_wave.geometry.verticesNeedUpdate = true;
	};
	// 山と谷（横）
	this.hpm = function(){
		this.plane();
		mesh_wave.geometry.vertices[DENSITY*tempDensity*2 + tempDensity*1].y = 20;
		mesh_wave.geometry.vertices[DENSITY*tempDensity*2 + tempDensity*3].y = -20;
		mesh_wave.geometry.verticesNeedUpdate = true;
	};
	// 山と山（縦）
	this.vpp = function(){
		this.plane();
		mesh_wave.geometry.vertices[DENSITY*tempDensity*1 + tempDensity*2].y = 20;
		mesh_wave.geometry.vertices[DENSITY*tempDensity*3 + tempDensity*2].y = 20;
		mesh_wave.geometry.verticesNeedUpdate = true;
	};
	// 山と谷（縦）
	this.vpm = function(){
		this.plane();
		mesh_wave.geometry.vertices[DENSITY*tempDensity*1 + tempDensity*2].y = 20;
		mesh_wave.geometry.vertices[DENSITY*tempDensity*3 + tempDensity*2].y = -20;
		mesh_wave.geometry.verticesNeedUpdate = true;
	};
	// 山（4点）
	this.pfour = function(){
		this.plane();
		mesh_wave.geometry.vertices[DENSITY*tempDensity*2 + tempDensity*1].y = 20;
		mesh_wave.geometry.vertices[DENSITY*tempDensity*2 + tempDensity*3].y = 20;
		mesh_wave.geometry.vertices[DENSITY*tempDensity*1 + tempDensity*2].y = 20;
		mesh_wave.geometry.vertices[DENSITY*tempDensity*3 + tempDensity*2].y = 20;
		mesh_wave.geometry.verticesNeedUpdate = true;
	};
	// 谷（4点）
	this.mfour = function(){
		this.plane();
		mesh_wave.geometry.vertices[DENSITY*tempDensity*2 + tempDensity*1].y = -20;
		mesh_wave.geometry.vertices[DENSITY*tempDensity*2 + tempDensity*3].y = -20;
		mesh_wave.geometry.vertices[DENSITY*tempDensity*1 + tempDensity*2].y = -20;
		mesh_wave.geometry.vertices[DENSITY*tempDensity*3 + tempDensity*2].y = -20;
		mesh_wave.geometry.verticesNeedUpdate = true;
	};
	// マウスムーブ
	this.mouse = function(){
		if(document.getElementById('mouseMove').checked){
			document.getElementById('dump').value = 0.75;
		}else{
			document.getElementById('dump').value = 0.97;
		}
	};
	this.removeFloor = function(){
		if(!document.getElementById('removeFloor').checked){
			scene.add(meshFloor);
			mesh_wave.material.opacity = 0.7;
		}else{
			scene.remove(meshFloor);
			mesh_wave.material.opacity = 0.9;
		}
	};
	return this;
})();

/*
** セレクトボックスのイベント
*/
function setInterference(s){
	switch(s.selectedIndex) {
		case 0:
			updateObject.hpp();
		break;
		case 1:
			updateObject.vpp();
		break;
		case 2:
			updateObject.hpm();
		break;
		case 3:
			updateObject.vpm();
		break;
		case 4:
			updateObject.pfour();
		break;
		case 5:
			updateObject.mfour();
		break;
	}
}

//===========================
// ここからはその他のイベントに関する記述
//===========================

/*
** マウス移動時のイベント
*/
document.addEventListener('mousemove', function(e) {
	// 座標を取得＆オフセット補正
	var mouseX = e.clientX - getElementPosition(renderer.domElement).left;
	var mouseY = e.clientY - getElementPosition(renderer.domElement).top;
	// 衝突したオブジェクトを取得
	var intersects = getIntersects(mouseX, mouseY);

	/* ここからイベント実装 */
	if(intersects[0].object == mesh_dummy){
		DRAW_AREA.style.cursor = 'pointer';
	}else{
		DRAW_AREA.style.cursor = 'default';
	};
	var height = document.getElementById('height').value/10;
	if(document.getElementById('mouseMove').checked){
		if(e.target.tagName === "CANVAS"){
			if(intersects[0].faceIndex > 0){
				var x = intersects[0].faceIndex % DENSITY;
				var y = (intersects[0].faceIndex - x)/DENSITY;
				mesh_wave.geometry.vertices[DENSITY*y + x+y].y -= height;
				mesh_wave.geometry.vertices[DENSITY*y + x-1+y].y += height/4;
				mesh_wave.geometry.vertices[DENSITY*y + x+1+y].y += height/4;
				mesh_wave.geometry.vertices[DENSITY*(y-1) + x+y].y += height/4;
				mesh_wave.geometry.vertices[DENSITY*(y+1) + x+y].y += height/4;
				mesh_wave.geometry.verticesNeedUpdate = true;
			}
		}
	}
}, false);

/*
** マウスクリック時のイベント（正確には離した時））
*/
document.addEventListener('click', function(e) {
	// 座標を取得＆オフセット補正
	var mouseX = e.clientX - getElementPosition(renderer.domElement).left;
	var mouseY = e.clientY - getElementPosition(renderer.domElement).top;
	// 衝突したオブジェクトを取得
	var intersects = getIntersects(mouseX, mouseY);

	/* ここからイベント実装 */
	
	var height = document.getElementById('height').value/10;
	if(e.target.tagName === "CANVAS"){
		if(intersects[0].faceIndex > 0){
			var x = intersects[0].faceIndex % DENSITY;
			var y = (intersects[0].faceIndex - x)/DENSITY;
			mesh_wave.geometry.vertices[DENSITY*y + x+y].y -= height;
			mesh_wave.geometry.vertices[DENSITY*y + x-1+y].y += height/4;
			mesh_wave.geometry.vertices[DENSITY*y + x+1+y].y += height/4;
			mesh_wave.geometry.vertices[DENSITY*(y-1) + x+y].y += height/4;
			mesh_wave.geometry.vertices[DENSITY*(y+1) + x+y].y += height/4;
			mesh_wave.geometry.verticesNeedUpdate = true;
		}
	}
}, false);

/*
** キーボード押下時のイベント
*/
document.onkeydown = function(e) { 
	var ctrl = typeof e.modifiers == 'undefined' ? e.ctrlKey : e.modifiers & Event.CONTROL_MASK;
	var shift = typeof e.modifiers == 'undefined' ? e.shiftKey : e.modifiers & Event.SHIFT_MASK;

	// 押下したキーのキーコードを取得 
	var keycode = e.which;
	if(keycode >= 48 & keycode <= 90){
		// 48~90（0~9, a~z）の場合は文字に変換
		keycode = String.fromCharCode(keycode).toUpperCase();
	};

	if(ctrl){	// ctrl押しながらの場合
		switch(keycode){
			case 37:	// left
			// カメラ回転停止
			cancelAnimationFrame(moveCamera);
			break;	

			case 38:	// up
			initCamera(0, 27, 20);
			break;

			case 39:	// right
			// カメラ回転
			(function mov(){
			moveCamera = requestAnimationFrame(mov);
			var omega = 1.0;
			var LENGTH = 30;
			controls.target = mesh_wave.position;
			camera.position = new THREE.Vector3(
				LENGTH * Math.sin(omega * 0.5 * moveCamera * Math.PI/180),
				30,
				LENGTH * Math.cos(omega * 0.5 * moveCamera * Math.PI/180)
				);
			})();
			break;

			case 40:	// down
			initCamera(0, 27, 20);
			controls.target = new THREE.Vector3(0, 0, -30);
			camera.position = new THREE.Vector3(0,54.81130581962728,-29.96711321650823);
			break;
		};
	}else if(shift){	// shift押しながらの場合
		switch(keycode){
			case 37:	// left
			break;	

			case 38:	// up
			break;

			case 39:	// right
			break;

			case 40:	// down
			break;
		};
	}else{
		switch(keycode){
			case 37:	// left
			break;	

			case 38:	// up
			break;

			case 39:	// right
			break;

			case 40:	// down
			break;

			case "Z":
			changeScreen();
			break;

			case "G":
			updateObject.gaussian();
			break;

			case "F":
			updateObject.gaussianInv();
			break;

			case "I":
			updateObject.plane();
			break;

			case "R":
			updateObject.rand();
			break;

			case "S":
			if(document.getElementById('stop').checked){
				document.getElementById('stop').checked = false;
			}else{
				document.getElementById('stop').checked = true;
			}
			break;
		};
	};
};

/*
** テキスト欄などのデフォルト値代入
*/
window.addEventListener('load', function() {
	document.getElementById('phase').value = 0.4;
	document.getElementById('dump').value = 0.97;
	document.getElementById('height').value = 40;
	document.getElementById('bottom').value = 0.2;
	document.getElementById('mouseMove').checked = false;
	document.getElementById('stop').checked = false;
}, false);