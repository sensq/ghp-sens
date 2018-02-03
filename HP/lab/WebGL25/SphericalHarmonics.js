
// 球面調和関数の座標を計算
function drawBasisSH(radius, l, m, nSlice, nStack, nRepeatS, nRepeatT, wire, map, color) {
	var geometry = new THREE.Geometry();
	geometry.vertices.length = 0;
	geometry.faces.length = 0;
	this.r = color[0];
	this.g = color[1];
	this.b = color[2];

	var point = function () {
		this.t;			// テクスチャ座標（sはprevもnextも共通の値になるので不要）
		this.r;
		this.theta;	// 極座標（phiはprevもnextも共通の値になるので不要）
		this.x;
		this.y;
		this.z;		// デカルト座標
		this.sphericalHarmonics;	// 球面調和関数
	}
	var prev = new point();
	var next = new point();

	var reverse = false;
	var createFace = false;
	for (var j = 0; j <= nStack; j++) {
		// 緯度方向のテクスチャ座標prevとnext
		prev.t = -j / nStack;
		next.t = -(j + 1) / nStack;
		prev.t = (1.0 - prev.t) * nRepeatT;
		next.t = (1.0 - next.t) * nRepeatT;
		// 緯度方向の頂点座標prevとnext
		prev.theta = Math.PI * prev.t;
		next.theta = Math.PI * next.t;

		// 球面調和関数をそのまま描画するか球面にマッピングするかの指定
		var ll, mm;
		if (map) {
			ll = 0;
			mm = 0;
		}
		else {
			ll = l;
			mm = m;
		}

		for (var i = 0; i <= nSlice; i++) {
			// 経度方向のテクスチャ座標
			var s = i / nSlice;
			s *= nRepeatS;
			var phi = 2.0 * Math.PI * i / nSlice;

			// 球面調和関数Y_l^m(θ, φ)を求める
			// 返り値が負の場合はそのままだと描画できないので絶対値を取る
			prev.sphericalHarmonics = Math.abs(SphericalHarmonics(l, m, prev.theta, phi));
			prev.r = radius * Math.abs(SphericalHarmonics(ll, mm, prev.theta, phi));
			// 極座標からデカルト座標へ変換
			prev.x = prev.r * Math.sin(prev.theta) * Math.cos(phi);
			prev.y = prev.r * Math.sin(prev.theta) * Math.sin(phi);
			prev.z = prev.r * Math.cos(prev.theta);

			// 球面調和関数Y_l^m(θ, φ)を求める
			// 返り値が負の場合はそのままだと描画できないので絶対値を取る
			next.sphericalHarmonics = Math.abs(SphericalHarmonics(l, m, next.theta, phi));
			next.r = radius * Math.abs(SphericalHarmonics(ll, mm, next.theta, phi));
			// 極座標からデカルト座標へ変換
			next.x = next.r * Math.sin(next.theta) * Math.cos(phi);
			next.y = next.r * Math.sin(next.theta) * Math.sin(phi);
			next.z = next.r * Math.cos(next.theta);
			/***** 計算はここで終了 *****/


			// 座標を作成（左上から時計回り）
			// 奇数ループ目で左上→右上、偶数ループ目で右下→左下
			// 分岐させないと面を構成する頂点座標がZ字型に捩れておかしくなる
			if (!reverse) {
				var vect = new THREE.Vector3(prev.x, prev.y, prev.z);
				geometry.vertices.push(new THREE.Vertex(vect));

				vect = new THREE.Vector3(next.x, next.y, next.z);
				geometry.vertices.push(new THREE.Vertex(vect));
			}
			else {
				var vect = new THREE.Vector3(next.x, next.y, next.z);
				geometry.vertices.push(new THREE.Vertex(vect));

				vect = new THREE.Vector3(prev.x, prev.y, prev.z);
				geometry.vertices.push(new THREE.Vertex(vect));
			}
			reverse = !reverse;

			// 最初のループ時は頂点座標が2つしかない＝面を作れないので無視
			if (createFace) {
				// 右上の三角面
				var face = new THREE.Face3(geometry.vertices.length - 4, geometry.vertices.length - 3, geometry.vertices.length - 2);
				var faceNormal = new THREE.Vector3(prev.x, prev.y, prev.z);
				face.normal = faceNormal;
				geometry.faces.push(face);
				// 左下の三角面
				face = new THREE.Face3(geometry.vertices.length - 4, geometry.vertices.length - 2, geometry.vertices.length - 1);
				faceNormal = new THREE.Vector3(prev.x, prev.y, prev.z);
				face.normal = faceNormal;
				geometry.faces.push(face);

				// 虚部と実部で色分け
				var intense = (prev.sphericalHarmonics + next.sphericalHarmonics) / 2;
				if (SphericalHarmonics(l, m, prev.theta, phi) > 0) {
					geometry.faces[geometry.faces.length - 2].color.setRGB(this.r * intense, this.g * intense, this.b * intense);
					geometry.faces[geometry.faces.length - 1].color.setRGB(this.r * intense, this.g * intense, this.b * intense);
				}
				else {
					geometry.faces[geometry.faces.length - 2].color.setRGB((1 - this.r) * intense, (1 - this.g) * intense, (1 - this.b) * intense);
					geometry.faces[geometry.faces.length - 1].color.setRGB((1 - this.r) * intense, (1 - this.g) * intense, (1 - this.b) * intense);
				}
			}
			// 2ループ目からずっとtrue
			createFace = true;
		}
	}

	// 材質
	var material = new THREE.MeshBasicMaterial({
		vertexColors: true,
		side: 2,
	});
	// ワイヤー表示
	material.wireframe = wire;
	var mesh = new THREE.Mesh(geometry, material);

	return mesh;
}


/***** 以下、計算に必要な関数 *****/

// 階乗計算
function factorial(n) {
	var fact = 1.0;
	// エラー処理
	if (n <= 0)
		return fact;
	for (var i = n; i >= 2; i--)
		fact *= i;
	return fact;
}

// 二重階乗計算
function factorial2(n) {
	var fact2 = 1.0;
	// エラー処理
	if (n <= 0)
		return fact2;
	for (var i = n; i >= 2; i = i - 2)
		fact2 *= i;
	return fact2;
}

// 単位化するための係数
// @param l：正の整数
// @param m：-l～lの整数
function K(l, m) {
	var mm = Math.abs(m);
	// 分子
	var numer = (2.0 * l + 1) * factorial(l - mm);
	// 分母
	var denom = (4 * 3.141592) * factorial(l + mm);

	return Math.sqrt(numer / denom);
}

// ルジャンドル陪多項式
// @param l：正の整数
// @param m：-l～lの整数
// @param x：cos(theta)
function P(l, m, x) {
	var mm = Math.abs(m);
	var ret = 1.0;
	var minus = 1.0;

	// m>=0の場合は使わない値なので無駄な計算を省略
	if (m < 0) {
		// m<0の場合はm>0の場合のretにこの値を掛けると計算出来る
		minus = Math.pow(-1.0, mm) * factorial(l - mm) / factorial(l + mm);
	}

	// m=0の場合は必ずret=1になるので無駄な計算を省略
	if (m != 0) {
		ret = Math.pow(1.0 - x * x, mm / 2.0) * factorial2(2 * mm - 1);
		// l=±mの場合はここで計算終了
		// m>=0の場合minus=1.0になるようにしているので場合分けは不要
		if (mm == l)
			return ret * minus;
	}

	// -l<m<lの場合は再帰的に値を計算
	var pm1 = ret;	// 一つ前のret
	var pm2 = 0.0;	// 二つ前のret
	for (var i = mm + 1; i <= l; i++) {
		ret = ((2.0 * i - 1.0) * x * pm1 - (i + mm - 1.0) * pm2) / (i - mm);
		pm2 = pm1;
		pm1 = ret;
	}

	// m>=0の場合minus=1.0になるようにしているので場合分けは不要
	return ret * minus;
}

// 球面調和関数
// @param l：正の整数
// @param m：-l～lの整数
// @param theta：0～Piの実数
// @param phi：0～2*Piの実数
function SphericalHarmonics(l, m, theta, phi) {
	// エラー処理
	if (Math.abs(m) > l)
		return 0;

	// l=0の場合は必ずm=0でKもPも定数になるため、あらかじめ計算した値を使って計算コスト下げる
	if (l == 0)
		return 0.28209479;

	// mが正, 負, 0の場合で定義通り普通に計算
	if (0 < m)
		return K(l, m) * Math.sqrt(2.0) * Math.cos(m * phi) * P(l, m, Math.cos(theta));
	else if (m < 0)
		return K(l, m) * Math.sqrt(2.0) * Math.sin(-m * phi) * P(l, -m, Math.cos(theta));
	else
		return K(l, m) * P(l, m, Math.cos(theta));
}