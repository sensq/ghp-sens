var renderer;
var camera,controls;
var scene;
var light,ambient;
var geometry,material,mesh;
var baseTime = +new Date;
var horizon = 18;
var vertical = 16;
var flag_cmy = false;

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
	subscene = new THREE.Scene();
}

//�����̐ݒ�
function initLight() {
	light = new THREE.DirectionalLight(0xcccccc);
	light.position = new THREE.Vector3(0, 0, 10);
	scene.add(light);

	ambient = new THREE.AmbientLight(0x333333);
	scene.add(ambient);
}

//�Փ˔���p�̃t���O�t��
flag_collision = new Array(horizon);
for (i = 0; i < flag_collision.length; i++) {
	flag_collision[i] = new Array(vertical);
	for (j = 0; j < flag_collision[i].length; j++) {
		flag_collision[i][j] = false;
	}
}

//���̂�����ʒu��true�ɂ���
function collision(mesh_name, flag){
	i = mesh_name.position.x + horizon/2;;
	j = mesh_name.position.y + vertical/2;;
	if(flag == 1){
		flag_collision[i][j] = true;
	}else if(flag == 0){
		flag_collision[i][j] = false;
	}
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
	//�����܂ŏ�
	
	//�������镨��1
	geometry1 = new THREE.CubeGeometry(1, 1, 1);
	material1 = new THREE.MeshPhongMaterial({
	  color: 0xff0000
	});
	mesh1 = new THREE.Mesh(geometry1, material1);
	mesh1.position = new THREE.Vector3(-5, -4, 1);
	collision(mesh1, 1);
	scene.add(mesh1);
	
	//�������镨��2
	geometry2 = new THREE.CubeGeometry(1, 1, 1);
	material2 = new THREE.MeshPhongMaterial({
	  color: 0x00ff00
	});
	mesh2 = new THREE.Mesh(geometry2, material2);
	mesh2.position = new THREE.Vector3(-3, 2, 1);
	collision(mesh2, 1);
	scene.add(mesh2);
}

//�����_�����O
function render() {	
	requestAnimationFrame(render);
	controls.update();	//�}�E�X����p
	
	//��
	geo_line = new THREE.Geometry();
	geo_line.vertices.push(new THREE.Vertex(new THREE.Vector3(
		mesh1.position.x,
		mesh1.position.y,
		mesh1.position.z
	)));    //�n�_
	geo_line.vertices.push(new THREE.Vertex(new THREE.Vector3(
		mesh2.position.x,
		mesh2.position.y,
		mesh2.position.z
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
	var shift, ctrl;
	ctrl = typeof e.modifiers == 'undefined' ? e.ctrlKey : e.modifiers & Event.CONTROL_MASK;
	shift = typeof e.modifiers == 'undefined' ? e.shiftKey : e.modifiers & Event.SHIFT_MASK;
	
	// �L�[�R�[�h�̕������擾 
	keycode = e.which;
	keychar = String.fromCharCode(keycode).toUpperCase();
	
	//�ړ��̉ۂ̔��f
	function judge(mesh_name, course){
		switch(course){
		case 0:	//left
			if(mesh_name.position.x > -horizon/2 & flag_collision[mesh_name.position.x + horizon/2 - 1][mesh_name.position.y + vertical/2] != true){
			collision(mesh_name, 0);
			mesh_name.position.x -= 1;
			collision(mesh_name, 1);
			}
			break;
		
		case 1:	//up
			if(mesh_name.position.y < vertical/2 - 1 & flag_collision[mesh_name.position.x + horizon/2][mesh_name.position.y + vertical/2 + 1] != true){
			collision(mesh_name, 0);
			mesh_name.position.y += 1;
			collision(mesh_name, 1);
			}
			break;
			
		case 2:	//right
			if(mesh_name.position.x < horizon/2 & flag_collision[mesh_name.position.x + horizon/2 + 1][mesh_name.position.y + vertical/2] != true){
			collision(mesh_name, 0);
			mesh_name.position.x += 1;
			collision(mesh_name, 1);
			}
			break;
			
		case 3:	//down
			if(mesh_name.position.y > -vertical/2 & flag_collision[mesh_name.position.x + horizon/2][mesh_name.position.y + vertical/2 - 1] != true){
			collision(mesh_name, 0);
			mesh_name.position.y -= 1;
			collision(mesh_name, 1);
			}
			break;
		}
	}

	//�ړ��p�֐�
	function move(mesh_name){
		if(keycode == "37") {	//left
			judge(mesh_name, 0);
		}else if(keycode == "38"){	//up
			judge(mesh_name, 1);
		}else if(keycode == "39"){	//right
			judge(mesh_name, 2);
		}else if(keycode == "40"){	//down
			judge(mesh_name, 3);
		}else if(keychar == "Z"){
			mesh_name.scale.z += 1;
			mesh_name.position.z += 0.5;
		}else if(keychar == "X"){
			mesh_name.scale.z -= 1;
			mesh_name.position.z -= 0.5;
		}
	}
	
	if(shift){
		move(mesh2);
	}else{
		move(mesh1);
	}
}
