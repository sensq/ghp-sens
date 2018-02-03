var renderer;
var camera, controls;
var scene;
var light, ambient;
var geometry, material, mesh;
var baseTime = +new Date();

var animOffset       = 0,   // starting frame of animation
	walking         = false,
	duration        = 8000, // milliseconds to complete animation
	keyframes       = 150,   // total number of animation frames
	interpolation   = duration / keyframes, // milliseconds per frame
	lastKeyframe    = 0,    // previous keyframe
	currentKeyframe = 0;
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

//FPS�̕\��
function initStats() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '77px';	//�ォ��̈ʒu
	document.getElementById('canvas').appendChild(stats.domElement);
	
	function fps() {
		requestAnimationFrame(fps);
		stats.update();
	};
	fps();
};

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
	light = new THREE.DirectionalLight(0xaaaaaa);
	light.position = new THREE.Vector3(50, 0, 0);
	scene.add(light);
	
	Hemilight = new THREE.HemisphereLight(0x555555,0x222222);
	Hemilight.position = new THREE.Vector3(50, 0, 0);
	scene.add(Hemilight);
	
	ambient = new THREE.AmbientLight(0x666666);
	scene.add(ambient);
}

//�I�u�W�F�N�g�̐ݒ�
function initObject(filename) {
	loader = new THREE.JSONLoader();
	loader.load(filename, function(geometry, materials) {
		for(i=0; i<materials.length; i++){
			materials[i].side = 2;
			materials[i].morphTargets = true;
		}
		var material = new THREE.MeshFaceMaterial(materials);
		mesh = new THREE.SkinnedMesh(geometry, material);
		mesh.scale = new THREE.Vector3(13, 13, 13);
		mesh.position = new THREE.Vector3(0, 0, 0);
		mesh.rotation = new THREE.Vector3(0, 0, 0);
		//for(var i = 0; i < mesh.morphTargetInfluences.length; i++) {
		//	mesh.morphTargetInfluences[i] = 0;
		//}
		// mesh.morphTargetInfluences[10] = 1;
		scene.add(mesh);
	});
}

//�����_�����O
function render() {
	var dt = requestAnimationFrame(render);
	controls.update(); //�}�E�X����p

	if (mesh)
	{
		// Alternate morph targets
		time = 10*dt % duration;
		keyframe = Math.floor( time / interpolation ) + animOffset;
		if ( keyframe != currentKeyframe ) 
		{
			mesh.morphTargetInfluences[ lastKeyframe ] = 0;
			mesh.morphTargetInfluences[ currentKeyframe ] = 1;
			mesh.morphTargetInfluences[ keyframe ] = 0;
			lastKeyframe = currentKeyframe;
			currentKeyframe = keyframe;
		}
		mesh.morphTargetInfluences[ keyframe ] = 
			( time % interpolation ) / interpolation;
		mesh.morphTargetInfluences[ lastKeyframe ] = 
			1 - mesh.morphTargetInfluences[ keyframe ];
	}
	//mesh.rotation.y = 0.3 * (+new Date() - baseTime) / 1000; //��]
	renderer.render(scene, camera);
}

//���s����֐�
function threeStart() {
	initThree();
	initStats();
	initCamera();
	initScene();
	initLight();
	initObject('collision.js');
	renderer.clear();
	render();
}

function Button(filename, num) {
	initScene();
	initLight();
	initObject(filename, num);
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
	var select=document.getElementsByName("model");
	select[0].selected = true;
	select.focus();
}, false);
