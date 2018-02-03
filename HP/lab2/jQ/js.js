function anim() {
	$("#blink").fadeOut();
	$("#blink").fadeIn();
}

function readtxt(no) {
	// 『jQuery』の『ajax()』メソッド
	// 引数は『{url:ファイルのパス, success:終了後の処理の関数}』の連想配列
	$.ajax({
		url: "test" + no + ".txt",    // ファイル名
		success: function(result){
			// 引数『result』を取る無名関数
			// 『result』には取得した文字列が格納されている
			$("#txtData").text(result);    // id『data』の要素の文字列に設定
		}
	});
}

function readjson(no) {
	$.getJSON("data" + no + ".json",
		function(json){
			// 内容を初期化
			$("#txtData").text("");
			// 艦種取得
			for (var i in json.kankore) {
				var kankore = json.kankore[i];
				$("#txtData")
				.append(kankore.category + " :<br>");
				// 艦型取得
				for(var i in kankore.series) {
					var series = kankore.series[i];
					$("#txtData")
					.append(" （" + series.series + "）");
					// 艦名取得
					for(var i in series.names) {
						var name = series.names[i].name;
						if(i < series.names.length-1){
							$("#txtData")
							.append(name + ", ");
						}else{
							$("#txtData")
							.append(name);
						}
					}
					$("#txtData")
					.append("<br>");
				}
			}
		}
	);
}

function callFlickr() {
	flickr($("#tag").val());
}

function flickr(tag) {
	$.getJSON(
		"http://api.flickr.com/services/feeds/photos_public.gne?tags=" + tag + "&format=json&jsoncallback=?",
		function(json){
			if(json.items.length == 0){
				alert("画像がありませんでした...");
			}
			else{
				$("#data")
				.append(tag + "の検索結果<br>" );
				for (var i = 0; i < json.items.length; i ++) {
					var item = json.items[i];
					$("<img/>")
					.attr("src", item.media.m)
					.appendTo("#data");
				}
				$("#data")
				.append("<hr>");
			}
		}
	);
}

var now = {
	state: "normal",
	face: "・",
	move: "",
	pos: 100,
	flag: true,
}
$(document).ready(function(){//jQuery使う時はこれでかこう
	//普通の顔セット
	var esnaBtn = $("#esna");
	var normalColor = "#ff6089";
	var normalFace = "・"
	//寝てる時の顔セット
	var slepleBtn = $("#sleple");
	var sleepColor = "#666666";
	var sleepFace = "-"
	//毒状態の顔セット
	var poisonBtn = $("#poison");
	var poisonColor = "#a42fe1";
	var poisonFace = "+"
	//キャッの顔セット
	var kyaFace = ">"

	function magic(magicName,　imoColor,　imoFace, stateName) {
		magicName.click(function () {
			$("#imomushi").css("background-color",imoColor);
			$("#imomushi .tsuno").css("color",imoColor);
			$("#imomushi .eye").text(imoFace);
			now.state = stateName;
			now.face =　imoFace;
		});
	};
	//functioneで覚えたエスナを使う
	magic(esnaBtn,　normalColor,　normalFace, "normal");
	//スリプルを使う
	magic(slepleBtn,　sleepColor,　sleepFace, "sleep");
	//ポイズンを使う(覚える上でも下でも使える)
	magic(poisonBtn,　poisonColor,　poisonFace, "poison");
	//バーサクを使う(引数は変数じゃなく文字列やオブジェクトでも大丈夫！)
	magic($("#berserk"),"#ff3e43","｀", "berserk");

	$("#imomushi").hover(
		function () {//カーソルがイモモに触れたら
			$("#imomushi .eye").text(kyaFace);
		},
		function () {//カーソルが離れたら
			$("#imomushi .eye").text(now.face);
		}
	);
	$(".btnR").hover(
		function () {//カーソルがイモモに触れたら
			$(".btnR").css("cursor","pointer");
		},
		function () {//カーソルが離れたら
			$(".btnR").css("cursor","default");
		}
	);
	$(".btnG").hover(
		function () {//カーソルがイモモに触れたら
			$(".btnG").css("cursor","pointer");
		},
		function () {//カーソルが離れたら
			$(".btnG").css("cursor","default");
		}
	);
	$(".btnB").hover(
		function () {//カーソルがイモモに触れたら
			$(".btnB").css("cursor","pointer");
		},
		function () {//カーソルが離れたら
			$(".btnB").css("cursor","default");
		}
	);
	
	now.move = setInterval("blink()",2000);

	$("#ssBtn").click(function () {
		if(now.flag){
			$("#imomushi").css("background-color","#999999");
			$("#imomushi .tsuno").css("color","#999999");
			$("#imomushi .eye").text(">");
			now.face =　">";
			clearInterval(now.move);
			now.flag = false;
			$("#ssBtn").text("スタート");
		}else{
			$("#imomushi").css("background-color",　normalColor);
			$("#imomushi .tsuno").css("color",　normalColor);
			$("#imomushi .eye").text(　normalFace);
			now.state = "normal";
			now.face =　normalFace;
			now.flag = true;
			$("#ssBtn").text("ストップ");
			now.move = setInterval("blink()",2000);
		}
	});
});

function blink() {
	if(now.state == "normal"){
		now.pos += 20;
		if(now.pos > 480)
			now.pos = 0;
		var $dis = now.pos + 'px';
		$("#imomushi").animate({width: '60px'}, 500);
		$("#imomushi").animate({width: '40px', left: $dis}, 500);
		$("#imomushi .eye").text("-");
		setTimeout("openEye()",200)//呼び出された0.2秒後にopenEye()を呼び出す
	}
	else if(now.state == "sleep"){
		$("#imomushi .eye").text("-");
	}
	else if(now.state == "poison"){
		$("#imomushi").animate({top: 60}, 50);
		$("#imomushi").animate({top: 57}, 50);
	}
	else if(now.state == "berserk"){
		var walk = 10 + Number((Math.random() * 70).toFixed(0));
		var durationS = 200 + Number((Math.random() * 200).toFixed(0));
		var durationE = 200 + Number((Math.random() * 200).toFixed(0));
		now.pos += walk;
		if(now.pos > 479)
			now.pos = 0;
		var $lengthNobi = 40 + walk + 'px';
		var $dis = now.pos + 'px';
		$("#imomushi").animate({width: $lengthNobi}, durationS);
		$("#imomushi").animate({width: '40px', left: $dis}, durationE);
	}
}

function openEye() {
	$("#imomushi .eye").text("・");
}

/*************
** その他のメソッド
**************/
window.addEventListener('load', function (){
	$("#tag").val("Flower");
}, false);
