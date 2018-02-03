function anim() {
	$("#blink").fadeOut();
	$("#blink").fadeIn();
}

function readtxt(no) {
	// �wjQuery�x�́wajax()�x���\�b�h
	// �����́w{url:�t�@�C���̃p�X, success:�I����̏����̊֐�}�x�̘A�z�z��
	$.ajax({
		url: "test" + no + ".txt",    // �t�@�C����
		success: function(result){
			// �����wresult�x����閳���֐�
			// �wresult�x�ɂ͎擾���������񂪊i�[����Ă���
			$("#txtData").text(result);    // id�wdata�x�̗v�f�̕�����ɐݒ�
		}
	});
}

function readjson(no) {
	$.getJSON("data" + no + ".json",
		function(json){
			// ���e��������
			$("#txtData").text("");
			// �͎�擾
			for (var i in json.kankore) {
				var kankore = json.kankore[i];
				$("#txtData")
				.append(kankore.category + " :<br>");
				// �͌^�擾
				for(var i in kankore.series) {
					var series = kankore.series[i];
					$("#txtData")
					.append(" �i" + series.series + "�j");
					// �͖��擾
					for(var i in series.names) {
						var name = series.names[i].name;
						if(i < series.names.length-1){
							$("#txtData")
							.append(name + ", ");
						}else{
							$("#txtData")
							.append(name);
						}
					}
					$("#txtData")
					.append("<br>");
				}
			}
		}
	);
}

function callFlickr() {
	flickr($("#tag").val());
}

function flickr(tag) {
	$.getJSON(
		"http://api.flickr.com/services/feeds/photos_public.gne?tags=" + tag + "&format=json&jsoncallback=?",
		function(json){
			if(json.items.length == 0){
				alert("�摜������܂���ł���...");
			}
			else{
				$("#data")
				.append(tag + "�̌�������<br>" );
				for (var i = 0; i < json.items.length; i ++) {
					var item = json.items[i];
					$("<img/>")
					.attr("src", item.media.m)
					.appendTo("#data");
				}
				$("#data")
				.append("<hr>");
			}
		}
	);
}

var now = {
	state: "normal",
	face: "�E",
	move: "",
	pos: 100,
	flag: true,
}
$(document).ready(function(){//jQuery�g�����͂���ł�����
	//���ʂ̊�Z�b�g
	var esnaBtn = $("#esna");
	var normalColor = "#ff6089";
	var normalFace = "�E"
	//�Q�Ă鎞�̊�Z�b�g
	var slepleBtn = $("#sleple");
	var sleepColor = "#666666";
	var sleepFace = "-"
	//�ŏ�Ԃ̊�Z�b�g
	var poisonBtn = $("#poison");
	var poisonColor = "#a42fe1";
	var poisonFace = "+"
	//�L���b�̊�Z�b�g
	var kyaFace = ">"

	function magic(magicName,�@imoColor,�@imoFace, stateName) {
		magicName.click(function () {
			$("#imomushi").css("background-color",imoColor);
			$("#imomushi .tsuno").css("color",imoColor);
			$("#imomushi .eye").text(imoFace);
			now.state = stateName;
			now.face =�@imoFace;
		});
	};
	//functione�Ŋo�����G�X�i���g��
	magic(esnaBtn,�@normalColor,�@normalFace, "normal");
	//�X���v�����g��
	magic(slepleBtn,�@sleepColor,�@sleepFace, "sleep");
	//�|�C�Y�����g��(�o�����ł����ł��g����)
	magic(poisonBtn,�@poisonColor,�@poisonFace, "poison");
	//�o�[�T�N���g��(�����͕ϐ�����Ȃ��������I�u�W�F�N�g�ł����v�I)
	magic($("#berserk"),"#ff3e43","�M", "berserk");

	$("#imomushi").hover(
		function () {//�J�[�\�����C�����ɐG�ꂽ��
			$("#imomushi .eye").text(kyaFace);
		},
		function () {//�J�[�\�������ꂽ��
			$("#imomushi .eye").text(now.face);
		}
	);
	$(".btnR").hover(
		function () {//�J�[�\�����C�����ɐG�ꂽ��
			$(".btnR").css("cursor","pointer");
		},
		function () {//�J�[�\�������ꂽ��
			$(".btnR").css("cursor","default");
		}
	);
	$(".btnG").hover(
		function () {//�J�[�\�����C�����ɐG�ꂽ��
			$(".btnG").css("cursor","pointer");
		},
		function () {//�J�[�\�������ꂽ��
			$(".btnG").css("cursor","default");
		}
	);
	$(".btnB").hover(
		function () {//�J�[�\�����C�����ɐG�ꂽ��
			$(".btnB").css("cursor","pointer");
		},
		function () {//�J�[�\�������ꂽ��
			$(".btnB").css("cursor","default");
		}
	);
	
	now.move = setInterval("blink()",2000);

	$("#ssBtn").click(function () {
		if(now.flag){
			$("#imomushi").css("background-color","#999999");
			$("#imomushi .tsuno").css("color","#999999");
			$("#imomushi .eye").text(">");
			now.face =�@">";
			clearInterval(now.move);
			now.flag = false;
			$("#ssBtn").text("�X�^�[�g");
		}else{
			$("#imomushi").css("background-color",�@normalColor);
			$("#imomushi .tsuno").css("color",�@normalColor);
			$("#imomushi .eye").text(�@normalFace);
			now.state = "normal";
			now.face =�@normalFace;
			now.flag = true;
			$("#ssBtn").text("�X�g�b�v");
			now.move = setInterval("blink()",2000);
		}
	});
});

function blink() {
	if(now.state == "normal"){
		now.pos += 20;
		if(now.pos > 480)
			now.pos = 0;
		var $dis = now.pos + 'px';
		$("#imomushi").animate({width: '60px'}, 500);
		$("#imomushi").animate({width: '40px', left: $dis}, 500);
		$("#imomushi .eye").text("-");
		setTimeout("openEye()",200)//�Ăяo���ꂽ0.2�b���openEye()���Ăяo��
	}
	else if(now.state == "sleep"){
		$("#imomushi .eye").text("-");
	}
	else if(now.state == "poison"){
		$("#imomushi").animate({top: 60}, 50);
		$("#imomushi").animate({top: 57}, 50);
	}
	else if(now.state == "berserk"){
		var walk = 10 + Number((Math.random() * 70).toFixed(0));
		var durationS = 200 + Number((Math.random() * 200).toFixed(0));
		var durationE = 200 + Number((Math.random() * 200).toFixed(0));
		now.pos += walk;
		if(now.pos > 479)
			now.pos = 0;
		var $lengthNobi = 40 + walk + 'px';
		var $dis = now.pos + 'px';
		$("#imomushi").animate({width: $lengthNobi}, durationS);
		$("#imomushi").animate({width: '40px', left: $dis}, durationE);
	}
}

function openEye() {
	$("#imomushi .eye").text("�E");
}

/*************
** ���̑��̃��\�b�h
**************/
window.addEventListener('load', function (){
	$("#tag").val("Flower");
}, false);
