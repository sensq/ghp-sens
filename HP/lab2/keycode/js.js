document.onkeydown = function(e) { 
	keycode = e.which;
	keychar = String.fromCharCode(keycode).toUpperCase();
	
	target = document.getElementById("code");
	target.value = keycode;
	
	target = document.getElementById("char");
	char.value = keychar;
	
	//�e�L�X�g�{�b�N�X�ɓ��͂����Ȃ�
	return false;
}

window.addEventListener('load', function (){
	document.box.char.focus();	
}, false);
