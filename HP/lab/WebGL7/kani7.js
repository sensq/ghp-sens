var renderer;
var camera,controls;
var scene;
var light,ambient;
var geometry,material,mesh;
var horizon = 18;
var vertical = 16;

//�`��̈�̐ݒ�
function initThree() {
	Width = document.getElementById('canvas').clientWidth;	//div�v�f�̃T�C�Y���擾
	Height = document.getElementById('canvas').clientHeight;	//div�v�f�̃T�C�Y���擾 
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(Width, Height );
	document.getElementById('canvas').appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);
};

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
	camera = new THREE.PerspectiveCamera( 45 , Width / Height , 1 , 10000 );
	camera.position = new THREE.Vector3(0, 0, 25);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls( camera , canvas);
}

//��ʏ�����
function initScene() {   
	scene = new THREE.Scene();
}

//�����̐ݒ�
function initLight() {
	light = new THREE.DirectionalLight(0xcccccc);
	light.position = new THREE.Vector3(0, 0, 10);
	scene.add(light);

	ambient = new THREE.AmbientLight(0x333333);
	scene.add(ambient);
}

//�I�u�W�F�N�g�̐ݒ�
function initObject() {
	//��
	geo_tile = new Array(horizon);
	for (i = 0; i < geo_tile.length; i++) {
		geo_tile[i] = new Array(vertical);
		for (j = 0; j < geo_tile[i].length; j++) {
			geo_tile[i][j] = new THREE.CubeGeometry(1, 1, 1);
		}
	}
	mat_tile = new Array(horizon);
	for (i = 0; i < mat_tile.length; i++) {
		mat_tile[i] = new Array(vertical);
		for (j = 0; j < mat_tile[i].length; j++) {
			if(i%2 == j%2){
				mat_tile[i][j] = new THREE.MeshPhongMaterial({
					color: 0xaaaaaa
				});
			}else{
				mat_tile[i][j] = new THREE.MeshPhongMaterial({
					color: 0x888888
				});
			}
		}
	}
	mesh_tile = new Array(horizon);
	for (i = 0; i < mesh_tile.length; i++) {
		mesh_tile[i] = new Array(vertical);
		for (j = 0; j < mesh_tile[i].length; j++) {
			mesh_tile[i][j] = new THREE.Mesh(geo_tile[i][j],mat_tile[i][j]);
			scene.add(mesh_tile[i][j]);
			mesh_tile[i][j].position.x = i-horizon/2;
			mesh_tile[i][j].position.y = j-vertical/2;
		}
	}
	
	//�������镨��1
	geometry1 = new THREE.CubeGeometry(1, 1, 1);
	material1 = new THREE.MeshPhongMaterial({
	  color: 0xff0000
	});
	mesh1 = new THREE.Mesh(geometry1, material1);
	mesh1.position = new THREE.Vector3(-5, -4, 1);
	scene.add(mesh1);
}

//�����_�����O
function render() {	
	requestAnimationFrame(render);
	controls.update();	//�}�E�X����p
	
	//��
	geo_line = new THREE.Geometry();
	geo_line.vertices.push(new THREE.Vertex(new THREE.Vector3(0, 0, 1)));    //�n�_
	geo_line.vertices.push(new THREE.Vertex(new THREE.Vector3(
		mesh1.position.x,
		mesh1.position.y,
		mesh1.position.z
	)));  //�I�_
	mat_line = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 1});
	line = new THREE.Line(geo_line, mat_line);
	scene.add(line);
	
	renderer.render(scene, camera);
	
	scene.remove(line);	//�������O�̐�������
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

document.onkeydown = function(e) { 
	// �L�[�R�[�h�̕������擾 
	keycode = e.which;
	keychar = String.fromCharCode(keycode).toUpperCase();
	
	if(keycode == "37") {	//left
		if(mesh1.position.x > -horizon/2)
			mesh1.position.x -= 1;
	}else if(keycode == "38"){	//up
		if(mesh1.position.y < vertical/2-1)
			mesh1.position.y += 1;
	}else if(keycode == "39"){	//right
		if(mesh1.position.x < horizon/2-1)
			mesh1.position.x += 1;
	}else if(keycode == "40"){	//down
		if(mesh1.position.y > -vertical/2)
			mesh1.position.y -= 1;
	}else if(keychar == "Z"){
		mesh1.scale.z += 1;
		mesh1.position.z += 0.5;
	}else if(keychar == "X"){
		mesh1.scale.z -= 1;
		mesh1.position.z -= 0.5;
	}
}
