function HaguremetalProbability1(){
	var prob = document.getElementById("prob1").value;
	var trial = document.getElementById("trial1").value;
	
	var prob_result = (1-Math.pow((1-1/prob),trial))*100;
	var result = new String();
	
	result = "結果：<i>" + (prob_result).toFixed(3) + "</i> %";
	document.getElementById("hagureResult").innerHTML = result;
}

function HaguremetalProbability2(){
	var prob = document.getElementById("prob2").value;
	var prob_result = document.getElementById("prob_result1").value / 100;
	
	//var trial = Math.log(1-prob_result) / Math.log(1-1/prob);
	var trial = Math.log(1-prob_result) / Math.log(1-1/prob);
	var result = new String();
	
	result = "必要な試行回数：<i>" + (trial).toFixed(1) + "</i> 回";
	document.getElementById("hagureResult2").innerHTML = result;
}

function CouponProbability(){
	var series = document.getElementById("series1").value;
	var result = new String();
	
	//調和級数バージョン（遅い）
	//var sum = 0;
	//for(i=1; i <= series; i++){
	//	sum += 1/i;
	//}
	//var prob_result = (series * sum);
	//result = "コンプにかかる回数の期待値：<i>" + (prob_result).toFixed(2) + "</i>回";
	//document.getElementById("couponResult1").innerHTML = result;
	
	//オイラー定数バージョン（速い）
	var EULER_GAMMA = 0.5772156649;
	var prob_result = series * (Math.log(series) + EULER_GAMMA)+0.5;
	result = "コンプにかかる回数の期待値：<i>" + (prob_result).toFixed(2) + "</i> 回";
	document.getElementById("couponResult2").innerHTML = result;
}

window.addEventListener('load', function (){
	document.getElementById("prob1").value = 256;
	document.getElementById("trial1").value = 256;
	document.getElementById("series1").value = 6;
	document.getElementById("prob2").value = 256;
	document.getElementById("prob_result1").value = 63.28;
	
	HaguremetalProbability1();
	HaguremetalProbability2();
	CouponProbability();
	document.hagure.prob.focus();	
}, false);
