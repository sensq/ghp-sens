var conte = 1;

function Button_Content() {
	switch (conte) {
	case 0:
		conte = 1;
		document.getElementById("Button_Content").innerHTML = "実装内容を表示";
		document.getElementById("inner-right1").style.display = "table-cell";
		document.getElementById("inner-right2").style.display = "none";
		break;
	case 1:
		conte = 0;
		document.getElementById("Button_Content").innerHTML = "元に戻す";
		document.getElementById("inner-right1").style.display = "none";
		document.getElementById("inner-right2").style.display = "table-cell";
		break;
	}
}