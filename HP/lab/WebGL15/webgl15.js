var baseTime = +new Date();
var success = 0;
var img_floor = './gray.jpg';
texture_floor = new THREE.ImageUtils.loadTexture(img_floor);

/*
** �`��̈�̐ݒ�
*/
function initThree() {
	Width = document.getElementById('canvas').clientWidth; // div�v�f�̃T�C�Y���擾
	Height = document.getElementById('canvas').clientHeight; // div�v�f�̃T�C�Y���擾 
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(Width, Height);
	document.getElementById('canvas').appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);
	
	// �V���h�[�}�b�s���OON
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
}

/*
** FPS�̕\��
*/
function initStats() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '65px';	// �ォ��̈ʒu
	document.getElementById('canvas').appendChild(stats.domElement);
	
	function fps() {
		requestAnimationFrame(fps);
		stats.update();
	};
	fps();
}

/*
** �J�����̐ݒ�
*/
function initCamera() {
	camera = new THREE.PerspectiveCamera(45, Width / Height, 1, 10000);
	camera.position = new THREE.Vector3(20, 45, 25);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.TrackballControls(camera, left);
}

/*
** ��ʏ�����
*/
function initScene() {
	scene = new THREE.Scene();
}

/*
** �����̐ݒ�
*/
function initLight() {
	light = new THREE.DirectionalLight(0xaaaaaa);
	light.position = new THREE.Vector3(60, 80, 0);
	
	light.target.position.copy(scene.position);
	light.castShadow = true;
	light.shadowCameraNear = 20;
	light.shadowCameraFar = 200;
	light.shadowBias = -.0001
	resolution = 2048;
	light.shadowMapWidth = light.shadowMapHeight = resolution;
	light.shadowDarkness = .7;
	scene.add(light);
	
	ambient = new THREE.AmbientLight(0xaaaaaa);
	scene.add(ambient);
}

/*
** �I�u�W�F�N�g�̐ݒ�
*/
function initObject() {
	meshArray = [];
    geometry = new THREE.CubeGeometry(2, 2, 2, 6, 6, 6);
    for(var i = 0; i < 5; i++){
        meshArray[i] = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
        meshArray[i].position.x = 2 * i;
        meshArray[i].position.z = -i;
        meshArray[i].castShadow = true;
        meshArray[i].receiveShadow = true;
		meshArray[i].position.y = 3;
        scene.add(meshArray[i]);
    }

	geometry = new THREE.TorusGeometry(2, 1, 30, 30);
	material = new THREE.MeshPhongMaterial( {
		color: Math.random() * 0xffffff,
		ambient: 0x444444,
		specular: 0x555555,
		shininess: 90,
		metal: true,
		side: 2
	} );
	mesh = new THREE.Mesh(geometry, material);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.position = new THREE.Vector3(0, 10, 0);
	scene.add(mesh);
	
	// �X�J�C�{�b�N�X
	sky_geo = new THREE.SphereGeometry(2000, 25, 25);
	sky_mat = new THREE.MeshPhongMaterial({
		color: 0x00aaff,
		ambient: 0xaaaaaa,
		specular: 0x000000,
		shininess: 90,
		metal: true,
		side: 2
	});
	sky_mesh = new THREE.Mesh(sky_geo, sky_mat);
	scene.add(sky_mesh);
	
	// ��
	floor_geo = new THREE.PlaneGeometry(50, 50);
	floor_mat = new THREE.MeshPhongMaterial({
		color: 0xaaaaff,
		ambient: 0x888888,
		specular: 0x888888,
		shininess: 90,
		metal: true,
		side: 2,
		map: texture_floor
	});
	floor_mesh = new THREE.Mesh(floor_geo, floor_mat);
	floor_mesh.rotation.x = -(Math.PI/2.0).toFixed(4);
	floor_mesh.position = new THREE.Vector3(0, 0, 0);
	floor_mesh.castShadow = true;
	floor_mesh.receiveShadow = true;
	scene.add(floor_mesh);
}

/*
** �����_�����O
*/
function render() {
	requestAnimationFrame(render);
	controls.update(); //�}�E�X����p

	// ������]
	dt = (+new Date() - baseTime);
	var omega = 0.0005;
	var amp = 80;
	if(!document.getElementsByName("off")[0].checked){
		light.position = new THREE.Vector3(amp * Math.sin(omega * dt), 80, amp * Math.cos(omega * dt));
	}
	renderer.render(scene, camera);
}

/*
** ���s����֐�
*/
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

function set() {
	success = 0;
	if(document.getElementsByName("off")[0].checked)
		renderer.shadowMapEnabled = false;
	else
		renderer.shadowMapEnabled = true;
	initScene();
	initLight();
	initObject();
	renderer.clear();
	render();
}

/*
** �C�ӂ̗v�f�̃I�t�Z�b�g���擾�p�֐� (���Ƃ� canvas �̃I�t�Z�b�g�ʒu�擾�p)
*/
var getElementPosition = function(element) {
        var top = left = 0;
        do {
            top  += element.offsetTop  || 0;
            left += element.offsetLeft || 0;
            element =  element.offsetParent;
        }
        while (element);
        return {top: top, left: left};
}

/*
** �X���[�v
*/
function Sleep( T ){ 
   var d1 = new Date().getTime(); 
   var d2 = new Date().getTime(); 
   while( d2 < d1+1000/60*T ){    //T�t���[���҂� 
       d2=new Date().getTime(); 
   } 
   return; 
} 

/*
** �}�E�X���W���擾���ďd�Ȃ�����ړ�����
*/
var mouseX = -1, mouseY = -1;
document.addEventListener('mousemove', function(e) {
	// ���W���擾���I�t�Z�b�g�␳
	var mouseX = e.clientX - getElementPosition(renderer.domElement).left;
	var mouseY = e.clientY - getElementPosition(renderer.domElement).top;

	// Ray�p
	var projector = new THREE.Projector();
	var x =   (mouseX / renderer.domElement.width) * 2 - 1;
	var y = - (mouseY / renderer.domElement.height) * 2 + 1;
	var pos = new THREE.Vector3(x, y, 1);
	var ray = projector.pickingRay(pos, camera);
	var intersects = ray.intersectObjects(scene.children);

	// �������烁�C���̎������e
	var color = Math.random() * 0xffffff;
	// �����_����-15����15�̒l��Ԃ�
	var move = function(){
		var pos = 0;
		if(Math.random()>0.5)
			pos = pos + Math.random() * 15;
		else
			pos = pos + Math.random() * -15;
		return {pos: pos};
	}

	// �}�E�X�Ƃ̏Փ˔���
	if(intersects[0].object == mesh){
		Sleep(10);
		mesh.material.color.setHex(color);
		mesh.position = new THREE.Vector3(move().pos, move().pos, move().pos);
		mesh.rotation = new THREE.Vector3(move().pos, move().pos, move().pos);
	}
	for(var i=0; i<5; i++){
		if(intersects[0].object == meshArray[i]){
			Sleep(5);
			meshArray[i].material.color.setHex(color);
			meshArray[i].position = new THREE.Vector3(move().pos, move().pos, move().pos);
		}
	}
}, false);

/*
** �N���b�N�������W���d�Ȃ��Ă����������
*/
document.addEventListener('click', function(e) {
	// ���W���擾���I�t�Z�b�g�␳
	var mouseX = e.clientX - getElementPosition(renderer.domElement).left;
	var mouseY = e.clientY - getElementPosition(renderer.domElement).top;

	// Ray�p
	var projector = new THREE.Projector();
	var x =   (mouseX / renderer.domElement.width) * 2 - 1;
	var y = - (mouseY / renderer.domElement.height) * 2 + 1;
	var pos = new THREE.Vector3(x, y, 1);
	var ray = projector.pickingRay(pos, camera);
	// �I�u�W�F�N�g�̈�����[]�Ŋ���
	var intersects1 = ray.intersectObjects([mesh]);
	// �z��Œ�`����Ă���ꍇ�͂��̂܂�
	var intersects2 = ray.intersectObjects(meshArray);

	// �������烁�C���̎������e

	if(intersects1.length > 0) {
		intersects1[0].object.scale = new THREE.Vector3(0, 0, 0);
		success += 1;
	}
	if(intersects2.length > 0) {
		intersects2[0].object.scale = new THREE.Vector3(0, 0, 0);
		success += 1;
	}
	if(success == 6){
		alert("�S����������I");
		success = 0;
	}
}, false);

/*
** �E�B���h�E�̃��T�C�Y�ɑΉ�
*/
window.addEventListener('resize', function() {
	newWidth = document.getElementById('canvas').clientWidth;
	newHeight = document.getElementById('canvas').clientHeight;
	renderer.setSize(newWidth, newHeight);
	camera.aspect = newWidth / newHeight;
	camera.updateProjectionMatrix();
}, false);

/*
** �f�t�H���g�l����{�t�H�[�J�X�����킹��
*/
window.addEventListener('load', function() {
	document.getElementsByName("off")[0].checked = false;
	document.getElementsByName("set")[0].focus();
}, false);