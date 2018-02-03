//データを読み込む
function inputData() {
	data = new Array(
		parseInt(document.getElementById("data1").value),
		parseInt(document.getElementById("data2").value),
		parseInt(document.getElementById("data3").value),
		parseInt(document.getElementById("data4").value),
		parseInt(document.getElementById("data5").value),
		parseInt(document.getElementById("data6").value),
		parseInt(document.getElementById("data7").value),
		parseInt(document.getElementById("data8").value)
	);
}

//バブルソート========================================
//初期化用
function initBubble(){
	inputData();
	dataBubble = data;
	printBubble();
	countBubble = 0;
	document.getElementById("timesBubble").innerHTML = "実行回数：" + 0;
}

function sortBubble() {
	if(dataBubble[0]>dataBubble[1] || dataBubble[1]>dataBubble[2] || dataBubble[2]>dataBubble[3] || dataBubble[3]>dataBubble[4] || dataBubble[4]>dataBubble[5] || dataBubble[5]>dataBubble[6] || dataBubble[6]>dataBubble[7]){
		for (j=0;
j<dataBubble.length-countBubble-1;
j++){
			if (dataBubble[j] > dataBubble[j+1]) {
				n = dataBubble[j];
				dataBubble[j] = dataBubble[j+1];
				dataBubble[j+1] = n;
			}
		}
		countBubble += 1;
		document.getElementById("timesBubble").innerHTML = "実行回数：" + countBubble;
		printBubble();
	}
}

function printBubble() {
	document.getElementById("bubble1").value = dataBubble[0];
	document.getElementById("bubble2").value = dataBubble[1];
	document.getElementById("bubble3").value = dataBubble[2];
	document.getElementById("bubble4").value = dataBubble[3];
	document.getElementById("bubble5").value = dataBubble[4];
	document.getElementById("bubble6").value = dataBubble[5];
	document.getElementById("bubble7").value = dataBubble[6];
	document.getElementById("bubble8").value = dataBubble[7];
}
//====================================================

//バブルソート========================================
//初期化用
function initQuick(){
	inputData();
	dataQuick = data;
	printQuick();
	countQuick = 0;
	start = 0;
	end = dataQuick.length - 1;
	document.getElementById("timesQuick").innerHTML = "実行回数：" + 0;
}

function sortQuick(start , end) {
	if(dataQuick[0]>dataQuick[1] || dataQuick[1]>dataQuick[2] || dataQuick[2]>dataQuick[3] || dataQuick[3]>dataQuick[4] || dataQuick[4]>dataQuick[5] || dataQuick[5]>dataQuick[6] || dataQuick[6]>dataQuick[7]){
	
		var x = dataQuick[Math.floor((start + end) / 2)];
		var i = start;
		var j = end;
		while (true) {
			while (dataQuick[i] < x) i++;
			while (x < dataQuick[j]) j--;
			if (i >= j)
				break;
			n = dataQuick[i];
			dataQuick[i] = dataQuick[j];
			dataQuick[j] = n;
			i++;
			j--;
		}
		if (start < i-1){
			//endTemp = i-1;
			sortQuick(start,i-1);
		}
		if (j+1 < end){
			//startTemp = j+1;
			sortQuick(j+1,end);
		}
		countQuick += 1;
		document.getElementById("timesQuick").innerHTML = "実行回数：" + countQuick;
		printQuick();
	}
}

function printQuick() {
	document.getElementById("quick1").value = dataQuick[0];
	document.getElementById("quick2").value = dataQuick[1];
	document.getElementById("quick3").value = dataQuick[2];
	document.getElementById("quick4").value = dataQuick[3];
	document.getElementById("quick5").value = dataQuick[4];
	document.getElementById("quick6").value = dataQuick[5];
	document.getElementById("quick7").value = dataQuick[6];
	document.getElementById("quick8").value = dataQuick[7];
}
//====================================================

window.addEventListener('load', function (){
	document.getElementById("data1").value = 5;
	document.getElementById("data2").value = 1;
	document.getElementById("data3").value = 7;
	document.getElementById("data4").value = 2;
	document.getElementById("data5").value = 6;
	document.getElementById("data6").value = 4;
	document.getElementById("data7").value = 8;
	document.getElementById("data8").value = 3;
	
	initBubble();
	initQuick();
	document.Data.data1.focus();	
}, false);
