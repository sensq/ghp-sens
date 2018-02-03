//�ϐ��i�ȗ��j
var Width,Height;
var renderer;
var camera;
var scene;
var light,ambient;
var geometry,material,mesh;

//�`��̈�̐ݒ�
function Init() {
	Width = 400;	//����
	Height = 400;	//�c��
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(Width, Height);
	document.body.appendChild(renderer.domElement);
	renderer.setClearColorHex(0xFFFFFF, 1.0);	//�w�i�F
}

//�J�����̐ݒ�
function Camera() {
	camera = new THREE.PerspectiveCamera( 45 , Width / Height , 1 , 10000 );	//��p�A�A�X��A�\�������O�̌��E�l�A���̍ő�l
	camera.position = new THREE.Vector3(100, 20, 50);	//���_�̈ʒu
	camera.lookAt(new THREE.Vector3(0, 0, 0));	//�������
}

//��ʏ�����
function Scene() {   
	scene = new THREE.Scene();
}

//�����̐ݒ�
function Light() {
	light = new THREE.DirectionalLight(0xcccccc);	//���s����
	light.position = new THREE.Vector3(0.577, 0.577, 0);	//�����̈ʒu
	scene.add(light);

	ambient = new THREE.AmbientLight(0x333333);	//����
	scene.add(ambient);
}

//�I�u�W�F�N�g�̐ݒ�
function Object() {
	geometry = new THREE.TorusGeometry(30, 10, 20, 40);	//�g�[���X
	material = new THREE.MeshPhongMaterial({			//------
		color: 0xff9900, ambient: 0x888888,				//�ގ�
		specular: 0xcccccc, shininess:90, metal:true});	//------
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}

//���s����֐�
function three() {
	Init();
	Camera();
	Scene();
	Light();
	Object();
	renderer.clear();
	renderer.render(scene, camera);
}
