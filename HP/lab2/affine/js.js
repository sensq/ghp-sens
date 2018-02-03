function setImage(img){
	var canvas = document.getElementById("img");
	var context = canvas.getContext('2d');
	
	// �摜�ǂݍ���
	image = new Image();
	image.src = img;
	// �ǂݍ��ݏI����҂�
	image.onload = function() {
	// �`��̈���摜�̃T�C�Y�Ƀ��T�C�Y
		canvas.width = 2 * image.width;
		canvas.height = 2 * image.height;
		// �摜�`��
		context.drawImage(image, 0, 0);
		// ��f�f�[�^�ǂݍ���
		input = context.getImageData(0, 0, canvas.width, canvas.height);
		w = input.width, h = input.height;
		inputData = input.data;
		// �摜�ϊ��p�I�u�W�F�N�g
		output = context.createImageData(canvas.width, canvas.height);
		outputData = output.data;
	}
}

/*
** �摜�ϊ�
*/
var imgConvert = (function(){
	// �`��̈惊�T�C�Y
	var canvas,context;
	function resize(){
		canvas = document.getElementById("img");
		context = canvas.getContext('2d');
		canvas.width = output.width;
		canvas.height = output.height;
	}

	// ������
	this.init = function(){
		resize();
		context.restore();
	}

	// �A�t�B���ϊ�
	this.affine = function(){
		// �ϊ��s��
		var affine_mat = [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1]
		];
		affine_mat[0][0] = document.getElementById("affine00").value;
		affine_mat[0][1] = document.getElementById("affine01").value;
		affine_mat[0][2] = document.getElementById("affine02").value;
		affine_mat[1][0] = document.getElementById("affine10").value;
		affine_mat[1][1] = document.getElementById("affine11").value;
		affine_mat[1][2] = document.getElementById("affine12").value;
		affine_mat[2][0] = document.getElementById("affine20").value;
		affine_mat[2][1] = document.getElementById("affine21").value;
		affine_mat[2][2] = document.getElementById("affine22").value;
		mat.inverse(affine_mat, affine_mat);
		// �ϊ��s��
		var trans_mat = [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1]
		];
		trans_mat[0][2] = -document.getElementById("trans_x").value;
		trans_mat[1][2] = -document.getElementById("trans_y").value;
		// �r���v�Z�p
		var dst = [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1]
		];
		// ��U���_�Ɉړ�����
		var offset_before = [
		[1, 0, image.width/2],
		[0, 1, image.height/2],
		[0, 0, 1]
		];
		// ���ɖ߂��{��
		var offset_after = [
		[1, 0, -image.width/2 * 1.5],
		[0, 1, -image.height/2 * 1.5],
		[0, 0, 1]
		];
		// �ϊ��O�̍��W
		var p = [
		[0],
		[0],
		[1]
		];
		// �ϊ���̍��W
		var P = [
		[0],
		[0],
		[1]
		];
		resize();
		mat.multiply2(offset_before, affine_mat, dst);
		mat.multiply2(dst, offset_after, affine_mat);
		mat.multiply2(affine_mat, trans_mat, dst);
		// p[0][0]��x���W, p[1][0]��y���W
		for (p[1][0] = 0; p[1][0] < h-1; p[1][0]++) {
			for (p[0][0] = 0; p[0][0] < w-1; p[0][0]++) {
				// �A�t�B���ϊ�
				mat.multiply1(dst, p, P);
				var i = (p[1][0]*w + p[0][0])*4;
				var j = (P[1][0]*w + P[0][0])*4;
				outputData[i + 0] = inputData[j + 0];
				outputData[i + 1] = inputData[j + 1];
				outputData[i + 2] = inputData[j + 2];
				outputData[i + 3] = inputData[j + 3];
			}
		}
		context.putImageData(output, 0, 0);
	}
	return this;
})();

var mat = (function (){
	// �P�ʍs��
	this.identity = function(dst){
		dst[0][0] = 1; dst[0][1] = 0; dst[0][2] = 0;
		dst[1][0] = 0; dst[1][1] = 1; dst[1][2] = 0;
		dst[2][0] = 0; dst[2][1] = 0; dst[2][2] = 1;
		return dst;
	};
	// 3�~3��1�~3�̊|���Z
	this.multiply1 = function(mat1, mat2, dst){
		var a = mat1[0][0], b = mat1[0][1], c = mat1[0][2],
			d = mat1[1][0], e = mat1[1][1], f = mat1[1][2],
			g = mat1[2][0], h = mat1[2][1], i = mat1[2][2],
			A = mat2[0][0],
			B = mat2[1][0],
			C = mat2[2][0];
		dst[0][0] = parseInt(a * A + b * B + c * C);
		dst[1][0] = parseInt(d * A + e * B + f * C);
		dst[2][0] = parseInt(g * A + h * B + i * C);
		return dst;
	};
	// 3�~3��3�~3�̊|���Z
	this.multiply2 = function(mat1, mat2, dst){
		var A = mat1[0][0], B = mat1[0][1], C = mat1[0][2],
			D = mat1[1][0], E = mat1[1][1], F = mat1[1][2],
			G = mat1[2][0], H = mat1[2][1], I = mat1[2][2],
			a = mat2[0][0], b = mat2[0][1], c = mat2[0][2],
			d = mat2[1][0], e = mat2[1][1], f = mat2[1][2],
			g = mat2[2][0], h = mat2[2][1], i = mat2[2][2];
		dst[0][0] = A * a + B * d + C * g;
		dst[0][1] = A * b + B * e + C * h;
		dst[0][2] = A * c + B * f + C * i;
		dst[1][0] = D * a + E * d + F * g;
		dst[1][1] = D * b + E * e + F * h;
		dst[1][2] = D * c + E * f + F * i;
		dst[2][0] = G * a + H * d + I * g;
		dst[2][1] = G * b + H * e + I * h;
		dst[2][2] = G * c + H * f + I * i;
		return dst;
	};
	// �t�s��
	this.inverse = function(mat, dst){
		var a = mat[0][0],  b = mat[0][1],  c = mat[0][2],
			d = mat[1][0],  e = mat[1][1],  f = mat[1][2],
			g = mat[2][0],  h = mat[2][1],  i = mat[2][2];
			s = a * e * i + g * b * f + h * d * c;
			t = c * e * g + d * b * i + a * f * h;
			det = s - t;
			idet = 1.0 / det;
		dst[0][0] = (e�@*�@i - f�@*�@h) * idet;
		dst[0][1] = (c�@*�@h - b�@*�@i) * idet;
		dst[0][2] = (b�@*�@f - c�@*�@h) * idet;
		dst[1][0] = (f�@*�@g - d�@*�@i) * idet;
		dst[1][1] = (a�@*�@i - c�@*�@g) * idet;
		dst[1][2] = (c�@*�@d - a�@*�@f) * idet;
		dst[2][0] = (d�@*�@h - e�@*�@g) * idet;
		dst[2][1] = (b�@*�@g - a�@*�@h) * idet;
		dst[2][2] = (a�@*�@e - b�@*�@d) * idet;
		return dst;
	};
	return this;
})();

// �摜�̓ǂݍ���
function loadImg(){
	if (document.getElementById('loadImg').files[0].type.match('image.*')) {
		var img = document.getElementById('loadImg').files[0];
		var info = "name:" + img.name + " size:" + img.size;
		document.getElementById('list').innerHTML = info;
		var fr = new FileReader();
		fr.onload = onFileLoad;
		fr.readAsDataURL(img);
	}else{
		alert("�摜�t�@�C�����w�肵�ĉ�����");
	}
}

// �ǂݍ��ݏI����҂�
function onFileLoad(e) {
	setImage(e.target.result);
 	imgConvert.init();
}

// Enter�L�[�Ŏ��s
function pressEnter(keycode) {
	if(keycode == 13){
		easyConvert.rot();
	}
}

// �����_�����s
function rand(){
	document.getElementById("affine00").value = 2 * Math.random() - 0.5;
	document.getElementById("affine01").value = 2 * Math.random() - 0.5;
	document.getElementById("affine10").value = 2 * Math.random() - 0.5;
	document.getElementById("affine11").value = 2 * Math.random() - 0.5;
	imgConvert.affine();
}

// �O�p�֐����߂�
function trigono(){
	var theta = document.getElementById("theta").value;
	var th = Math.PI/180 * theta;
	document.getElementById("sin").value = Math.sin(th).toFixed(3);
	document.getElementById("cos").value = Math.cos(th).toFixed(3);
	document.getElementById("tan").value = Math.tan(th).toFixed(3);
}

// �{�^���ŊȈՕϊ�
var easyConvert = (function (){
	// ������
	this.init = function(){
		document.getElementById("affine00").value = 1;
		document.getElementById("affine01").value = 0;
		document.getElementById("affine02").value = 0;
		document.getElementById("affine10").value = 0;
		document.getElementById("affine11").value = 1;
		document.getElementById("affine12").value = 0;
		document.getElementById("affine20").value = 0;
		document.getElementById("affine21").value = 0;
		document.getElementById("affine22").value = 1;
		imgConvert.affine();
	};

	// ��]
	this.rot = function(){
		var theta = document.getElementById("theta").value;
		var th = Math.PI/180 * theta;
		var c = Math.cos(th).toFixed(3);
		var s = Math.sin(th).toFixed(3);
		var t = Math.tan(th).toFixed(3);
		document.getElementById("affine00").value = c;
		document.getElementById("affine01").value = s;
		document.getElementById("affine10").value = -s;
		document.getElementById("affine11").value = c;
		imgConvert.affine();
	};

	// �X�P�[�����O
	this.scale = function(){
		document.getElementById("affine00").value = 1.5;
		document.getElementById("affine01").value = 0;
		document.getElementById("affine10").value = 0;
		document.getElementById("affine11").value = 0.5;
		imgConvert.affine();
	};

	// �X�L���[
	this.skew = function(){
		var theta = document.getElementById("theta").value;
		var th = Math.PI/180 * theta;
		var t = Math.tan(th).toFixed(3);
		document.getElementById("affine00").value = 1;
		document.getElementById("affine01").value = t;
		document.getElementById("affine10").value = 0;
		document.getElementById("affine11").value = 1;
		imgConvert.affine();
	};

	// xy�X�L���[
	this.xyskew = function(){
		var theta = document.getElementById("theta").value;
		var th = Math.PI/180 * theta;
		var t = Math.tan(th).toFixed(3);
		document.getElementById("affine00").value = 1;
		document.getElementById("affine01").value = t;
		document.getElementById("affine10").value = t;
		document.getElementById("affine11").value = 1;
		imgConvert.affine();
	};

	// ���f(x��)
	this.xmirror = function(){
		document.getElementById("affine00").value = 1;
		document.getElementById("affine01").value = 0;
		document.getElementById("affine10").value = 0;
		document.getElementById("affine11").value = -1;
		imgConvert.affine();
	};

	return this;
})();

window.addEventListener('load', function (){
	var th = Math.PI/180*30;
	var c = Math.cos(th).toFixed(3);
	var s = Math.sin(th).toFixed(3);
	var t = Math.tan(th).toFixed(3);

	document.getElementById("theta").value = 30;
	document.getElementById("trans_x").value = 0;
	document.getElementById("trans_y").value = 0;
	document.getElementById("affine00").value = 1;
	document.getElementById("affine01").value = t;
	document.getElementById("affine02").value = 0;
	document.getElementById("affine10").value = 0;
	document.getElementById("affine11").value = 1;
	document.getElementById("affine12").value = 0;
	document.getElementById("affine20").value = 0;
	document.getElementById("affine21").value = 0;
	document.getElementById("affine22").value = 1;
	setImage("ika.png");
	trigono();
	easyConvert.init();
}, false);
