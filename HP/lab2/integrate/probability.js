var func;

//�e�L�X�g�{�b�N�X���͂��ēǂݍ��߂�悤�ɂ�����
//���w�֐��Ɉ�����^������@���v���t���Ȃ�
//�Ή����銇�ʓ����ׂĂɃ}�b�`���鐳�K�\�����Ă���H
function FuncInput(){
	func = document.getElementById("Func").value;
	func = func.replace(/exp/g, Math.exp);
	func = func.replace(/sqrt/g, Math.sqrt);
	func = func.replace(/sin/g, Math.sin);
	func = func.replace(/cos/g, Math.cos);
	func = func.replace(/tan/g, Math.tan);
	document.getElementById("kakunin").innerHTML = func;
}

function Func(x){	
	//�K�E�X�֐�
	//�͈�-5�`5�A������100���x�ŏ\��
	//�͈͂�傫�������番���������₷
	return Math.exp(-(x*x));
	
	//�~����
	//�͈͂�0�`1�ɂ���
	//return 4*Math.sqrt(1 - x*x);
	
	//�O�p�`
	//if(x<=0)
	//	return x;
	//else
	//	return -x;
		
	//���z
	//return func;
}

//�ϕ��v�Z�֐�
function Integrate(){
	//��Ԃ̎w��
	var left = parseInt(document.getElementById("left").value);
	var right = parseInt(document.getElementById("right").value);
	
	//������
	var n = parseInt(document.getElementById("divide").value);
	
	//�v�Z�p
	var h = (right-left) / n;
	var x = left;
	var s = 0;
	var sum = 0;
	for(k=1; k<=n-1; k++){
	  x = x + h;
	  s = s + Func(x);
	}
	sum = h * ((Func(left) + Func(right)) / 2 + s);
	document.getElementById("integrate").innerHTML = sum;
}

window.addEventListener('load', function (){
	document.getElementById("Func").value = "exp(-(x*x))";
	document.getElementById("left").value = -10;
	document.getElementById("right").value = 10;
	document.getElementById("divide").value = 100;
	
	FuncInput()
	Integrate();
	document.int.left.focus();	
}, false);
