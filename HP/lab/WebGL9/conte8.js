var conte = 1;

function Button_Content() {
	switch (conte) {
	case 0:
		conte = 1;
		document.getElementById("Button_Content").innerHTML = "ãZèpìIÇ»Ç±Ç∆";
		document.getElementById("inner-right1").style.display = "table-cell";
		document.getElementById("inner-right3").style.display = "table-cell";
		document.getElementById("inner-right2").style.display = "none";
		break;
	case 1:
		conte = 0;
		document.getElementById("Button_Content").innerHTML = "å≥Ç…ñﬂÇ∑";
		document.getElementById("inner-right1").style.display = "none";
		document.getElementById("inner-right3").style.display = "none";
		document.getElementById("inner-right2").style.display = "table-cell";
		break;
	}
}