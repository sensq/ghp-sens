var init = true;
var bracket = new String("pmatrix");

// 画像の取得
function LaTeX() {
	//dpiを取得
	var dpi = new String();
	dpi += "\\dpi{";
	dpi += document.sizebox.sizebox.value;
	dpi += "}";
	
	//URLを作成
	var url = new String();
	url += "http://latex.codecogs.com/png.latex?";
	url += dpi;
	url += document.textbox.textbox.value;
	
	//画像とリンクのタグ付け
	var strlatex = new String();
	strlatex += "<a target=\"blank\" href=\"";
	strlatex += url;
	strlatex += "\">";
	strlatex += "<img src=\"";
	strlatex += url;
	strlatex += "\">";
	strlatex += "</a>";
	
	document.getElementById("imgEq").innerHTML = strlatex;
}

// 行数と列数を指定して個数分のボックスを作成
function createMatrix(){
	var row = document.getElementById('row').value;
	var col = document.getElementById('col').value;
	document.getElementById("matrix").innerHTML = '';

	for(var j=0; j<row; j++){
		for(var i=0; i<col; i++){
			document.getElementById("matrix").innerHTML += '<input type="text" size="6" id="element' + i + j + '" onKeyup="createMatrixEq();"> ';
		}
		document.getElementById("matrix").innerHTML += '<br>';
	}
	init = true;
	createMatrixEq();
}

// 各ボックスの値からTeX用のテキストを作成
function createMatrixEq(){
	var row = document.getElementById('row').value;
	var col = document.getElementById('col').value;
	var id = "element";

    // テキストカラーを取得
	var color = new String();
	color += "{\\color[rgb]{";
	color += document.setColor.setColor.value;
	color += "}\n";

	document.textbox.textbox.value = color;
	document.textbox.textbox.value += "\\begin{" + bracket + "}\n";

	for(var j=0; j<row; j++){
		for(var i=0; i<col; i++){
			// 要素IDを作成
			id = id + i + j;
			// テキスト値を初期化
			if(init){
				document.getElementById(id).value = "a_{" + i + j + "}";
			}
			// TeXの入力ボックスに要素を入力
			document.textbox.textbox.value += document.getElementById(id).value;
			// 最終列なら改行、そうでないなら列を追加
			if(i == (col-1)){
				document.textbox.textbox.value += "\\\\ \n";
			}else{
				document.textbox.textbox.value += " & ";
			}
			// 初期化
			id = "element";
		}
	}
	document.textbox.textbox.value += "\\end{" + bracket + "}\n";
    // カラーの閉じ括弧
	document.textbox.textbox.value += "}";
	init = false;
	LaTeX();
}

// 括弧を選択
function selectBracket(s) {
    switch (s.selectedIndex) {
        case 0:
            bracket = "bmatrix";
            break;
        case 1:
            bracket = "pmatrix";
            break;
        case 2:
            bracket = "vmatrix";
            break;
        case 3:
            bracket = "matrix";
            break;
    }
    init = false;
    createMatrixEq();
}

//更新時に実行される動作
window.addEventListener('load', function (){
	document.getElementById('row').value = 4;
	document.getElementById('col').value = 4;
	document.sizebox.sizebox.value = "200";
	document.sizebox.sizebox.focus();
	document.setColor.setColor.value = "0.0, 0.0, 0.0";
	createMatrix();
	createMatrixEq();
}, false);
