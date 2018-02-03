// �O���t�쐬�p���C�u����
document.write('<script type="text/javascript" src="raphael-min.js"></script>');
document.write('<script type="text/javascript" src="g.raphael-min.js"></script>');
document.write('<script type="text/javascript" src="g.line-min.js"></script>');

// �I�u�W�F�N�g�쐬
CV = function(){};
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

/***************
** ��̓I�ȃ��\�b�h
****************/

/////////////////
// ��{�I�ȃ��\�b�h //
/////////////////

// �쐬
// CV.create = function(canvas, context){
	// CV.canvas = document.getElementById("outputImg");
	// CV.context = CV.canvas.getContext('2d');
// }

// �`��̈惊�T�C�Y
CV.resize = function(){
	if(!document.getElementById("invisible").checked){
		CV.canvas = document.getElementById("outputImg");
		CV.context = CV.canvas.getContext('2d');
		CV.canvas.width = output.width;
		CV.canvas.height = output.height;
	}else{
		CV.canvas = document.getElementById("img");
		CV.context = CV.canvas.getContext('2d');
		CV.canvas.width = output.width;
		CV.canvas.height = output.height;
	}
}

// ������
CV.init = function(){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			for (var c = 0; c < 4; c++) {
				var i = (y*w + x)*4 + c;
				input.data[i] = initialize.data[i];
				output.data[i] = initialize.data[i];
			}
		}
	}
	CV.context.putImage.data(initialize, 0, 0);
}

// �d�ˊ|���p�̃R�s�[
CV.copy = function(input, output){
	var history = CV.history;
	CV.resize();
	var temp = CV.context.getImage.data(0, 0, CV.canvas.width, CV.canvas.height);
	history.push(temp);
	if(document.getElementById('copy').checked){
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				for (var c = 0; c < 4; c++) {
					var i = (y*w + x)*4 + c;
					input.data[i] = output.data[i];
					history[history.length-1].data[i] = output.data[i]; 
				}
			}
		}
	}
	CV.context.putImage.data(output, 0, 0);
}

// �߂�
CV.undo = function(input, output){
	var history = CV.history;
	// resize���ƃ_��
	if(!document.getElementById("invisible").checked){
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
	if(pre >= 0){
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				for (var c = 0; c < 4; c++) {
					var i = (y*w + x)*4 + c;
					input.data[i] = history[pre].data[i];
					output.data[i] = history[pre].data[i];
				}
			}
		}
		history.pop();
	}
	context.putImage.data(output, 0, 0);
}

// ����ւ�
CV.invisible = function(){
	CV.resize();
	CV.context.restore();
	CV.context.putImage.data(output, 0, 0);
}

// �q�X�g�O����
CV.hist = function(input, output){
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
			output.data[i + 0] = input.data[i + 0];
			output.data[i + 1] = input.data[i + 1];
			output.data[i + 2] = input.data[i + 2];
			output.data[i + 3] = input.data[i + 3];
			hist.r[ input.data[i + 0] ]++;
			hist.g[ input.data[i + 1] ]++;
			hist.b[ input.data[i + 2] ]++;
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
	CV.copy(input, output);
	// �O���t��`��
	(function(){
		// �O��̃O���t������
		document.getElementById('histgram').innerHTML = "";
		document.getElementById('histgram').style.backgroundColor = "#aaccff";
		var r = Raphael("histgram", 360, 235);
		var txtattr = { font: "15px sans-serif" };
		r.text(150, 10, "Color Histgram").attr(txtattr);
		r.text(20, 10, "[%]").attr(txtattr);
		r.text(330, 150, "�P�x").attr(txtattr);

		var x = [];
		for(var i=0; i<261; i++){
			x[i] = i;
		}
		// ���_�i����j, width, height, xValue[], yValue[], opts
		var lines = r.linechart(10, 10, 300, 145, 
			// ��
			[x],
			// �c
			[hist.r, hist.g, hist.b],
			// �I�v�V����
			{
				nostroke: false,	// false�œ_���q��
				axis: "0 0 1 1",	// ��, �E, ��, ������\��
				axisxstep: 13,	// x���̕������i���x���Ԋu�ɑ����j
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
CV.sample = function(input, output){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {	
			output.data[i + 0] = input.data[i + 0];
			output.data[i + 1] = input.data[i + 1];
			output.data[i + 2] = input.data[i + 2];
			output.data[i + 3] = input.data[i + 3];
		}
	}
	CV.context.putImage.data(output, 0, 0);
}

/////////////////////
// RGB��HSV�̑��ݕϊ� //
/////////////////////

// RGB��HSV�ϊ�
CV.RGB2HSV = function(color, input){
	CV.resize();
	// color�ɒl���i�[
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			color.push({
				r:input.data[i],
				g:input.data[i+1],
				b:input.data[i+2],
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
CV.hsv = function(type, input, output){
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
	var hueC = Number(document.getElementById('convValue').value);
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
		case 'convert':
			for(var i=0; i<color.length; i++){
				if(
					(color[i].h >= hueS) & (color[i].h <= hueE) &
					(color[i].s >= satS) & (color[i].s <= satE) &
					(color[i].v >= volS) & (color[i].v <= volE)
				){
					color[i].h += hueC;
					if(color[i].h < 0){
						color[i].h += 360;
					}else if(color[i].h > 360){
						color[i].h -= 360;
					}
				}
			}
		break;
	}
	// RGB�֖߂�
	color = CV.HSV2RGB(color);
	// �ϊ�����
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			output.data[i + 0] = color[Math.floor(i/4)].r;
			output.data[i + 1] = color[Math.floor(i/4)].g;
			output.data[i + 2] = color[Math.floor(i/4)].b;
			output.data[i + 3] = input.data[i + 3];
		}
	}
	CV.copy(input, output);
}

/////////////
// �F���ϊ� //
/////////////

// �l�K�|�W���]
CV.negaposi = function(input, output){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			output.data[i] = 255 - input.data[i];
			output.data[i+1] = 255 - input.data[i+1];
			output.data[i+2] = 255 - input.data[i+2];
			output.data[i+3] = input.data[i+3];
		}
	}
	CV.copy(input, output);
}

// �O���[�X�P�[��
CV.gray = function(input, output){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			// �O���[�X�P�[���̒萔
			var gray = 
				+ 0.299 * input.data[i]
				+ 0.587 * input.data[i + 1]
				+ 0.114 * input.data[i + 2];
			output.data[i + 0] = gray;
			output.data[i + 1] = gray;
			output.data[i + 2] = gray;
			output.data[i + 3] = input.data[i + 3];
		}
	}
	CV.copy(input, output);
}

// �Z�s�A��
CV.sepia = function(input, output){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			// �O���[�X�P�[���̒萔
			var gray = 
				+ 0.299 * input.data[i]
				+ 0.587 * input.data[i + 1]
				+ 0.114 * input.data[i + 2];
			output.data[i + 0] = gray / 255 * 240;
			output.data[i + 1] = gray / 255 * 200;
			output.data[i + 2] = gray / 255 * 140;
			output.data[i + 3] = input.data[i + 3];
		}
	}
	CV.copy(input, output);
}

/////////////
// �G�b�W���o //
/////////////

// �G�b�W���o�i8�ߖT�j
CV.edge = function(input, output){
	CV.sobel(8, input, output);
}

// �G�b�W���o�i4�ߖT�j
CV.edge2 = function(input, output){
	CV.sobel(4, input, output);
}

// �\�[�x��
CV.sobel = function(opt, input, output){
	CV.resize();
	var course;
	if(opt == 4){
		// 4�ߖT
		course = 0;
	}else if(opt == 8){
		// 8�ߖT
		course = 5;
	}else{
		// �n�������̓e���L�[�̐����̈ʒu�ɑΉ�
		course = parseInt(document.getElementById('course').value);
	}
	switch(course){
		case 0:	var S = [0, 1, 0, 1, -4, 1, 0, 1, 0];break;	// 4�ߖT
		case 1:	var S = [0, -1, -2, 1, 0, -1, 2, 1, 0];break;
		case 2:	var S = [-1, -2, -1, 0, 0, 0, 1, 2, 1];break;
		case 3:	var S = [-2, -1, 0, -1, 0, 1, 0, 1, 2];break;
		case 4:	var S = [1, 0, -1, 2, 0, -2, 1, 0, -1];break;
		case 5:	var S = [1, 1, 1, 1, -8, 1, 1, 1, 1];break;	// 8�ߖT
		case 6:	var S = [-1, 0, 1, -2, 0, 2, -1, 0, 1];break;
		case 7:	var S = [2, 1, 0, 1, 0, -1, 0, -1, -2];break;
		case 8:	var S = [1, 2, 1, 0, 0, 0, -1, -2, -1];break;
		case 9:	var S = [0, 1, 2, -1, 0, 1, -2, -1, 0];break;
	}
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				output.data[i] = 
					S[0]*input.data[i - w*4 - 4] + S[1]*input.data[i - w*4] + S[2]*input.data[i - w*4 + 4] +
					S[3]*input.data[i - 4] + S[4]*input.data[i] + S[5]*input.data[i + 4] +
					S[6]*input.data[i + w*4 - 4] + S[7]*input.data[i + w*4] + S[8]*input.data[i + w*4 + 4];
			}
			output.data[(y*w + x)*4 + 3] = input.data[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy(input, output);
}

//////////
// �ڂ��� //
//////////

// ���f�B�A��
CV.median = function(input, output){
	CV.resize();
	var number = [];
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				// �����l�����߂�
				number[0] = input.data[i - w*4 - 4];
				number[1] = input.data[i - w*4];
				number[2] = input.data[i - w*4 + 4];
				number[3] = input.data[i - 4];
				number[4] = input.data[i];
				number[5] = input.data[i + 4];
				number[6] = input.data[i + w*4 - 4];
				number[7] = input.data[i + w*4];
				number[8] = input.data[i + w*4 + 4];
				number.sort(
					function(a,b){
						if( a < b ) return -1;
						if( a > b ) return 1;
						return 0;
					}
				);
				// �����l����
				output.data[i] = number[4];
			}
			output.data[(y*w + x)*4 + 3] = input.data[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy(input, output);
}

// ������(NxN)
CV.smoothing = function(N, input, output){
	CV.resize();
	var smooth = Math.pow(N, -2);
	// var smooth = 1/25;
	// �S��f���[�v
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				var sum = 0;
				// �J�[�l���S���[�v
				for(var dy=0; dy<N; dy++){
					for(var dx=0; dx<N; dx++){
						var horizon = w*(-(N-1)/2*4 + 4*dx);
						var vertical = -(N-1)/2*4 + 4*dy;
						// ��f�l�v�Z
						sum += smooth * input.data[i + horizon +  vertical];
					}
				}
				output.data[i] = sum;
			}
			output.data[(y*w + x)*4 + 3] = input.data[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy(input, output);
}

// �K�E�V�A��(3x3)
CV.gaussian = function(input, output){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				output.data[i] = 
					1/16*input.data[i - w*4 - 4] + 2/16*input.data[i - w*4] + 1/16*input.data[i - w*4 + 4] +
					2/16*input.data[i - 4] + 4/16*input.data[i] + 2/16*input.data[i + 4] +
					1/16*input.data[i + w*4 - 4] + 2/16*input.data[i + w*4] + 1/16*input.data[i + w*4 + 4];
			}
			output.data[(y*w + x)*4 + 3] = input.data[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy(input, output);
}

// �K�E�V�A��(5x5)
CV.gaussian2 = function(input, output){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				output.data[i] = 
					1/256*input.data[i - w*8 - 8] + 
					4/256*input.data[i - w*8 - 4] + 
					6/256*input.data[i - w*8] + 
					4/256*input.data[i - w*8 + 4] +
					1/256*input.data[i - w*8 + 8] +

					4/256*input.data[i - w*4 - 8] + 
					16/256*input.data[i - w*4 - 4] + 
					24/256*input.data[i - w*4] + 
					16/256*input.data[i - w*4 + 4] +
					4/256*input.data[i - w*4 + 8] +

					6/256*input.data[i - 8] + 
					24/256*input.data[i - 4] + 
					36/256*input.data[i] + 
					24/256*input.data[i + 4] +
					6/256*input.data[i + 8] +

					4/256*input.data[i + w*4 - 8] + 
					16/256*input.data[i + w*4 - 4] + 
					24/256*input.data[i + w*4] + 
					16/256*input.data[i + w*4 + 4] +
					4/256*input.data[i + w*4 + 8] +

					1/256*input.data[i + w*8 - 8] + 
					4/256*input.data[i + w*8 - 4] + 
					6/256*input.data[i + w*8] + 
					4/256*input.data[i + w*8 + 4] +
					1/256*input.data[i + w*8 + 8];
			}
			output.data[(y*w + x)*4 + 3] = input.data[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy(input, output);
}

/////////////
// ���x�␳ //
/////////////

// ����
CV.bright = function(input, output){
	CV.resize();
	var rate = document.getElementById('brightValue').value / 100;
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			var j = parseInt(rate);
			output.data[i + 0] = rate * input.data[i + 0];
			output.data[i + 1] = rate * input.data[i + 1];
			output.data[i + 2] = rate * input.data[i + 2];
			output.data[i + 3] = input.data[i + 3];
		}
	}
	CV.copy(input, output);
}

// �K���}�␳�i�����x���j
CV.gamma = function(input, output){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			// �K���}�l
			var gamma = document.getElementById("gammaValue").value;
			output.data[i + 0] = 255 * Math.pow((input.data[i + 0]/255), 1.0/gamma);
			output.data[i + 1] = 255 * Math.pow((input.data[i + 1]/255), 1.0/gamma);
			output.data[i + 2] = 255 * Math.pow((input.data[i + 2]/255), 1.0/gamma);
			output.data[i + 3] = input.data[i + 3];
		}
	}
	CV.copy(input, output);
}

// �K���}�␳�iLUT�g�p�Łj
CV.gammaLUT = function(input, output){
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
			output.data[i + 0] = LUT[input.data[i]];
			output.data[i + 1] = LUT[input.data[i + 1]];
			output.data[i + 2] = LUT[input.data[i + 2]];
			output.data[i + 3] = input.data[i + 3];
		}
	}
	CV.copy(input, output);
}

/////////////
// ���ߏ��� //
/////////////

// ����
CV.transparent = function(input, output){
	CV.resize();
	var opacity = document.getElementById('opacity').value;
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			output.data[i + 0] = input.data[i + 0];
			output.data[i + 1] = input.data[i + 1];
			output.data[i + 2] = input.data[i + 2];
			// ���P�x�ȏ�̃s�N�Z���𓧉�
			if(
				(input.data[i] >= opacity) &
				(input.data[i+1] >= opacity) &
				(input.data[i+2] >= opacity) 
			){
				output.data[i + 3] = 0;
			}
		}
	}
	CV.copy(input, output);
}

/////////////
// �􉽕ϊ� //
/////////////

// �������]
CV.hmirror = function(input, output){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			var j = (y*w + (w - x - 1))*4;
			output.data[i + 0] = input.data[j + 0];
			output.data[i + 1] = input.data[j + 1];
			output.data[i + 2] = input.data[j + 2];
			output.data[i + 3] = input.data[j + 3];
		}
	}
	CV.copy(input, output);
}

// �������]
CV.vmirror = function(input, output){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			var j = ((h - y -1)*w + x)*4;
			output.data[i + 0] = input.data[j + 0];
			output.data[i + 1] = input.data[j + 1];
			output.data[i + 2] = input.data[j + 2];
			output.data[i + 3] = input.data[j + 3];
		}
	}
	CV.copy(input, output);
}

// �g�k�i�������j
CV.small = function(input, output){
	CV.resize();
	var rate = document.getElementById('rate').value / 100;
	CV.canvas.width = CV.canvas.width * rate;
	CV.canvas.height = CV.canvas.height * rate;
	CV.context.drawImage(image, 0, 0, rate * w, rate * h);
}

// ��]�i�������j
CV.rotation = function(input, output){
	CV.resize();
	var itheta = document.getElementById('theta').value;
	var theta = itheta * Math.PI/180;
	var sin = Math.sin(theta);
	var cos = Math.cos(theta);
	dw = parseInt((Math.abs(w * cos) + Math.abs(h * sin) + 0.5), 10);
	dh = parseInt((Math.abs(w * sin) + Math.abs(h * cos) + 0.5), 10);
	output.width = dw;
	output.height = dh;
	CV.canvas.width = output.width;
	CV.canvas.height = output.height;
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			// ��]�p
			var rx = parseInt(((cos * (x-dw/2) - sin * (y-dh/2)) + w/2), 10);
			var ry = parseInt(((sin * (x-dw/2) + cos * (y-dh/2)) + h/2), 10);
			var j = (ry*w + rx)*4;
			output.data[i + 0] = input.data[j + 0];
			output.data[i + 1] = input.data[j + 1];
			output.data[i + 2] = input.data[j + 2];
			output.data[i + 3] = input.data[j + 3];
		}
	}
	CV.copy(input, output);
}
