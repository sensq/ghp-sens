var MaterialSample = function () {
	//white
	this.white = function(){
		mesh.material.ambient.setRGB(0, 0, 0);
		mesh.material.color.setRGB(1, 1, 1);
		mesh.material.specular.setRGB(0.5, 0.5, 0.5);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 50;
		
		recreateDat();
	};
	//ruby(ルビー)
	this.ruby = function(){
		mesh.material.ambient.setRGB(0.1745, 0.01175, 0.01175);
		mesh.material.color.setRGB(0.61424, 0.04136, 0.04136);
		mesh.material.specular.setRGB(0.727811, 0.626959, 0.626959);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 76.8;
		
		recreateDat();
	};
	//emerald(エメラルド)
	this.emerald = function(){
		mesh.material.ambient.setRGB(0.0215, 0.1745, 0.0215);
		mesh.material.color.setRGB(0.07568, 0.61424, 0.07568);
		mesh.material.specular.setRGB(0.633, 0.727811, 0.633);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 76.8;
		
		recreateDat();
	};
	//jade(翡翠)
	this.jade = function(){
		mesh.material.ambient.setRGB(0.135, 0.2225, 0.1575);
		mesh.material.color.setRGB(0.54, 0.89, 0.63);
		mesh.material.specular.setRGB(0.316228, 0.316228, 0.316228);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 12.8;
		
		recreateDat();
	};
	//obsidian(黒曜石)
	this.obsidian = function(){
		mesh.material.ambient.setRGB(0.05375, 0.05, 0.06625);
		mesh.material.color.setRGB(0.18275, 0.17, 0.22525);
		mesh.material.specular.setRGB(0.332741, 0.328634, 0.346435);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 38.4;
		
		recreateDat();
	};
	// pearl(真珠)
	this.pearl = function(){
		mesh.material.ambient.setRGB(0.25, 0.20725, 0.20725);
		mesh.material.color.setRGB(1.0, 0.829, 0.829);
		mesh.material.specular.setRGB(0.296648, 0.296648, 0.296648);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 10.24;
		
		recreateDat();
	};
	//turquoise(トルコ石)
	this.turquoise = function(){
		mesh.material.ambient.setRGB(0.1, 0.18725, 0.1745);
		mesh.material.color.setRGB(0.396, 0.74151, 0.69102);
		mesh.material.specular.setRGB(0.297254, 0.30829, 0.306678);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 12.8;
		
		recreateDat();
	};
	//brass(真鍮)
	this.brass = function(){
		mesh.material.ambient.setRGB(0.329412, 0.223529, 0.027451);
		mesh.material.color.setRGB(0.780392, 0.568627, 0.113725);
		mesh.material.specular.setRGB(0.992157, 0.941176, 0.807843);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 27.89743616;
		
		recreateDat();
	};
	//bronze(青銅)
	this.bronze = function(){
		mesh.material.ambient.setRGB(0.2125, 0.1275, 0.054);
		mesh.material.color.setRGB(0.714, 0.4284, 0.18144);
		mesh.material.specular.setRGB(0.393548, 0.271906, 0.166721);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 25.6;
		
		recreateDat();
	};
	//chrome(クローム)
	this.chrome = function(){
		mesh.material.ambient.setRGB(0.25, 0.25, 0.25);
		mesh.material.color.setRGB(0.4, 0.4, 0.4);
		mesh.material.specular.setRGB(0.774597, 0.774597, 0.774597);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 76.8;
		
		recreateDat();
	};
	//copper(銅)
	this.copper = function(){
		mesh.material.ambient.setRGB(0.19125, 0.0735, 0.0225);
		mesh.material.color.setRGB(0.7038, 0.27048, 0.0828);
		mesh.material.specular.setRGB(0.256777, 0.137622, 0.086014);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 12.8;
		
		recreateDat();
	};
	//gold(金)
	this.gold = function(){
		mesh.material.ambient.setRGB(0.24725, 0.1995, 0.0745);
		mesh.material.color.setRGB(0.75164, 0.60648, 0.22648);
		mesh.material.specular.setRGB(0.628281, 0.555802, 0.366065);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 51.2;
		
		recreateDat();
	};
	//silver(銀)
	this.silver = function(){
		mesh.material.ambient.setRGB(0.19225, 0.19225, 0.19225);
		mesh.material.color.setRGB(0.50754, 0.50754, 0.50754);
		mesh.material.specular.setRGB(0.508273, 0.508273, 0.508273);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 51.2;
		
		recreateDat();
	};
	//プラスチック(黒)
	this.black_plastic = function(){
		mesh.material.ambient.setRGB(0.0, 0.0, 0.0);
		mesh.material.color.setRGB(0.01, 0.01, 0.01);
		mesh.material.specular.setRGB(0.50, 0.50, 0.50);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 32;
		
		recreateDat();
	};
	//プラスチック(シアン)
	this.cyan_plastic = function(){
		mesh.material.ambient.setRGB(0.0, 0.1, 0.06);
		mesh.material.color.setRGB(0.0, 0.50980392, 0.50980392);
		mesh.material.specular.setRGB(0.50196078, 0.50196078, 0.50196078);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 32;
		
		recreateDat();
	};
	//プラスチック(緑)
	this.green_plastic = function(){
		mesh.material.ambient.setRGB(0.0, 0.0, 0.0);
		mesh.material.color.setRGB(0.1, 0.35, 0.1);
		mesh.material.specular.setRGB(0.45, 0.55, 0.45);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 32;
		
		recreateDat();
	};
	//プラスチック(赤)
	this.red_plastic = function(){
		mesh.material.ambient.setRGB(0.0, 0.0, 0.0);
		mesh.material.color.setRGB(0.5, 0.0, 0.0);
		mesh.material.specular.setRGB(0.7, 0.6, 0.6);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 32;
		
		recreateDat();
	};
	//プラスチック(白)
	this.white_plastic = function(){
		mesh.material.ambient.setRGB(0.0, 0.0, 0.0);
		mesh.material.color.setRGB(0.55, 0.55, 0.55);
		mesh.material.specular.setRGB(0.70, 0.70, 0.70);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 32;
		
		recreateDat();
	};
	//プラスチック(黄)
	this.yellow_plastic = function(){
		mesh.material.ambient.setRGB(0.0, 0.0, 0.0);
		mesh.material.color.setRGB(0.5, 0.5, 0.0);
		mesh.material.specular.setRGB(0.60, 0.60, 0.50);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 32;
		
		recreateDat();
	};
	//ゴム(黒)
	this.black_rubber = function(){
		mesh.material.ambient.setRGB(0.02, 0.02, 0.02);
		mesh.material.color.setRGB(0.01, 0.01, 0.01);
		mesh.material.specular.setRGB(0.4, 0.4, 0.4);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 10.0;
		
		recreateDat();
	};
	//ゴム(シアン)
	this.cyan_rubber = function(){
		mesh.material.ambient.setRGB(0.0, 0.05, 0.05);
		mesh.material.color.setRGB(0.4, 0.5, 0.5);
		mesh.material.specular.setRGB(0.04, 0.7, 0.7);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 10.0;
		
		recreateDat();
	};
	//ゴム(緑)
	this.green_rubber = function(){
		mesh.material.ambient.setRGB(0.0, 0.05, 0.0);
		mesh.material.color.setRGB(0.4, 0.5, 0.4);
		mesh.material.specular.setRGB(0.04, 0.7, 0.04);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 10.0;
		
		recreateDat();
	};
	//ゴム(赤)
	this.red_rubber = function(){
		mesh.material.ambient.setRGB(0.05, 0.0, 0.0);
		mesh.material.color.setRGB(0.5, 0.4, 0.4);
		mesh.material.specular.setRGB(0.7, 0.04, 0.04);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 10.0;
		
		recreateDat();
	};
	//ゴム(白)
	this.white_rubber = function(){
		mesh.material.ambient.setRGB(0.05, 0.05, 0.05);
		mesh.material.color.setRGB(0.5, 0.5, 0.5);
		mesh.material.specular.setRGB(0.7, 0.7, 0.7);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 10.0;
		
		recreateDat();
	};
	//ゴム(黄)
	this.yellow_rubber = function(){
		mesh.material.ambient.setRGB(0.05, 0.05, 0.0);
		mesh.material.color.setRGB(0.5, 0.5, 0.4);
		mesh.material.specular.setRGB(0.7, 0.7, 0.04);
		mesh.material.emissive.setRGB(0.0, 0.0, 0.0);
		mesh.material.shininess	= 10.0;
		
		recreateDat();
	};
};