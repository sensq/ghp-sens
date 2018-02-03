var func;

//テキストボックス入力して読み込めるようにしたい
//数学関数に引数を与える方法が思い付かない
//対応する括弧内すべてにマッチする正規表現ってある？
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
	//ガウス関数
	//範囲-5～5、分割数100程度で十分
	//範囲を大きくしたら分割数も増やす
	return Math.exp(-(x*x));
	
	//円周率
	//範囲を0～1にする
	//return 4*Math.sqrt(1 - x*x);
	
	//三角形
	//if(x<=0)
	//	return x;
	//else
	//	return -x;
		
	//理想
	//return func;
}

//積分計算関数
function Integrate(){
	//区間の指定
	var left = parseInt(document.getElementById("left").value);
	var right = parseInt(document.getElementById("right").value);
	
	//分割数
	var n = parseInt(document.getElementById("divide").value);
	
	//計算用
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
