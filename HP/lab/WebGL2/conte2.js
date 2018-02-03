var conte = 1;

function Button_Content() {
	switch (conte) {
	case 0:
		conte = 1;
		document.getElementById("Button_Content").innerHTML = "ŽÀ‘•“à—e‚ð•\Ž¦";
		document.getElementById("inner-right1").style.display = "table-cell";
		document.getElementById("inner-right2").style.display = "none";
		break;
	case 1:
		conte = 0;
		document.getElementById("Button_Content").innerHTML = "Œ³‚É–ß‚·";
		document.getElementById("inner-right1").style.display = "none";
		document.getElementById("inner-right2").style.display = "table-cell";
		break;
	}
}