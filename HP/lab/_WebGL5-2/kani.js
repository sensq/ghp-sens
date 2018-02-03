var renderer;
var camera,controls;
var scene;
var light,ambient;
var geometry,material,mesh;
var baseTime = +new Date;

var a = 40;	//���_
var b = 20;	//�ߓ_
var e = (a-b)/(a+b);	//���S��

//�`��̈�̐ݒ�
function initThree() {
	Width = document.getElementById('canvas').clientWidth;	//div�v�f�̃T�C�Y���擾
	Height = document.getElementById('canvas').clientHeight;	//div�v�f�̃T�C�Y���擾 
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(Width, Height );
	document.getElementById('canvas').appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);
}

//�J�����̐ݒ�
function initCamera() {
	camera = new THREE.PerspectiveCamera( 45 , Width / Height , 1 , 10000 );
	camera.position = new THREE.Vector3(100, 20, 50);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls( camera , canvas);
}

//��ʏ�����
function initScene() {   
	scene = new THREE.Scene();
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
}

//�����̐ݒ�
function initLight() {
	light = new THREE.DirectionalLight(0xcccccc);
	light.position = new THREE.Vector3(0.577, 0.577, 0);
	scene.add(light);

	ambient = new THREE.AmbientLight(0x333333);
	scene.add(ambient);
}

//�I�u�W�F�N�g�̐ݒ�
function initObject() {
	//�����̕���
	geometry1 = new THREE.CubeGeometry(6, 6, 6);
	material1 = new THREE.MeshPhongMaterial({
		color: 0xdddddd, ambient: 0x008888,
		specular: 0xcfcfcf, emissive: 0x202020, shininess:90, metal:true
	});
	
	mesh1 = new THREE.Mesh(geometry1, material1);
	scene.add(mesh1);
	
	//�����̕���
	geometry2 = new THREE.CubeGeometry(6, 6, 6);
	material2 = new THREE.MeshPhongMaterial({
		color: 0x44dddd, ambient: 0x008888,
		specular: 0xcfcfcf, emissive: 0x202020, shininess:90, metal:true
	});
	
	mesh2 = new THREE.Mesh(geometry2, material2);
	scene.add(mesh2);
	
	//�O���̐�
	line_geo = new THREE.Geometry();
	for (dw = 0; dw <= 360; dw++) {
	line_geo.vertices.push(
		new THREE.Vertex( new THREE.Vector3(
			a*e+a*Math.cos(dw*Math.PI/180),
			b*Math.sin(dw*Math.PI/180),
			0 ))
		);
	}

	line_mat = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1});
	line = new THREE.Line(line_geo, line_mat)
	scene.add(line);
}

//�����_�����O
function render() {
	requestAnimationFrame(render);
	controls.update();	//�}�E�X����p
	
	var step = (+new Date - baseTime) / 1000;
	
	//���]
	var v = 0.5;	//���]�̑��x
	mesh1.rotation.y = v * (+new Date - baseTime) / 1000;
	mesh2.rotation.y = v * (+new Date - baseTime) / 1000;
	
	//���]
	var v = 20;		//���]�̑��x
	mesh2.position = new THREE.Vector3(
		a*e+a*Math.cos(v*Math.PI/180*step),
		b*Math.sin(v*Math.PI/180*step),
		0
	);
		
	renderer.render(scene, camera);
}

//���s����֐�
function threeStart() {
	initThree();
	initStats();
	initCamera();
	initScene();
	initLight();
	initObject();
	renderer.clear();
	render();
}

//�E�B���h�E�̃��T�C�Y�ɑΉ�
window.addEventListener('resize', function() {
	newWidth = document.getElementById('canvas').clientWidth;
	newHeight = document.getElementById('canvas').clientHeight;
	renderer.setSize(newWidth, newHeight );
	camera.aspect = newWidth/newHeight;
	camera.updateProjectionMatrix();
}, false );
