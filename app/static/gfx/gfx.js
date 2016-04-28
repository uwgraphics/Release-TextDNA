var gfx = {};

/*
 */
console.warn = function () {};
//constants
gfx.ORDER = 2;
gfx.SEQUENCES = 3;
gfx.DATA = 4;

gfx.SEQLENGTH = 3;//make _
gfx.SEQ_NAME = 7;

gfx.VIEWING_ANGLE = 90;
gfx.NEAR = .01;
gfx.FAR = 10000;

gfx.WHITE = 0xFFFFF;
gfx.RED = 0x0ff0000;
gfx.LIMEGREEN = 0x32CD32;



gfx.PAD = 10;
gfx.BLKW = gfx.blkW = 16; //@TODO alias

gfx.colorMap = {
		BLUE_YELLOW: { 
			name: "Blue-Yellow", 
			values: [[255,255,217],[237,248,177],[199,233,180],[127,205,187],[65,182,196],[29,145,192],[34,94,168],[37,52,148],[8,29,88]], 
			highlight: new THREE.Vector3(1, 0, 0)
		},
		GREY: {
			name: "Grey", 
			values: [[84,84,84],[84,84,84],[84,84,84],[84,84,84],[84,84,84]], 
			highlight: new THREE.Vector3(1,0,0)
		},
		//NEW
		PURPLE_BLUE_GREEN: {
			name: "Purple-Blue-Green", 
			values: [ [236,226,240], [208,209,230], [166,189,219], [103,169,207], [54,144,192], [2,129,138], [1,108,89], [1,70,54]], 
			highlight: new THREE.Vector3(50/255,205/255,50/255)
		},
		YELLOW_ORANGE_BROWN: {
			name: "Yellow-Orange-Brown", 
			values: [ [255,247,188], [254,227,145], [254,196,79], [254,153,41], [236,112,20], [204,76,2], [153,52,4], [102,37,6]], 
			highlight: new THREE.Vector3(50/255,205/255,50/255)
		},
		RED_PURPLE: {
			name: "Red-Purple", 
			values: [ [253,224,221], [252,197,192], [250,159,181], [247,104,161], [221,52,151], [174,1,126], [122,1,119], [73,0,106]], 
			highlight: new THREE.Vector3(50/255,205/255,50/255)
		},
		PURPLE: {
			name: "Purple", 
			values: [ [239,237,245], [218,218,235], [188,189,220], [158,154,200], [128,125,186], [106,81,163], [84,39,143], [63,0,125]], 
			highlight: new THREE.Vector3(50/255,205/255,50/255)
		},
		GREEN: {
			name: "Green", 
			values: [ [229,245,224], [199,233,192], [161,217,155], [116,196,118], [65,171,93], [35,139,69], [0,109,44], [0,68,27]], 
			highlight: new THREE.Vector3(1,0,0)
		},
		RED: {
			name: "Red", 
			values: [ [254,224,210], [252,187,161], [252,146,114], [251,106,74], [239,59,44], [203,24,29], [165,15,21], [103,0,13]], 
			highlight: new THREE.Vector3(50/255,205/255,50/255)
		},

		BLUE: {
			name: "Blue", 
			values:[ [222,235,247], [198,219,239], [158,202,225], [107,174,214], [66,146,198], [33,113,181], [8,81,156], [8,48,107]], 
			highlight: new THREE.Vector3(50/255,205/255,50/255)
		},
		BROWN_BLUE_GREEN: {
			name: "Brown-Blue-Green", 
			values: [ [84,48,5], [140,81,10], [191,129,45], [223,194,125], [246,232,195], [199,234,229], [128,205,193], [53,151,143], [1,102,94], [0,60,48]], 
			highlight: new THREE.Vector3(50/255,205/255,50/255)
		},
		PINK_YELLOW_GREEN: {
			name: "Pink-Yellow-Green", 
			values: [ [142,1,82], [197,27,125], [222,119,174], [241,182,218], [253,224,239], [230,245,208], [184,225,134], [127,188,65], [77,146,33], [39,100,25]], 
			highlight: new THREE.Vector3(50/255,205/255,50/255)
		},
		PURPLE_GREEN: {
			name: "Purple-Green", 
			values: [ [64,0,75], [118,42,131], [153,112,171], [194,165,207], [231,212,232], [217,240,211], [166,219,160], [90,174,97], [27,120,55], [0,68,27]], 
			highlight: new THREE.Vector3(1,0,0)
		},
		PURPLE_ORANGE: {
			name: "Purple-Orange", 
			values:[ [127,59,8], [179,88,6], [224,130,20], [253,184,99], [254,224,182], [216,218,235], [178,171,210], [128,115,172], [84,39,136], [45,0,75]], 
			highlight: new THREE.Vector3(50/255,205/255,50/255)
		},
		RED_BLACK: {
			name: "Red-Black", 
			values:[ [103,0,31], [178,24,43], [214,96,77], [244,165,130], [253,219,199], [224,224,224], [186,186,186], [135,135,135], [77,77,77], [26,26,26]], 
			highlight: new THREE.Vector3(50/255,205/255,50/255)
		},
		RED_BLUE: {
			name: "Red-Blue", 
			values:[ [103,0,31], [178,24,43], [214,96,77], [244,165,130], [253,219,199], [209,229,240], [146,197,222], [67,147,195], [33,102,172], [5,48,97]], 
			highlight: new THREE.Vector3(50/255,205/255,50/255)
		},
		FILTER : {
			name : "FILTER :^)",
 			values : [[166,206,227],[31,120,180],[178,223,138],[51,160,44],[251,154,153],[227,26,28],[253,191,111],[255,127,0],[202,178,214],[106,61,154],[255,255,153],[177,89,40]],
 			highlight : new THREE.Vector3(50/255,205/255,50/255) 
		}





	}

//purple-green, brown-teal

//variables
gfx.dataset;
gfx.sequences;
gfx.sequenceData;
gfx.backgroundCanvas = $("<canvas></canvas>");
gfx.backgroundContext = gfx.backgroundCanvas[0].getContext("2d");
gfx.tooltip = $("<div class='tooltip' style='z-index:3;visibility:hidden;'></div>");
gfx.container;
gfx.zoomWidth;
gfx.zoomHeight = 25;
gfx.sceneWidth;
gfx.sceneHeight;
gfx.dataSteps;
gfx.renderMode;
gfx.orderTexture;
gfx.mapTexture;
gfx.colorScheme = gfx.colorMap.BLUE_YELLOW;
gfx.rampScheme = gfx.colorMap.BLUE_YELLOW;//gfx.colorMap.RED_BLUE;
gfx.blkH;
gfx.idArray = [];
gfx.lookupMap = {};
gfx.zoomMap = {};
gfx.zoomArray = [];
gfx.zoomRegion;
gfx.isZoomLocked = false;
gfx.zoomCamera;
gfx.zoomScene = new THREE.Scene();
gfx.grid;
gfx.referenceColoring = false;
gfx.referenceOrdering = false;
gfx.ratioStep = .01;
gfx.wordFilter = [];
gfx.usingFullRamps = false;

gfx.invertRampA = false;
gfx.invertRampB = false;

//THREE.JS 
gfx.scene = new THREE.Scene();
gfx.renderer = new THREE.WebGLRenderer({ alpha: true , preserveDrawingBuffer: true});
gfx.camera = new THREE.OrthographicCamera();

gfx.materials = {};
gfx.materials.default = new THREE.ShaderMaterial({
				        vertexShader  :  $('#vertexshader').text(),
				        fragmentShader:  $('#fragmentshader').text()
				     })

gfx.materials.average = new THREE.ShaderMaterial({
				        vertexShader  :  $('#wvs').text(),
				        fragmentShader:  $('#wfs').text()
				     })

gfx.materials.color = gfx.materials.default;

gfx.materials.highlight = new THREE.ShaderMaterial({
	         			vertexShader  :	$('#vertexshader').text(),
				        fragmentShader: "uniform vec3 color;\nvoid main() { gl_FragColor = vec4(color, 1.0);}",
				        uniforms : { color : {type : "v3" , value : gfx.colorScheme.highlight } }
				    })

gfx.materials.zoom = new THREE.ShaderMaterial({
	         			vertexShader  :	$('#vertexshader').text(),
				        fragmentShader: $('#zoomshader').text()
				    })
gfx.materials.legend = new THREE.ShaderMaterial({
				        vertexShader  :  $('#vertexshader').text(),
				        fragmentShader:  $('#legendshader').text() });



