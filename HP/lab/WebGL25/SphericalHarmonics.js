
// ���ʒ��a�֐��̍��W���v�Z
function drawBasisSH(radius, l, m, nSlice, nStack, nRepeatS, nRepeatT, wire, map, color) {
	var geometry = new THREE.Geometry();
	geometry.vertices.length = 0;
	geometry.faces.length = 0;
	this.r = color[0];
	this.g = color[1];
	this.b = color[2];

	var point = function () {
		this.t;			// �e�N�X�`�����W�is��prev��next�����ʂ̒l�ɂȂ�̂ŕs�v�j
		this.r;
		this.theta;	// �ɍ��W�iphi��prev��next�����ʂ̒l�ɂȂ�̂ŕs�v�j
		this.x;
		this.y;
		this.z;		// �f�J���g���W
		this.sphericalHarmonics;	// ���ʒ��a�֐�
	}
	var prev = new point();
	var next = new point();

	var reverse = false;
	var createFace = false;
	for (var j = 0; j <= nStack; j++) {
		// �ܓx�����̃e�N�X�`�����Wprev��next
		prev.t = -j / nStack;
		next.t = -(j + 1) / nStack;
		prev.t = (1.0 - prev.t) * nRepeatT;
		next.t = (1.0 - next.t) * nRepeatT;
		// �ܓx�����̒��_���Wprev��next
		prev.theta = Math.PI * prev.t;
		next.theta = Math.PI * next.t;

		// ���ʒ��a�֐������̂܂ܕ`�悷�邩���ʂɃ}�b�s���O���邩�̎w��
		var ll, mm;
		if (map) {
			ll = 0;
			mm = 0;
		}
		else {
			ll = l;
			mm = m;
		}

		for (var i = 0; i <= nSlice; i++) {
			// �o�x�����̃e�N�X�`�����W
			var s = i / nSlice;
			s *= nRepeatS;
			var phi = 2.0 * Math.PI * i / nSlice;

			// ���ʒ��a�֐�Y_l^m(��, ��)�����߂�
			// �Ԃ�l�����̏ꍇ�͂��̂܂܂��ƕ`��ł��Ȃ��̂Ő�Βl�����
			prev.sphericalHarmonics = Math.abs(SphericalHarmonics(l, m, prev.theta, phi));
			prev.r = radius * Math.abs(SphericalHarmonics(ll, mm, prev.theta, phi));
			// �ɍ��W����f�J���g���W�֕ϊ�
			prev.x = prev.r * Math.sin(prev.theta) * Math.cos(phi);
			prev.y = prev.r * Math.sin(prev.theta) * Math.sin(phi);
			prev.z = prev.r * Math.cos(prev.theta);

			// ���ʒ��a�֐�Y_l^m(��, ��)�����߂�
			// �Ԃ�l�����̏ꍇ�͂��̂܂܂��ƕ`��ł��Ȃ��̂Ő�Βl�����
			next.sphericalHarmonics = Math.abs(SphericalHarmonics(l, m, next.theta, phi));
			next.r = radius * Math.abs(SphericalHarmonics(ll, mm, next.theta, phi));
			// �ɍ��W����f�J���g���W�֕ϊ�
			next.x = next.r * Math.sin(next.theta) * Math.cos(phi);
			next.y = next.r * Math.sin(next.theta) * Math.sin(phi);
			next.z = next.r * Math.cos(next.theta);
			/***** �v�Z�͂����ŏI�� *****/


			// ���W���쐬�i���ォ�玞�v���j
			// ����[�v�ڂō��と�E��A�������[�v�ڂŉE��������
			// ���򂳂��Ȃ��Ɩʂ��\�����钸�_���W��Z���^�ɝ���Ă��������Ȃ�
			if (!reverse) {
				var vect = new THREE.Vector3(prev.x, prev.y, prev.z);
				geometry.vertices.push(new THREE.Vertex(vect));

				vect = new THREE.Vector3(next.x, next.y, next.z);
				geometry.vertices.push(new THREE.Vertex(vect));
			}
			else {
				var vect = new THREE.Vector3(next.x, next.y, next.z);
				geometry.vertices.push(new THREE.Vertex(vect));

				vect = new THREE.Vector3(prev.x, prev.y, prev.z);
				geometry.vertices.push(new THREE.Vertex(vect));
			}
			reverse = !reverse;

			// �ŏ��̃��[�v���͒��_���W��2�����Ȃ����ʂ����Ȃ��̂Ŗ���
			if (createFace) {
				// �E��̎O�p��
				var face = new THREE.Face3(geometry.vertices.length - 4, geometry.vertices.length - 3, geometry.vertices.length - 2);
				var faceNormal = new THREE.Vector3(prev.x, prev.y, prev.z);
				face.normal = faceNormal;
				geometry.faces.push(face);
				// �����̎O�p��
				face = new THREE.Face3(geometry.vertices.length - 4, geometry.vertices.length - 2, geometry.vertices.length - 1);
				faceNormal = new THREE.Vector3(prev.x, prev.y, prev.z);
				face.normal = faceNormal;
				geometry.faces.push(face);

				// �����Ǝ����ŐF����
				var intense = (prev.sphericalHarmonics + next.sphericalHarmonics) / 2;
				if (SphericalHarmonics(l, m, prev.theta, phi) > 0) {
					geometry.faces[geometry.faces.length - 2].color.setRGB(this.r * intense, this.g * intense, this.b * intense);
					geometry.faces[geometry.faces.length - 1].color.setRGB(this.r * intense, this.g * intense, this.b * intense);
				}
				else {
					geometry.faces[geometry.faces.length - 2].color.setRGB((1 - this.r) * intense, (1 - this.g) * intense, (1 - this.b) * intense);
					geometry.faces[geometry.faces.length - 1].color.setRGB((1 - this.r) * intense, (1 - this.g) * intense, (1 - this.b) * intense);
				}
			}
			// 2���[�v�ڂ��炸����true
			createFace = true;
		}
	}

	// �ގ�
	var material = new THREE.MeshBasicMaterial({
		vertexColors: true,
		side: 2,
	});
	// ���C���[�\��
	material.wireframe = wire;
	var mesh = new THREE.Mesh(geometry, material);

	return mesh;
}


/***** �ȉ��A�v�Z�ɕK�v�Ȋ֐� *****/

// �K��v�Z
function factorial(n) {
	var fact = 1.0;
	// �G���[����
	if (n <= 0)
		return fact;
	for (var i = n; i >= 2; i--)
		fact *= i;
	return fact;
}

// ��d�K��v�Z
function factorial2(n) {
	var fact2 = 1.0;
	// �G���[����
	if (n <= 0)
		return fact2;
	for (var i = n; i >= 2; i = i - 2)
		fact2 *= i;
	return fact2;
}

// �P�ʉ����邽�߂̌W��
// @param l�F���̐���
// @param m�F-l�`l�̐���
function K(l, m) {
	var mm = Math.abs(m);
	// ���q
	var numer = (2.0 * l + 1) * factorial(l - mm);
	// ����
	var denom = (4 * 3.141592) * factorial(l + mm);

	return Math.sqrt(numer / denom);
}

// ���W�����h����������
// @param l�F���̐���
// @param m�F-l�`l�̐���
// @param x�Fcos(theta)
function P(l, m, x) {
	var mm = Math.abs(m);
	var ret = 1.0;
	var minus = 1.0;

	// m>=0�̏ꍇ�͎g��Ȃ��l�Ȃ̂Ŗ��ʂȌv�Z���ȗ�
	if (m < 0) {
		// m<0�̏ꍇ��m>0�̏ꍇ��ret�ɂ��̒l���|����ƌv�Z�o����
		minus = Math.pow(-1.0, mm) * factorial(l - mm) / factorial(l + mm);
	}

	// m=0�̏ꍇ�͕K��ret=1�ɂȂ�̂Ŗ��ʂȌv�Z���ȗ�
	if (m != 0) {
		ret = Math.pow(1.0 - x * x, mm / 2.0) * factorial2(2 * mm - 1);
		// l=�}m�̏ꍇ�͂����Ōv�Z�I��
		// m>=0�̏ꍇminus=1.0�ɂȂ�悤�ɂ��Ă���̂ŏꍇ�����͕s�v
		if (mm == l)
			return ret * minus;
	}

	// -l<m<l�̏ꍇ�͍ċA�I�ɒl���v�Z
	var pm1 = ret;	// ��O��ret
	var pm2 = 0.0;	// ��O��ret
	for (var i = mm + 1; i <= l; i++) {
		ret = ((2.0 * i - 1.0) * x * pm1 - (i + mm - 1.0) * pm2) / (i - mm);
		pm2 = pm1;
		pm1 = ret;
	}

	// m>=0�̏ꍇminus=1.0�ɂȂ�悤�ɂ��Ă���̂ŏꍇ�����͕s�v
	return ret * minus;
}

// ���ʒ��a�֐�
// @param l�F���̐���
// @param m�F-l�`l�̐���
// @param theta�F0�`Pi�̎���
// @param phi�F0�`2*Pi�̎���
function SphericalHarmonics(l, m, theta, phi) {
	// �G���[����
	if (Math.abs(m) > l)
		return 0;

	// l=0�̏ꍇ�͕K��m=0��K��P���萔�ɂȂ邽�߁A���炩���ߌv�Z�����l���g���Čv�Z�R�X�g������
	if (l == 0)
		return 0.28209479;

	// m����, ��, 0�̏ꍇ�Œ�`�ʂ蕁�ʂɌv�Z
	if (0 < m)
		return K(l, m) * Math.sqrt(2.0) * Math.cos(m * phi) * P(l, m, Math.cos(theta));
	else if (m < 0)
		return K(l, m) * Math.sqrt(2.0) * Math.sin(-m * phi) * P(l, -m, Math.cos(theta));
	else
		return K(l, m) * P(l, m, Math.cos(theta));
}