var conte = 1;

function Button_Content() {
	switch (conte) {
	case 0:
		conte = 1;
		document.getElementById("Button_Content").innerHTML = "���ӏ���";
		document.getElementById("canvas").style.display = "block";
		document.getElementById("center").style.display = "none";
		break;
	case 1:
		conte = 0;
		document.getElementById("Button_Content").innerHTML = "���ɖ߂�";
		document.getElementById("canvas").style.display = "none";
		document.getElementById("center").style.display = "table";
		break;
	}
}