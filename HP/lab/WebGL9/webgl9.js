var renderer;
var camera, controls;
var scene;
var light, ambient;
var geometry, material, mesh;
var baseTime = +new Date();

//�`��̈�̐ݒ�
function initThree() {
	Width = document.getElementById('canvas').clientWidth; //div�v�f�̃T�C�Y���擾
	Height = document.getElementById('canvas').clientHeight; //div�v�f�̃T�C�Y���擾 
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(Width, Height);
	document.getElementById('canvas').appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);
}

//�J�����̐ݒ�
function initCamera() {
	camera = new THREE.PerspectiveCamera(45, Width / Height, 1, 10000);
	camera.position = new THREE.Vector3(0, 0, 100);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls(camera, left);
}

//��ʏ�����
function initScene() {
	scene = new THREE.Scene();
}

//�����̐ݒ�
function initLight() {
	light = new THREE.DirectionalLight(0xaaaaaa);
	light.position = new THREE.Vector3(20, 0, 40);
	scene.add(light);
	
	Hemilight = new THREE.HemisphereLight(0x555555,0x222222);
	Hemilight.position = new THREE.Vector3(20, 0, 40);
	scene.add(Hemilight);
	
	ambient = new THREE.AmbientLight(0x888888);
	scene.add(ambient);
}

function mkctx(str, size, height){
	var textGeo = new THREE.Geometry();
	var textMesh = new THREE.Mesh(
      new THREE.TextGeometry(str, {
        size: size, height:height, curveSegments: 20, font: 'helvetiker'
      })
    );
    THREE.GeometryUtils.merge( textGeo, textMesh );
    
    material = new THREE.MeshPhongMaterial({
		color: 0x0099ff,
		ambient: 0x888888,
		specular: 0xcccccc,
		shininess: 90,
		side: 2,
		metal: true
	});
    var mesh = new THREE.Mesh(textGeo, material);
    mesh.position = new THREE.Vector3(-40, 0, 0);
    scene.add( mesh );
}

//�����_�����O
function render() {
	requestAnimationFrame(render);
	controls.update(); //�}�E�X����p
	//mesh.rotation.y = 0.3 * (+new Date() - baseTime) / 1000; //��]
	renderer.render(scene, camera);
}

//���s����֐�
function threeStart() {
	initThree();
	initCamera();
	initScene();
	initLight();
	mkctx('THREE.js', 15, 10);
	renderer.clear();
	render();
}

function Button_ctx() {
	initScene();
	initLight();
	str = document.getElementById("CTX").value;
	size = document.getElementById("size").value;
	height = document.getElementById("height").value;
	mkctx(str, size, height);
}

//�E�B���h�E�̃��T�C�Y�ɑΉ�
window.addEventListener('resize', function() {
	newWidth = document.getElementById('canvas').clientWidth;
	newHeight = document.getElementById('canvas').clientHeight;
	renderer.setSize(newWidth, newHeight);
	camera.aspect = newWidth / newHeight;
	camera.updateProjectionMatrix();
}, false);

//�t�H�[�J�X�����킹��
window.addEventListener('load', function (){
	var element = document.getElementById("CTX"); 
	element.focus();
	
	document.getElementById("CTX").value = "THREE.js";
	document.getElementById("size").value = 15;
	document.getElementById("height").value = 10;
}, false);
