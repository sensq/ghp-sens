var conte = 1;
var menu = 1;

function Button_Content() {
	switch (conte) {
	case 0:
		conte = 1;
		document.getElementById("Button_Content").innerHTML = "�ڍׂ�\��";
		document.getElementById("inner-right1").style.display = "block";
		document.getElementById("inner-right2").style.display = "block";
		document.getElementById("conte").style.display = "none";
		document.getElementById("inner-right3").style.display = "none";
		document.getElementById("inner-right4").style.display = "none";
		break;
	case 1:
		conte = 0;
		document.getElementById("Button_Content").innerHTML = "���ɖ߂�";
		document.getElementById("inner-right1").style.display = "none";
		document.getElementById("inner-right2").style.display = "none";
		document.getElementById("conte").style.display = "block";
		document.getElementById("inner-right3").style.display = "none";
		document.getElementById("inner-right4").style.display = "none";
		break;
	}
}

function Button_Menu() {
	switch (menu) {
	case 0:
		menu = 1;
		document.getElementById("Button_Menu").innerHTML = "���E�`��E�e�N�X�`��";
		document.getElementById("inner-right1").style.display = "block";
		document.getElementById("inner-right2").style.display = "block";
		document.getElementById("conte").style.display = "none";
		document.getElementById("inner-right3").style.display = "none";
		document.getElementById("inner-right4").style.display = "none";
		break;
	case 1:
		menu = 0;
		document.getElementById("Button_Menu").innerHTML = "�ގ��̃p�����[�^";
		document.getElementById("inner-right1").style.display = "none";
		document.getElementById("inner-right2").style.display = "none";
		document.getElementById("conte").style.display = "none";
		document.getElementById("inner-right3").style.display = "block";
		document.getElementById("inner-right4").style.display = "block";
		break;
	}
}