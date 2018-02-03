document.write('<script type="text/javascript" src="./myTemplate.js" charset="utf-8"></script>');

var composer;
var texture;
var sprite;
var infoImg = {width:1, height:2};

/*
** ☆オブジェクトの設定
** 基本的にここをメインに書き換えていく
*/
function initObject() {
	// スカイボックスと床
	var sky = new myObj.skyboxCube();
	// scene.add(sky);

	var amb = 0xffffff;
	var ambient = new THREE.AmbientLight(amb);
	scene.add(ambient);

	texture = setTexture("miku.jpg");
	var geometry = new THREE.PlaneGeometry(10, 10, 1, 1);
	var material = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		ambient: 0xffffff,
		specular: 0xffffff,
		emissive: 0x000000,
		shininess: 90,
		metal: true,
		side: 2,
		map: texture,
	});
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	var materialS = new THREE.SpriteMaterial({map: texture, color: 0xFFFFFF});
	sprite = new THREE.Sprite(materialS);
	var w = texture.image.width;
	var h = texture.image.height;

	document.getElementById("draw_area").style.width = w + "px";
	document.getElementById("draw_area").style.height = h + "px";
	renderer.setSize(w, h);
	camera2d.right = w;
	camera2d.bottom = h;
	camera2d.updateProjectionMatrix();

	sprite.material.map = texture;
	sprite.position.set(w*0.5, h*0.5, -9999);
	sprite.scale.set(w, -h, 1);
	scene.add(sprite);


	// ポストプロセスの設定
	composer = new THREE.EffectComposer(renderer);
	composer.addPass(new THREE.RenderPass(scene, camera));
	composer.addPass(new THREE.RenderPass(scene2d, camera2d));

	// オリジナルのポストプロセスを追加
	composer.addPass(new THREE.ShaderPass({
		vertexShader: document.getElementById('vshader').textContent,
		fragmentShader: document.getElementById('fshader').textContent,
		uniforms: { tDiffuse: { type:"t", value:null } },
	}));

	var toScreen = new THREE.ShaderPass(THREE.CopyShader);
	toScreen.renderToScreen = true;
	composer.addPass(toScreen);
};

/*
** ☆レンダリング
** アニメーションはここに書く
*/
function render() {
	var dt = requestAnimationFrame(render);
	stats.update();
	controls.update();	//マウス操作用
	controls2d.update();	//マウス操作用

	composer.render();

	keyControl();
	// renderer.render(scene, camera);
};

/*
** キーボード入力
*/
function keyControl(){
	function animate() {
		requestAnimationFrame(animate);
		TWEEN.update();
	}

	// 床を傾ける
	if (keyboard.pressed("left")){
	}
	if (keyboard.pressed("right")){
	}
}

/*
** ☆最初に一度だけ実行する関数
*/
function threeStart() {
	initThree();	// レンダラーを作成
	viewFPS();		// FPSの表示
	initCamera(0, 0, 1);	// カメラ初期化
	initScene();	// シーン初期化
	initObject();	// オブジェクト初期化
	renderer.clear();	// レンダラー初期化
	render();		// レンダリング
};

//========================
// ここからはボタンなどに関する記述
//========================

/*
** 個別にイベントを実行する関数を集めたクラス
*/
var updateObject = function (){};

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
}, false);

/*
** キーボード押下時のイベント
*/
document.onkeydown = function(e) { 
	// 押下したキーのキーコードを取得 
	var keycode = e.which;
	if(keycode >= 48 & keycode <= 90){
		// 48~90（0~9, a~z）の場合は文字に変換
		keycode = String.fromCharCode(keycode).toUpperCase();
	};
	switch(keycode){
		case "Z":
		changeScreen();
		break;

		case "R":
		camera.position = new THREE.Vector3(0, 0, 1);
		camera.up = new THREE.Vector3(0, 1, 0);
		break;
	};
};


// ドラッグ＆ドロップで読み込み
function onDropFile(e){
	e.preventDefault();
	var img = e.dataTransfer.files[0];
	// ファイル名と拡張子を別々に取得
	var name = img.name.match(/([^:\\\*?\"<>\|]+)\.+([^:\\\*?\"<>\|]+)$/);
	info = {name:name[1], type:name[2], size:img.size};
	if (img.type.match('image.*')) {
		var fr = new FileReader();
		// 読み込み終了を待つ
		fr.onload = function onFileLoad(e) {
			tmpImg = new Image();
			tmpImg.src = e.target.result;
			tmpImg.onload = function() {
				texture = setTexture(e.target.result);
				var w = texture.image.width;
				var h = texture.image.height;
				var property = "NAME『" + img.name + 
					"』, SIZE『" + img.size + "byte (" + (img.size/1024).toFixed(0) + "KB)』　" + 
					w + "x" + h;
				document.getElementById('list').innerHTML = property;

				if($("#3D:checked").val()){
					camera.position = new THREE.Vector3(0, 0, 10);
					mesh.material.map = texture;
					if(w > h){
						mesh.scale.x = 1;
						mesh.scale.y = h/w;
					}else{
						mesh.scale.x = w/h;
						mesh.scale.y = 1;
					}
				}
				if($("#2D:checked").val()){
					document.getElementById("draw_area").style.width = w + "px";
					document.getElementById("draw_area").style.height = h + "px";
					renderer.setSize(w, h);
					camera2d.right = w;
					camera2d.bottom = h;
					camera2d.updateProjectionMatrix();

					sprite.material.map = texture;
					sprite.position.set(w*0.5, h*0.5, -9999);
					sprite.scale.set(w, -h, 1);
					scene.add(sprite);
				}
			}
		}
		fr.readAsDataURL(img);
	}else{
		alert("画像ファイルを指定して下さい");
	}
}

function resize(w, h){
}

 // デフォルト処理をキャンセル
function　onCancel(e){
	if(e.preventDefault){
		e.preventDefault();
	}
	return false;
};

/*
** テキスト欄などのデフォルト値代入
*/
window.addEventListener('load', function() {
	// ドラッグ＆ドロップに対応
	document.getElementById("center").addEventListener("dragover", onCancel, false);
	document.getElementById("center").addEventListener("dragenter", onCancel, false);
	document.getElementById("center").addEventListener("drop", onDropFile, false);
}, false);