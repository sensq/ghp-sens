document.write('<script type="text/javascript" src="../util/myTemplate.js"></script>');

var a = 40;	//���_
var b = 20;	//�ߓ_
var e = (a-b)/(a+b);	//���S��

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
	var geometry, material;

	//�����̕���
	geometry = new THREE.CubeGeometry(6, 6, 6);
	material = new THREE.MeshPhongMaterial({
		color: 0xdddddd, ambient: 0x008888,
		specular: 0xcfcfcf, emissive: 0x202020, shininess:90, metal:true
	});
	
	mesh1 = new THREE.Mesh(geometry, material);
	scene.add(mesh1);
	
	//�����̕���
	geometry = new THREE.CubeGeometry(6, 6, 6);
	material = new THREE.MeshPhongMaterial({
		color: 0x44dddd, ambient: 0x008888,
		specular: 0xcfcfcf, emissive: 0x202020, shininess:90, metal:true
	});
	
	mesh2 = new THREE.Mesh(geometry, material);
	scene.add(mesh2);
	
	//�O���̐�
	var line_geo = new THREE.Geometry();
	for (dw = 0; dw <= 360; dw++) {
	line_geo.vertices.push(
		new THREE.Vertex( new THREE.Vector3(
			a*e+a*Math.cos(dw*Math.PI/180),
			b*Math.sin(dw*Math.PI/180),
			0 ))
		);
	}

	var line_mat = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1});
	line = new THREE.Line(line_geo, line_mat)
	scene.add(line);
}

//�����_�����O
function render() {
	var dt = requestAnimationFrame(render) / 15;
	controls.update();	//�}�E�X����p
	stats.update();

	//���]
	var v = 0.5;	//���]�̑��x
	mesh1.rotation.y = v * dt;
	mesh2.rotation.y = v * dt;
	
	//���]
	var v = 20;		//���]�̑��x
	mesh2.position = new THREE.Vector3(
		a*e + a*Math.cos(v*Math.PI/180 * dt),
		b * Math.sin(v*Math.PI/180 * dt),
		0
	);
		
	renderer.render(scene, camera);
}

/*
** ���ŏ��Ɉ�x�������s����֐�
*/
function threeStart() {
	initThree();	// �����_���[���쐬
	viewFPS();		// FPS�̕\��
	initCamera(40, 20, 50);	// �J����������
	initScene();	// �V�[��������
	initLight();	// ���C�g������
	initObject();	// �I�u�W�F�N�g������
	renderer.clear();	// �����_���[������
	render();		// �����_�����O
};
