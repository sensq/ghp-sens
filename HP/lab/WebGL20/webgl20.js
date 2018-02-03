document.write('<script type="text/javascript" src="./myTemplate.js"></script>');

// グローバル変数

//カメラの設定
function originalCamera() {
	camera = new THREE.PerspectiveCamera(45 , Width / Height , 1 , 10000);
	camera.position = new THREE.Vector3(0, 0, 30);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls(camera , renderer.domElement);
	controls.noPan = true;
}

/*
** ☆オブジェクトの設定
** 基本的にここをメインに書き換えていく
*/
function initObject() {
	// 平面
	plane = new myObj.segmentPlane(10, 10);
	scene.add(plane.mesh)
	plane.mesh.position.x = -20;
	plane.mesh.rotation.x = -Math.PI/180*60;
	plane.mesh.rotation.y = Math.PI/180*30;
	for(j=0; j<10; j++){
		for(i=0; i<10; i++){
			if(i%2 == j%2)
				plane.change(i, j, 0x0033bb);
			else
				plane.change(i, j, 0xffff00);
		}
	}

	// キューブ
	cube = new myObj.segmentCube(6, 6, 6, 5, 5, 5);
	scene.add(cube.mesh)
	cube.mesh.rotation.x = Math.PI/180*30;
	cube.mesh.rotation.y = -Math.PI/180*30;

	for(k=0; k<6; k++){
		for(j=0; j<5; j++){
			for(i=0; i<5; i++){
				if(i%2 == j%2)
					cube.change(k, i, j, 0x990000);
				else
					cube.change(k, i, j, 0x009999);
			}
		}
	}

	// スフィア
	sphere = new segmentSphere(5, 30, 30, 0x9900cc);
	scene.add(sphere.mesh)
	sphere.mesh.position.x = 20;
	for(j=0; j<30; j++){
		for(i=0; i<30; i++){
			var rcolor = 0x666666 + 0x999999*Math.random();
			if(i%2 == j%2)	
				sphere.change(i, j, 0x000000);
			else
				sphere.change(i, j, rcolor);
		}
	}

	sky = new myObj.skyboxSphere();
	scene.add(sky)
	dat_gui();
};

/*
** dat.guiの作成
*/
function dat_gui(){
	// テキストボックスから取得
	var color = document.getElementById('clickColor').value;
	color = color.replace("0x", "#");
	var parameters = {color: color};
	var gui = new dat.GUI();
	var clickColor = gui.addColor(parameters, 'color').name("パレット").listen();
	clickColor.onChange(function(value){
		color = value.replace("#", "0x");
		// 一旦テキストボックスに保存
		document.getElementById('clickColor').value = color;
	});
	gui.open();
	// 重複しないようにするための処理
	// 値はhtmlの構成によって書き換える
	if(FULLSCREEN){
		// dat.guiが既に存在していたら削除（フルスクリーン化時）
		var element = document.body;
	 	if(element.childNodes.length == 17){	// ローカルだと5, ネットだと17？
	 		element.removeChild(element.childNodes[16]);
	 	};
		// 通常時のdat.guiを消去
		var element = document.getElementById('datgui');
	 	if(element.childNodes.length == 1){
	 		element.removeChild(element.firstChild);
	 	};
	 	// フルスクリーン時のdat.guiの位置調整
		gui.domElement.style.position = 'absolute';
		gui.domElement.style.right = '0px';
		gui.domElement.style.top = '5px';
		gui.domElement.style.height = '140px';
		document.body.appendChild(gui.domElement);
	}else{
		// dat.guiが既に存在していたら削除（ボタンクリック時）
		var element = document.getElementById('datgui');
	 	if(element.childNodes.length == 1){
	 		element.removeChild(element.firstChild);
	 	};
	 	// 最大化時のdat.guiを消去
		var element = document.body;
	 	if(element.childNodes.length == 17){	// ローカルだと5, ネットだと17？
	 		element.removeChild(element.childNodes[16]);
	 	};
		// 通常時のdat.guiの位置調整
		// gui.domElement.style.position = 'relative';
		// gui.domElement.style.height = '140px';
		document.getElementById('datgui').appendChild(gui.domElement);
	};
};

/*
** ☆レンダリング
** アニメーションはここに書く
*/
function render() {
	requestAnimationFrame(render);
	controls.update();	//マウス操作用
	stats.update();

	// 光源
	omega = 1.5;
	radius = 50;
	Hemilight.position = new THREE.Vector3(
		30+radius * Math.sin(omega * 0.5 * Math.PI / 180),
		10,
		radius * Math.cos(omega * 0.5 * Math.PI / 180)
		);
	light.position = Hemilight.position;

	renderer.render(scene, camera);
};

/*
** ☆最初に一度だけ実行する関数
*/
function threeStart() {
	initThree();	// レンダラーを作成
	viewFPS();		// FPSの表示
	originalCamera();	// カメラ初期化
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
	this.meshSelect = function(number){
		var mesh;
		switch(number) {
			case 0:
				mesh = plane.mesh;
			break;
			case 1:
				mesh = cube.mesh;
			break;
			case 2:
				mesh = sphere.mesh;
			break;
		}
		return mesh;
	}
	this.cameraTarget = function(mesh){
		this.mesh = meshSelect(document.getElementById('cameraTarget').selectedIndex);
		controls.target = this.mesh.position;
	}
	this.black = function(){
		this.mesh = meshSelect(document.getElementById('black').selectedIndex);
		for(var i=0; i<mesh.geometry.faces.length; i++){
			this.mesh.geometry.faces[i].color.setHex(0x000000);
		}
		this.mesh.geometry.colorsNeedUpdate = true;
	}
	this.random = function(){
		this.mesh = meshSelect(document.getElementById('random').selectedIndex);
		if(!document.getElementById('tri').checked){
			for(var i=0; i<mesh.geometry.faces.length-1; i+=2){
				var rcolor = Math.random()*0xffffff;
				this.mesh.geometry.faces[i].color.setHex(rcolor);
				this.mesh.geometry.faces[i+1].color.setHex(rcolor);
			}
		}else{
			for(var i=0; i<mesh.geometry.faces.length; i++){
				var rcolor = Math.random()*0xffffff;
				this.mesh.geometry.faces[i].color.setHex(rcolor);
			}
		}
		this.mesh.geometry.colorsNeedUpdate = true;
	}
	return this;
})();

//===========================
// ここからはその他のイベントに関する記述
//===========================

/*
** 画像を読み込む関数
*/
function loadImage(){
	if (document.getElementById('loadImg').files[0].type.match('image.*')) {
		var img = document.getElementById('loadImg').files[0];
		var fr = new FileReader();
		// 読み込み終了を待つ
		fr.onload = function onFileLoad(e) {
			imgURL = e.target.result;
		}
		fr.readAsDataURL(img);
	}else{
		alert("画像ファイルを指定して下さい");
	}
}

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
	var color = document.getElementById('clickColor').value;

	// 左クリックで色を変える
	if(e.button == 0 && e.target.tagName === "CANVAS"){
		if(intersects[0].object != sky){
			var face = intersects[0].faceIndex;
			if(face%2){
				intersects[0].object.geometry.faces[face].color.setHex(color);
				intersects[0].object.geometry.faces[face-1].color.setHex(color);
			}else{
				intersects[0].object.geometry.faces[face].color.setHex(color);
				intersects[0].object.geometry.faces[face+1].color.setHex(color);
			}
			intersects[0].object.geometry.colorsNeedUpdate = true;
		}
	}
	// 右クリックでカメラ
	if(e.button == 2 && e.target.tagName === "CANVAS"){
		if(intersects[0].object != sky){
			controls.target = intersects[0].object.position;
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
			break;	

			case 38:	// up
			break;

			case 39:	// right
			break;

			case 40:	// down
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
		};
	};
};

/*
** テキスト欄などのデフォルト値代入
*/
window.addEventListener('load', function() {
	document.getElementById('clickColor').value = "0xff0000";
}, false);