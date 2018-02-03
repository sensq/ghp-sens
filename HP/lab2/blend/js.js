// �I�u�W�F�N�g�쐬
var CV = function(){};
// �����i�[�p
CV.history = [];
// RGB��HSV�i�[�p
CV.color = [];

/*
** �I�u�W�F�N�g�̃v���p�e�B�̈ꗗ��\������֐�
** �f�o�b�O�p
*/
function printProperties(obj, opt) {
	this.obj = obj;
	this.opt = opt || 0;
	this.properties = new String();
	// ��2������1�������alert�ŕ\�������
	if(this.opt == 1){
		for (this.prop in this.obj){
			if(this.obj[this.prop] == ''){
				this.obj[this.prop] = '����';
			}
			this.properties += this.prop + "\n" + this.obj[this.prop] + "\n" + "\n";
		}
		if(this.properties == ''){
			this.properties = 'Property is none.';
		}
		alert(this.properties);
	}else{
		for (this.prop in this.obj){
			if(this.obj[this.prop] == ''){
				this.obj[this.prop] = '<i>����</i>';
			}
		this.properties += "<font color='blue'><b>" + this.prop + "</b></font> =<br>" + this.obj[this.prop] + "<br><br>";
		}
		if(this.properties == ''){
			this.properties = 'Property is none.';
		}
		// �ʃy�[�W�ɕ\�������
		// �ꏊ�ɂ���Ă�FPS�\���̘g�Ȃǂ��\�������͎̂d�l
		this.newWin = window.open(this.obj, this.obj, "width=400,height=600");
		this.newWin.document.open();
		this.newWin.document.write('<title>�v���p�e�B���X�g</title>');
		this.newWin.document.write(this.properties);
		this.newWin.document.close();
	}
};

// �ǂݍ��񂾉摜��`��
function setImage(img, opt){
	this.opt = opt;
	var canvas = document.getElementById(this.opt);
	var context = canvas.getContext('2d');

	// �摜�ǂݍ���
	var image = new Image();
	image.src = img;
	// �ǂݍ��ݏI����҂�
	image.onload = function() {
		// �`��̈���摜�̃T�C�Y�Ƀ��T�C�Y
		// width>500 or height>400�̏ꍇ�͋����I��500�ɏk��
		var scale = 400/image.height;
		if(image.width > image.height)
			scale = 500/image.width;
		if(scale < 1.0 & document.getElementById('resize').checked){
			canvas.width = scale*image.width;
			canvas.height = scale*image.height;
			context.scale(scale, scale);
		}else{
			canvas.width = image.width;
			canvas.height = image.height;
		}
		// �摜�`��
		context.drawImage(image, 0, 0);
		// ��f�f�[�^�ǂݍ���
		var input = context.getImageData(0, 0, canvas.width, canvas.height);
		w = input.width, h = input.height;
		inputData = input.data;
		// �������p�I�u�W�F�N�g
		initialize = context.getImageData(0, 0, canvas.width, canvas.height);
		initializeData = initialize.data;
		CV.history.push(context.drawImage(image, 0, 0));
	}
}

//�u�����f�B���O�p
function setBlendImage1(img, opt){
	this.opt = opt;
	var canvas = document.getElementById(this.opt);
	var context = canvas.getContext('2d');

	// �摜�ǂݍ���
	var image = new Image();
	image.src = img;
	// �ǂݍ��ݏI����҂�
	image.onload = function() {
		// �`��̈���摜�̃T�C�Y�Ƀ��T�C�Y
		// width>500 or height>400�̏ꍇ�͋����I��500�ɏk��
		var scale = 400/image.height;
		if(image.width > image.height)
			scale = 500/image.width;
		if(scale < 1.0 & document.getElementById('resize').checked){
			canvas.width = scale*image.width;
			canvas.height = scale*image.height;
			context.scale(scale, scale);
		}else{
			canvas.width = image.width;
			canvas.height = image.height;
		}
		// �摜�`��
		context.drawImage(image, 0, 0);
		// ��f�f�[�^�ǂݍ���
		input1 = context.getImageData(0, 0, canvas.width, canvas.height);
		w1 = input1.width, h1 = input1.height;
		inputData1 = input1.data;
		// �������p�I�u�W�F�N�g
		initialize1 = context.getImageData(0, 0, canvas.width, canvas.height);
		initializeData1 = initialize1.data;
		// �摜�ϊ��p�I�u�W�F�N�g
		output = context.createImageData(canvas.width, canvas.height);
		outputData = output.data;
	}
}

function setBlendImage2(img, opt){
	this.opt = opt;
	var canvas = document.getElementById(this.opt);
	var context = canvas.getContext('2d');

	// �摜�ǂݍ���
	var image = new Image();
	image.src = img;
	// �ǂݍ��ݏI����҂�
	image.onload = function() {
		// �`��̈���摜�̃T�C�Y�Ƀ��T�C�Y
		// width>500 or height>400�̏ꍇ�͋����I��500�ɏk��
		var scale = 400/image.height;
		if(image.width > image.height)
			scale = 500/image.width;
		if(scale < 1.0 & document.getElementById('resize').checked){
			canvas.width = scale*image.width;
			canvas.height = scale*image.height;
			context.scale(scale, scale);
		}else{
			canvas.width = image.width;
			canvas.height = image.height;
		}
		// �摜�`��
		context.drawImage(image, 0, 0);
		// ��f�f�[�^�ǂݍ���
		input2 = context.getImageData(0, 0, canvas.width, canvas.height);
		w2 = input2.width, h2 = input2.height;
		inputData2 = input2.data;
		// �������p�I�u�W�F�N�g
		initialize2 = context.getImageData(0, 0, canvas.width, canvas.height);
		initializeData2 = initialize2.data;
	}
}

CV.blend = function(mode){
	this.canvas = document.getElementById("blendImg");
	this.context = this.canvas.getContext('2d');
	this.canvas.width = output.width;
	this.canvas.height = output.height;

	// �𑜓x�̏����������g��
	var w = w1;
	if(w1 > w2) w = w2;
	var h = h1;
	if(h1 > h2) h = h2;

	// �A���t�@�l�̏�����
	if(document.getElementById("transparent").checked){
		// �P�x�v�Z
		var opacity = document.getElementById('opacity').value;
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				var gray = 
					+ 0.299 * inputData1[i]
					+ 0.587 * inputData1[i + 1]
					+ 0.114 * inputData1[i + 2];
				// ���P�x�ȏ�̃s�N�Z���𓧉�
				if(gray >= opacity)
					outputData[i + 3] = 0;
			}
		}
	}else{
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				outputData[i + 3] = inputData1[i + 3];
			}
		}
	}
	
	//Basic
	if(mode == "add"){		// ���Z
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				var calc = function (base, blend){
					var value = base + blend;
					if(value > 255)
						value = 255;
					return value;
				}
				outputData[i + 0] = calc(inputData1[i + 0], inputData2[i + 0]);
				outputData[i + 1] = calc(inputData1[i + 1], inputData2[i + 1]);
				outputData[i + 2] = calc(inputData1[i + 2], inputData2[i + 2]);
			}
		}
	}
	else if(mode == "diff"){	// ���Z
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				var calc = function (base, blend){
					var value = base - blend;
					if(value < 0)
						value = 0;
					return value;
				}
				outputData[i + 0] = calc(inputData1[i + 0], inputData2[i + 0]);
				outputData[i + 1] = calc(inputData1[i + 1], inputData2[i + 1]);
				outputData[i + 2] = calc(inputData1[i + 2], inputData2[i + 2]);
			}
		}
	}
	else if(mode == "exclusion"){	// ���O
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				var calc = function (base, blend){
					// �������敽��
					var value = base + blend - 2 * base * blend / 255;
					return value;
				}
				outputData[i + 0] = calc(inputData1[i + 0], inputData2[i + 0]);
				outputData[i + 1] = calc(inputData1[i + 1], inputData2[i + 1]);
				outputData[i + 2] = calc(inputData1[i + 2], inputData2[i + 2]);
			}
		}
	}
	else if(mode == "abs"){		// ���̐�Βl
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				var calc = function (base, blend){
					var value = Math.abs(base - blend);
					return value;
				}
				outputData[i + 0] = calc(inputData1[i + 0], inputData2[i + 0]);
				outputData[i + 1] = calc(inputData1[i + 1], inputData2[i + 1]);
				outputData[i + 2] = calc(inputData1[i + 2], inputData2[i + 2]);
			}
		}
	}
	//Darken
	else if(mode == "multi"){	// ��Z
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				var calc = function (base, blend){
					var value = base * blend / 255;
					return value;
				}
				outputData[i + 0] = calc(inputData1[i + 0], inputData2[i + 0]);
				outputData[i + 1] = calc(inputData1[i + 1], inputData2[i + 1]);
				outputData[i + 2] = calc(inputData1[i + 2], inputData2[i + 2]);
			}
		}
	}
	else if(mode == "burn"){	// �Ă�����
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				var calc = function (base, blend){
					var value;
					if(blend == 0)
						value = 0;
					else
						value = 255 - ((255 - base) * 255 / blend);
					if(value < 0)
						value = 0;
					return value;
				}
				outputData[i + 0] = calc(inputData1[i + 0], inputData2[i + 0]);
				outputData[i + 1] = calc(inputData1[i + 1], inputData2[i + 1]);
				outputData[i + 2] = calc(inputData1[i + 2], inputData2[i + 2]);
			}
		}
	}
	// Lighten
	else if(mode == "screen"){	// �X�N���[��
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				var calc = function (base, blend){
					// ���]�F�ŏ�Z���Ĕ��]
					var value = 255 - ((255 - base) * (255 - blend)) / 255;
					return value;
				}
				outputData[i + 0] = calc(inputData1[i + 0], inputData2[i + 0]);
				outputData[i + 1] = calc(inputData1[i + 1], inputData2[i + 1]);
				outputData[i + 2] = calc(inputData1[i + 2], inputData2[i + 2]);
			}
		}
	}
	else if(mode == "dodge"){	// �����Ă�
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				var calc = function (base, blend){
					var value;
					if(blend == 255)
						value = 255;
					else
						value = base * 255 / (255 - blend);
					if(value > 255)
						value = 255;
					return value;
				}
				outputData[i + 0] = calc(inputData1[i + 0], inputData2[i + 0]);
				outputData[i + 1] = calc(inputData1[i + 1], inputData2[i + 1]);
				outputData[i + 2] = calc(inputData1[i + 2], inputData2[i + 2]);
			}
		}
	}
	// Contrast
	else if(mode == "overlay"){		// �I�[�o�[���C
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				var calc = function (base, blend){
					var value;
					if(base < 128)
						value = base * blend * 2 / 255;
					else
						value = 2 * (base + blend - base * blend / 255) - 255;
					if(value > 255)
						value = 255;
					return value;
				}
				outputData[i + 0] = calc(inputData1[i + 0], inputData2[i + 0]);
				outputData[i + 1] = calc(inputData1[i + 1], inputData2[i + 1]);
				outputData[i + 2] = calc(inputData1[i + 2], inputData2[i + 2]);
			}
		}
	}
	else if(mode == "soft"){	// �\�t�g���C�g
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				var calc = function (base, blend){
					var value;
					if(blend < 128)
						value = Math.pow((base / 255), ((255 - blend) / 128)) * 255;
					else
						value = Math.pow((base / 255), (128 / blend)) * 255;
					return value;
				}
				outputData[i + 0] = calc(inputData1[i + 0], inputData2[i + 0]);
				outputData[i + 1] = calc(inputData1[i + 1], inputData2[i + 1]);
				outputData[i + 2] = calc(inputData1[i + 2], inputData2[i + 2]);
			}
		}
	}
	else if(mode == "hard"){	// �n�[�h���C�g
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				var calc = function (base, blend){
					var value;
					if(blend < 128)
						value = base * blend * 2 / 255;
					else
						value = (1 - 2 * (1 - base/255) * (1 - blend/255)) * 255;
					if(value > 255)
						value = 255;
					return value;
				}
				outputData[i + 0] = calc(inputData1[i + 0], inputData2[i + 0]);
				outputData[i + 1] = calc(inputData1[i + 1], inputData2[i + 1]);
				outputData[i + 2] = calc(inputData1[i + 2], inputData2[i + 2]);
			}
		}
	}
	else if(mode == "linear"){	// ���j�A���C�g
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				var calc = function (base, blend){
					var value;
					if(blend < 128)
						value = base + 2 * blend - 255;
					else
						value = base + 2 * (blend - 128);
					return value;
				}
				outputData[i + 0] = calc(inputData1[i + 0], inputData2[i + 0]);
				outputData[i + 1] = calc(inputData1[i + 1], inputData2[i + 1]);
				outputData[i + 2] = calc(inputData1[i + 2], inputData2[i + 2]);
			}
		}
	}
	else if(mode == "pin"){		// �s�����C�g
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				var calc = function (base, blend){
					if(blend < 128)
						value = Math.min(base, 2 * blend);
					else
						value = Math.max(base, 2 * (blend - 128));
					return value;
				}
				outputData[i + 0] = calc(inputData1[i + 0], inputData2[i + 0]);
				outputData[i + 1] = calc(inputData1[i + 1], inputData2[i + 1]);
				outputData[i + 2] = calc(inputData1[i + 2], inputData2[i + 2]);
			}
		}
	}
	else if(mode == "vivid"){	// �r�r�b�h���C�g
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				var calc = function (base, blend){
					var value;
					if(blend < 128){
						value = (1 - (255 - base) / (2 * blend)) * 255;
					}
					else{
						value = (base / (255 - 2 * (blend - 128))) * 255;
					}
					return value;
				}
				outputData[i + 0] = calc(inputData1[i + 0], inputData2[i + 0]);
				outputData[i + 1] = calc(inputData1[i + 1], inputData2[i + 1]);
				outputData[i + 2] = calc(inputData1[i + 2], inputData2[i + 2]);
			}
		}
	}
	else if(mode == "vividmis"){	// ���s��
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				var calc = function (base, blend){
					var value;
					if(blend < 128){
						value = base / (255 - blend * 2);
					}
					else{
						value = 255 - (255 - base) / (2 * (blend - 128));
					}
					return value;
				}
				outputData[i + 0] = calc(inputData1[i + 0], inputData2[i + 0]);
				outputData[i + 1] = calc(inputData1[i + 1], inputData2[i + 1]);
				outputData[i + 2] = calc(inputData1[i + 2], inputData2[i + 2]);
			}
		}
	}
	this.context.putImageData(output, 0, 0);
}

/***************
** ��̓I�ȃ��\�b�h
****************/

/////////////////
// ��{�I�ȃ��\�b�h //
/////////////////

// �`��̈惊�T�C�Y
CV.resize = function(){
	if(!document.getElementById("change").checked){
		this.canvas = document.getElementById("divImg2");
		this.context = this.canvas.getContext('2d');
		this.canvas.width = output.width;
		this.canvas.height = output.height;
	}else{
		this.canvas = document.getElementById("divImg1");
		this.context = this.canvas.getContext('2d');
		this.canvas.width = output.width;
		this.canvas.height = output.height;
	}
}

// ������
CV.init = function(){
	// CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			for (var c = 0; c < 4; c++) {
				var i = (y*w + x)*4 + c;
				inputData1[i] = initializeData1[i];
				inputData2[i] = initializeData2[i];
				outputData[i] = initializeData1[i];
			}
		}
	}
	this.context.putImageData(initialize, 0, 0);
}

// �d�ˊ|���p�̃R�s�[
CV.copy = function(){
	var history = CV.history;
	CV.resize();
	var temp = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
	history.push(temp);
	if(document.getElementById('copy').checked){
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				for (var c = 0; c < 4; c++) {
					var i = (y*w + x)*4 + c;
					inputData[i] = outputData[i];
					history[history.length-1].data[i] = outputData[i]; 
				}
			}
		}
	}
	this.context.putImageData(output, 0, 0);
}

// �߂�
CV.undo = function(){
	var history = CV.history;
	// resize���ƃ_��
	if(!document.getElementById("change").checked){
		var canvas = document.getElementById("divImg2");
		var context = canvas.getContext('2d');
		canvas.width = output.width;
		canvas.height = output.height;
	}else{
		var canvas = document.getElementById("divImg1");
		var context = canvas.getContext('2d');
		canvas.width = output.width;
		canvas.height = output.height;
	}
	var pre = history.length - 2;
	if(pre > 0){
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				for (var c = 0; c < 4; c++) {
					var i = (y*w + x)*4 + c;
					inputData[i] = history[pre].data[i];
					outputData[i] = history[pre].data[i];
				}
			}
		}
		history.pop();
	}
	context.putImageData(output, 0, 0);
}

// ����ւ�
CV.change = function(){
	CV.resize();
	var w = w1;
	if(w1 > w2) w = w2;
	var h = h1;
	if(h1 > h2) h = h2;

	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			outputData[i + 0] = inputData1[i + 0];
			outputData[i + 1] = inputData1[i + 1];
			outputData[i + 2] = inputData1[i + 2];
			outputData[i + 3] = inputData1[i + 3];
		}
	}
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			inputData1[i + 0] = inputData2[i + 0];
			inputData1[i + 1] = inputData2[i + 1];
			inputData1[i + 2] = inputData2[i + 2];
			inputData1[i + 3] = inputData2[i + 3];
		}
	}
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			inputData2[i + 0] = outputData[i + 0];
			inputData2[i + 1] = outputData[i + 1];
			inputData2[i + 2] = outputData[i + 2];
			inputData2[i + 3] = outputData[i + 3];
		}
	}
	var canvas = document.getElementById("divImg1");
	var context = canvas.getContext('2d');
	context.putImageData(input1, 0, 0);
	canvas = document.getElementById("divImg2");
	context = canvas.getContext('2d');
	context.putImageData(input2, 0, 0);
}

// �q�X�g�O����
CV.hist = function(){
	CV.resize();
	var hist = {
		r: [],
		g: [],
		b: []
	};
	for(var i=0; i<256; i++){
		hist.r[i] = hist.g[i] = hist.b[i] = 0;
	}
	// �e�F�̋P�x���Ƃ̉�f�������߂�
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			i = (y*w + x)*4;
			outputData[i + 0] = inputData[i + 0];
			outputData[i + 1] = inputData[i + 1];
			outputData[i + 2] = inputData[i + 2];
			outputData[i + 3] = inputData[i + 3];
			hist.r[ inputData[i + 0] ]++;
			hist.g[ inputData[i + 1] ]++;
			hist.b[ inputData[i + 2] ]++;
		}
	}
	// �S��f���ɑ΂���P�x���Ƃ̉�f�̊��������߂�
	var max = w*h;
	for(var i=0; i<256; i++){
		hist.r[i] = hist.r[i]/max*100;
		hist.g[i] = hist.g[i]/max*100;
		hist.b[i] = hist.b[i]/max*100;
	}
	// �P�x0��255�͕\�����Ȃ�
	hist.r[0] = hist.r[255] = 0;
	hist.g[0] = hist.g[255] = 0;
	hist.b[0] = hist.b[255] = 0;
	CV.copy();
	// �O���t��`��
	(function(){
		// �O��̃O���t������
		document.getElementById('histgram').innerHTML = "";
		document.getElementById('histgram').style.backgroundColor = "#aaccff";
		var r = Raphael("histgram", 460, 170);	// �\���̈�̃T�C�Y
		var txtattr = { font: "15px sans-serif" };
		r.text(200, 12, "Color Histgram").attr(txtattr);
		r.text(20, 12, "[%]").attr(txtattr);
		r.text(430, 150, "�P�x").attr(txtattr);

		var x = [];
		for(var i=0; i<=260; i++){
			x[i] = i;
		}
		// ���_�i����j, width, height, xValue[], yValue[], opts
		var lines = r.linechart(10, 12, 400, 145, 
			// ��
			[x],
			// �c
			[hist.r, hist.g, hist.b],
			// �I�v�V����
			{
				nostroke: false,	// false�œ_���q��
				axis: "0 0 1 1",	// ��, �E, ��, ������\��
				axisxstep: 13,	// x���̕������i���x���Ԋu�ɑ��� 260/13=20�j
				axisystep: 5,	// y���̕�����
				colors: ["#f00", "#0f0", "#00f"],	// �܂���̐F
				gutter: 15,	// padding
				shade: true,
				symbol: "circle",	// �_�̌`
				smooth: true
			}
		);
		var xlabel = lines.axis[0].text.items;
		var ylabel = lines.axis[1].text.items;
		lines.axis.attr({"stroke-width": 3,});	// ���̑���
		// ���x���̕����T�C�Y�ύX
		for(var i=0; i<xlabel.length; i++){
			xlabel[i].attr(txtattr);
		}
		for(var i=0; i<ylabel.length; i++){
			ylabel[i].attr(txtattr);
		}
		// �_�̃T�C�Y�ύX
		lines.symbols.attr({ r: 1 });
	})();
}

// ��{�`
CV.sample = function(){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			outputData[i + 0] = inputData[i + 0];
			outputData[i + 1] = inputData[i + 1];
			outputData[i + 2] = inputData[i + 2];
			outputData[i + 3] = inputData[i + 3];
		}
	}
	this.context.putImageData(output, 0, 0);
}

/////////////////////
// RGB��HSV�̑��ݕϊ� //
/////////////////////

// RGB��HSV�ϊ�
CV.RGB2HSV = function(color){
	CV.resize();
	// color�ɒl���i�[
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			color.push({
				r:inputData[i],
				g:inputData[i+1],
				b:inputData[i+2],
				h:0, s:0, v:0
			});
		}
	}
	// HSV�̒l���v�Z���Ċi�[
	for(var i=0; i<color.length; i++){
		var max = Math.max(color[i].r, Math.max(color[i].g, color[i].b));
		var min = Math.min(color[i].r, Math.min(color[i].g, color[i].b));
		// Hue�̌v�Z
		if(max == min){
			color[i].h = 0;
		}else if(max == color[i].r){
			color[i].h = (60 * (color[i].g - color[i].b) / (max - min) + 360) % 360;
		}else if(max == color[i].g){
			color[i].h = (60 * (color[i].b - color[i].r) / (max - min)) + 120;
		}else if(max == color[i].b){
			color[i].h = (60 * (color[i].r - color[i].g) / (max - min)) + 240;
		}
		// Saturation�̌v�Z
		if(max == 0){
			color[i].s = 0;
		}else{
			color[i].s = (255 * ((max - min) / max))
		}
		// Value�̌v�Z
		color[i].v = max;
	}
	return color;
}

// HSV��RGB�ϊ�
CV.HSV2RGB = function(color){
	var hi, f, p, q, t;
	for(var i=0; i<color.length; i++){
		hi = Math.floor(color[i].h / 60.0) % 6;
		f  = (color[i].h / 60.0) - Math.floor(color[i].h / 60.0);
		p  = Math.round(color[i].v * (1.0 - (color[i].s / 255.0)));
		q  = Math.round(color[i].v * (1.0 - (color[i].s / 255.0) * f));
		t  = Math.round(color[i].v * (1.0 - (color[i].s / 255.0) * (1.0 - f)));
		
		switch(hi){
			case 0:
				color[i].r = color[i].v;
				color[i].g = t;
				color[i].b = p;
				break;
			case 1:
				color[i].r = q;
				color[i].g = color[i].v;
				color[i].b = p;
				break;
			case 2:
				color[i].r = p;
				color[i].g = color[i].v;
				color[i].b = t;
				break;
			case 3:
				color[i].r = p;
				color[i].g = q;
				color[i].b = color[i].v;
				break;
			case 4:
				color[i].r = t;
				color[i].g = p;
				color[i].b = color[i].v;
				break;
			case 5:
				color[i].r = color[i].v;
				color[i].g = p;
				color[i].b = q;
				break;
			default:
				alert("error");
		}
	}
	return color;
}

// HSV�ϊ�
CV.hsv = function(type){
	CV.resize();
	var hue = Number(document.getElementById('hueValue').value);
	var sat = Number(document.getElementById('satValue').value);
	var vol = Number(document.getElementById('volValue').value);

	// ���o�p
	var hueS = Number(document.getElementById('hueStart').value);
	var hueE = Number(document.getElementById('hueEnd').value);
	var satS = Number(document.getElementById('satStart').value);
	var satE = Number(document.getElementById('satEnd').value);
	var volS = Number(document.getElementById('volStart').value);
	var volE = Number(document.getElementById('volEnd').value);
	var hueCH = Number(document.getElementById('convHValue').value);
	// �ʓx�E���x�͎g���ɂ����̂ŃR�����g�A�E�g
	// var hueCS = Number(document.getElementById('convSValue').value);
	// var hueCV = Number(document.getElementById('convVValue').value);
	// �z���������
	CV.color.length = 0;
	// HSV�֕ϊ�
	var color = CV.RGB2HSV(CV.color);
	// ���֐�������ƒ����Ȃ�̂Ŋȗ���
	switch(type){
		// �F���ϊ�
		case 'hue':
			for(var i=0; i<color.length; i++){
				color[i].h += hue;
				if(color[i].h < 0){
					color[i].h += 360;
				}else if(color[i].h > 360){
					color[i].h -= 360;
				}
			}
		break;
		// �ʓx����
		case 'sat':
			for(var i=0; i<color.length; i++){
				if(color[i].s > 10)
					color[i].s += sat;
				if(color[i].s < 0){
					color[i].s = 0;
				}else if(color[i].s > 255){
					color[i].s = 255;
				}
			}
		break;
		// ���x����
		case 'vol':
			for(var i=0; i<color.length; i++){
				color[i].v += vol;
				if(color[i].v < 0){
					color[i].v = 0;
				}else if(color[i].v > 255){
					color[i].v = 255;
				}
			}
		break;
		// ���o�̈�ȊO�J�b�g
		case 'cut':
			for(var i=0; i<color.length; i++){
				if(!(
					(color[i].h >= hueS) & (color[i].h <= hueE) &
					(color[i].s >= satS) & (color[i].s <= satE) &
					(color[i].v >= volS) & (color[i].v <= volE)
					)
				){
					color[i].v = 0;
				}
			}
		break;
		// ���o�̈�𔒂�
		case 'white':
			for(var i=0; i<color.length; i++){
				if(
					(color[i].h >= hueS) & (color[i].h <= hueE) &
					(color[i].s >= satS) & (color[i].s <= satE) &
					(color[i].v >= volS) & (color[i].v <= volE)
				){
					color[i].s = 0;
					color[i].v = 255;
				}
			}
		break;
		// ���o�̈������
		case 'black':
			for(var i=0; i<color.length; i++){
				if(
					(color[i].h >= hueS) & (color[i].h <= hueE) &
					(color[i].s >= satS) & (color[i].s <= satE) &
					(color[i].v >= volS) & (color[i].v <= volE)
				){
					color[i].v = 0;
				}
			}
		break;
		// ���o�̈�̐F����ϊ�
		case 'extractH':
			for(var i=0; i<color.length; i++){
				if(
					(color[i].h >= hueS) & (color[i].h <= hueE) &
					(color[i].s >= satS) & (color[i].s <= satE) &
					(color[i].v >= volS) & (color[i].v <= volE)
				){
					color[i].h += hueCH;
					if(color[i].h < 0){
						color[i].h += 360;
					}else if(color[i].h > 360){
						color[i].h -= 360;
					}
				}
			}
		break;
		// // ���o�̈�̍ʓx��ϊ�
		// case 'extractS':
		// 	for(var i=0; i<color.length; i++){
		// 		if(
		// 			(color[i].h >= hueS) & (color[i].h <= hueE) &
		// 			(color[i].s >= satS) & (color[i].s <= satE) &
		// 			(color[i].v >= volS) & (color[i].v <= volE)
		// 		){
		// 			color[i].s += hueS;
		// 			if(color[i].s < 0){
		// 				color[i].s = 0;
		// 			}else if(color[i].s > 255){
		// 				color[i].s = 255;
		// 			}
		// 		}
		// 	}
		// break;
		// // ���o�̈�̖��x��ϊ�
		// case 'extractV':
		// 	for(var i=0; i<color.length; i++){
		// 		if(
		// 			(color[i].h >= hueS) & (color[i].h <= hueE) &
		// 			(color[i].s >= satS) & (color[i].s <= satE) &
		// 			(color[i].v >= volS) & (color[i].v <= volE)
		// 		){
		// 			color[i].v += hueCV;
		// 			if(color[i].v < 0){
		// 				color[i].v = 0;
		// 			}else if(color[i].v > 255){
		// 				color[i].v = 255;
		// 			}
		// 		}
		// 	}
		// break;
	}
	// RGB�֖߂�
	color = CV.HSV2RGB(color);
	// �ϊ�����
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			outputData[i + 0] = color[Math.floor(i/4)].r;
			outputData[i + 1] = color[Math.floor(i/4)].g;
			outputData[i + 2] = color[Math.floor(i/4)].b;
			outputData[i + 3] = inputData[i + 3];
		}
	}
	CV.copy();
}

////////////
// RGB���o //
////////////
CV.rgb = function(mode){
	CV.resize();
	if(mode == "R"){
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				outputData[i] = inputData[i];
				outputData[i+1] = 0;
				outputData[i+2] = 0;
				outputData[i+3] = inputData[i+3];
			}
		}
	}
	else if(mode == "G"){
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				outputData[i] = 0;
				outputData[i+1] = inputData[i+1];
				outputData[i+2] = 0;
				outputData[i+3] = inputData[i+3];
			}
		}
	}
	else if(mode == "B"){
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				outputData[i] = 0;
				outputData[i+1] = 0;
				outputData[i+2] = inputData[i+2];
				outputData[i+3] = inputData[i+3];
			}
		}
	}
	CV.copy();
}

/////////////
// �F���ϊ� //
/////////////

// �l�K�|�W���]
CV.negaposi = function(){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			outputData[i] = 255 - inputData[i];
			outputData[i+1] = 255 - inputData[i+1];
			outputData[i+2] = 255 - inputData[i+2];
			outputData[i+3] = inputData[i+3];
		}
	}
	CV.copy();
}

// �O���[�X�P�[��
CV.gray = function(){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			// �O���[�X�P�[���̒萔
			var gray = 
				+ 0.299 * inputData[i]
				+ 0.587 * inputData[i + 1]
				+ 0.114 * inputData[i + 2];
			outputData[i + 0] = gray;
			outputData[i + 1] = gray;
			outputData[i + 2] = gray;
			outputData[i + 3] = inputData[i + 3];
		}
	}
	CV.copy();
}

// �Z�s�A��
CV.sepia = function(){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			// �O���[�X�P�[���̒萔
			var gray = 
				+ 0.299 * inputData[i]
				+ 0.587 * inputData[i + 1]
				+ 0.114 * inputData[i + 2];
			outputData[i + 0] = gray / 255 * 240;
			outputData[i + 1] = gray / 255 * 200;
			outputData[i + 2] = gray / 255 * 140;
			outputData[i + 3] = inputData[i + 3];
		}
	}
	CV.copy();
}

// ��l��
CV.binary = function(){
	CV.resize();
	var threshold = document.getElementById('threshold').value;
	var bin = [];
	// LUT�쐬
	for(var i=0; i<threshold; i++){
		bin[i] = 0;
	}
	for(var i=threshold; i<256; i++){
		bin[i] = 255;
	}
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			// �O���[�X�P�[���̒萔
			var gray = Math.round(
				+ 0.299 * inputData[i]
				+ 0.587 * inputData[i + 1]
				+ 0.114 * inputData[i + 2]
			);
			outputData[i + 0] = bin[gray];
			outputData[i + 1] = bin[gray];
			outputData[i + 2] = bin[gray];
			outputData[i + 3] = inputData[i + 3];
		}
	}
	CV.copy();
}

/////////////
// �G�b�W���o //
/////////////

// �G�b�W���o�i8�ߖT���v���V�A���j
CV.edge = function(){
	CV.sobel(8);
}

// �G�b�W���o�i4�ߖT���v���V�A���j
CV.edge2 = function(){
	CV.sobel(4);
}

// �\�[�x���i�����v���V�A���j
CV.sobel = function(opt){
	CV.resize();
	var course;
	if(opt == 4){
		// 4�ߖT���v���V�A��
		course = 0;
	}else if(opt == 8){
		// 8�ߖT���v���V�A��
		course = 5;
	}else{
		// �n�������̓e���L�[�̐����̈ʒu�ɑΉ�
		course = parseInt(document.getElementById('course').value);
	}
	switch(course){
		case 0: var S = [0, 1, 0, 1, -4, 1, 0, 1, 0];break;	// 4�ߖT
		case 1: var S = [0, -1, -2, 1, 0, -1, 2, 1, 0];break;
		case 2: var S = [-1, -2, -1, 0, 0, 0, 1, 2, 1];break;
		case 3: var S = [-2, -1, 0, -1, 0, 1, 0, 1, 2];break;
		case 4: var S = [1, 0, -1, 2, 0, -2, 1, 0, -1];break;
		case 5: var S = [1, 1, 1, 1, -8, 1, 1, 1, 1];break;	// 8�ߖT
		case 6: var S = [-1, 0, 1, -2, 0, 2, -1, 0, 1];break;
		case 7: var S = [2, 1, 0, 1, 0, -1, 0, -1, -2];break;
		case 8: var S = [1, 2, 1, 0, 0, 0, -1, -2, -1];break;
		case 9: var S = [0, 1, 2, -1, 0, 1, -2, -1, 0];break;
	}
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				outputData[i] = 
					S[0]*inputData[i - w*4 - 4] + S[1]*inputData[i - w*4] + S[2]*inputData[i - w*4 + 4] +
					S[3]*inputData[i - 4] + S[4]*inputData[i] + S[5]*inputData[i + 4] +
					S[6]*inputData[i + w*4 - 4] + S[7]*inputData[i + w*4] + S[8]*inputData[i + w*4 + 4];
			}
			outputData[(y*w + x)*4 + 3] = inputData[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy();
}

//////////
// �ڂ��� //
//////////

// �����_������ւ�(NxN)
CV.shuffle = function(N){
	CV.resize();
	var size = Math.pow(N, 2);
	// �ʒu�����ւ��邽�߂̔z��
	var number = [];
	for(var i=0; i<size; i++){
		number[i] = []
	}
	// �z��̗v�f�������_���ɓ���ւ���
	Array.prototype.shuffle = function() {
		var i = this.length;
		while(i){
			var j = Math.floor(Math.random()*i);
			var t = this[--i];
			this[i] = this[j];
			this[j] = t;
		}
		return this;
	}
	var offset = (N-1)/2;
	for (var y = offset; y < h-offset; y++) {
		for (var x = offset; x < w-offset; x++) {
			// �J�[�l�����̉�f���Ƃ�RGB���i�[
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				var k = 0;
				for(var dy=0; dy<N; dy++){
					for(var dx=0; dx<N; dx++){
						var horizon = w*(-(N-1)/2*4 + 4*dx);
						var vertical = -(N-1)/2*4 + 4*dy;
						number[k][c] = inputData[i + horizon + vertical];
						k++;
					}
				}
			}
			number.shuffle();
			// �����_���ɓ���ւ�����f����
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				var k = 0;
				for(var dy=0; dy<N; dy++){
					for(var dx=0; dx<N; dx++){
						outputData[i + w*dx*4 + dy*4] = number[k][c];
						k++;
					}
				}
			}
			outputData[(y*w + x)*4 + 3] = inputData[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy();
}

// ���f�B�A��
CV.median = function(){
	CV.resize();
	// �����l�����߂邽�߂̔z��
	var number = [];
	// �N�C�b�N�Z���N�g�ik�Ԗڂ̒l�����������Ȃ�\�[�g�j
	// �����l�i������5�Ԗځj���~���������Ȃ̂ŁA���ׂă\�[�g����K�v�͖���
	Array.prototype.quickselect = function(k, l, r) {
		var v, i, j, t;
		var l = l || 0;	// �J�n�ʒu
		var r = r || this.length - 1;	// �I���ʒu
		if (r > l) {
			v = this[r]; i = l-1; j = r;
			for (;;) {
				while(this[++i] < v);
				while(this[--j] > v);
				if(i >= j)
					break;
				t = this[i]; this[i] = this[j]; this[j] = t;
			}
			t = this[i]; this[i] = this[r]; this[r] = t;
			if (i > l+k-1)
				this.quickselect(k, l, i-1);
			if (i < l+k-1)
				this.quickselect(k-i, i+1, r);
		}
		return this;
	}
	// ���f�B�A���t�B���^�̏���
	for (var y = 1; y < h-1; y++) {
		for (var x = 1; x < w-1; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				// 3x3�̃f�[�^���i�[�i���̓��������ԑ��������j
				number[0] = inputData[i - w*4 - 4];
				number[1] = inputData[i - w*4];
				number[2] = inputData[i - w*4 + 4];
				number[3] = inputData[i - 4];
				number[4] = inputData[i];
				number[5] = inputData[i + 4];
				number[6] = inputData[i + w*4 - 4];
				number[7] = inputData[i + w*4];
				number[8] = inputData[i + w*4 + 4];
				// �f�t�H���g�̃\�[�g�i���Ԃ�N�C�b�N�\�[�g�j
				// number.sort(
				// 	function(a,b){
				// 		if( a < b ) return -1;
				// 		if( a > b ) return 1;
				// 		return 0;
				// 	}
				// );
				// �N�C�b�N�Z���N�g��
				number.quickselect(5);
				// �����l����
				outputData[i] = number[4];
			}
			outputData[(y*w + x)*4 + 3] = inputData[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy();
}

// ������(NxN)
CV.smoothing = function(N){
	N = N || 5;
	CV.resize();
	var smooth = Math.pow(N, -2);
	// �S��f���[�v
	var offset = (N-1)/2;
	for (var y = offset; y < h-offset; y++) {
		for (var x = offset; x < w-offset; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				var sum = 0;
				// �J�[�l���S���[�v
				for(var dy=0; dy<N; dy++){
					for(var dx=0; dx<N; dx++){
						var horizon = w*(-(N-1)/2*4 + 4*dx);
						var vertical = -(N-1)/2*4 + 4*dy;
						// �P�x�l�v�Z
						sum += smooth * inputData[i + horizon +  vertical];
					}
				}
				outputData[i] = Math.round(sum);
			}
			outputData[(y*w + x)*4 + 3] = inputData[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy();
}

// ��s��(3x3)
CV.sharp = function(){
	CV.resize();
	var k = document.getElementById('sharpValue').value;
	for (var y = 1; y < h-1; y++) {
		for (var x = 1; x < w-1; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				outputData[i] = 
					-k/9*inputData[i - w*4 - 4] - k/9*inputData[i - w*4] - k/9*inputData[i - w*4 + 4]
					-k/9*inputData[i - 4] + (1+8*k/9)*inputData[i] - k/9*inputData[i + 4]
					-k/9*inputData[i + w*4 - 4] - k/9*inputData[i + w*4] - k/9*inputData[i + w*4 + 4];
			}
			outputData[(y*w + x)*4 + 3] = inputData[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy();
}

// �K�E�V�A��(3x3)
// NxN�͓񍀒藝���K�v�ŏd���Ȃ肻����������Ȃ�
CV.gaussian = function(){
	CV.resize();
	for (var y = 1; y < h-1; y++) {
		for (var x = 1; x < w-1; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				outputData[i] = 
					1/16*inputData[i - w*4 - 4] + 2/16*inputData[i - w*4] + 1/16*inputData[i - w*4 + 4] +
					2/16*inputData[i - 4] + 4/16*inputData[i] + 2/16*inputData[i + 4] +
					1/16*inputData[i + w*4 - 4] + 2/16*inputData[i + w*4] + 1/16*inputData[i + w*4 + 4];
			}
			outputData[(y*w + x)*4 + 3] = inputData[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy();
}

// �K�E�V�A��(5x5)
CV.gaussian2 = function(){
	CV.resize();
	for (var y = 2; y < h-2; y++) {
		for (var x = 2; x < w-2; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				outputData[i] = 
					1/256*inputData[i - w*8 - 8] + 
					4/256*inputData[i - w*8 - 4] + 
					6/256*inputData[i - w*8] + 
					4/256*inputData[i - w*8 + 4] +
					1/256*inputData[i - w*8 + 8] +

					4/256*inputData[i - w*4 - 8] + 
					16/256*inputData[i - w*4 - 4] + 
					24/256*inputData[i - w*4] + 
					16/256*inputData[i - w*4 + 4] +
					4/256*inputData[i - w*4 + 8] +

					6/256*inputData[i - 8] + 
					24/256*inputData[i - 4] + 
					36/256*inputData[i] + 
					24/256*inputData[i + 4] +
					6/256*inputData[i + 8] +

					4/256*inputData[i + w*4 - 8] + 
					16/256*inputData[i + w*4 - 4] + 
					24/256*inputData[i + w*4] + 
					16/256*inputData[i + w*4 + 4] +
					4/256*inputData[i + w*4 + 8] +

					1/256*inputData[i + w*8 - 8] + 
					4/256*inputData[i + w*8 - 4] + 
					6/256*inputData[i + w*8] + 
					4/256*inputData[i + w*8 + 4] +
					1/256*inputData[i + w*8 + 8];
			}
			outputData[(y*w + x)*4 + 3] = inputData[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy();
}

// ���U�C�N(NxN)
CV.pixelization = function(N){
	N = N || 5;
	CV.resize();
	var offset = (N-1)/2;
	var count, r, g, b;
	// �S��f���[�v
	for (var y = offset; y < h; y+=N) {
		for (var x = offset; x < w; x+=N) {
			var i = (y*w + x)*4;
			count = r = g = b = 0;
			// ���͗p�J�[�l���S���[�v
			for(var dy=0; dy<N; dy++){
				for(var dx=0; dx<N; dx++){
					var horizon = -(N-1)/2*4 + 4*dx;
					var vertical = -(N-1)/2*4 + 4*dy;
					// �摜�͈̔͊O�͖�������
					if(
						((x + horizon) < 0) ||
						(w <= (x + horizon)) ||
						((y + vertical) < 0) ||
						(h <= (y + vertical))
					){
						continue;
					}
					// �P�x�l�̍��v���擾
					r += inputData[i + w*horizon + vertical + 0];
					g += inputData[i + w*horizon + vertical + 1];
					b += inputData[i + w*horizon + vertical + 2];
					// �擾������f�̌�
					count++;
				}
			}
			// ���ϋP�x�l���v�Z
			r = Math.round(r/count);
			g = Math.round(g/count);
			b = Math.round(b/count);
			// �o�͗p�J�[�l���S���[�v
			for(var dy=0; dy<N; dy++){
				for(var dx=0; dx<N; dx++){
					var horizon = -(N-1)/2*4 + 4*dx;
					var vertical = -(N-1)/2*4 + 4*dy;
					// �P�x�l���
					outputData[i + w*horizon + vertical + 0] = r;
					outputData[i + w*horizon + vertical + 1] = g;
					outputData[i + w*horizon + vertical + 2] = b;
				}
			}
			outputData[(y*w + x)*4 + 3] = inputData[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy();
}

// �u���[(NxN)
CV.blur = function(N, course){
	N = N || 5;
	course = course || "tiltL";
	CV.resize();
	var count, r, g, b, H, V;
	if(course == "vertical")
		H = 0;
	else if(course == "tiltR")
		H = -1;
	else if(course == "tiltL")
		H = 1;
	// �S��f���[�v
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			count = r = g = b = 0;
			// ���͗p�J�[�l���S���[�v
			for(var dx=0; dx<N; dx++){
				if(course == "horizon"){
					var vertical = -(N-1)/2*4 + 4*dx;
					var horizon = 0;
				}else{
					var horizon = -(N-1)/2*4 + 4*dx;
					var vertical = H * horizon;
				}
				// �摜�͈̔͊O�͖�������
				if(
					((x + horizon) < 0) ||
					(w <= (x + horizon)) ||
					((y + vertical) < 0) ||
					(h <= (y + vertical))
				){
					continue;
				}
				// �P�x�l�̍��v���擾
				r += inputData[i + w*horizon + vertical + 0];
				g += inputData[i + w*horizon + vertical + 1];
				b += inputData[i + w*horizon + vertical + 2];
				// �擾������f�̌�
				count++;
			}
			// ���ϋP�x�l���v�Z
			r = Math.round(r/count);
			g = Math.round(g/count);
			b = Math.round(b/count);
			// �P�x�l���
			outputData[i + 0] = r;
			outputData[i + 1] = g;
			outputData[i + 2] = b;
			outputData[(y*w + x)*4 + 3] = inputData[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy();
}

/////////////
// ���x�␳ //
/////////////

// ����
CV.bright = function(){
	CV.resize();
	var rate = document.getElementById('brightValue').value / 100;
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			var j = parseInt(rate);
			outputData[i + 0] = rate * inputData[i + 0];
			outputData[i + 1] = rate * inputData[i + 1];
			outputData[i + 2] = rate * inputData[i + 2];
			outputData[i + 3] = inputData[i + 3];
		}
	}
	CV.copy();
}

// �K���}�␳�i�����x���j
CV.gamma = function(){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			// �K���}�l
			var gamma = document.getElementById("gammaValue").value;
			outputData[i + 0] = 255 * Math.pow((inputData[i + 0]/255), 1.0/gamma);
			outputData[i + 1] = 255 * Math.pow((inputData[i + 1]/255), 1.0/gamma);
			outputData[i + 2] = 255 * Math.pow((inputData[i + 2]/255), 1.0/gamma);
			outputData[i + 3] = inputData[i + 3];
		}
	}
	CV.copy();
}

// �K���}�␳�iLUT�g�p�Łj
CV.gammaLUT = function(){
	CV.resize();
	// �K���}�l��LUT�쐬
	var gamma = document.getElementById("gammaValue").value;
	var LUT = [256];
	for(var i=0; i<256; i++){
		LUT[i] = Math.round(Math.pow((i/255), 1/gamma)*255);
	}
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			outputData[i + 0] = LUT[inputData[i]];
			outputData[i + 1] = LUT[inputData[i + 1]];
			outputData[i + 2] = LUT[inputData[i + 2]];
			outputData[i + 3] = inputData[i + 3];
		}
	}
	CV.copy();
}

/////////////
// ���ߏ��� //
/////////////

// ����
CV.transparent = function(){
	CV.resize();
	var opacity = document.getElementById('opacity').value;
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			// �O���[�X�P�[���̒萔
			var gray = 
				+ 0.299 * inputData[i]
				+ 0.587 * inputData[i + 1]
				+ 0.114 * inputData[i + 2];
			outputData[i + 0] = inputData[i + 0];
			outputData[i + 1] = inputData[i + 1];
			outputData[i + 2] = inputData[i + 2];
			// ���P�x�ȏ�̃s�N�Z���𓧉�
			if(gray >= opacity){
				outputData[i + 3] = 0;
			}
		}
	}
	CV.copy();
}

/////////////
// �􉽕ϊ� //
/////////////

// �������]
CV.hmirror = function(){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			var j = (y*w + (w - x - 1))*4;
			outputData[i + 0] = inputData[j + 0];
			outputData[i + 1] = inputData[j + 1];
			outputData[i + 2] = inputData[j + 2];
			outputData[i + 3] = inputData[j + 3];
		}
	}
	CV.copy();
}

// �������]
CV.vmirror = function(){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			var j = ((h - y -1)*w + x)*4;
			outputData[i + 0] = inputData[j + 0];
			outputData[i + 1] = inputData[j + 1];
			outputData[i + 2] = inputData[j + 2];
			outputData[i + 3] = inputData[j + 3];
		}
	}
	CV.copy();
}

// �摜�ۑ�
// �Q�l�ɂ��܂��� �� http://jsdo.it/Yukisuke/p311
CV.save = function(){
	var canvas;
	canvas = document.getElementById("blendImg");
	var base64 = canvas.toDataURL();	// firefox�Ȃ�toblob�Œ���blob�ɂ��ĕۑ��ł��܂��B
    var blob = Base64toBlob(base64);
    var name = "Blending"�@+ ".png";
    saveBlob(blob, name);

    function Base64toBlob(_base64){
		var i;
		var tmp = _base64.split(',');
		var data = atob(tmp[1]);
		var mime = tmp[0].split(':')[1].split(';')[0];

		//var buff = new ArrayBuffer(data.length);
		//var arr = new Uint8Array(buff);
		var arr = new Uint8Array(data.length);
		for (i = 0; i < data.length; i++) {arr[i] = data.charCodeAt(i);}
		var blob = new Blob([arr], { type: mime });
		return blob;
	}
	function saveBlob(_blob,_file){
		if( /*@cc_on ! @*/ false ){	// IE�̏ꍇ
			window.navigator.msSaveBlob(_blob, _file);
		}else{
			var url = (window.URL || window.webkitURL);
			var data = url.createObjectURL(_blob);
			var e = document.createEvent("MouseEvents");
			e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
			a.href = data;
			a.download = _file;   
			a.dispatchEvent(e);
		}
	}
}

/**********************
** �摜�ǂݍ��݊֘A�̃��\�b�h
***********************/

// �摜��ǂݍ���
function loadImg(){
	if (document.getElementById('loadImg').files[0].type.match('image.*')) {
		var img = document.getElementById('loadImg').files[0];
		// �t�@�C�����Ɗg���q��ʁX�Ɏ擾
		var name = img.name.match(/([^:\\\*?\"<>\|]+)\.+([^:\\\*?\"<>\|]+)$/);
		info = {name:name[1], type:name[2], size:img.size};
		var property = "NAME�w" + img.name + 
			"�x, SIZE�w" + img.size + "byte (" + (img.size/1024).toFixed(0) + "KB)�x";
		document.getElementById('list').innerHTML = property;
		var fr = new FileReader();
		// �ǂݍ��ݏI����҂�
		fr.onload = function onFileLoad(e) {
			setImage(e.target.result);
		 	CV.init();
		}
		fr.readAsDataURL(img);
	}else{
		alert("�摜�t�@�C�����w�肵�ĉ�����");
	}
}

// �h���b�O���h���b�v�œǂݍ���
function onDropFile1(e){
	e.preventDefault();
	var img = e.dataTransfer.files[0];
	// �t�@�C�����Ɗg���q��ʁX�Ɏ擾
	var name = img.name.match(/([^:\\\*?\"<>\|]+)\.+([^:\\\*?\"<>\|]+)$/);
	info = {name:name[1], type:name[2], size:img.size};
	var property = "NAME�w" + img.name + 
		"�x, SIZE�w" + img.size + "byte (" + (img.size/1024).toFixed(0) + "KB)�x";
	document.getElementById('list').innerHTML = property;
	if (img.type.match('image.*')) {
		var fr = new FileReader();
		// �ǂݍ��ݏI����҂�
		fr.onload = function onFileLoad(e) {
			setBlendImage1(e.target.result, "divImg1");
		 	CV.init();
		}
		fr.readAsDataURL(img);
	}else{
		alert("�摜�t�@�C�����w�肵�ĉ�����");
	}
}
function onDropFile2(e){
	e.preventDefault();
	var img = e.dataTransfer.files[0];
	// �t�@�C�����Ɗg���q��ʁX�Ɏ擾
	var name = img.name.match(/([^:\\\*?\"<>\|]+)\.+([^:\\\*?\"<>\|]+)$/);
	info = {name:name[1], type:name[2], size:img.size};
	var property = "NAME�w" + img.name + 
		"�x, SIZE�w" + img.size + "byte (" + (img.size/1024).toFixed(0) + "KB)�x";
	document.getElementById('list').innerHTML = property;
	if (img.type.match('image.*')) {
		var fr = new FileReader();
		// �ǂݍ��ݏI����҂�
		fr.onload = function onFileLoad(e) {
			setBlendImage2(e.target.result, "divImg2");
		 	CV.init();
		}
		fr.readAsDataURL(img);
	}else{
		alert("�摜�t�@�C�����w�肵�ĉ�����");
	}
}

 // �f�t�H���g�������L�����Z��
function�@onCancel(e){
	if(e.preventDefault){
		e.preventDefault();
	}
	return false;
};

/*************
** ���̑��̃��\�b�h
**************/

/*
** �C�ӂ̗v�f�̃I�t�Z�b�g���擾����֐� �i�`��̈�̃I�t�Z�b�g�ʒu�擾�p�j
** �}�E�X���W�𐳂����擾���邽�߂ɕK�v
*/
function getElementPosition(element) {
	var html = document.documentElement;
    var body = document.body;
	var top = left = scrollLeft = scrollTop = 0;
	do {
		top  += element.offsetTop  || 0;
		left += element.offsetLeft || 0;
		scrollLeft = body.scrollLeft || html.scrollLeft;
		scrollTop = body.scrollTop || html.scrollTop;
		element =  element.offsetParent;
	}
	while (element);
	return {top: top, left: left, scrollLeft: scrollLeft, scrollTop: scrollTop};
};


/*
** �}�E�X�N���b�N�ړ����̃C�x���g
*/
// document.addEventListener('mousemove', function(e) {
// 	// ���W���擾���I�t�Z�b�g�␳
// 	var mouseX = e.clientX - getElementPosition(divImg2).left + getElementPosition(divImg2).scrollLeft;
// 	var mouseY = e.clientY - getElementPosition(divImg2).top + getElementPosition(divImg2).scrollTop;

// 	var coodinate = [mouseX, mouseY];
// 	var color = {r:0, g:0, b:0, a:0, h:0, s:0, v:0};
// 	var rgba = [];
// 	var hsv = [];
// 	var info = "";
// 	/* ��������C�x���g���� */
// 	if(mouseX >=0 & mouseX < w & mouseY >=0 & mouseY < h){
// 		var i = (mouseY*w + mouseX)*4;
// 		color.r = outputData[i+0];
// 		color.g = outputData[i+1];
// 		color.b = outputData[i+2];
// 		color.a = outputData[i+3];
// 		rgba[0] = color.r;
// 		rgba[1] = color.g;
// 		rgba[2] = color.b;
// 		rgba[3] = color.a;
// 		rgb2hsv(color);
// 		hsv[0] = parseInt(color.h);
// 		hsv[1] = parseInt(color.s);
// 		hsv[2] = parseInt(color.v);
// 		info = "R:" + rgba[0] + "�@G:" + rgba[1] + "�@B:" + rgba[2] + "�@A:" + rgba[3] + "�@�@H:" + hsv[0] + "�@S:" + hsv[1] + "�@V:" + hsv[2];
// 		document.getElementById('info').innerHTML = info;
// 	}

// 	function rgb2hsv(color){
// 		var max = Math.max(color.r, Math.max(color.g, color.b));
// 		var min = Math.min(color.r, Math.min(color.g, color.b));
// 		// Hue�̌v�Z
// 		if(max == min){
// 			color.h = 0;
// 		}else if(max == color.r){
// 			color.h = (60 * (color.g - color.b) / (max - min) + 360) % 360;
// 		}else if(max == color.g){
// 			color.h = (60 * (color.b - color.r) / (max - min)) + 120;
// 		}else if(max == color.b){
// 			color.h = (60 * (color.r - color.g) / (max - min)) + 240;
// 		}
// 		// Saturation�̌v�Z
// 		if(max == 0){
// 			color.s = 0;
// 		}else{
// 			color.s = (255 * ((max - min) / max))
// 		}
// 		// Value�̌v�Z
// 		color.v = max;
// 	}
// }, false);

/*
** �}�E�X�N���b�N���̃C�x���g�i���m�ɂ͗��������j�j
*/
// document.addEventListener('click', function(e) {
// 	// ���W���擾���I�t�Z�b�g�␳
// 	var mouseX = e.clientX - getElementPosition(divImg2).left + getElementPosition(divImg2).scrollLeft;
// 	var mouseY = e.clientY - getElementPosition(divImg2).top + getElementPosition(divImg2).scrollTop;

// 	var coodinate = [mouseX, mouseY];
// 	var color = {r:0, g:0, b:0, a:0, h:0, s:0, v:0};
// 	var rgba = [];
// 	var hsv = [];
// 	var info = "";
// 	/* ��������C�x���g���� */
// 	if(mouseX >=0 & mouseX < w & mouseY >=0 & mouseY < h){
// 		var i = (mouseY*w + mouseX)*4;
// 		color.r = outputData[i+0];
// 		color.g = outputData[i+1];
// 		color.b = outputData[i+2];
// 		color.a = outputData[i+3];
// 		rgba[0] = color.r;
// 		rgba[1] = color.g;
// 		rgba[2] = color.b;
// 		rgba[3] = color.a;
// 		rgb2hsv(color);
// 		hsv[0] = parseInt(color.h);
// 		hsv[1] = parseInt(color.s);
// 		hsv[2] = parseInt(color.v);
// 		document.getElementById('hueStart').value = hsv[0] - 20;
// 		document.getElementById('hueEnd').value = hsv[0] + 20;
// 		if(hsv[1] > 40)
// 			document.getElementById('satStart').value = hsv[1] - 40;
// 		else
// 			document.getElementById('satStart').value = 0;
// 		if(hsv[1] < 215)
// 			document.getElementById('satEnd').value = hsv[1] + 40;
// 		else
// 			document.getElementById('satEnd').value = 255;
// 		if(hsv[2] > 40)
// 			document.getElementById('volStart').value = hsv[2] - 40;
// 		else
// 			document.getElementById('volStart').value = 0;
// 		if(hsv[2] < 215)
// 			document.getElementById('volEnd').value = hsv[2] + 40;
// 		else
// 			document.getElementById('volEnd').value = 255;
// 	}

// 	function rgb2hsv(color){
// 		var max = Math.max(color.r, Math.max(color.g, color.b));
// 		var min = Math.min(color.r, Math.min(color.g, color.b));
// 		// Hue�̌v�Z
// 		if(max == min){
// 			color.h = 0;
// 		}else if(max == color.r){
// 			color.h = (60 * (color.g - color.b) / (max - min) + 360) % 360;
// 		}else if(max == color.g){
// 			color.h = (60 * (color.b - color.r) / (max - min)) + 120;
// 		}else if(max == color.b){
// 			color.h = (60 * (color.r - color.g) / (max - min)) + 240;
// 		}
// 		// Saturation�̌v�Z
// 		if(max == 0){
// 			color.s = 0;
// 		}else{
// 			color.s = (255 * ((max - min) / max))
// 		}
// 		// Value�̌v�Z
// 		color.v = max;
// 	}
// }, false);

window.addEventListener('load', function (){
	// �h���b�O���h���b�v�ɑΉ�
	document.getElementById('divImg1').addEventListener("dragover", onCancel, false);
	document.getElementById('divImg1').addEventListener("dragenter", onCancel, false);
	document.getElementById('divImg1').addEventListener("drop", onDropFile1, false);
	document.getElementById('divImg2').addEventListener("dragover", onCancel, false);
	document.getElementById('divImg2').addEventListener("dragenter", onCancel, false);
	document.getElementById('divImg2').addEventListener("drop", onDropFile2, false);

	// �f�t�H���g�摜
	setBlendImage1("miku.jpg", "divImg1");
	setBlendImage2("silhouette.png", "divImg2");

	document.getElementById('opacity').value = 245;

	document.getElementById("change").checked = false;
	document.getElementById("transparent").checked = false;
	document.getElementById("resize").checked = true;
	document.getElementById("copy").checked = true;
}, false);
