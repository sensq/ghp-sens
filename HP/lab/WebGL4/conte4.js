var conte = 1;
var menu = 1;

function Button_Content() {
	switch (conte) {
	case 0:
		conte = 1;
		document.getElementById("Button_Content").innerHTML = "詳細を表示";
		document.getElementById("inner-right1").style.display = "block";
		document.getElementById("inner-right2").style.display = "block";
		document.getElementById("conte").style.display = "none";
		document.getElementById("inner-right3").style.display = "none";
		document.getElementById("inner-right4").style.display = "none";
		break;
	case 1:
		conte = 0;
		document.getElementById("Button_Content").innerHTML = "元に戻す";
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
		document.getElementById("Button_Menu").innerHTML = "光・形状・テクスチャ";
		document.getElementById("inner-right1").style.display = "block";
		document.getElementById("inner-right2").style.display = "block";
		document.getElementById("conte").style.display = "none";
		document.getElementById("inner-right3").style.display = "none";
		document.getElementById("inner-right4").style.display = "none";
		break;
	case 1:
		menu = 0;
		document.getElementById("Button_Menu").innerHTML = "材質のパラメータ";
		document.getElementById("inner-right1").style.display = "none";
		document.getElementById("inner-right2").style.display = "none";
		document.getElementById("conte").style.display = "none";
		document.getElementById("inner-right3").style.display = "block";
		document.getElementById("inner-right4").style.display = "block";
		break;
	}
}