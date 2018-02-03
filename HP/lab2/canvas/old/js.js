// �O���t�쐬�p���C�u����
document.write('<script type="text/javascript" src="raphael-min.js"></script>');
document.write('<script type="text/javascript" src="g.raphael-min.js"></script>');
document.write('<script type="text/javascript" src="g.line-min.js"></script>');

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
function setImage(img){
	if(!document.getElementById("change").checked){
		var canvas = document.getElementById("img");
		var context = canvas.getContext('2d');
	}else{
		var canvas = document.getElementById("outputImg");
		var context = canvas.getContext('2d');
	}
	// �摜�ǂݍ���
	image = new Image();
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
		input = context.getImageData(0, 0, canvas.width, canvas.height);
		w = input.width, h = input.height;
		inputData = input.data;
		// �������p�I�u�W�F�N�g
		initialize = context.getImageData(0, 0, canvas.width, canvas.height);
		initializeData = initialize.data;
		// �摜�ϊ��p�I�u�W�F�N�g
		output = context.createImageData(canvas.width, canvas.height);
		outputData = output.data;
		CV.history.push(context.drawImage(image, 0, 0));
		CV.hist();
	}
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
		this.canvas = document.getElementById("outputImg");
		this.context = this.canvas.getContext('2d');
		this.canvas.width = output.width;
		this.canvas.height = output.height;
	}else{
		this.canvas = document.getElementById("img");
		this.context = this.canvas.getContext('2d');
		this.canvas.width = output.width;
		this.canvas.height = output.height;
	}
}

// ������
CV.init = function(){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			for (var c = 0; c < 4; c++) {
				var i = (y*w + x)*4 + c;
				inputData[i] = initializeData[i];
				outputData[i] = initializeData[i];
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
		var canvas = document.getElementById("outputImg");
		var context = canvas.getContext('2d');
		canvas.width = output.width;
		canvas.height = output.height;
	}else{
		var canvas = document.getElementById("img");
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
	this.context.restore();
	this.context.putImageData(output, 0, 0);
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
				outputData[i] = 255;
				outputData[i+1] = inputData[i+1];
				outputData[i+2] = inputData[i+2];
				outputData[i+3] = inputData[i+3];
			}
		}
	}
	else if(mode == "G"){
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				outputData[i] = inputData[i];
				outputData[i+1] = 255;
				outputData[i+2] = inputData[i+2];
				outputData[i+3] = inputData[i+3];
			}
		}
	}
	else if(mode == "B"){
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				outputData[i] = inputData[i];
				outputData[i+1] = inputData[i+1];
				outputData[i+2] = 255;
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

// �g�k�i�������j
CV.small = function(){
	CV.resize();
	var rate = document.getElementById('rate').value / 100;
	// var h = [rate, 0, 0, 0, rate, 0, 0, 0, 1];
	// CV.affine(h)
	this.context.scale(rate, rate);
	this.context.drawImage(image, 0, 0);
	var temp = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {	
			var i = (y*w + x)*4;
			outputData[i + 0] = temp.data[i + 0];
			outputData[i + 1] = temp.data[i + 1];
			outputData[i + 2] = temp.data[i + 2];
			outputData[i + 3] = temp.data[i + 3];
		}
	}
	CV.copy();
}

// ��]�i�������j
CV.rotation = function(){
	CV.resize();
	var itheta = document.getElementById('theta').value;
	var theta = itheta * Math.PI/180;
	var sin = Math.sin(theta);
	var cos = Math.cos(theta);
	// var h = [cos, sin, 0, -sin, cos, 0, 0, 0, 1];
	// CV.affine(h)
	this.context.translate(w/2, h/2);
	this.context.rotate(theta);
	this.context.translate(-w/2, -h/2);
	this.context.drawImage(image, 0, 0, w, h);
	var temp = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {	
			var i = (y*w + x)*4;
			outputData[i + 0] = temp.data[i + 0];
			outputData[i + 1] = temp.data[i + 1];
			outputData[i + 2] = temp.data[i + 2];
			if(!temp.data[i + 3]){
				outputData[i + 0] = 255;
				outputData[i + 1] = 255;
				outputData[i + 2] = 255;
				outputData[i + 3] = 255;
			}
		}
	}
	CV.copy();
}

// �A�t�B���ϊ�
CV.affine = function(H, tx, ty){
	// ���s�ړ��p
	var tx = tx || 0;
	var ty = ty || 0;
	// �ϊ��s��
	var affine_mat = [
		[H[0], H[1], H[2]],
		[H[3], H[4], H[5]],
		[H[6], H[7], H[8]]
	];
	// �ϊ���̍��W�ɕϊ��O�̍��W��Ή������邽�߁A�t�s��ɂ���
	mat.inverse(affine_mat, affine_mat);
	// ���s�ړ��p�ϊ��s��
	var trans_mat = [
		[1, 0, tx],
		[0, 1, ty],
		[0, 0, 1]
	];
	// �r���v�Z�p
	var tmp = [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1]
	];
	// ��U���_�Ɉړ����邽�߂̍s��
	var offset_before = [
		[1, 0, image.width/2],
		[0, 1, image.height/2],
		[0, 0, 1]
	];
	// ���ɖ߂����߂̍s��
	var offset_after = [
		[1, 0, -image.width/2],
		[0, 1, -image.height/2],
		[0, 0, 1]
	];
	// �ϊ��O�̍��W�̊eRGBA�����Ă����s��
	var p = [
		[0],
		[0],
		[1]
	];
	// �ϊ���̍��W�̊eRGBA�����Ă����s��
	var P = [
		[0],
		[0],
		[1]
	];
	CV.resize();
	// ���_�ֈړ�
	mat.multiply2(offset_before, affine_mat, tmp);
	// ���̈ʒu�֖߂�
	mat.multiply2(tmp, offset_after, affine_mat);
	// ���s�ړ�
	mat.multiply2(affine_mat, trans_mat, tmp);
	// p[0][0]��x���W, p[1][0]��y���W
	for (p[1][0] = 0; p[1][0] < h-1; p[1][0]++) {
		for (p[0][0] = 0; p[0][0] < w-1; p[0][0]++) {
			// �A�t�B���ϊ�
			mat.multiply1(tmp, p, P);
			var i = (p[1][0]*w + p[0][0])*4;
			var j = (P[1][0]*w + P[0][0])*4;
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
	if(!document.getElementById("change").checked){
		canvas = document.getElementById("outputImg");
	}else{
		canvas = document.getElementById("img");
	}
	var base64 = canvas.toDataURL();	// firefox�Ȃ�toblob�Œ���blob�ɂ��ĕۑ��ł��܂��B
    var blob = Base64toBlob(base64);
    var name = "js_" + info.name�@+ ".png";
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
function onDropFile(e){
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
			setImage(e.target.result);
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

/*****************
** �A�t�B���ϊ��p���\�b�h
******************/

var mat = function (){};
// �P�ʍs��
mat.identity = function(dst){
	dst[0][0] = 1; dst[0][1] = 0; dst[0][2] = 0;
	dst[1][0] = 0; dst[1][1] = 1; dst[1][2] = 0;
	dst[2][0] = 0; dst[2][1] = 0; dst[2][2] = 1;
	return dst;
};
// 3�~3��1�~3�̊|���Z�i�����ŕԂ��j
mat.multiply1 = function(mat1, mat2, dst){
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
mat.multiply2 = function(mat1, mat2, dst){
	var A = mat1[0][0], B = mat1[0][1], C = mat1[0][2],
		D = mat1[1][0], E = mat1[1][1], F = mat1[1][2],
		G = mat1[2][0], H = mat1[2][1], I = mat1[2][2],
		a = mat2[0][0], b = mat2[0][1], c = mat2[0][2],
		d = mat2[1][0], e = mat2[1][1], f = mat2[1][2],
		g = mat2[2][0], h = mat2[2][1], i = mat2[2][2];
	dst[0][0] = (A * a + B * d + C * g).toFixed(4);
	dst[0][1] = (A * b + B * e + C * h).toFixed(4);
	dst[0][2] = (A * c + B * f + C * i).toFixed(4);
	dst[1][0] = (D * a + E * d + F * g).toFixed(4);
	dst[1][1] = (D * b + E * e + F * h).toFixed(4);
	dst[1][2] = (D * c + E * f + F * i).toFixed(4);
	dst[2][0] = (G * a + H * d + I * g).toFixed(4);
	dst[2][1] = (G * b + H * e + I * h).toFixed(4);
	dst[2][2] = (G * c + H * f + I * i).toFixed(4);
	return dst;
};
// �t�s��
mat.inverse = function(mat, dst){
	var a = mat[0][0],  b = mat[0][1],  c = mat[0][2],
		d = mat[1][0],  e = mat[1][1],  f = mat[1][2],
		g = mat[2][0],  h = mat[2][1],  i = mat[2][2];
		s = a * e * i + g * b * f + h * d * c;
		t = c * e * g + d * b * i + a * f * h;
		det = s - t;
		idet = 1.0 / det;
	dst[0][0] = ((e�@*�@i - f�@*�@h) * idet).toFixed(4);
	dst[0][1] = ((c�@*�@h - b�@*�@i) * idet).toFixed(4);
	dst[0][2] = ((b�@*�@f - c�@*�@h) * idet).toFixed(4);
	dst[1][0] = ((f�@*�@g - d�@*�@i) * idet).toFixed(4);
	dst[1][1] = ((a�@*�@i - c�@*�@g) * idet).toFixed(4);
	dst[1][2] = ((c�@*�@d - a�@*�@f) * idet).toFixed(4);
	dst[2][0] = ((d�@*�@h - e�@*�@g) * idet).toFixed(4);
	dst[2][1] = ((b�@*�@g - a�@*�@h) * idet).toFixed(4);
	dst[2][2] = ((a�@*�@e - b�@*�@d) * idet).toFixed(4);
	return dst;
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
document.addEventListener('mousemove', function(e) {
	// ���W���擾���I�t�Z�b�g�␳
	var mouseX = e.clientX - getElementPosition(outputImg).left + getElementPosition(outputImg).scrollLeft;
	var mouseY = e.clientY - getElementPosition(outputImg).top + getElementPosition(outputImg).scrollTop;

	var coodinate = [mouseX, mouseY];
	var color = {r:0, g:0, b:0, a:0, h:0, s:0, v:0};
	var rgba = [];
	var hsv = [];
	var info = "";
	/* ��������C�x���g���� */
	if(mouseX >=0 & mouseX < w & mouseY >=0 & mouseY < h){
		var i = (mouseY*w + mouseX)*4;
		color.r = outputData[i+0];
		color.g = outputData[i+1];
		color.b = outputData[i+2];
		color.a = outputData[i+3];
		rgba[0] = color.r;
		rgba[1] = color.g;
		rgba[2] = color.b;
		rgba[3] = color.a;
		rgb2hsv(color);
		hsv[0] = parseInt(color.h);
		hsv[1] = parseInt(color.s);
		hsv[2] = parseInt(color.v);
		info = "R:" + rgba[0] + "�@G:" + rgba[1] + "�@B:" + rgba[2] + "�@A:" + rgba[3] + "�@�@H:" + hsv[0] + "�@S:" + hsv[1] + "�@V:" + hsv[2];
		document.getElementById('info').innerHTML = info;
	}

	function rgb2hsv(color){
		var max = Math.max(color.r, Math.max(color.g, color.b));
		var min = Math.min(color.r, Math.min(color.g, color.b));
		// Hue�̌v�Z
		if(max == min){
			color.h = 0;
		}else if(max == color.r){
			color.h = (60 * (color.g - color.b) / (max - min) + 360) % 360;
		}else if(max == color.g){
			color.h = (60 * (color.b - color.r) / (max - min)) + 120;
		}else if(max == color.b){
			color.h = (60 * (color.r - color.g) / (max - min)) + 240;
		}
		// Saturation�̌v�Z
		if(max == 0){
			color.s = 0;
		}else{
			color.s = (255 * ((max - min) / max))
		}
		// Value�̌v�Z
		color.v = max;
	}
}, false);

/*
** �}�E�X�N���b�N���̃C�x���g�i���m�ɂ͗��������j�j
*/
document.addEventListener('click', function(e) {
	// ���W���擾���I�t�Z�b�g�␳
	var mouseX = e.clientX - getElementPosition(outputImg).left + getElementPosition(outputImg).scrollLeft;
	var mouseY = e.clientY - getElementPosition(outputImg).top + getElementPosition(outputImg).scrollTop;

	var coodinate = [mouseX, mouseY];
	var color = {r:0, g:0, b:0, a:0, h:0, s:0, v:0};
	var rgba = [];
	var hsv = [];
	var info = "";
	/* ��������C�x���g���� */
	if(mouseX >=0 & mouseX < w & mouseY >=0 & mouseY < h){
		var i = (mouseY*w + mouseX)*4;
		color.r = outputData[i+0];
		color.g = outputData[i+1];
		color.b = outputData[i+2];
		color.a = outputData[i+3];
		rgba[0] = color.r;
		rgba[1] = color.g;
		rgba[2] = color.b;
		rgba[3] = color.a;
		rgb2hsv(color);
		hsv[0] = parseInt(color.h);
		hsv[1] = parseInt(color.s);
		hsv[2] = parseInt(color.v);
		document.getElementById('hueStart').value = hsv[0] - 20;
		document.getElementById('hueEnd').value = hsv[0] + 20;
		if(hsv[1] > 40)
			document.getElementById('satStart').value = hsv[1] - 40;
		else
			document.getElementById('satStart').value = 0;
		if(hsv[1] < 215)
			document.getElementById('satEnd').value = hsv[1] + 40;
		else
			document.getElementById('satEnd').value = 255;
		if(hsv[2] > 40)
			document.getElementById('volStart').value = hsv[2] - 40;
		else
			document.getElementById('volStart').value = 0;
		if(hsv[2] < 215)
			document.getElementById('volEnd').value = hsv[2] + 40;
		else
			document.getElementById('volEnd').value = 255;
	}

	function rgb2hsv(color){
		var max = Math.max(color.r, Math.max(color.g, color.b));
		var min = Math.min(color.r, Math.min(color.g, color.b));
		// Hue�̌v�Z
		if(max == min){
			color.h = 0;
		}else if(max == color.r){
			color.h = (60 * (color.g - color.b) / (max - min) + 360) % 360;
		}else if(max == color.g){
			color.h = (60 * (color.b - color.r) / (max - min)) + 120;
		}else if(max == color.b){
			color.h = (60 * (color.r - color.g) / (max - min)) + 240;
		}
		// Saturation�̌v�Z
		if(max == 0){
			color.s = 0;
		}else{
			color.s = (255 * ((max - min) / max))
		}
		// Value�̌v�Z
		color.v = max;
	}
}, false);

// ���j���[�\��
var menu = function(divID){
	var div = document.getElementById(divID);
	div.style.display = div.style.display == 'none' ? 'block' : 'none';
}
menu.all = function(){
	var count = 0;
	var div = [];
	div[0] = document.getElementById('siki');
	div[1] = document.getElementById('edge');
	div[2] = document.getElementById('pix');
	div[3] = document.getElementById('hsv');
	div[4] = document.getElementById('kido');
	div[5] = document.getElementById('kika');
	div[6] = document.getElementById('histgram');
	var button = [];
	button[0] = document.getElementById('Msiki');
	button[1] = document.getElementById('Medge');
	button[2] = document.getElementById('Mpix');
	button[3] = document.getElementById('Mhsv');
	button[4] = document.getElementById('Mkido');
	button[5] = document.getElementById('Mkika');
	button[6] = document.getElementById('Mhistgram');

	// none�̌�������
	for(var i=0; i<div.length; i++){
		if(div[i].style.display == 'none'){
			count++;
		}
	}
	// none����ł���������S��block�A�����łȂ���ΑS��none�ɂ���
	if(count > 0){
		for(var i=0; i<div.length; i++){
			div[i].style.display = 'block';
			button[i].checked = true;
		}
	}else{
		for(var i=0; i<div.length; i++){
			div[i].style.display = 'none';
			button[i].checked = false;
		}
	}
	document.getElementById('histgram').height = document.getElementById('cont').height;
}

window.addEventListener('load', function (){
	// �h���b�O���h���b�v�ɑΉ�
	document.getElementById('img').addEventListener("dragover", onCancel, false);
	document.getElementById('img').addEventListener("dragenter", onCancel, false);
	document.getElementById('img').addEventListener("drop", onDropFile, false);
	document.getElementById('outputImg').addEventListener("dragover", onCancel, false);
	document.getElementById('outputImg').addEventListener("dragenter", onCancel, false);
	document.getElementById('outputImg').addEventListener("drop", onDropFile, false);

	// �f�t�H���g�摜
	setImage("HSV_cone.jpg");

	// �e�f�t�H���g�l
	document.getElementById('threshold').value = 190;
	document.getElementById('course').value = 8;
	document.getElementById('sharpValue').value = 1;
	document.getElementById("gammaValue").value = 1.5;
	document.getElementById('rate').value = 75;
	document.getElementById('brightValue').value = 150;
	document.getElementById('opacity').value = 245;
	document.getElementById('theta').value = 45;

	// HSV
	document.getElementById('hueValue').value = 45;
	document.getElementById('satValue').value = 20;
	document.getElementById('volValue').value = 20;

	// �F���o�p
	document.getElementById('hueStart').value = 80;
	document.getElementById('hueEnd').value = 180;
	document.getElementById('satStart').value = 100;
	document.getElementById('satEnd').value = 255;
	document.getElementById('volStart').value = 80;
	document.getElementById('volEnd').value = 255;
	document.getElementById('convHValue').value = 45;
	// document.getElementById('convSValue').value = 20;
	// document.getElementById('convVValue').value = 20;

	document.getElementById("change").checked = false;
	document.getElementById("resize").checked = true;
	document.getElementById("copy").checked = true;

	// ���j���[�p
	document.getElementById("Msiki").checked = true;
	document.getElementById("Medge").checked = false;
	document.getElementById("Mpix").checked = true;
	document.getElementById("Mhsv").checked = true;
	document.getElementById("Mkido").checked = true;
	document.getElementById("Mkika").checked = false;
	document.getElementById("Mhistgram").checked = false;
}, false);
