var MaterialSample = function () {
	//white
	this.white = function(){
		mesh.material.ambient	= {r:0, g:0, b:0};
		mesh.material.color		= {r:1, g:1, b:1};
		mesh.material.specular	= {r:0.5, g:0.5, b:0.5};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 50;
		
		divRewrite();
	};
	//ruby(ルビー)
	this.ruby = function(){
		mesh.material.ambient	= {r:0.1745, g:0.01175, b:0.01175};
		mesh.material.color		= {r:0.61424, g:0.04136, b:0.04136};
		mesh.material.specular	= {r:0.727811, g:0.626959, b:0.626959};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 76.8;
		
		divRewrite();
	};
	//emerald(エメラルド)
	this.emerald = function(){
		mesh.material.ambient	= {r:0.0215, g:0.1745, b:0.0215};
		mesh.material.color		= {r:0.07568, g:0.61424, b:0.07568};
		mesh.material.specular	= {r:0.633, g:0.727811, b:0.633};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 76.8;
		
		divRewrite();
	};
	//jade(翡翠)
	this.jade = function(){
		mesh.material.ambient	= {r:0.135, g:0.2225, b:0.1575};
		mesh.material.color		= {r:0.54, g:0.89, b:0.63};
		mesh.material.specular	= {r:0.316228, g:0.316228, b:0.316228};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 12.8;
		
		divRewrite();
	};
	//obsidian(黒曜石)
	this.obsidian = function(){
		mesh.material.ambient	= {r:0.05375, g:0.05, b:0.06625};
		mesh.material.color		= {r:0.18275, g:0.17, b:0.22525};
		mesh.material.specular	= {r:0.332741, g:0.328634, b:0.346435};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 38.4;
		
		divRewrite();
	};
	// pearl(真珠)
	this.pearl = function(){
		mesh.material.ambient	= {r:0.25, g:0.20725, b:0.20725};
		mesh.material.color		= {r:1.0, g:0.829, b:0.829};
		mesh.material.specular	= {r:0.296648, g:0.296648, b:0.296648};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 10.24;
		
		divRewrite();
	};
	//turquoise(トルコ石)
	this.turquoise = function(){
		mesh.material.ambient	= {r:0.1, g:0.18725, b:0.1745};
		mesh.material.color		= {r:0.396, g:0.74151, b:0.69102};
		mesh.material.specular	= {r:0.297254, g:0.30829, b:0.306678};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 12.8;
		
		divRewrite();
	};
	//brass(真鍮)
	this.brass = function(){
		mesh.material.ambient	= {r:0.329412, g:0.223529, b:0.027451};
		mesh.material.color		= {r:0.780392, g:0.568627, b:0.113725};
		mesh.material.specular	= {r:0.992157, g:0.941176, b:0.807843};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 27.89743616;
		
		divRewrite();
	};
	//bronze(青銅)
	this.bronze = function(){
		mesh.material.ambient	= {r:0.2125, g:0.1275, b:0.054};
		mesh.material.color		= {r:0.714, g:0.4284, b:0.18144};
		mesh.material.specular	= {r:0.393548, g:0.271906, b:0.166721};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 25.6;
		
		divRewrite();
	};
	//chrome(クローム)
	this.chrome = function(){
		mesh.material.ambient	= {r:0.25, g:0.25, b:0.25};
		mesh.material.color		= {r:0.4, g:0.4, b:0.4};
		mesh.material.specular	= {r:0.774597, g:0.774597, b:0.774597};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 76.8;
		
		divRewrite();
	};
	//copper(銅)
	this.copper = function(){
		mesh.material.ambient	= {r:0.19125, g:0.0735, b:0.0225};
		mesh.material.color		= {r:0.7038, g:0.27048, b:0.0828};
		mesh.material.specular	= {r:0.256777, g:0.137622, b:0.086014};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 12.8;
		
		divRewrite();
	};
	//gold(金)
	this.gold = function(){
		mesh.material.ambient	= {r:0.24725, g:0.1995, b:0.0745};
		mesh.material.color		= {r:0.75164, g:0.60648, b:0.22648};
		mesh.material.specular	= {r:0.628281, g:0.555802, b:0.366065};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 51.2;
		
		divRewrite();
	};
	//silver(銀)
	this.silver = function(){
		mesh.material.ambient	= {r:0.19225, g:0.19225, b:0.19225};
		mesh.material.color		= {r:0.50754, g:0.50754, b:0.50754};
		mesh.material.specular	= {r:0.508273, g:0.508273, b:0.508273};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 51.2;
		
		divRewrite();
	};
	//プラスチック(黒)
	this.black_plastic = function(){
		mesh.material.ambient	= {r:0.0, g:0.0, b:0.0};
		mesh.material.color		= {r:0.01, g:0.01, b:0.01};
		mesh.material.specular	= {r:0.50, g:0.50, b:0.50};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 32;
		
		divRewrite();
	};
	//プラスチック(シアン)
	this.cyan_plastic = function(){
		mesh.material.ambient	= {r:0.0, g:0.1, b:0.06};
		mesh.material.color		= {r:0.0, g:0.50980392, b:0.50980392};
		mesh.material.specular	= {r:0.50196078, g:0.50196078, b:0.50196078};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 32;
		
		divRewrite();
	};
	//プラスチック(緑)
	this.green_plastic = function(){
		mesh.material.ambient	= {r:0.0, g:0.0, b:0.0};
		mesh.material.color		= {r:0.1, g:0.35, b:0.1};
		mesh.material.specular	= {r:0.45, g:0.55, b:0.45};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 32;
		
		divRewrite();
	};
	//プラスチック(赤)
	this.red_plastic = function(){
		mesh.material.ambient	= {r:0.0, g:0.0, b:0.0};
		mesh.material.color		= {r:0.5, g:0.0, b:0.0};
		mesh.material.specular	= {r:0.7, g:0.6, b:0.6};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 32;
		
		divRewrite();
	};
	//プラスチック(白)
	this.white_plastic = function(){
		mesh.material.ambient	= {r:0.0, g:0.0, b:0.0};
		mesh.material.color		= {r:0.55, g:0.55, b:0.55};
		mesh.material.specular	= {r:0.70, g:0.70, b:0.70};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 32;
		
		divRewrite();
	};
	//プラスチック(黄)
	this.yellow_plastic = function(){
		mesh.material.ambient	= {r:0.0, g:0.0, b:0.0};
		mesh.material.color		= {r:0.5, g:0.5, b:0.0};
		mesh.material.specular	= {r:0.60, g:0.60, b:0.50};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 32;
		
		divRewrite();
	};
	//ゴム(黒)
	this.black_rubber = function(){
		mesh.material.ambient	= {r:0.02, g:0.02, b:0.02};
		mesh.material.color		= {r:0.01, g:0.01, b:0.01};
		mesh.material.specular	= {r:0.4, g:0.4, b:0.4};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 10.0;
		
		divRewrite();
	};
	//ゴム(シアン)
	this.cyan_rubber = function(){
		mesh.material.ambient	= {r:0.0, g:0.05, b:0.05};
		mesh.material.color		= {r:0.4, g:0.5, b:0.5};
		mesh.material.specular	= {r:0.04, g:0.7, b:0.7};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 10.0;
		
		divRewrite();
	};
	//ゴム(緑)
	this.green_rubber = function(){
		mesh.material.ambient	= {r:0.0, g:0.05, b:0.0};
		mesh.material.color		= {r:0.4, g:0.5, b:0.4};
		mesh.material.specular	= {r:0.04, g:0.7, b:0.04};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 10.0;
		
		divRewrite();
	};
	//ゴム(赤)
	this.red_rubber = function(){
		mesh.material.ambient	= {r:0.05, g:0.0, b:0.0};
		mesh.material.color		= {r:0.5, g:0.4, b:0.4};
		mesh.material.specular	= {r:0.7, g:0.04, b:0.04};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 10.0;
		
		divRewrite();
	};
	//ゴム(白)
	this.white_rubber = function(){
		mesh.material.ambient	= {r:0.05, g:0.05, b:0.05};
		mesh.material.color		= {r:0.5, g:0.5, b:0.5};
		mesh.material.specular	= {r:0.7, g:0.7, b:0.7};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 10.0;
		
		divRewrite();
	};
	//ゴム(黄)
	this.yellow_rubber = function(){
		mesh.material.ambient	= {r:0.05, g:0.05, b:0.0};
		mesh.material.color		= {r:0.5, g:0.5, b:0.4};
		mesh.material.specular	= {r:0.7, g:0.7, b:0.04};
		mesh.material.emissive	= {r:0.0, g:0.0, b:0.0};
		mesh.material.shininess	= 10.0;
		
		divRewrite();
	};
};