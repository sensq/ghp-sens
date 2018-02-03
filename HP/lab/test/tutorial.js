//変数（省略可）
var Width,Height;
var renderer;
var camera;
var scene;
var light,ambient;
var geometry,material,mesh;

//描画領域の設定
function Init() {
	Width = 400;	//横幅
	Height = 400;	//縦幅
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(Width, Height);
	document.body.appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);	//背景色
}

//カメラの設定
function Camera() {
	camera = new THREE.PerspectiveCamera( 45 , Width / Height , 1 , 10000 );	//画角、アス比、表示する手前の限界値、奥の最大値
	camera.position = new THREE.Vector3(100, 20, 50);	//視点の位置
	camera.lookAt(new THREE.Vector3(0, 0, 0));	//見る方向
}

//画面初期化
function Scene() {   
	scene = new THREE.Scene();
}

//光源の設定
function Light() {
	light = new THREE.DirectionalLight(0xcccccc);	//平行光源
	light.position = new THREE.Vector3(0.577, 0.577, 0);	//光源の位置
	scene.add(light);

	ambient = new THREE.AmbientLight(0x333333);	//環境光
	scene.add(ambient);
}

//オブジェクトの設定
function Object() {
	geometry = new THREE.TorusGeometry(30, 10, 20, 40);	//トーラス
	material = new THREE.MeshPhongMaterial({			//------
		color: 0xff9900, ambient: 0x888888,				//材質
		specular: 0xcccccc, shininess:90, metal:true});	//------
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}

//実行する関数
function three() {
	Init();
	Camera();
	Scene();
	Light();
	Object();
	renderer.clear();
	renderer.render(scene, camera);
}
