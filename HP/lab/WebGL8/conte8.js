var conte = 1;

function Button_Content() {
	switch (conte) {
	case 0:
		conte = 1;
		document.getElementById("Button_Content").innerHTML = "注意書き";
		document.getElementById("canvas").style.display = "block";
		document.getElementById("center").style.display = "none";
		break;
	case 1:
		conte = 0;
		document.getElementById("Button_Content").innerHTML = "元に戻す";
		document.getElementById("canvas").style.display = "none";
		document.getElementById("center").style.display = "table";
		break;
	}
}