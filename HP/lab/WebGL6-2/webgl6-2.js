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
	camera.position = new THREE.Vector3(100, 20, 50);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls(camera, left);
}

//��ʏ�����
function initScene() {
	scene = new THREE.Scene();
}

//�����̐ݒ�
function initLight() {
	light = new THREE.DirectionalLight(0x999999);
	light.position = new THREE.Vector3(50, 0, 0);
	scene.add(light);
	
	Hemilight = new THREE.HemisphereLight(0x666666,0x333333);
	Hemilight.position = new THREE.Vector3(50, 0, 0);
	scene.add(Hemilight);
	
	ambient = new THREE.AmbientLight(0x444444);
	scene.add(ambient);
}

//�I�u�W�F�N�g�̐ݒ�
function initObject(filename) {
	mesh = new THREE.Object3D(); // �ǂݍ��݂���������܂ł̃_�~�[
	var loader = new THREE.OBJLoader();
	loader.load(filename, function(geometry) {
		mesh = geometry;
		
		//�T�b�J�[�{�[��
        c = mesh.children[0].geometry.faces;
        len = c.length;
        if(filename === 'obj/s06.obj'){
			for(i=0; i<len; i++){
	          if(i<40){
		          c[i].materialIndex = 0;	//�Z�p�`
	          }else{
		          c[i].materialIndex = 1;	//�܊p�`
	          }
	          mesh.children[0].material = new THREE.MeshFaceMaterial([
		          new THREE.MeshLambertMaterial({ color:0xdddddd }),
		          new THREE.MeshLambertMaterial({ color:0x000000 })
				]);
        	}
        //����ȊO
    	}else{
			mesh.children[0].material = new THREE.MeshLambertMaterial({ color:0x00bbcc })
		}
        
		mesh.scale = new THREE.Vector3(30, 30, 30);
		scene.add(mesh);
	});
}

//�����_�����O
function render() {
	requestAnimationFrame(render);
	controls.update(); //�}�E�X����p
	mesh.rotation.y = 0.3 * (+new Date() - baseTime) / 1000; //��]
	renderer.render(scene, camera);
}

//���s����֐�
function threeStart() {
	initThree();
	initCamera();
	initScene();
	initLight();
	initObject('obj/s06.obj');
	renderer.clear();
	render();
}

function Button_obj() {
	initScene();
	initLight();
	obj = new String();
	obj = 'obj/' + document.getElementById("OBJ").value + '.obj';
	initObject(obj);
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
	var element = document.getElementById("dummy"); 
	element.focus();
	
	document.getElementById("OBJ").value = "s06";
}, false);
