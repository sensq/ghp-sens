/*	jscam <http://crocro.com/html5/jscam/wiki.cgi>
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
	in a Japanese translation <http://sourceforge.jp/projects/opensource/wiki/licenses%2FMIT_license>
	Copyright (c) 2012 Masakazu Yanai / (c) 2012 Cronus Crown <webmaster@crocro.com>
*/

//== パッケージの初期化
if (typeof crocro == "undefined") var crocro = function() {};
if (typeof crocro.jscam == "undefined") crocro.jscam = function() {};

//== ======================================

	/**
	 *	@variable	crocro.jscam.information
	 *	@title	基本情報
	 *	@description
	 *
	 *		「jscam」の基本情報が入ったオブジェクトです。
	 *
	 *		各情報は「crocro.jscam.information.version」のようにして取得できます。
	 *
	 *		<div>name - ライブラリ名。</div>
	 *		<div>descriptionJa - 説明（日本語）。</div>
	 *		<div>descriptionEn - 説明（英語）。</div>
	 *		<div>version - バージョンのフル表記。「1.0.0」など。</div>
	 *		<div>versionMajor - メジャーバージョンのみの数字。「1」など。</div>
	 *		<div>author - 作者名。</div>
	 *		<div>publisher - 配布元。</div>
	 *		<div>lastModified - 最終更新日。</div>
	 *		<div>url - 配布元のWebサイト。</div>
	 *		<div>urlDownload - 配布元のダウンロード・サイト。</div>
	 *		<div>copyright - 著作権表示。</div>
	 *
	 *	@param	arg		パラメータをオブジェクトで指定します。空の場合は無視されます。
	 */
//== 基本情報
crocro.jscam.information = {
	 name:			"crocro.jscam"
	,descriptionJa:	"JavaScriptでWebカメラの画像を取得するライブラリ"
	,descriptionEn:	"The library which operates a Web camera by JavaScript."
	,version:		"1.0.0"
	,versionMajor:	"1"
	,author:		"Masakazu Yanai"
	,publisher:		"Cronus Crown"
	,lastModified:	"2012/01/19"
	,url:			"http://crocro.com/"
	,urlDownload:	"http://crocro.com/html5/jscam/wiki.cgi"
	,copyright:		"(c) 2012 Masakazu Yanai / (c) 2012 Cronus Crown"
};


//== ======================================
	/**
	 *	@variable	crocro.jscam.write(arg)
	 *	@title	jscamのswfを書き出し
	 *	@description
	 *
	 *		bodyタグ内で使います。この場所にjscamのオブジェクトを書き出します。
	 *
	 *		argは「{fps: 8, dir: "./js/"}」のようにオブジェクトで指定します。
	 *		argに指定可能な値は以下の通りです。
	 *
	 *		<div>fps - fps。</div>
	 *		<div>dir - jscam.swfの置いてあるディレクトリ。</div>
	 *		<div>w - 横幅。</div>
	 *		<div>h - 高さ。</div>
	 *
	 *	@param	arg		パラメータをオブジェクトで指定します。空の場合は無視されます。
	 */
	/**
	 *	@variable	crocro.jscam.option
	 *	@title	jscamの設定
	 *	@description
	 *
	 *		writeで作成されたjscamの設定が格納されたオブジェクトです。
	 *
	 *		「crocro.jscam.option.w」のようにして、値を取得できます。
	 *		利用できる設定は以下の通りです。
	 *
	 *		<div>fps - fps。</div>
	 *		<div>dir - jscam.swfの置いてあるディレクトリ。</div>
	 *		<div>w - 横幅。</div>
	 *		<div>h - 高さ。</div>
	 *
	 *	@param	arg		パラメータをオブジェクトで指定します。空の場合は無視されます。
	 */
//== Flash初期化用
crocro.jscam.option = {};
crocro.jscam.write = function(arg) {
	// 設定
	if (! arg) arg = {};
	var opt = {};
	var defaults = {
		 fps: 8
		,dir: ""
		,w: 320
		,h: 240
	};
	var flVarsArr = [];
	for (var key in defaults) {
		opt[key] = defaults[key];
		if (key in arg) opt[key] = arg[key];
		flVarsArr.push(key + "=" + opt[key]);
	}
	crocro.jscam.option = opt;
	var flVars = flVarsArr.join("&");

	// HTML出力
	var flArr = [];
	flArr.push('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" \
		codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" \
		width="' + opt.w + '" height="' + opt.h + '" id="externalSwfCam" align="middle">');
	flArr.push('<param name="allowScriptAccess" value="always" />');
	flArr.push('<param name="allowFullScreen" value="false" />');
	flArr.push('<param name="movie" value="' + opt.dir + 'jscam.swf" />');
	flArr.push('<param name="quality" value="high" />');
	flArr.push('<param name="bgcolor" value="#cccccc" />');
	flArr.push('<param name="FlashVars" value="' + flVars + '" />');
		// ↑↓scrW=?&scrH=?&fps=? が設定可能
	flArr.push('<embed src="' + opt.dir + 'jscam.swf" FlashVars="' + flVars + '"');
	flArr.push('quality="high" bgcolor="#ffffff" \
		width="' + opt.w + '" height="' + opt.h + '" align="middle" \
		name="externalSwfCam" allowScriptAccess="always" allowFullScreen="false" \
		type="application/x-shockwave-flash" \
		pluginspage="http://www.macromedia.com/go/getflashplayer" />');
	flArr.push('</object>');

	document.writeln(flArr.join("\n"));
};

//== SWFのブラウザ対応呼び出し
crocro.jscam.getSwf = function(str) {
	if (navigator.appName.indexOf("Microsoft") >= 0
	 && new String(document[str]).indexOf("ObjectElement") < 0)
		return window[str];		// IE8以下
	return document[str];		// IE以外、IE9以上
};


	/**
	 *	@variable	crocro.jscam.initSwfCam()
	 *	@title	カメラ初期化
	 *	@description
	 *
	 *		Flashのカメラ取得用オブジェクトを初期化します。
	 */
//== SwfCamの初期化
crocro.jscam.swfCam = null;
crocro.jscam.initSwfCam = function() {
	var swfCam = crocro.jscam.getSwf("externalSwfCam");
	swfCam.enable = true;

	// キャンバスが使えるか確認
	if (! window.HTMLCanvasElement) {
		swfCam.enable = false;	// キャプチャ不可
		alert("Don't use this browser.");
	}
	crocro.jscam.swfCam = swfCam;		// 外部から参照利用可能に
};


	/**
	 *	@variable	crocro.jscam.ready(fnc)
	 *	@title	カメラ開始時のコールバック
	 *	@description
	 *
	 *		カメラが開始した時にコールバック実行したいfunctionオブジェクトを指定します。
	 *
	 *	@param	fnc		コールバック実行させるfunctionオブジェクト。
	 */
//== SwfCamの準備完了コールバック
crocro.jscam.callbackReady = null;
crocro.jscam.ready = function(fnc) {
	if (typeof fnc == "function") crocro.jscam.callbackReady = fnc;
};
crocro.jscam.readyFromSwf = function(prm) {
	if (crocro.jscam.callbackReady) {
		setTimeout(function() {
			crocro.jscam.callbackReady(prm)
		}, 10);
	}
}

//== ============================================================================

	/**
	 *	@variable	crocro.jscam.setFilter(fltrArr)
	 *	@title	カメラのフィルタ設定
	 *	@description
	 *
	 *		カメラに入力した映像に対して、処理を行わせる命令を、配列で指定します。
	 *		「["bin", "label"]」のように指定します。命令は順番が正しくなければなりません。
	 *
	 *		命令には、以下を指定可能です。「要 ～」と書いてある場合は、事前にその処理が必要になります。
	 *
	 *		<div>bin - 2値化。</div>
	 *		<div>label - ラベリング（要 2値化）。</div>
	 *		<div>drawLabel - ラベル描画（要 ラベリング）。</div>
	 *		<div>detectDots - ドット・パターン検知（要 ラベリング）。</div>
	 *		<div>drawDots - ドット・パターン描画（要 ドット・パターン検知）。</div>
	 *		<div>drawClipDots - ドット・パターン切抜き描画（要 ドット・パターン検知）。</div>
	 *		<div>detectMarker - マーカー検知（要 ラベリング）。</div>
	 *		<div>drawMarker - マーカー描画（要 マーカー検知）。</div>
	 *		<div>showPaint - 2値化、ラベリングなどの描画を画面に反映させる。</div>
	 *		<div>hidePaint - 2値化、ラベリングなどの描画を画面に反映させない。</div>
	 *
	 *	@param	fltrArr		カメラの映像に対して処理させる内容の配列。
	 */
//== SwfCamのフィルタ設定
crocro.jscam.setFilter = function(fltrArr) {
	var swfCam = crocro.jscam.swfCam;
	try {
		if (swfCam.checkEnable()) {
			swfCam.setFilter(fltrArr);	// 即時変更
			return;
		}
	} catch(e) {}

	setTimeout(function(){		// 待機実行
		crocro.jscam.setFilter(fltrArr);
	}, 1000);
};


	/**
	 *	@variable	crocro.jscam.setLabelCutOff(minPrm, maxPrm)
	 *	@title	ラベル・カットオフ設定
	 *	@description
	 *
	 *		ラベルとして認識するドット数の範囲を指定します。
	 *		デフォルトでは、最小値が10、最大値が57600です。
	 *		minPrm、maxPrmともに-1を指定した場合は、デフォルト値に戻ります。
	 *
	 *	@param	minPrm		最小値。
	 *	@param	maxPrm		最大値。
	 */
//== SwfCamのラベル・カットオフ設定
crocro.jscam.setsetLabelCutOff = function(minPrm, maxPrm) {
	var swfCam = crocro.jscam.swfCam;
	try {
		if (swfCam.checkEnable()) {
			swfCam.setLabelCutOff(parseInt(minPrm), parseInt(maxPrm));	// 即時変更
			return;
		}
	} catch(e) {}

	setTimeout(function(){		// 待機実行
		crocro.jscam.setsetLabelCutOff(minPrm, maxPrm);
	}, 1000);
};


	/**
	 *	@variable	crocro.jscam.setDots(dotPttrnArr)
	 *	@title	ドット・パターンの設定
	 *	@description
	 *
	 *		検知させるドット・パターンを配列で設定します。
	 *		4×4の0, 1の配列で指定します。
	 *
	 *		[[1,1,0,1],<br>
	 *		 [1,0,0,1],<br>
	 *		 [0,0,0,1],<br>
	 *		 [1,1,1,1]]
	 *
	 *		配列は[x][y]の向きになります。
	 *		上記の配列だとxyが逆になるので、swapXYでひっくり返すとよいです。
	 *
	 *		var dotsArr = crocro.jscam.util.swapXY(4, 4, dotPttrnArr);
	 *
	 *	@param	dotPttrnArr		ドット・パターンの配列。
	 */
//== SwfCamのドット・パターンの設定
crocro.jscam.setDots = function(dotPttrnArr) {
	var swfCam = crocro.jscam.swfCam;
	try {
		if (swfCam.checkEnable()) {
			swfCam.setDots(dotPttrnArr);	// 即時変更
			return;
		}
	} catch(e) {}

	setTimeout(function(){		// 待機実行
		crocro.jscam.setDots(dotPttrnArr);
	}, 1000);
};


	/**
	 *	@variable	crocro.jscam.setMarker(mrkrArr)
	 *	@title	マーカーの設定
	 *	@description
	 *
	 *		検知させるマーカーを配列で設定します。
	 *		正方形の配列で指定します。サンプルは16マスですが、16でなくても構いません。
	 *
	 *		[[1,1,0,1],<br>
	 *		 [1,0,0,1],<br>
	 *		 [0,0,0,1],<br>
	 *		 [1,1,1,1]]
	 *
	 *		配列は[x][y]の向きになります。
	 *		上記の配列だとxyが逆になるので、swapXYでひっくり返すとよいです。
	 *
	 *		var mrkrArr = crocro.jscam.util.swapXY(4, 4, mrkrArr);
	 *
	 *	@param	mrkrArr		マーカーの配列。
	 */
//== SwfCamのマーカーの設定
crocro.jscam.setMarker = function(mrkrArr) {
	var swfCam = crocro.jscam.swfCam;
	try {
		if (swfCam.checkEnable()) {
			swfCam.setMarker(mrkrArr, mrkrArr.length);	// 即時変更
			return;
		}
	} catch(e) {}

	setTimeout(function(){		// 待機実行
		crocro.jscam.setMarker(mrkrArr, mrkrArr.length);
	}, 1000);
};


	/**
	 *	@variable	crocro.jscam.setMarkerMatchThreshold(newPrm)
	 *	@title	マーカー一致閾値の設定
	 *	@description
	 *
	 *		マーカーの形に、何パーセント以上一致していれば一致と見なすかを設定します。
	 *		デフォルトは80です。newPrmに-1を指定した場合は、デフォルト値に戻ります。
	 *
	 *	@param	newPrm		新しい数値。
	 */
//== SwfCamのマーカー一致閾値の設定
crocro.jscam.setMarkerMatchThreshold = function(newPrm) {
	var swfCam = crocro.jscam.swfCam;
	try {
		if (swfCam.checkEnable()) {
			swfCam.setMarkerMatchThreshold(parseInt(newPrm));	// 即時変更
			return;
		}
	} catch(e) {}

	setTimeout(function(){		// 待機実行
		crocro.jscam.setMarkerMatchThreshold(newPrm);
	}, 1000);
};

//== ============================================================================

	/**
	 *	@variable	crocro.jscam.CaptureObject(id)
	 *	@title	キャプチャ・オブジェクト
	 *	@description
	 *
	 *		「crocro.jscam.makeCaptureObject()」で作成します。
	 *		Canvasと1対1で対応して、Webカメラのキャプチャ、コールバックなどを行います。
	 *
	 *	@param	id		canvasのid。
	 */
//== キャプチャ・オブジェクト
crocro.jscam.CaptureObject = function(id) {
	/**
	 *	@variable	(crocro.jscam.CaptureObject).w
	 *	@title	キャプチャ・オブジェクト - 横幅
	 *	@description
	 *
	 *		カメラの横幅（crocro.jscam.option.w）と同じ値です。
	 *		指定するキャンバスの横幅は、カメラの横幅（デフォルトは320）と同じ値にしてください。
	 */
	/**
	 *	@variable	(crocro.jscam.CaptureObject).h
	 *	@title	キャプチャ・オブジェクト - 高さ
	 *	@description
	 *
	 *		カメラの高さ（crocro.jscam.option.h）と同じ値です。
	 *		指定するキャンバスの高さは、カメラの高さ（デフォルトは240）と同じ値にしてください。
	 */
	/**
	 *	@variable	(crocro.jscam.CaptureObject).cnvsObj
	 *	@title	キャプチャ・オブジェクト - キャンバス・オブジェクト
	 *	@description
	 *
	 *		指定したIDのキャンバスのDOM要素です。
	 */
	/**
	 *	@variable	(crocro.jscam.CaptureObject).cntxtObj
	 *	@title	キャプチャ・オブジェクト - コンテクスト・オブジェクト
	 *	@description
	 *
	 *		指定したIDのキャンバスの、2Dコンテクストです。
	 */
	/**
	 *	@variable	(crocro.jscam.CaptureObject).cntxtImg
	 *	@title	キャプチャ・オブジェクト - イメージ・データ
	 *	@description
	 *
	 *		指定したIDのキャンバスの、2Dコンテクストから、getImageData(0, 0, 横幅, 高さ)したオブジェクトです。
	 */
	//== キャンバス用変数の初期化
	this.w = crocro.jscam.option.w;  this.h = crocro.jscam.option.h;  this.c = 4;
	this.cnvsObj = document.getElementById(id);
	this.cntxtObj = this.cnvsObj.getContext("2d");
	this.cntxtImg = this.cntxtObj.getImageData(0, 0, this.w, this.h);
	this.putImg = function(cptr) {		// 画像表示
		var d = this.cntxtImg.data;
		var sz = this.w * this.h;
		var c = this.c;
		for (var i = 0; i < sz; i++) {
			var j = i * c;
			var p = cptr[i];
			d[j    ] = (p >> 16) & 0xFF;
			d[j + 1] = (p >> 8) & 0xFF;
			d[j + 2] = p & 0xFF;
			d[j + 3] = 0xFF;
		}
		this.cntxtObj.putImageData(this.cntxtImg, 0, 0);
	};


	/**
	 *	@variable	(crocro.jscam.CaptureObject).setBackDataType(arr)
	 *	@title	キャプチャ・オブジェクト - 戻りデータ種類設定
	 *	@description
	 *
	 *		キャプチャ実行時に取得するデータの種類を配列で指定します。
	 *		配列の順番は自由です。
	 *
	 *		データの種類には、以下を指定可能です。
	 *		pixelSwf、pixelRaw、pixelBinを指定した場合は、最初に指定した画像がCanvasに描画されます。
	 *
	 *		<div>pixelSwf - Flash上に描画されている画像の画素配列です。
	 *			一次元の配列で、1画素の値は0x000000～0xFFFFFF（RGBが16進数で2桁ずつ）になります。</div>
	 *		<div>pixelRaw - Webカメラが取得した画像の画素配列です。
	 *			一次元の配列で、1画素の値は0x000000～0xFFFFFF（RGBが16進数で2桁ずつ）になります。</div>
	 *		<div>pixelBin - 2値化した画像の画素配列です。事前に2値化がおこなわれている必要があります。
	 *			一次元の配列で、1画素の値は0x000000～0xFFFFFF（RGBが16進数で2桁ずつ）になります。</div>
	 *		<div>labelData - ラベルの情報が配列で入っています。
	 *			各配列はオブジェクトになっており、
	 *			tX, tY（上XY）、bX, bY（下XY）、lX, lY（左XY）、rX, rY（右XY）、
	 *			cX, cY（中心XY）、cnt（ドット数）といった値が格納されています。</div>
	 *		<div>label2dArr - 1画素につき1つの値で画面上のラベルの配置が入っています。
	 *			これは一次元の配列です。値が0のマスが地のマスになります。
	 *			1以降の値のマスは、その値がラベル番号になっています。</div>
	 *		<div>dotsData - ドット・パターンを検出した時の値です。
	 *			ltX, ltY（左上XY）rtX, rtY（右上XY）rbX, rbY（右上XY）lbX, lbY（左下XY）、
	 *			rtt（判定時に回転させた角度）が入っています。</div>
	 *		<div>markerData - マーカーを検出した時の値です。
	 *			ltX, ltY（左上XY）rtX, rtY（右上XY）rbX, rbY（右上XY）lbX, lbY（左下XY）、
	 *			rtt（判定時に回転させた角度）が入っています。<br>
	 *			また、mtchThrshldPer（一致閾値％）、mtchThrshldCnt（一致閾値ドット数）、
	 *			mtchCnt（一致数）、mtchMax（一致可能最大数）、mtchPer（一致％）も利用できます。</div>
	 *
	 *	@param	arr		戻りデータ種類の配列。
	 */
	//== 戻りデータ種類設定
	this.backDataTypes = ["pixelSwf"];	// 戻りデータ種類
	this.setBackDataType = function(arr) {
		if (arr instanceof Array) this.backDataTypes = arr;
	}

	//== キャプチャ用変数の初期化
	this.id = id;
	this.callback = "callback" + this.id;
	var my = this;


	/**
	 *	@variable	(crocro.jscam.CaptureObject).setExtrFnc(fnc)
	 *	@title	キャプチャ・オブジェクト - コールバック終了時の追加処理
	 *	@description
	 *
	 *		キャプチャが終了した際に、常時呼び出されるfunctionオブジェクトを指定します。
	 *
	 *		指定したfunctionオブジェクトは「function(resObj)」とすることで、
	 *		setBackDataTypeで指定したオブジェクトを受け取れます。
	 *
	 *	@param	fnc		コールバック実行させるfunctionオブジェクト。
	 */
	//== コールバック終了時の追加処理
	this.extrFnc = null;
	this.setExtrFnc = function(fnc) {
		this.extrFnc = fnc;
	};

	//== コールバック初期化
	(function() {
		crocro.jscam.CaptureObject[my.callback] = function (arr) {
			// キャンバスへの描画
			for (var i = 0; i < arr.length; i ++) {
				if (typeof arr[i] === "undefined") continue;
				if (arr[i].name == "pixelSwf"
				 || arr[i].name == "pixelRaw"
				 || arr[i].name == "pixelBin"
				) {
					my.putImg(arr[i].data);		// 出力
					break;						// 1回目のみ描画
				}
			}

			// 戻り値の変換
			var resObj = {};
			for (var i = 0; i < arr.length; i ++) {
				if (typeof arr[i] === "undefined") continue;
				resObj[arr[i].name] = arr[i].data;
			}

			// 追加関数の実行
			if (my.extrFnc)      my.extrFnc(resObj);		// 追加関数
			if (my.onceCallBack) my.onceCallBack(resObj);	// 1回のみのコールバック
			my.onceCallBack = null;
		}
	})()


	/**
	 *	@variable	(crocro.jscam.CaptureObject).capture(callBack)
	 *	@title	キャプチャ・オブジェクト - コールバック終了時の追加処理
	 *	@description
	 *
	 *		キャプチャを実行します。引数にfunctionオブジェクトを指定した場合は、
	 *		一度だけ実行されるコールバック関数になります。
	 *		
	 *		このfunctionオブジェクトは「function(resObj)」とすることで、
	 *		setBackDataTypeで指定したオブジェクトを受け取れます。
	 *
	 *	@param	callBack		コールバック実行させるfunctionオブジェクト。未指定の場合は無視される。
	 */
	//== キャプチャ
	this.onceCallBack = null;
	this.capture = function(callBack) {
		my.onceCallBack = callBack;	// コールバックの初期化

		// キャプチャ
		var swfCam = crocro.jscam.swfCam;
		if (! swfCam.enable) return;	// キャプチャ不可
		try {
			if (swfCam.checkEnable()) {
				swfCam.captureCallback(	// キャプチャ
					"crocro.jscam.CaptureObject." + my.callback,
					my.backDataTypes);
			}
		} catch(e) {}
	};


	/**
	 *	@variable	(crocro.jscam.CaptureObject).detect(callBack)
	 *	@title	キャプチャ・オブジェクト - 検知
	 *	@description
	 *
	 *		ドットパターンやマーカーを発見すると、コールバックされるようにします。
	 *		引数にfunctionオブジェクトを指定した場合は、
	 *		一度だけ実行されるコールバック関数になります。
	 *
	 *		このfunctionオブジェクトは「function(resObj)」とすることで、
	 *		setBackDataTypeで指定したオブジェクトを受け取れます。
	 *
	 *	@param	callBack		コールバック実行させるfunctionオブジェクト。未指定の場合は無視される。
	 */
	//== 検知
	this.detect = function(callBack) {
		my.onceCallBack = callBack;	// コールバックの初期化

		// 発見
		var swfCam = crocro.jscam.swfCam;
		if (! swfCam.enable) return;	// キャプチャ不可
		try {
			if (swfCam.checkEnable()) {
				swfCam.detectCallback(	// キャプチャ
					"crocro.jscam.CaptureObject." + my.callback,
					my.backDataTypes);
				return;
			}
		} catch(e) {}

		// まだ初期化されていない場合は時間を置く（事前に設定する可能性が高い関数なので）
		setTimeout(function(){
			my.detect(callBack);
		}, 200);
	};


	/**
	 *	@variable	(crocro.jscam.CaptureObject).outputImage(id, type)
	 *	@title	キャプチャ・オブジェクト - 画像の出力
	 *	@description
	 *
	 *		指定したidのDOM要素内に、画像を作成して挿入します。
	 *		typeは、pngやjpegなどの、HTML5のcanvasで指定可能な画像形式を指定します。
	 *		setBackDataTypeで指定したオブジェクトを受け取れます。
	 *
	 *	@param	id		画像を出力させるのDOM要素のID。
	 *	@param	type	作成する画像の形式。空文字の場合はデフォルトの形式で出力されます。
	 */
	//== 画像の出力
	this.outputImage = function(id, type) {
		var imgSrc = this.cnvsObj.toDataURL(type);
		document.getElementById(id).src = imgSrc;
	};
};


	/**
	 *	@variable	crocro.jscam.makeCaptureObject(id)
	 *	@title	キャプチャー・オブジェクトの作成
	 *	@description
	 *
	 *		指定したidのcanvasに対応したキャプチャー・オブジェクトを作成します。
	 *
	 *	@param	id		canvasのid。
	 *	@return	キャプチャー・オブジェクト。
	 */
//== キャプチャー・オブジェクトの作成
crocro.jscam.makeCaptureObject = function(id) {
	return new crocro.jscam.CaptureObject(id);
};

//== ============================================================================

//== ユーティリティ
crocro.jscam.util = function() {};


	/**
	 *	@variable	crocro.jscam.util.swapXY(w, h, arg)
	 *	@title	配列のXY交換
	 *	@description
	 *
	 *		配列の縦横を入れ替えます。プログラムを見やすく書くために利用します。
	 *
	 *	@param	w		配列の横幅。
	 *	@param	h		配列の高さ。
	 *	@param	arg		二次元配列。
	 *	@return	縦横を入れ替えた配列。
	 */
//== 配列のXY交換
crocro.jscam.util.swapXY = function(w, h, arg) {
	var x, y;
	var xArr = new Array(w);
	for (x = 0; x < w; x ++) {
		var yArr = new Array(y);
		for (y = 0; y < h; y ++) yArr[y] = arg[y][x];
		xArr[x] = yArr;
	}
	return xArr;
};


	/**
	 *	@variable	crocro.jscam.util.makeMarker(id, arr, pxSz, isEdit, evtOnClick)
	 *	@title	マーカーの作成
	 *	@description
	 *
	 *		配列を指定して、「table」タグでできたマーカーを作成します。
	 *		isEditにtrueを指定することで、クリックで編集可能になります。
	 *		また、evtOnClickを指定することで、クリック時のコールバック処理を指定できます。
	 *
	 *	@param	id		マーカーを作成するDOM要素のID。
	 *	@param	arr		マーカーを表現する01の二次元配列。
	 *	@param	pxSz	1セルあたりのドット数。
	 *	@param	isEdit	trueなら編集可能、falseなら編集不能。
	 *	@param	evtOnClick	isEditがtrueの場合に動作。クリック時のコールバック処理をfunctionオブジェクトで指定する。
	 *					このfunctionオブジェクトは「function(x, y, prm)」としてXY座標と変更後の値を受け取れる。
	 */
//== マーカーの作成
crocro.jscam.util.makeMarker = function(id, arr, pxSz, isEdit, evtOnClick) {
	var sz = arr.length;
	var tbl = document.createElement("table");
	tbl.id = id + 'Tbl';
	tbl.setAttribute("border", 0);
	tbl.setAttribute("cellspacing", 0);
	tbl.setAttribute("cellpadding", 0);

	for (var y = 0; y < sz; y ++) {
		var tr = document.createElement("tr");
		for (var x = 0; x < sz; x ++) {
			var col = arr[x][y] == 1 ? 'black' : 'white';
			var celId = id + 'Tbl_' + x + '_' + y;

			var td = document.createElement("td");
			tr.appendChild(td);
			var div = document.createElement("div");
			td.appendChild(div);

			div.style.width = pxSz + 'px';
			div.style.height = pxSz + 'px';
			div.style.background = col;
			div.style.overflow = 'hidden';
			div.style.color = col;
			div.id = celId;
			if (isEdit) {
				div.addEventListener("click", (function(x, y){
					return function() {
						var prm = 1 - this.innerHTML * 1;
						this.innerHTML = prm;
						this.style.background = this.style.color = prm ? 'black' : 'white';
						if (typeof evtOnClick == 'function') evtOnClick(x, y, prm);
					};
				})(x, y));
			}
			div.innerHTML = arr[x][y];
		}
		tbl.appendChild(tr);
	}
	document.getElementById(id).appendChild(tbl);
};


	/**
	 *	@variable	crocro.jscam.util.makeDots(id, arr, pxSz, isEdit, evtOnClick)
	 *	@title	ドット・パターンの作成
	 *	@description
	 *
	 *		配列を指定して、「table」タグでできたドット・パターンを作成します。
	 *		isEditにtrueを指定することで、クリックで編集可能になります。
	 *		また、evtOnClickを指定することで、クリック時のコールバック処理を指定できます。
	 *
	 *	@param	id		ドット・パターンを作成するDOM要素のID。
	 *	@param	arr		ドット・パターンを表現する01の二次元配列。
	 *	@param	pxSz	1セルあたりのドット数。
	 *	@param	isEdit	trueなら編集可能、falseなら編集不能。
	 *	@param	evtOnClick	isEditがtrueの場合に動作。クリック時のコールバック処理をfunctionオブジェクトで指定する。
	 *					このfunctionオブジェクトは「function(x, y, prm)」としてXY座標と変更後の値を受け取れる。
	 */
//== ドット・パターンの作成
crocro.jscam.util.makeDots = function(id, arr, cellSz, isEdit, evtOnClick) {
	var sz = arr.length;
	var tbl = document.createElement("table");
	tbl.id = id + 'Tbl';
	tbl.setAttribute("border", 0);
	tbl.setAttribute("cellspacing", 0);
	tbl.setAttribute("cellpadding", 0);

	var cellSzBig = parseInt(cellSz * 0.8);
	var cellSzSml = parseInt(cellSz * 0.35);

	for (var y = 0; y < sz; y ++) {
		var tr = document.createElement("tr");
		for (var x = 0; x < sz; x ++) {
			var thisCellSz = arr[x][y] == 1 ? cellSzBig : cellSzSml;
			var celId = id + 'Tbl_' + x + '_' + y;

			var td = document.createElement("td");
			td.setAttribute("align", "center");
			td.setAttribute("valign", "middle");
			td.style.background = "white";
			td.style.width = cellSz + 'px';
			td.style.height = cellSz + 'px';
			tr.appendChild(td);
			var div = document.createElement("div");
			td.appendChild(div);

			div.style.width = thisCellSz + 'px';
			div.style.height = thisCellSz + 'px';
			div.style.background = "black";
			div.style.overflow = 'hidden';
			div.style.color = "black";
			div.id = celId;
			if (isEdit) {
				div.addEventListener("click", (function(x, y){
					return function() {
						var prm = 1 - this.innerHTML * 1;
						this.innerHTML = prm;

						var thisCellSz = prm == 1 ? cellSzBig : cellSzSml;
						this.style.width = thisCellSz + 'px';
						this.style.height = thisCellSz + 'px';

						if (typeof evtOnClick == 'function') evtOnClick(x, y, prm);
					};
				})(x, y));
			}
			div.innerHTML = arr[x][y];
		}
		tbl.appendChild(tr);
	}
	document.getElementById(id).appendChild(tbl);
};
