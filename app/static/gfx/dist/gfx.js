var gfx = {};

/*
 */
console.warn = function () {};
//constants
gfx.ORDER = 2;
gfx.ORDER_NAME = "INT rank";
gfx.SEQUENCES = 3;
gfx.DATA = 4;

gfx.SEQLENGTH = 3;//make _
gfx.SEQ_NAME = 6;
gfx.SEQ_IDX= "STRING seqName";

gfx.VIEWING_ANGLE = 90;
gfx.NEAR = .01;
gfx.FAR = 10000;

gfx.WHITE = 0xFFFFF;
gfx.RED = 0x0ff0000;
gfx.LIMEGREEN = 0x32CD32;

gfx.BASE_PROPERTIES = ["STRING word", "INT seqId", "INT rank", "INT frequency", "STRING groupedFrequency", "INT seqId", "STRING seqName", "INT seqOrder"];


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
        CATEGORICAL: {
          name: "Categorical",
          values: [[166,206,227],[31,120,180],[178,223,138],[51,160,44],[251,154,153],[227,26,28],[253,191,111],[255,127,0],[202,178,214],[106,61,154],[255,255,153],[177,89,40]],
          highlight: new THREE.Vector3(.5,.5,.5)
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

gfx.supplementalProperties = [];

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




gfx.Grid = function (stepSize) {
    this.stepSize = stepSize;
    this.data = {};

    this.insert = function (region) {
        var map = this.data, stepSize = this.stepSize;

        var cornerX = Math.floor(region.x/stepSize), cornerY = Math.floor(region.y/stepSize);
        var strideX = Math.ceil(region.width/stepSize), strideY = Math.ceil(region.height/stepSize);

        for(var x = 0; x  <= strideX; x++){
            for(var y = 0; y <= strideY; y++){
                var hashX = cornerX + x, hashY = cornerY + y;
                var hashcode = "" + hashX + hashY;
                if(map[hashcode] == undefined) map[hashcode] = [];
                map[hashcode].push(region)
            }
        }
    }

    this.get = function (x, y) {
        var map = this.data, stepSize = this.stepSize;
        var regions = map["" + Math.floor(x/stepSize) + Math.floor(y/stepSize)];
        if(regions == undefined) return null;
        for(var i = 0; i < regions.length;i++){
            var region = regions[i];
            if(x >= region.x && y >= region.y && x <= (region.x + region.width) && y <= (region.y + region.height)){
                return region;
            }
        }
        return null;
    }
}

gfx.Area = function (x, y, width, height, owner) {
    this.x = x;
    this.y = y;
    this.width = width;
    if(this.width < 1){
        this.width = 1;
    }
    this.height = height;
    this.owner = owner;
}

/*
Saturday = Get connections to work
Sundauy  = Bug fix day. There are quite a few (also read for Sci-Fi -DO ANRDOIRDS DREAM OF ELECTRIC SHEEP

matchBy does not always match the actual tile that is highlighted
rought draft of connections working
look into split ramps. idk what those even are. build the histrogram data. 
 */
gfx.init = function (container, dataset) {

	gfx.canvasWidth = container.width() - 10;
	gfx.canvasHeight = container.height();
	gfx.sceneWidth = gfx.canvasWidth;
	gfx.zoomWidth = gfx.sceneWidth;
	gfx.sceneHeight = gfx.canvasHeight - gfx.zoomHeight;
	
	$("#zoomtitle").css("font-size", 13 + "px").css("top", (gfx.zoomHeight/2 - 15/2)).css("margin-left", "auto").css("position", "absolute").html("<b>Zoom Window<b>")

	
	gfx.camera = new THREE.OrthographicCamera( gfx.sceneWidth / - 2, gfx.sceneWidth / 2, gfx.sceneHeight / 2, gfx.sceneHeight / - 2, gfx.NEAR,	gfx.FAR  );
	gfx.camera.position.z = gfx.sceneWidth;

	gfx.zoomCamera = new THREE.OrthographicCamera( gfx.sceneWidth / - 2, gfx.sceneWidth / 2, gfx.zoomHeight / 2, gfx.zoomHeight / - 2, gfx.NEAR,	gfx.FAR  );
	gfx.camera.position.z = gfx.sceneWidth;
	gfx.maxTextureSize = gfx.renderer.context.getParameter(gfx.renderer.context.MAX_TEXTURE_SIZE);
	gfx.renderer.setSize(gfx.sceneWidth, gfx.sceneHeight + gfx.zoomHeight);
	gfx.renderer.enableScissorTest ( true );
	gfx.renderer.setViewport(0, 0, gfx.sceneWidth, gfx.sceneHeight);
	gfx.renderer.setScissor( 0, 0, gfx.sceneWidth, gfx.sceneHeight);


	gfx.backgroundCanvas.attr("width", gfx.sceneWidth).attr("height", gfx.sceneHeight + gfx.zoomHeight);


	$("#histogram-container").removeClass("hidden");
	$("#histogram")
		.attr("width", $("#widgets").width() - 15)
		.attr("height", 300);
	$("#histogram-background")
		.attr("width", $("#widgets").width() - 15)
		.attr("height", 300);
	
	//$("#colorlegend")
	//	.attr("width", $("#widgets").width() - 15)
	//	.attr("height", 50);

	gfx.legendCanvas = document.createElement("canvas");
	gfx.legendCanvas.width = 150;
	gfx.legendCanvas.height = 80;
	gfx.legendCtx = gfx.legendCanvas.getContext("2d");
	$("#colorlegend-container").append(gfx.legendCanvas)


	$("svg")[0].setAttribute("width", gfx.sceneWidth)
	$("svg")[0].setAttribute("height", gfx.sceneHeight + gfx.zoomHeight);
	
	container.append(gfx.backgroundCanvas).append(gfx.renderer.domElement);
	$("body").append(gfx.tooltip);

        
    // Load the additional properties
    var labels = dataset[0];
    for (var i = 0; i < labels.length; i++) {
        if (gfx.BASE_PROPERTIES.indexOf(labels[i])==-1) {
            $('#color')
          .append($('<option>', { value : i})
          .text(labels[i].split(" ").slice(1).join(" ")));
            gfx.supplementalProperties.push(i);
            //gfx.DATA++;
        }
    }
    
    //gfx.ORDER = labels.indexOf(gfx.ORDER_NAME);
    //gfx.SEQ_NAME = labels.indexOf(gfx.SEQ_IDX);
    //console.log(gfx.DATA);
    
	var now = new Date().getTime();
	gfx.loadDataSet(dataset);
	gfx.render(true, false, false);
	console.log(new Date().getTime() - now)

	var elem = $(gfx.renderer.domElement), tooltip = gfx.tooltip;
	var interval, last;
	var offsetX, offsetY;
	var active;
	var pageX, pageY;

    

	var update = function () {
		var canvasX = gfx.canvasX, canvasY = gfx.canvasY;
		var now = new Date().getTime();

		//tooltip.css("top", (pageY+15)+"px").css("left",(pageX-10)+"px");
	   // $(".contextmenu").removeClass("active");
		var needsUpdate = false;
		if(canvasY < gfx.zoomHeight){
			if(gfx.zoomRegion != undefined){
				var series = gfx.zoomRegion.localSeries;
				var hashX = Math.max ( (Math.floor(canvasX / gfx.zoomWidth * series.data.length)), 0);
				var word =  series.lookup[0][hashX]
				tooltip.css('visibility', "visible").html("Word : " + word + "<br>Sequence : " + gfx.zoomRegion.localSeries.sequence[1]);
				if(active != hashX){
					gfx.active = series.data[hashX];
					needsUpdate = true;
				}
			}else{
				tooltip.css('visibility', "hidden").text("");
				$("#words").html("");
				gfx.active = null;
				needsUpdate = true;
			}

			/*
			if(needsUpdate && false) {
				if(gfx.active === null){
					//clear histogram
					gfx.updateHistogram(undefined);
				}else{
					var word = gfx.active;
					var _word = word[gfx.WORD];

					var index = 0;
					var histoData = gfx.histogramData;
					for(var i = 0; i < histoData.length;i++){
						if(histoData[i][gfx.WORD] === _word) {
							index = i;
							break;
						}
					}
					var width = $("#histogram").width();
					var numWords = histoData.length;
				    var pixelsPerWord = width / numWords;
				    var wordsPerPixel = 1/ pixelsPerWord;
				    if(wordsPerPixel < 1) {
				        wordsPerPixel = 1;
				    }
					gfx.histogram(index / wordsPerPixel);
				}

				

				//get psuedoX
			}*/
			
		}else{
			var area = gfx.grid.get(canvasX, canvasY - gfx.zoomHeight);
			if(area != null && area != active){
				active = area;
				var region = area.owner;

				gfx.active = region.localSeries
				needsUpdate = true;
				//testing-----------------------------------
				if(!gfx.isZoomLocked){
					gfx.zoomRegion = area.owner;
					var position = worldToCanvas(area.owner.mesh.position)
					$("svg").find("rect").remove();
					var svg = makeSVG("rect", {
						x : position.x - area.owner.mesh.scale.x /2, 
						y : position.y - gfx.blkH/2,
						width : area.owner.mesh.scale.x,
						height : gfx.blkH,
						style : "fill:none;stroke-width:2;stroke:rgb(0,0,0);opacity:.6"
					})

					$("svg").append(svg);

					gfx.updateZoomMap();
					gfx.updateFilter();
					gfx.render(false, true, true, true);
					needsUpdate = false;
				}

				tooltip.css('visibility', "visible").html(gfx.stringifySeries(region.localSeries));
			
			}else if(area == null && area != active){
				active = area;
				gfx.active = null;
				tooltip.css('visibility', "hidden").text("");
				$("#words").html("")
				needsUpdate = true;
			}
		}

		if(needsUpdate){
			gfx.render(false, true, true);
		} 

		if( new Date().getTime() - last > 50){
			clearInterval(interval);
			interval = null;
		}

		gfx.setTooltipPosition(tooltip, tooltip.width(), tooltip.height(), pageX, pageY+15);
	}


	$( gfx.legendCanvas ).bind("click", function (e) {
		var self = $(this);
		if(e.pageY - self.offset().top < self.height()/2){
			gfx.invertRampA = !gfx.invertRampA
		}else{
			gfx.invertRampB = !gfx.invertRampB
		}

		gfx.active = null;
		gfx.longTask(function(){
			gfx.updateTextures();
			gfx.updateZoomWeights();
			gfx.render(true, true, true);
			gfx.updateHistogram();
		})

	})
	
	
	elem.bind("mousemove", function (e) {
		pageX = e.pageX;
		pageY = e.pageY;
		gfx.canvasX = e.pageX - offsetX;
		gfx.canvasY = e.pageY - offsetY;
		if(interval != null) return
		var offset = elem.offset();
		offsetX = offset.left;
		offsetY = offset.top;
		last = new Date().getTime();
		update();
		interval = setInterval(update, 17);
	})


	$("#filter").change(function(e) {
		if(this.value.length == 0){
			gfx.wordFilter = [];
		}else{
			gfx.wordFilter = this.value.split(",").map(function(value) { return value.trim(); });
		}
		gfx.updateColor();
		gfx.updateAverages();
		gfx.updateDataTextures();
		gfx.active = null;
    	gfx.render(true, true, true);//@TODO
	})

	

	elem.bind("click", function (e) {
		var offset = elem.offset();
		gfx.canvasX = e.pageX - offset.left;
		gfx.canvasY = e.pageY - offset.top;
		//gfx.active = undefined;
		if(gfx.canvasY < gfx.zoomHeight){
			if(gfx.zoomRegion !== undefined && gfx.zoomRegion !== null){
				var series = gfx.zoomRegion.localSeries;
				var hashX = Math.max ( (Math.floor(gfx.canvasX / gfx.zoomWidth * series.data.length)), 0);
				var data = gfx.zoomArray[hashX], word = data.word;
				var tex = (data.material.uniforms.index.value == 0)? gfx.mapTexture:gfx.rampTexture;
				var color = gfx.sampleTexture(tex, data.material.uniforms.weight.value);
	        	var rgb = "rgb(" + Math.floor(color[0]-15) + "," + Math.floor(color[1]-15) + "," + Math.floor(color[2]-15) + ")";


				gfx.mark(word, rgb);
			}
		}else{
			var area = gfx.grid.get( e.pageX - offset.left,  e.pageY - offset.top - gfx.zoomHeight);
			if(area != null){
				if(gfx.isZoomLocked){
					gfx.zoomRegion = area.owner;
					var position = worldToCanvas(area.owner.mesh.position)
					$("svg").find("rect").remove();
					var svg = makeSVG("rect", {
						x : position.x - area.owner.mesh.scale.x /2, 
						y : position.y - gfx.blkH/2,
						width : area.owner.mesh.scale.x,
						height : gfx.blkH,
						style : "fill:none;stroke-width:2;stroke:rgb(0,0,0);opacity:.6"
					})

					$("svg").append(svg);

					gfx.updateZoomMap();
					gfx.updateFilter();
				}

				gfx.isZoomLocked = true;

				gfx.render(false, true, true);
			}
		}

		$(".contextmenu").removeClass("active");
	})



	var fillWordDisplay = function (srcWords, sequence) {
		var wordlist = $("#wordlist");
		var WORD = gfx.WORD, RANK = gfx.RANK, FREQUENCY = gfx.FREQUENCY, GROUPED_FREQUENCY = gfx.GROUPED_FREQUENCY;

		var regions = {};
		var idArray = gfx.idArray, start = false;
		for(var i = 0; i < idArray.length;i++){
			var region = idArray[i];
			if(region.localSeries.sequence === sequence){
				var list = region.localSeries.lookup[WORD];
				for(var n = 0; n < list.length;n++){
					var word = list[n];
					if(srcWords.indexOf(word) > -1){
						regions[region.id] = region;
						start = true;
					}
				}
			}else if(start){
				break;
			}
		}	

		for(var key in regions){
			var region = regions[key], data = region.localSeries.data;
			for(var i = 0; i < data.length;i++){
				var word = data[i];

				var ramp = word["ramp"];
				var color = word["color"] /255;
				var sample = gfx.sampleTexture( (ramp === 0)? gfx.mapTexture:gfx.rampTexture, color);
				var rgb = "rgb(" + Math.floor(sample[0]) + "," + Math.floor(sample[1]) + "," + Math.floor(sample[2]) + ")";
				//
				var element = $("<li> <div class='wordttitle' > <span style='color: " + rgb + " '>&#x25a0 </span>" + word[WORD]+ "</div>rank : "+ word[RANK]+ ", frequency : " + word[FREQUENCY]+"</li>");
				if(srcWords.indexOf(word[WORD]) > -1){
					element.addClass("bold");
				}
				wordlist.append(element);
			}	

			wordlist.append("<li><div style='display:inline-block'><br></br></br></div></li>")//wheeeze.
		}
	}

	elem.bind("contextmenu", function (e) {	
		var posX = e.pageX, posY = e.pageY;
		if(e.pageY - elem.offset().top < gfx.zoomHeight){
			return;
		}
		$(".contextmenu").find("#setreferencecolor, #setreferenceorder").css("display", "block");
		e.preventDefault();
		$(".contextmenu").addClass("active").css("top", e.pageY-5+"px").css("left",e.pageX-5+"px");
		tooltip.css('visibility', "hidden")
		$("#showwords").unbind("click");
		$("#showwords").bind("click",  function (e) {
			var offset = elem.offset(), cp = $(".contextmenu").offset();
			var area = gfx.grid.get( posX - offset.left, posY - offset.top - gfx.zoomHeight);
			if(area != null){
				$("#worddisplay").addClass("active");
				$("#seqlist,#wordlist").find("li").remove();
				$("#seqlist,#wordlist").scrollTop();
				$("#wordlist").find(".title").html("Matching blocks in " + area.owner.localSeries.sequence[1]);//TODO hardcode. 
				var wordlist = $("#wordlist");
				var WORD = gfx.WORD, RANK = gfx.RANK, FREQUENCY = gfx.FREQUENCY, GROUPED_FREQUENCY = gfx.GROUPED_FREQUENCY;

				var seqlist = $("#seqlist");
				var sequences = gfx.sequences;
				for(var i = 0;i < sequences.length;i++){//highlight which sequence we came from. 
					if(sequences[i] == area.owner.localSeries.sequence){
						seqlist.append("<li class='active' id="+ i +">" + sequences[i][1] + "</li>");//@TODO HARDCODE
					}else{
						seqlist.append("<li id="+ i +">" + sequences[i][1] + "</li>");//@TODO HARDCODE
					}
					
				}


				fillWordDisplay(area.owner.localSeries.lookup[gfx.WORD], area.owner.localSeries.sequence);
				
				$("#seqlist").find("li").bind("click", function () {
					//wipe words
					$("#seqlist").find("li").removeClass("active");
					$(this).addClass("active");
					$("#wordlist").find("li").remove();
					$("#wordlist").scrollTop();
					var seqId = parseInt( $(this).attr("id") );
					$("#wordlist").find(".title").html("Matching blocks in " + gfx.sequences[seqId][1]);
					fillWordDisplay(area.owner.localSeries.lookup[gfx.WORD], gfx.sequences[seqId]);
				})

			}
			
		})
		return false
	}, false)



	$("#histogram").bind("contextmenu", function (e) {	
		$(".contextmenu").find("#setreferencecolor, #setreferenceorder").css("display", "none");
		e.preventDefault();
		$(".contextmenu").addClass("active").css("top", e.pageY+"px").css("left",e.pageX+"px");
		tooltip.css('visibility', "hidden");
		var sequences = gfx.sequences;
		$("#showwords").unbind("click");
		$("#showwords").bind("click",  function (e) {
			$("#worddisplay").addClass("active");
			$("#seqlist,#wordlist").find("li").remove();
			$("#seqlist,#wordlist").scrollTop();
			$("#wordlist").find(".title").html("Matching blocks in " + sequences[0][1]);//TODO hardcode. 
			var wordlist = $("#wordlist");
			var WORD = gfx.WORD, RANK = gfx.RANK, FREQUENCY = gfx.FREQUENCY, GROUPED_FREQUENCY = gfx.GROUPED_FREQUENCY;

			var seqlist = $("#seqlist");
			for(var i = 0;i < sequences.length;i++){//highlight which sequence we came from. 
				if(i == 0){
					seqlist.append("<li class='active' id="+ i +">" + sequences[i][1] + "</li>");//@TODO HARDCODE
				}else{
					seqlist.append("<li id="+ i +">" + sequences[i][1] + "</li>");//@TODO HARDCODE
				}
			}
			var words = [], last = gfx.lastHistogram;
			for(var i = 0; i < last.length;i++){
				words[i] = last[i][WORD];
			}
			fillWordDisplay(words, sequences[0]);
			
			$("#seqlist").find("li").bind("click", function () {
				//wipe words
				$("#seqlist").find("li").removeClass("active");
				$(this).addClass("active");
				$("#wordlist").find("li").remove();
				$("#wordlist").scrollTop();
				var seqId = parseInt( $(this).attr("id") );
				$("#wordlist").find(".title").html("Matching blocks in " + gfx.sequences[seqId][1]);
				fillWordDisplay(words, gfx.sequences[seqId]);
			})
		})
		return false
	}, false)



	$(".contextmenu").bind("click", function () {
		$(".contextmenu").removeClass("active");
	})

	$("#setreferencecolor").bind("click", function (e) {
		var offset = elem.offset(), cp = $(".contextmenu").offset();
		var area = gfx.grid.get( cp.left - offset.left, cp.top - offset.top - gfx.zoomHeight);
		if(area != null){
			gfx.longTask(function(){
				gfx.referenceColorSequence = area.owner.localSeries.sequence["words"];

				//$(".seqtitle").removeClass("reference-color");
				//$("#seq_" + area.owner.localSeries.sequence[0]).addClass("reference-color");

				gfx.referenceColorSequenceId = area.owner.localSeries.sequence[0];
				gfx.active = null;
				gfx.colorBy = 102;
				$("#color")[0].value = 102;
				//why are we doing all of it? O_o
				gfx.updateOrder();
				gfx.updateRegions();
				gfx.updateColor();
				gfx.updateAverages();
				gfx.updateDataTextures();
				gfx.updateZoomWeights();
				gfx.render(true, true, true);
			})
		}
	})

	$("#setreferenceorder").bind("click", function (e) {
		var offset = elem.offset(), cp = $(".contextmenu").offset();
		var area = gfx.grid.get( cp.left - offset.left, cp.top - offset.top - gfx.zoomHeight);
		if(area != null){
			gfx.longTask(function(){
				gfx.referenceOrderSequence = area.owner.localSeries.sequence["words"];

				gfx.referenceOrderSequenceId = area.owner.localSeries.sequence[0];
				gfx.active = null;
				$("#refordering")[0].checked = true;
			    gfx.referenceOrdering = true;
				gfx.longTask(function(){
					gfx.updateOrder();
					gfx.updateRegions();
					gfx.updateColor();
					gfx.updateAverages();
					gfx.updateDataTextures();
					gfx.updateZoomWeights();
					gfx.render(true, true, true);
					$("svg").find("line").remove();
				})
			})
		}
	})



	$("#worddisplaybg").bind("click",  function (e) {
		$("#worddisplay").removeClass("active");
	})

	$("#clearmarks").bind("click", function (e) {
		$("svg").find("line").remove();
	})

	$("#clearzoom").bind("click", function (e) {
		gfx.zoomRegion = null;
		gfx.isZoomLocked = false;
		gfx.updateZoomWeights();
		gfx.updateZoomMap();
		gfx.render(false, true, true);
		$("svg").find("rect").remove();

	})

	//aassume we just grab those dom elememes for now.
	$("#color").change(function(e) {
		gfx.colorBy = parseInt(this.value);
		gfx.longTask(function(){
			gfx.active = null;
			gfx.updateColor();
			gfx.updateAverages();
			gfx.updateDataTextures();
			gfx.updateZoomWeights();
			gfx.render(true, true, true);
			gfx.updateHistogram();
		})
    });
	
	$("#order").change(function(e) {
	   	  var orderBy = gfx.orderBy = parseInt(this.value);
	   	  gfx.longTask(function(){
			   gfx.active = null;
			   gfx.updateOrder();
			   gfx.updateRegions();
			   gfx.updateAverages();
			  $("svg").find("line").remove();
			   gfx.render(true, true, true);
	   	   })
	   
    });
	
	$("#colormap").change(function(e) {
		gfx.invertRampA = false;
		gfx.colorScheme = gfx.colorMap[this.value];
		gfx.active = null;
		gfx.updateTextures();
		gfx.updateAverages();
		gfx.materials.highlight.uniforms.color.value = gfx.colorScheme.highlight;
		gfx.updateZoomWeights();
		gfx.render(true, true, true);
		gfx.updateHistogram();
    });

    $("#splitramp").change(function(e){//none | gf | ref
    	gfx.splitRamps = (this.value == "none")? undefined:this.value
    	gfx.updateColor();
    	gfx.updateAverages();
    	gfx.updateDataTextures();
		gfx.updateZoomWeights();
		gfx.render(true, true, true);
    })

    $("#ramptheme").change(function(e) {
    	gfx.invertRampB = false;
    	gfx.rampScheme = gfx.colorMap[this.value];
		gfx.active = null;
		gfx.longTask(function(){
			gfx.updateTextures();
			gfx.updateZoomWeights();
			gfx.render(true, true, true);
			gfx.updateHistogram();
		})
    })
	
	$("#datakey").change(function(e) {
		gfx.active = null;
		gfx.matchBy = parseInt(this.value);
		gfx.longTask(function(){
			gfx.updateZoomMap(); 
			gfx.updateLookupMap();
			gfx.updateFilter();
		});
    });

    $("#coloringmode").change(function(e){
    	gfx.active = null;
    	gfx.coloringMode = this.value;
    	gfx.longTask(function(){
	    	gfx.updateColor();
	    	gfx.updateAverages();
			gfx.updateDataTextures();
			gfx.updateZoomWeights();
			gfx.render(true, true, true);
		})
    })

	$("#refordering").change(function(e){
		gfx.active = null;
	    gfx.referenceOrdering = this.checked;
		gfx.longTask(function(){
			gfx.updateOrder();
			gfx.updateRegions();
			gfx.updateAverages();
			$("svg").find("line").remove();
			gfx.render(true, true, true);
		})
    })

    $("#reversecoloring").change(function(e) {
    	gfx.reverseColors = this.checked;
    	gfx.longTask(function(){
	    	gfx.updateColor();
	    	gfx.updateRegions();
	    	gfx.updateAverages();
	    	gfx.render(true, true, true);
	    })
    })

    $("#fullramps").change(function(e) {
    	gfx.usingFullRamps = this.checked;
		gfx.active = null;
		gfx.longTask(function(){
			gfx.updateTextures();
			gfx.updateZoomWeights();
			gfx.render(true, true, true);
			gfx.updateHistogram();
		})
    });

    $("#refcoloring").change(function(e){
    	gfx.active = null;
    	gfx.referenceColoring = this.checked;
    	gfx.longTask(function(){
	    	gfx.updateColor();
	    	gfx.updateAverages();
			gfx.updateDataTextures();
			gfx.updateZoomWeights();
			gfx.render(true, true, true);
		})
    })

    $("#colormode").change(function(){
    	if(this.value == "default"){
    		gfx.materials.color = gfx.materials.default;
    	}else{
    		gfx.materials.color = gfx.materials.average;
    	}
   		gfx.longTask(function(){
	       gfx.updateRegions();
	       gfx.updateAverages();
		   gfx.render(true, true, true);
		})
    })
    
    $("#presets").change(function(e) {
                
    	switch(this.value) {
            case "CR":
                $('#order option[value="11"]').attr('selected', 'selected');
                $('#color option[value="2"]').attr('selected', 'selected');
                $("#color").change();
                $("#order").change();
                break;
            case "RC":
                $('#order option[value="2"]').attr('selected', 'selected');
                $('#color option[value="101"]').attr('selected', 'selected');
                $("#color").change();
                $("#order").change();
                break;
            case "FR":
                $('#order option[value="2"]').attr('selected', 'selected');
                $('#color option[value="3"]').attr('selected', 'selected');
                $("#color").change();
                $("#order").change();
                break;
            case "FC": 
                $('#order option[value="11"]').attr('selected', 'selected');
                $('#color option[value="3"]').attr('selected', 'selected');
                $("#color").change();
                $("#order").change();
                break;
        }
    })

    var histogram = $("#histogram"), lastHisto = null;
    histogram.bind("mousemove", function (e) {
    	$(".contextmenu").removeClass("active");
    	var offset = histogram.offset();
    	var mouseX =  e.pageX - offset.left;
    	tooltip.css("top", (e.pageY+15)+"px").css("left",(e.pageX-10)+"px");
    	var active = gfx.histogram(mouseX);//TODO
    	if(active != lastHisto){
    		lastHisto = active;
    		gfx.active = new gfx.LocalSeries(null, active);
    	}
    	gfx.render(false, true, true);

    })
    histogram.mouseleave(function(){
    	gfx.histogram()
    	tooltip.css('visibility', "hidden").text("");
    })


  

    var search = $("#search");

    search.change(function(e){
    	gfx.active = null;
    	gfx.filter =  this.value;
    	gfx.render(true, true, true);//@TODO

    })



   $("#widgets").mouseenter(function(){
   		gfx.active = null;
   		gfx.render(false, true, true);
   		tooltip.css('visibility', "hidden").text("");
   		$(".contextmenu").removeClass("active");
   })

}


/*

[0, 3, 5, 7, 334, 88, 2234, 7,3443]
[0, 3433, 4334, 43343, 4333, 33343] 
might need rounding? 23/22 = 23/

*/

gfx.LocalSeries = function (sequence, data) {
	this.sequence = sequence;
	this.data = data;

	var aux = [];
	for(var i = 0; i < data[0].length;i++){
		aux.push([]);
	}

	for(var n = 0; n < data[0].length;n++){
		if(data[0][n]!==undefined){
			for(var i = 0; i < data.length;i++){
				aux[n][i] = data[i][n];
			}
		}
	}

	this.lookup = aux;

}
gfx.Region = function (localSeries) {
	this.position;
	this.width;
	this.height;
	this.highlightArea;
	this.mesh;
	this.localSeries;

	this.dataTexture = gfx.constructDataTexture(localSeries.data);
	this.dataTexture.needsUpdate = true;
		
	this.colorMaterial = gfx.materials.color.clone();
	this.colorMaterial.uniforms  = { 
    	texture1 : { type: "t", value : gfx.mapTexture }, 
    	texture2 : { type: "t", value : gfx.rampTexture },
    	dataTex  : { type: "t", value : this.dataTexture }, 
    	orderTex : { type: "t", value : gfx.orderTexture }, 
    	w        : { type: "f", value : localSeries.data.length},
    	opacity  : { type: "f", value : 1.0 },
    	texWidth : { type: "f", value : this.dataTexture.image.width },
    	texHeight: { type: "f", value : this.dataTexture.image.height },
    	average1 : { type : "v2", value : new THREE.Vector2(0, 0) },
    	average2 : {type : "v2", value : new THREE.Vector2(0, 0) }
    };

	this.mesh = new THREE.Mesh(gfx.planeGeometry , this.colorMaterial);
	this.mesh.dynamic = true;
	this.position = this.mesh.position;
	gfx.scene.add(this.mesh);

	this.update(localSeries);
}


gfx.Region.prototype.update = function (localSeries) {
	var sequence = localSeries.sequence, data = localSeries.data;
	this.localSeries = localSeries
	var sceneWidth = gfx.virtualWidth;
	var valueWidth = gfx.virtualValueWidth;//pre-compute this once. 
	var blockWidth = ( (data[data.length-1]["order"] - data[0]["order"]) + 1) * valueWidth;
	this.width = blockWidth;
	this.height = gfx.blkH;
	this.colorMaterial.uniforms.w.value = localSeries.data.length;
	this.position.x = -gfx.sceneWidth/2 + (data[0]["order"] * valueWidth + this.width/2);     //-gfx.sceneWidth/2 + Math.ceil(data[0]["order"] * gfx.sceneWidth) * .95 + this.width/2;
	//this.position.y = -gfx.sceneHeight/2 + sequence[gfx.ORDER] * (gfx.blkH + gfx.PAD) + (gfx.blkH + gfx.PAD) - 5;//@TODO ERROR ERROR
	this.position.y =  gfx.sceneHeight/2 - sequence[gfx.ORDER] * (gfx.blkH + gfx.PAD) - (gfx.blkH + gfx.PAD) + 5;
	this.mesh.scale.x = this.width;

	this.highlightArea = new gfx.Area(gfx.sceneWidth/2 + this.position.x - this.width/2, gfx.sceneHeight/2 - this.position.y - (this.height + 4)/2, this.width,  this.height + 4, this )
}

gfx.render = function (bData, bHightlights, bZoom, dontHighlightZoom) {//@TODO apply filters. 

	var idArray = gfx.idArray, renderMode = gfx.renderMode, renderer = gfx.renderer;
	
	if((bData || bZoom) && (gfx.lastFilter != gfx.filter)){
		gfx.updateFilter();
		gfx.lastFilter = gfx.filter;
	}

	if(bData){
		gfx.renderColorLegend();
		//check if we need a filter
		for(var i = 0; i < idArray.length;i++){
			var region = idArray[i], mesh = region.mesh;
				mesh.visible = true;
				mesh.material = region.colorMaterial;
		}

		gfx.renderer.setClearColor( 0xffffff, 1 );
		gfx.renderer.clear();
	    gfx.renderer.render(this.scene, this.camera);
	    this.backgroundContext.clearRect(0,0, gfx.canvasWidth, gfx.canvasHeight + gfx.zoomHeight);
	    this.backgroundContext.drawImage( gfx.renderer.domElement, 0, gfx.zoomHeight,  gfx.canvasWidth,  gfx.sceneHeight, 0, gfx.zoomHeight,  gfx.canvasWidth,  gfx.sceneHeight);
	    gfx.renderer.setClearColor(0x000000, 0);
	    gfx.renderer.clear();

	    var material = gfx.materials.highlight;
	    for(var i = 0; i < idArray.length;i++){
	    	idArray[i].mesh.material = material;
		}

		//bootstrap rendering color legend into here for now. 
		
	}

	if( (bHightlights || bZoom) && (bData ||  gfx.lastHighlight != gfx.active || gfx.lastZoom != gfx.zoomRegion || gfx.lastDontHighlightZoom != dontHighlightZoom)) {
		//reset all materials. 

		
		for(var i = 0; i < idArray.length;i++){
			idArray[i].mesh.visible = false;
		}
	    var children = gfx.zoomArray;
	    for(var i = 0; i < children.length;i++){
	        var child = children[i];
	        child.mesh.material = child.material;
	    }
	    //apply highlights
	    $(".seqtitle").removeClass("bold");
	    if( gfx.active !== null && gfx.active !== undefined ){
	    	 if(gfx.LocalSeries.prototype.isPrototypeOf(gfx.active)){//is a local series
				gfx.highlightBySeries(gfx.active, dontHighlightZoom);
			}else{//is a specific word
				gfx.highlightByWord(gfx.active, dontHighlightZoom);
			}
	    }
		gfx.lastHighlight = gfx.active
		gfx.lastZoom = gfx.zoomRegion
	}


	if(bHightlights) {
		renderer.clear();
		if(gfx.active !== null && gfx.active !== undefined){
			renderer.render(this.scene, this.camera);
		}
	}

	if(bZoom){//more to do
		renderer.setViewport(0, gfx.sceneHeight, gfx.zoomWidth, gfx.zoomHeight);
		renderer.setScissor( 0, gfx.sceneHeight, gfx.zoomWidth, gfx.zoomHeight);
		if(gfx.zoomRegion !== undefined){
			renderer.render(gfx.zoomScene, this.camera);
		}else{
			renderer.clear();
		}
		renderer.setViewport(0, 0, gfx.sceneWidth, gfx.sceneHeight);
		renderer.setScissor( 0, 0, gfx.sceneWidth, gfx.sceneHeight);
	}

	gfx.lastDontHighlightZoom = dontHighlightZoom;
}




gfx.renderColorLegend = function () {//super hacky temp code. 

	var GEOM = new THREE.PlaneGeometry( 2, .6, 1, 1 );

	var MAT1 = gfx.materials.legend.clone()
		MAT1.uniforms = {
			texture : { type: "t", value : gfx.mapTexture },
	    	flip : {type : "f", value :  (gfx.reverseColors)?1:0}
		}

	var MAT2 = gfx.materials.legend.clone()
		MAT2.uniforms = {
	    	texture : { type: "t", value : gfx.rampTexture },
	    	flip : {type : "f", value : (gfx.reverseColors)?1:0}
		}

	var PLANE = new THREE.Mesh( GEOM, MAT1 );
	var CAMERA = new THREE.Camera();
	var PLANE2 = new THREE.Mesh( GEOM, MAT2 );
		PLANE.position.y = .2;
		PLANE2.position.y = -.7;

	var SCENE = new THREE.Scene();
	SCENE.add( PLANE );
	SCENE.add( PLANE2 )


	var renderer = gfx.renderer;
	
	renderer.setViewport(0, 0, 150, 80);
	renderer.setScissor( 0, 0, 150, 80);

	renderer.render(SCENE, CAMERA);


	renderer.setViewport(0, 0, gfx.sceneWidth, gfx.sceneHeight);
	renderer.setScissor( 0, 0, gfx.sceneWidth, gfx.sceneHeight);

	gfx.legendCtx.drawImage(renderer.domElement, 0, gfx.sceneHeight - 40, 150, 80, 0, 0, 150, 80 )




	/*
	
	var renderer = gfx.legendRenderer;
	
	
	/*
	gfx.materials.zoom.uniforms = {
		texture1 : { type: "t", value : gfx.mapTexture }, 
    	texture2 : { type: "t", value : gfx.rampTexture },
    	texIndex : {type : "f", value : 0}, 
    	flip     : {type : "f", value : (gfx.reverseColors)?1:0 }
	}
	//var mesh = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), gfx.materials.zoom);
	
	//plane.position.y -= .5;
	//console.log(plane.position)
	//plane.position.y = -.5;
	//console.log(plane)
	//plane.rotation.x += 1//Math.PI / 2//Math.PI/2;
	

	//scene.add(mesh);

	//PLANE.rotation.set(new THREE.Vector3( Math.PI/2, 0, 0));
	PLANE.rotation.x = 1;
	renderer.setClearColor(0x00ff00, 1);
	renderer.clear();
	renderer.render(SCENE, camera);
	console.log("ASd") */

}

gfx.constructTextures = function () {

    gfx.mapTexture = new THREE.DataTexture(new Uint8Array([0]), 1, 1, THREE.RGBFormat);
    gfx.mapTexture.wrapS = THREE.ClampToEdgeWrapping
    gfx.mapTexture.wrapT = THREE.ClampToEdgeWrapping
    gfx.mapTexture.needsUpdate = true;

    gfx.rampTexture = new THREE.DataTexture(new Uint8Array([0]), 1, 1, THREE.RGBFormat);
    gfx.mapTexture.wrapS = THREE.ClampToEdgeWrapping
    gfx.mapTexture.wrapT = THREE.ClampToEdgeWrapping
    gfx.rampTexture.needsUpdate = true;
    gfx.updateTextures();

    //orderTexture

    var blkH = 16 , blkSize = 16;
    var map = new Array();
    for (var i = 0; map.length < 3 * blkH * blkSize; i++) {
            map.push(i);
    }
    map.sort(function() { return 0.5 - Math.random();});

    var map2 = new Array();
     for (var i = 0; i < map.length; i++) {
            map2.push(map[i], 0, 0);
    }

    gfx.orderTexture = new THREE.DataTexture(new Uint8Array(map2), blkH, blkSize, THREE.RGBFormat);
    gfx.orderTexture.needsUpdate = true;


}


gfx.updateTextures = function () {

    var colorScheme;
    var rampScheme;

    if(gfx.wordFilter.length !== 0){
        colorScheme = gfx.colorMap.FILTER.values.slice();
        rampScheme = gfx.colorMap.GREY.values.slice();
    }else{
        colorScheme = gfx.colorScheme.values.slice();
        rampScheme = gfx.rampScheme.values.slice();
    }
    
   
   

    if(gfx.colorScheme == gfx.rampScheme && gfx.colorBy > 100 && gfx.colorBy < 104 && !gfx.usingFullRamps) {
        //split the values in 2.
        var half = Math.floor(colorScheme.length/2);
        var left = colorScheme.slice(0, half)
        var right = colorScheme.slice(half)

        if(gfx.invertRampA) { left = left.reverse() };
        if(gfx.invertRampB) { right = right.reverse() };

        gfx.updateTexture(gfx.mapTexture, left);
        gfx.updateTexture(gfx.rampTexture, right);
    }else{
        if(gfx.invertRampA) {colorScheme = colorScheme.reverse()};
        if(gfx.invertRampB) {rampScheme = rampScheme.reverse()};

        gfx.updateTexture(gfx.mapTexture, colorScheme);
        gfx.updateTexture(gfx.rampTexture, rampScheme);
    }
}

gfx.constructTexture = function (colorMap) {
    var map = new Array();

    var STEPS = 100;
    for(var i = 0; i < values.length-1;i++){
        var a = values[i], b = values[i+1];
        for(var n = 0; n < STEPS;n++){
            var interp = interpColor(b, a, n/STEPS);
            map.push(interp[0], interp[1], interp[2]);
        }
    }

    var texture = new THREE.DataTexture(new Uint8Array(map), map.length/3, 1, THREE.RGBFormat);

    texture.needsUpdate = true;
    return texture;
}

var interpColor = function (a, b, t){
    var m = 1 - t;
    return [
        a[0] * t + b[0] * m,
        a[1] * t + b[1] * m,
        a[2] * t + b[2] * m
    ]
}

gfx.updateTexture = function (texture, values) {
    var map = new Array();

    var STEPS = 10;
    for(var i = 0; i < values.length-1;i++){
        var a = values[i], b = values[i+1];
        for(var n = 0; n < STEPS;n++){
            var interp = interpColor(b, a, n/STEPS);
            map.push(interp[0], interp[1], interp[2]);
        }
    }

    var image = texture.image;
    image.data = new Uint8Array(map);
    image.width = map.length/3;
    texture.needsUpdate = true;
}

//need to like do an averaging kernal for every friggan tile region :(
gfx.constructDataTexture = function (data) {

    var nextPower = Math.pow(2, Math.ceil(Math.log(data.length) / Math.log(2)));
    //can optimzie this to only run when we need to.
    var maxTextureSize = gfx.maxTextureSize;
    var width = nextPower, height = 1;

    while(width > maxTextureSize){
        width/=4;
        height*=4;
    }

    var map = new Uint8Array(width * height * 3);
    for (var d = 0; d < data.length; d++) {
        var word = data[d];
        map[d*3+0] = word["color"];
        map[d*3+1] = word["ramp"];
    }
    var out = new THREE.DataTexture(map, width, height, THREE.RGBFormat);
    out.needsUpdate = true;
    //@TODO maybe only turn on no averaging when there is a 2 stack texture?
    //if(height > 1){
        out.minFilter =  THREE.NearestFilter
        out.magFilter = THREE.NearestFilter
   // }
    out.wrapS = THREE.ClampToEdgeWrapping
    out.wrapT = THREE.ClampToEdgeWrapping
    return out;
};

gfx.updateDataTextures = function () {

    var idArray = gfx.idArray;
    for(var i = 0;i < idArray.length;i++){
        var region = idArray[i], dataTexture = region.dataTexture, data = dataTexture.image.data;
        var words = region.localSeries.data;

        for(var n = 0; n < words.length;n++){
            var word = words[n];
            data[n*3] = word["color"];
            data[n*3+1] = word["ramp"];
        }

        dataTexture.needsUpdate = true;
    }
}
 //because weird spec things
//http://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
function makeSVG(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}

gfx.loadDataSet = function (dataset) {//dont call update as long as regions dont change number of words per region

    var oldSeqOrder = [];
    (function(dataset){
        //temp sort. 
        var sequences = dataset[gfx.SEQUENCES], data = dataset[gfx.DATA];
        sequences.sort(function(a, b){
            return a[1] < b[1] ? -1 : 1;
        });

        var out = {};
        for(var i = 0; i < sequences.length;i++){
            oldSeqOrder[ sequences[i][0] ] = sequences[i]; 
            sequences[i]["oi"] = sequences[i][0];
            out[i] = data[sequences[i][0]];
            sequences[i][0] = i;
            sequences[i][2] = i;
        }

        dataset[gfx.DATA] = out;

    })(dataset);

    //optimize otherwise this will take 25 years. 
    var numSequences = Object.keys(dataset[gfx.SEQUENCES]).length;
    function remapgfstring(string){
        var out = "";
        for(var i = 0; i < numSequences;i++){
            out+= string.charAt(sequences[i]["oi"]+1);
        }
        return out;
    }

    gfx.renderMode = "color";
    gfx.dataset = dataset;

    var types = gfx.dataset[0], schema = [];
    for(var i=0;i<types.length;i++){
        var prop = types[i];
        if(prop.indexOf("word") > -1){
            gfx.WORD = i;
            schema[i] = "word";
        }else if(prop.indexOf("seqId") > -1){
            gfx.SEQID = i;
            schema[i] = "seqId";
        }else if(prop.indexOf("rank") > -1) {
            gfx.RANK = i;
            schema[i] = "rank";
        }else if(prop.indexOf("frequency") > -1){
            gfx.FREQUENCY = i;
            schema[i] = "frequency";
        }else if(prop.indexOf("groupedFrequency") > -1){
             gfx.GROUPED_FREQUENCY = i;
            schema[i] = "groupedFrequency";
        }else if(prop.indexOf("count") > -1){
            gfx.COUNT = i;
            schema[i] = "count";
        }else{
            schema[i] = prop;//??????????????/
            //new prop not already accounted for. Not sure what the spec on this is. 
        }
    }

    //calculate freq



    gfx.GROUPED_FREQUENCY_COUNT = 10;
    gfx.GROUPED_FREQUENCY_ORDER = 11;
    gfx.schema = schema;

    gfx.colorBy = gfx.RANK;
    gfx.orderBy = gfx.RANK;
    gfx.matchBy = gfx.WORD;

    var GROUPED_FREQUENCY_COUNT = gfx.GROUPED_FREQUENCY_COUNT, GROUPED_FREQUENCY = gfx.GROUPED_FREQUENCY;
    var sequences = gfx.sequences = dataset[gfx.SEQUENCES], data = gfx.data = gfx.dataset[gfx.DATA];
    gfx.dataset[2][gfx.GROUPED_FREQUENCY_COUNT] = gfx.dataset[2][gfx.GROUPED_FREQUENCY].split("1").length -1
    gfx.dataset[1][gfx.GROUPED_FREQUENCY_COUNT] = gfx.dataset[1][gfx.GROUPED_FREQUENCY].split("1").length -1;


    //calculate freq of all words;
    var freqbank = {}, freqMin = Number.POSITIVE_INFINITY, freqMax = Number.NEGATIVE_INFINITY;
    for(var s in data){
        var words = data[s];
        for(var i = 0; i < words.length;i++){
            var word = words[i], _word = word[gfx.WORD];
            if(freqbank[_word] == undefined){
                freqbank[_word] = 1;
            }else{
                freqbank[_word]++
            }
        }
    }

    for(var word in freqbank){
        var val = freqbank[word];
        if(val < freqMin) {
            freqMin = val;
        } 
        if(val > freqMax) {
            freqMax = val;
        }
         
    }

    for(var s in data){
        var words = data[s];
        for(var i = 0; i < words.length;i++){
            var word = words[i], _word = word[gfx.WORD];
            word[gfx.FREQUENCY] = freqbank[word[gfx.WORD]]
        }
    }

    gfx.dataset[2][gfx.FREQUENCY] = freqMin;
    gfx.dataset[1][gfx.FREQUENCY] = freqMax;

    var solved = {};
    for(var s in data){
        var words = data[s];
        for(var i = 0; i < words.length;i++){
            var word = words[i], gf = word[GROUPED_FREQUENCY];
            if(solved[gf] == undefined){
                var ngf = remapgfstring(gf);
                word[GROUPED_FREQUENCY] = ngf;
                solved[gf] = ngf;
            }else{
                word[GROUPED_FREQUENCY] = solved[gf];
            }
        }
    }
    
    for(var s in data){
        var words = data[s];
        for(var i = 0; i < words.length;i++){
            var word = words[i];
                word[GROUPED_FREQUENCY_COUNT] = word[GROUPED_FREQUENCY].split("1").length-1;
        }
    }


    var histogramData = [];//ask danielle about this.
    var seen = {};
    for(var s in data){
        var words = data[s]; 
        words.forEach(function(word){
            if(seen[word[gfx.WORD]] == undefined){
                seen[word[gfx.WORD]] = true;
                histogramData.push(word);
            }
        })
    }

    histogramData.sort(function(a, b){
        return a[gfx.FREQUENCY] - b[gfx.FREQUENCY]
    })


    //why u no stable
    var bank = {};
   

    var gfWords = histogramData.map(function(a, index) {
        return [a, index]
    })

    gfWords.sort(function(a, b) {
        var aFreq = a[0][gfx.FREQUENCY], 
            bFreq = b[0][gfx.FREQUENCY];
        if (aFreq === bFreq)
            return a[1] - b[1];
        return bFreq - aFreq;
    }); 

    gfWords.forEach(function(a, index){
        a[1] = index;
    })

    gfWords.sort(function(a, b) {
        var aGFString = a[0][gfx.GROUPED_FREQUENCY], 
            bGFString = b[0][gfx.GROUPED_FREQUENCY];
        if(aGFString === bGFString) return a[1] - b[1];
        if (aGFString > bGFString)
            return -1;
      return 1;
    })

    gfWords.forEach(function(a, index){
        a[1] = index;
    })
   
    gfWords.sort(function(a, b) {
        var aGFFreq = a[0][gfx.GROUPED_FREQUENCY_COUNT], 
            bGFFreq = b[0][gfx.GROUPED_FREQUENCY_COUNT];

        if (aGFFreq === bGFFreq)
            return a[1] - b[1];
        if (aGFFreq > bGFFreq)
            return -1;
      return 1;
    });

    gfWords.forEach(function(a, index){
        a[1] = index;
    })
  
  





    gfWords.forEach(function(word, index) {
        bank[word[0][gfx.WORD]] = index;
    })

    var min = Number.POSITIVE_INFINITY, max = Number.NEGATIVE_INFINITY;
    for(var s in data){
        var words = data[s]; 
        sequences[s]["words"] = words;
        var GROUPED_FREQUENCY_COUNT = gfx.GROUPED_FREQUENCY_COUNT, GROUPED_FREQUENCY = gfx.GROUPED_FREQUENCY, GROUPED_FREQUENCY_ORDER = gfx.GROUPED_FREQUENCY_ORDER;
        for(var w = 0; w < words.length;w++){
            var word = words[w];
            var gfo = bank[word[gfx.WORD]];
            word[GROUPED_FREQUENCY_ORDER] = gfo;
            if(gfo < min) min = gfo;
            if(gfo > max) max = gfo;
        }
    }

    gfx.dataset[2][GROUPED_FREQUENCY_ORDER] = min;
    gfx.dataset[1][GROUPED_FREQUENCY_ORDER] = max;

    gfx.blkH = (gfx.sceneHeight)/(1.25 * (sequences.length + 1)) //(gfx.sceneHeight - 1.25 * sequences.length) / (sequences.length + 1);
    gfx.PAD = .25 * gfx.blkH;
    gfx.dataSteps =  gfx.maxSequenceLength(sequences) / Math.floor(gfx.sceneWidth / gfx.BLKW);

    var seqlist = $(".sequencelist");
    for(var seq in sequences){
        var sequence = sequences[seq], name =  sequence[1];
        var pos = (gfx.blkH + gfx.PAD)/2 - 5 + gfx.zoomHeight + parseInt(seq) * (gfx.blkH + gfx.PAD)
        var div = $("<div id='seq_" + sequence[0] + "' class='seqtitle' style='width:100%'>" + name +"</div>").css("height", gfx.blkH + gfx.PAD).css("position", "absolute").css("top", pos );
        seqlist.append(div)
    }

    gfx.planeGeometry = new THREE.PlaneBufferGeometry(1, gfx.blkH);
    gfx.constructTextures();

    gfx.updateOrder();
    gfx.updateColor();
    gfx.updateRegions();

    gfx.histogramData = histogramData;

    gfx.updateHistogram();
    $(".working").css("display", "none");



    
}


gfx.sampleTexture = function (texture, u) {
    var image = texture.image, pixels = image.data;
    var i = u * ( (pixels.length-3)/3)
    var indexA = Math.floor(i);
    //console.log(u)@TODO handle 1 I think everything might be one pixel off. 
    if(indexA == i){
        return [pixels[i*3], pixels[i*3+1], pixels[i*3+2]];
    }else{
        var ratio = i - indexA;
        var indexB = indexA + 1;
        var colorA =  [pixels[indexA*3], pixels[indexA*3+1], pixels[indexA*3+2]];
        var colorB =  [pixels[indexB*3], pixels[indexB*3+1], pixels[indexB*3+2]];
        return [  (1-ratio) * colorA[0] + ratio * colorB[0],  (1-ratio) * colorA[1] + ratio * colorB[1], (1-ratio) * colorA[2] + ratio * colorB[2]   ];
    }
}

gfx.updateHistogram = function() {
     
    var canvas = $("#histogram-background"), ctx = canvas[0].getContext('2d');
    var width = canvas.width(), height = canvas.height();
    var data = gfx.histogramData

    ctx.save();
    ctx.clearRect(0,0,width,height)
    ctx.translate(0, height);
    ctx.scale(1, -1);


   
    //always color by membership frequency. 

    var numWords = data.length;
    var wordsPerPixel = numWords / width;


    var maxFrequency = gfx.dataset[1][gfx.FREQUENCY], 
        minFrequency = gfx.dataset[2][gfx.FREQUENCY]

    var colorBy = gfx.colorBy;
    var dynamic = colorBy == gfx.GROUPED_FREQUENCY || 
                  colorBy == 102 || 
                  colorBy == 101  ||
                  colorBy == 10;


    for(var i = 0; i < width;i++){
        var start = Math.floor(i * wordsPerPixel), 
            end = Math.min( Math.floor(i * wordsPerPixel + wordsPerPixel), data.length);

        var count = end - start;
        if(count <= 0) {
            break;
        }


        //calculate color. 
        var avgFreq = 0;
        var rampAvgs = [0, 0];
        var rampCounts = [0, 0];

        for(var n = start; n < end;n++){
            var word = data[n];
            var rampIndex = word["ramp"];

          //  if(isNaN(word["color"])) console.log("ASd")

            rampAvgs[rampIndex] += word["color"];
            rampCounts[rampIndex] ++;
            avgFreq += word[gfx.FREQUENCY];
        }

        rampAvgs[0] /= 255;
        rampAvgs[1] /= 255;

        rampAvgs[0] = (rampCounts[0] == 0)? 0 : rampAvgs[0] / rampCounts[0];
        rampAvgs[1] = (rampCounts[1] == 0)? 0 : rampAvgs[1] / rampCounts[1];
        avgFreq /= count;



        if(dynamic) {
          //  console.log(rampAvgs, rampCounts)
            var sampleA = gfx.sampleTexture(gfx.mapTexture, rampAvgs[0] );
            var sampleB = gfx.sampleTexture(gfx.rampTexture, rampAvgs[1]);
            var sampleC = interpColor(sampleA, sampleB, rampCounts[0] / count);
            ctx.strokeStyle = "rgb(" + Math.floor(sampleC[0]) + "," + Math.floor(sampleC[1]) + "," + Math.floor(sampleC[2]) + ")"
        }else{
            ctx.strokeStyle = "rgb(200,10,10)"
        }

        var h = (avgFreq - minFrequency) / maxFrequency * height;

        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.closePath();
        ctx.stroke(); 
    }
     ctx.restore();
}

gfx.histogram = function (mouseX) {//should totally cache



    var canvas = $("#histogram"), ctx = canvas[0].getContext('2d');
    var width = canvas.width(), height = canvas.height();
    var data = gfx.histogramData

    ctx.save();
    ctx.clearRect(0,0,width,height)
    ctx.translate(0, height);
    ctx.scale(1, -1);


   
    //always color by membership frequency. 

    var numWords = data.length;
    var wordsPerPixel = numWords / width;


    var maxFrequency = gfx.dataset[1][gfx.FREQUENCY], 
        minFrequency = gfx.dataset[2][gfx.FREQUENCY]

    var i = mouseX;

    var start = Math.floor(i * wordsPerPixel), 
        end = Math.min( Math.floor(i * wordsPerPixel + wordsPerPixel), data.length);

    var count = end - start;

    if(count <= 0) {
        ctx.restore();
        return null;
    }


    //calculate color. 
    var avgFreq = 0;
    var min = Number.POSITIVE_INFINITY, max = Number.NEGATIVE_INFINITY;
    for(var n = start; n < end;n++){
        var freq = data[n][gfx.FREQUENCY]
        avgFreq += freq;
        if(freq < min) min = freq;
        if(freq > max) max = freq;
    }

    avgFreq /= count;

    ctx.strokeStyle = "rgb(10,255,10)" //should use the actual picker :/

    var h = (avgFreq - minFrequency) / maxFrequency * height;

    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, h);
    ctx.closePath();
    ctx.stroke(); 

    ctx.restore();

    var str = "";
    str += "Frequency:[" + min+ "," + max + "]"
    gfx.tooltip.css('visibility', "visible").html(str);
    var words = data.slice(start, end)
    gfx.lastHistogram = words;
    return words;




    /*
    var canvas = $("#histogram"), ctx = canvas[0].getContext('2d');
    var data = gfx.histogramData
    ctx.save();
    var width = canvas.width(), height = canvas.height();
    ctx.clearRect(0,0,width,height)
    ctx.translate(0, height);
    ctx.scale(1, -1);
    var colorBy = gfx.colorBy;
    var min = gfx.dataset[2][colorBy], max = gfx.dataset[1][colorBy], minmax = max - min;

    var numWords = data.length;
    var pixelsPerWord = width / numWords;
    var wordsPerPixel = 1/ pixelsPerWord;
    if(wordsPerPixel < 1) {
        wordsPerPixel = 1;
    }
    var maxCount = gfx.dataset[1][gfx.FREQUENCY],  maxLogCount = Math.log(maxCount);

    ctx.strokeStyle="rgb(255,0,0)";
    if(mouseX != undefined){
        var mouseX = Math.floor(mouseX);

        var words = data.slice(Math.floor(mouseX * wordsPerPixel), Math.ceil(mouseX * wordsPerPixel + wordsPerPixel) );
        var avgCount = 0;
        var min = Number.POSITIVE_INFINITY, max = Number.NEGATIVE_INFINITY;
        for(var n = 0; n < words.length; n++ ){
            var count = words[n][gfx.FREQUENCY]
            avgCount += count; //don't forget to add the base
            if(count < min) min= count;
            if(count > max) max = count;
        }
        avgCount/=words.length;
        //the height of the thing
        ctx.beginPath();
        ctx.moveTo(mouseX, 0);
        ctx.lineTo(mouseX,  ( (Math.log(avgCount) / maxLogCount) * height) + 3);
        ctx.closePath();
        ctx.stroke();
        if(words.length>0){
            var str = "";
            str += "Rank:[" + words[0][gfx.RANK] + "," + words[words.length-1][gfx.RANK] + "]  <br> "
            str += "Frequency:[" + min+ "," + max + "]"
            gfx.tooltip.css('visibility', "visible").html(str);
            gfx.lastHistogram = words;
        }else{
            words = null;
        }
        

        ctx.restore();
        return words;
    }

    ctx.restore();
    return null;*/
}

gfx.updateOrder = function () {
    var dataset = gfx.data;
    var orderBy = gfx.orderBy;
    var sequence = gfx.referenceOrderSequence;
    var minOrder = gfx.dataset[2][orderBy] , maxOrder = gfx.dataset[1][orderBy];

    var gfoMin = gfx.dataset[2][gfx.GROUPED_FREQUENCY_ORDER], gfoMax = gfx.dataset[1][gfx.GROUPED_FREQUENCY_ORDER];

    $(".seqtitle").removeClass("reference-order");

    if(!gfx.referenceOrdering || gfx.referenceOrderSequence == undefined){
        gfx.virtualWidth = gfx.sceneWidth * .95;
        gfx.virtualValueWidth = gfx.virtualWidth / (maxOrder - minOrder);

        for(var s in dataset){
            var words = dataset[s];
            for(var w = 0; w < words.length;w++){
                var word = words[w];
                word["order"] = (word[orderBy] - minOrder);
            }
            if(orderBy == gfx.FREQUENCY){//special casing freq for now :/. this is really slow
                for(var w = 0; w < words.length;w++){
                    var word = words[w];
                    word["order"] = maxOrder - (word["order"] + minOrder);
                }
            }

            words.sort(function(a, b){  return a["order"] - b["order"] })
        }
    }else{
        //we are using a ref order. 
        //referenceOrderSequenceId
        $("#seq_" + gfx.referenceOrderSequenceId).addClass("reference-order");

        var order = {}, min = Number.POSITIVE_INFINITY, max = Number.NEGATIVE_INFINITY;

        //lots of overhead her :/.
        sequence.sort(function(a, b) {
            return a[orderBy] - b[orderBy];
        })

        for(var i = 0; i < sequence.length;i++){
            var item = sequence[i], value = (item[orderBy]);
            min = Math.min(min, value);
            max = Math.max(max, value);
            if( order[item[gfx.WORD]] === undefined ){
                order[item[gfx.WORD]] = value;
            }  
        }


        gfx.virtualWidth = gfx.sceneWidth * .70;
        gfx.virtualValueWidth = gfx.virtualWidth / (maxOrder - min);

        for(var s in dataset){
            var words = dataset[s];
            if(words == sequence){
                if(orderBy != gfx.FREQUENCY) {
                    for(var w = 0; w < words.length;w++){
                        var word = words[w];
                        word["order"] = (word[orderBy] - min);
                    }
                }else{
                    for(var w = 0; w < words.length;w++){
                        var word = words[w];
                        word["order"] =  (max - min) - (word[orderBy] - min);
                    }
                }
            }else{
                if(orderBy != gfx.FREQUENCY){
                     for(var w = 0;w < words.length;w++){  
                        var word = words[w], value = order[word[gfx.WORD]];
                        if(value !== undefined){
                            word["order"] = (value - min);
                        }else{
                            word["order"] = (maxOrder - min) + (maxOrder - min) * .1 + (word[gfx.GROUPED_FREQUENCY_ORDER] - gfoMin) / (gfoMax - gfoMin) * .2 * (maxOrder - min);
                        }
                    }
                }else{
                     for(var w = 0;w < words.length;w++){  
                        var word = words[w], value = order[word[gfx.WORD]];
                        if(value !== undefined){
                            word["order"] = (max - min) - (value - min);
                        }else{
                            word["order"] = (maxOrder - min) + (maxOrder - min) * .1 + (word[gfx.GROUPED_FREQUENCY_ORDER] - gfoMin) / (gfoMax - gfoMin) * .2 * (maxOrder - min);
                        }
                    }
                }
               
            }
            words.sort(function(a, b){  return a["order"] - b["order"] })
        }
    }

    var orderProp = (gfx.orderBy == gfx.GROUPED_FREQUENCY_ORDER)? "Sequence Frequency": gfx.schema[gfx.orderBy];
    var orderBy = (gfx.orderBy == gfx.GROUPED_FREQUENCY_ORDER)? gfx.FREQUENCY:gfx.orderBy;
    var str = "<p>x-axis (" +orderProp + ")</p>"
        str += "<p>"  +  words[0][orderBy] +  " - " + words[words.length-1][orderBy] + "</p>"
    $("#xaxis").html(str);

    gfx.zoomRegion = undefined;
    gfx.isZoomLocked = false;
    $("svg").find("line,rect").remove();//
    

}

gfx.updateColor = function () {
    var dataset = gfx.data;
    var colorBy = gfx.colorBy;
    var sequence = gfx.referenceColorSequence;
    var numSequences = Object.keys(gfx.sequences).length;
    var refSeqId = gfx.referenceColorSequenceId;

    $(".seqtitle").removeClass("reference-color");
    gfx.updateTextures(); //prob not the right place to put thise. :/

    // Reference color stuff == 102
    if(colorBy == 102 && gfx.referenceColorSequence === undefined){
        colorBy = gfx.RANK;
    }

    if(gfx.wordFilter.length > 0){ 
        var wordList = gfx.wordFilter;
        var wordProp = gfx.WORD;
        for(var s in dataset){//also dont loop through the already computed seq @TODO. 
            var words = dataset[s];
            for(var w = 0; w < words.length;w++){
                var word = words[w]
                var index = wordList.indexOf( word[wordProp]);
                if(  index >-1 ){
                    word["color"] = (index / wordList.length) * 255;
                    word["ramp"] = 0;
                }else{  
                    word["color"] = 0;
                    word["ramp"] = 1;
                }
               
            }
        }
    }else if(colorBy == 102){
        $("#seq_" + gfx.referenceColorSequenceId).addClass("reference-color");
        var colorBy = gfx.RANK;
        var min1 = Number.POSITIVE_INFINITY, max1 = Number.NEGATIVE_INFINITY,
            min2 = Number.POSITIVE_INFINITY, max2 = Number.NEGATIVE_INFINITY

        var color = {}


        var tmp = sequence.slice().sort(function(a, b) {
            return a[colorBy] - b[colorBy];
        })

        for(var i = 0; i < sequence.length;i++){
            var item = sequence[i], value = item[colorBy];
            if(value > max1) max1 = value;
            if(value < min1) min1 = value;
        }

        var minmax1 = max1 - min1

        for(var i = 0; i < tmp.length;i++){
            var item = tmp[i], value = item[colorBy];
            var word = item[gfx.WORD];
            if(color[word] === undefined) {
                color[word] = (value - min1) / minmax1 * 255;
            }
        }

        for(var s in dataset){//also dont loop through the already computed seq @TODO. 
            var words = dataset[s];
            for(var w = 0; w < words.length;w++){
                var word = words[w], value = word[colorBy];
                if(color[word[gfx.WORD]] === undefined){
                    if(value > max2) max2 = value;
                    if(value < min2) min2 = value;
                } 
            }
        }

        var minmax2 = max2 - min2
        for(var s in dataset){
            var words = dataset[s];
            for(var w = 0; w < words.length;w++){
                var word = words[w];
                if(color[word[gfx.WORD]] !== undefined){
                    word["color"] = color[word[gfx.WORD]]
                    word["ramp"] = 0;
                }else{
                    word["color"] = (word[colorBy] - min2) / minmax2 * 255;
                    word["ramp"] = 1;
                }
            }
        }

        var colorProp = "rank";
        var str = "<p>color ramp #1 (" + colorProp + ")</p>"
            str += "<p>"  +  min1 + " - " +  max1 + "</p>"
        $("#ramp1").html(str)

        var str = "<p>color ramp #2 (" + colorProp + ")</p>"
            str += "<p>"  +  min2 + " - " +  max2 + "</p>"
            
        $("#ramp2").html(str)
        
    // GF Color By is 101
    }else if(colorBy == 101){
        var colorBy = gfx.GROUPED_FREQUENCY_COUNT;
        var numSequences = Object.keys(gfx.sequences).length;
        var min2 = Number.POSITIVE_INFINITY, max2 = Number.NEGATIVE_INFINITY
        for(var s in dataset){
            var words = dataset[s];
            for(var w = 0; w < words.length;w++){
                var word = words[w], value = word[colorBy];
                if(word[gfx.GROUPED_FREQUENCY_COUNT] != numSequences ){
                    if(value > max2) max2 = value;
                    if(value < min2) min2 = value;
                }
            }
        }

        var minmax1 = (max1 - min1), minmax2 = (max2 - min2);
        for(var s in dataset){
            var words = dataset[s];
            for(var w = 0; w < words.length;w++){
                var word = words[w];
                if(word[gfx.GROUPED_FREQUENCY_COUNT] == numSequences){
                    word["color"] = 255;
                    word["ramp"] = 0;
                }else{
                    word["color"] = (word[colorBy] - min2 ) / minmax2 * 255;
                    word["ramp"] = 1;
                }
            }
        }

        var colorProp = "Sequence Frequency";//temp special case here. 
        var str = "<p>color ramp #1 (" + colorProp + ")</p>"
            str += "<p>"  +  numSequences + " - "+ numSequences + "</p>"
        $("#ramp1").html(str)
        var str = "<p>color ramp #2 (" + colorProp + ")</p>"
            str += "<p>"  +  min2 + " - " +  max2 + "</p>"
        $("#ramp2").html(str)

    }else{
        var min = gfx.dataset[2][colorBy], max = gfx.dataset[1][colorBy], minmax = max - min;
        for(var s in dataset){
            var words = dataset[s];
            for(var w = 0; w < words.length;w++){
                var word = words[w];
                word["color"] =  (word[colorBy] - min)/(minmax) * 255;
                word["ramp"] = 0;
            }
        }

        var colorProp = (colorBy == gfx.GROUPED_FREQUENCY_COUNT)? "Sequence Frequency": gfx.schema[colorBy];//temp special case here. 
        var str = "<p>color ramp #1 (" +colorProp + ")</p>"
            str += "<p>"  +  gfx.dataset[2][colorBy] + " - " + gfx.dataset[1][colorBy] + "</p>"
        $("#ramp1").html(str)
        $("#ramp2").html("")
    }


    if(gfx.reverseColors) {
         for(var s in dataset){ 
            var words = dataset[s];
            for(var w = 0; w < words.length;w++){
                var word = words[w]
                word["color"] = 255 - word["color"];
                word["ramp"] = (word["ramp"] == 0)? 1:0;
            }
        }
    }

}

gfx.updateRegions = function () {
    var sequences = gfx.sequences, data = gfx.data;
    var idArray = this.idArray = [];

    var scene = gfx.scene, children = scene.children;
    for(var i = children.length; i >= 0;i--){
        var child = children[i];
        scene.remove(child);
    }
    var sceneWidth = gfx.sceneWidth, stepSize = gfx.ratioStep * gfx.dataset[1][gfx.orderBy];

    for(var s = 0; s < sequences.length;s++){
        var sequence = sequences[s], local = data[s];
        var startIndex = 0, startValue = data[s][0]["order"];
        for(var w = 1; w < local.length;w++){
            var word = local[w], order = word["order"];
            if(order - startValue > stepSize){
                var words = local.slice(startIndex, w);
                if(words.length > 0){
                    var region = new gfx.Region(new gfx.LocalSeries(sequence, words));
                    region.id = idArray.length;//@TODO auto this. 
                    idArray.push(region);
                   
                }
                startIndex = w;
                startValue = order;
            }
        }

        if(startIndex < local.length){
            var words = local.slice(startIndex);
            var region = new gfx.Region(new gfx.LocalSeries(sequence, words));
                region.id = idArray.length;//@TODO auto this. 
                idArray.push(region);
        }
    }
    
   gfx.active = null;
   gfx.updateGrid();
   gfx.updateLookupMap();
   
   gfx.updateZoomMap();
   gfx.updateFilter();
}

gfx.updateGrid = function () {
    var grid = gfx.grid = new gfx.Grid(15);
    var idArray = gfx.idArray;
    for(var i = 0; i < idArray.length;i++){
       grid.insert(idArray[i].highlightArea);
    }
}


gfx.updateLookupMap = function () {
        var lookupMap = gfx.lookupMap  = {};
        var idArray = gfx.idArray, dataKey = gfx.matchBy;

        for(var i = 0; i < idArray.length;i++){
            var region = idArray[i], values = region.localSeries.lookup[dataKey];
            for(var n = 0; n < values.length;n++){
                var value = values[n];
                (lookupMap[value] == undefined)? lookupMap[value] = [region] : lookupMap[value].push(region)
            }
        }

        for(var key in lookupMap){
            var seen = {};
            lookupMap[key] = lookupMap[key].filter(function(region) {
                if(seen[region.id] == undefined){
                    seen[region.id] = true;
                    return true;
                }
                return false;
            })
        }
}

gfx.updateFilter = function () {
    var value = gfx.filter;
    var idArray = gfx.idArray
    if(value == undefined || value.length == 0 ){
        idArray.forEach(function(region) {
            region.colorMaterial.uniforms.opacity.value = 1;
        })

        gfx.zoomArray.forEach(function(region) {
            region.material.uniforms.opacity.value = 1;
        })
    }else {
        var values = value.split(",").map(function(value) { return value.trim(); });
        idArray.forEach(function(region) {
            region.colorMaterial.uniforms.opacity.value = .5;
        })

        gfx.zoomArray.forEach(function(region) {
            region.material.uniforms.opacity.value = .5;
        })
        ///*
        var index = gfx.schema.indexOf("word");
        values.forEach(function(value){
            idArray.forEach(function(region) {
                if(region.localSeries.lookup[index].indexOf(value) > -1){
                    region.colorMaterial.uniforms.opacity.value = 1;
                }
            })
            gfx.zoomArray.forEach(function(region) {
                if(region.word == value){
                    region.material.uniforms.opacity.value = 1;
                }
            })
        })//*/
    }
}

gfx.updateZoomMap = function () {
    var zoomRegion = gfx.zoomRegion;
    gfx.zoomScene = new THREE.Scene();
    var zoomMap = gfx.zoomMap = {};
    var zoomArray = gfx.zoomArray = [];
    if(zoomRegion == undefined) return;
    var localSeries = zoomRegion.localSeries;

    var numTiles = localSeries.data.length;
    var tileWidth = gfx.zoomWidth / numTiles;
    var tileHeight = gfx.zoomHeight * 40;
    var words = localSeries.data, WORD = gfx.WORD, matchBy = gfx.matchBy;
    for(var i = 0; i < words.length;i++){
        var word = words[i];
        var match = word[matchBy], weight = word["color"] / 255;
        var material = gfx.materials.zoom.clone();
            material.uniforms = {
                texture1 : { type: "t", value : gfx.mapTexture }, 
                texture2 : { type: "t", value : gfx.rampTexture }, 
                weight   : {type : "f", value :  weight},
                index    : {type : "f", value :  word["ramp"]},
                opacity  : { type : 'f', value : 1.0}
            }
                // (localSeries.lookup[gfx.colorBy][i] + min) / minmax
        var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(tileWidth, tileHeight), material );
        mesh.position.x = -gfx.zoomWidth/2 + i * tileWidth + tileWidth/2;
        (zoomMap[match] == undefined)? zoomMap[match] = [mesh] : zoomMap[match].push(mesh);
        zoomArray.push({ material : material, mesh : mesh, word : word[WORD]});
        gfx.zoomScene.add(mesh);
    }

}

gfx.updateZoomWeights = function () {//@TODO NEED TO UPDATE THIS HOLYSHIT. 
    if(gfx.zoomRegion == undefined) return;
    var array = gfx.zoomArray;
    var localSeries = gfx.zoomRegion.localSeries;
    for(var i = 0; i < array.length;i++){
        array[i].material.uniforms.weight.value = localSeries.data[i]["color"] /255;
        array[i].material.uniforms.index.value = localSeries.data[i]["ramp"]
    }  
}

gfx.highlightBySeries = function (series, dontHighlightZoom) {
    //highlight scene
    var array = series.lookup[gfx.matchBy], seen = {}, lookupMap = gfx.lookupMap;
    var seq = {};
    for(var i = array.length - 1;i > -1;i-- ){
        var key = array[i];
       if(seen[key] == undefined){
            seen[key] = true;
            var array2 = lookupMap[key];
            for(var n = array2.length - 1;n > -1;n-- ){
                array2[n].mesh.visible = true;
                seq[array2[n].localSeries.sequence[0]] = true;
            }
        }
    }

   // console.log(seq)
    for(var key in seq){
        $("#seq_" + key).addClass("bold");
    }
  
   if(gfx.zoomRegion != undefined && !dontHighlightZoom) {
        var highlight = gfx.materials.highlight;
        for(var key in seen){
            var meshes = gfx.zoomMap[key];
            if(meshes != undefined){
                for(var i = 0; i < meshes.length;i++){
                    meshes[i].material = highlight;
                }
            }
        }
   }
    
}

gfx.highlightByWord = function (word, dontHighlightZoom) {
    var matchBy = gfx.matchBy;
    var idArray = gfx.idArray, match = word[gfx.matchBy];
    var seq = {};
    for(var i = 0; i < idArray.length;i++){
        var region = idArray[i], series = region.localSeries;
        if(series.lookup[gfx.matchBy].indexOf(match) > -1) {
            region.mesh.visible = true;
            seq[series.sequence[0]] = true;
        }
    }

    for(var key in seq){
        $("#seq_" + key).addClass("bold");
    }


    if(gfx.zoomRegion != undefined && !dontHighlightZoom) {
        var array = gfx.zoomArray;
        var material = gfx.materials.highlight;
        var series = gfx.zoomRegion.localSeries;
        var lookup = series.lookup[matchBy];
        for(var i = 0; i < lookup.length;i++){
            if(lookup[i] == match){
                array[i].mesh.material = material;
            }
        }
    }

}

gfx.clearHighlights = function () {
    var children = gfx.scene.children;
    for(var i = 0; i < children.length;i++){
        children[i].visible = false;
    }

    //highlight zoomwindow
    var material = gfx.materials.zoom;
    var children = gfx.zoomArray;
    for(var i = 0; i < children.length;i++){
        var child = children[i];
        child.mesh.material = child.material;
    }
}


function worldToCanvas (worldPoint) {
    var canvasSpace = worldPoint.clone();
    canvasSpace.add(new THREE.Vector3(gfx.sceneWidth/2, gfx.sceneHeight/2))
    canvasSpace.y = gfx.sceneHeight - canvasSpace.y + gfx.zoomHeight;
    return canvasSpace
}

gfx.mark = function (word, rgb) {
   // /*
    var idArray = gfx.idArray;
    var src
    gfx.idArray.forEach(function(region){
        if(region.localSeries.lookup[0].indexOf(word) > -1){
            var canvasSpace = worldToCanvas(region.position);
            if(src !== undefined){
               // $("svg").append($("<line x1=" + 0+ " y1=" + 0+" x2=" + 100+ " y2="+100 + " style='stroke:rgb(255,0,0);stroke-width:2' />"));
            $("svg").append(makeSVG("line", {x1 : src.x, y1 : src.y, x2 : canvasSpace.x, y2 : canvasSpace.y, style : 'stroke:' + rgb + ';stroke-width:8'}));
            }
            src = canvasSpace;
        }
    })

    console.log("MARKED!");


}

//returns sequence witj
gfx.maxSequenceLength = function () {
	var sequences = gfx.sequences;
	var maxLength = 0;
	var key = gfx.SEQLENGTH;
	for(var i = 0; i < sequences.length;i++){
		var len = sequences[i][key];
		if(len > maxLength) maxLength = len;
	}
	return maxLength;
}


gfx.stringifySeries = function (localSeries) {
    var colorBy = gfx.colorBy;
    if(colorBy == 101) colorBy = gfx.GROUPED_FREQUENCY_COUNT;
    if(colorBy == 102) colorBy = gfx.RANK;

    var out = "sequence: " + localSeries.sequence[1] + "<br> ";// idk why 1.

    var colorProp = (colorBy == gfx.GROUPED_FREQUENCY_COUNT)? "Sequence Frequency": gfx.schema[colorBy];//temp special case here. 
    var orderProp = (gfx.orderBy == gfx.GROUPED_FREQUENCY_ORDER)? "Sequence Frequency": gfx.schema[gfx.orderBy];//consider doing the gfx string value instead? maybe?

    var orderBy = (gfx.orderBy == gfx.GROUPED_FREQUENCY_ORDER)? gfx.FREQUENCY:gfx.orderBy;
    var colors = localSeries.lookup[colorBy], orders = localSeries.lookup[orderBy];
    var colorMin = Math.min.apply(null, colors);
    var colorMax = Math.max.apply(null, colors);
    var orderMin = orders[0]  //Math.min.apply(null, orders);
    var orderMax = orders[orders.length-1];  
    // TODO: write out the range of x and color values included
    out += colorProp + ": " + colorMin + " to " + colorMax + "<br> " + orderProp + ": " +  orderMin + " to " + orderMax + "<br>";

    out += "Words<br>"
    var words = localSeries.lookup[gfx.WORD].slice(0, 10);
    for(var i = 0;i < words.length;i++){
        out+=words[i];
        if(i!=words.length-1){
            out+=","
        }
        if(i!= 0 && i != words.length -1 && i%3==0){
            out +="<br>"
        }
    }

    if(words.length < localSeries.lookup[gfx.WORD].length){
        out+=".....";
    }
    //do a slight 
    return out;

}

gfx.setTooltipPosition = function (tip, width, height, x, y) {
    x = Math.min(window.innerWidth - width - 20, x);
    y = Math.min(window.innerHeight - height, y);
    x = Math.max(0, x);
    y = Math.max(0, y);
    tip.css("top", y + "px").css("left", x + "px");
}

gfx.findMatches = function (wordsA, wordsB) {//assumed the sequence is in order already

   var min = wordsA[0], max = wordsA[wordsA.length-1];//assume both of are at least length 1
   var minOrder = min["order"], maxOrder = max["order"];
   
   //march till we find the start
   var start, end;
   for(var i = 0; i < wordsB.length;i++){
    if(wordsB[i]["order"] >= minOrder){
        start = i;
        break;
    }
   }

    for(var i = start; i < wordsB.length;i++){
        if(wordsB[i]["order"] <= maxOrder){
            end = i;
        }else{
            break;
        }
   }

   //now we have a start and end range in this set of words to compare against. 
   //do N^2 for now
   var matches = [];
   for(var i = 0; i < wordsA.length;i++){
        var wordA = wordsA[i];
        //find all matches for this word. (there are going to be dupes)
        for(var n = start; n <= end;n++){
            var wordB = wordsB[n];
            if(wordA["order"] == wordB["order"]){
                matches.push([wordA, wordB]);
                break;//temp breaking
                //found = true;
            }
        }
   }
   return matches;
}

gfx.updateAverages = function () {
   
    if(gfx.materials.color == gfx.materials.average){
        var now = new Date().getTime();
        var idArray = gfx.idArray;
        idArray.forEach(function(region) {
            var data = region.localSeries.data;
            var averages = [ [0, 0], [0, 0]] 
            for(var i = 0; i < data.length;i++){
                var word = data[i];
                var info = averages[word["ramp"]];
                    info[0] += word["color"];
                    info[1]++;
            }

            averages[0][0] = (averages[0][1] == 0)? 0:averages[0][0]/averages[0][1];
            averages[0][1] /= data.length;

            averages[1][0] = (averages[1][1] == 0)? 0:averages[1][0]/averages[1][1];
            averages[1][1] /= data.length;

            region.colorMaterial.uniforms.average1.value.x = averages[0][0] / 255;
            region.colorMaterial.uniforms.average1.value.y = averages[0][1];
            region.colorMaterial.uniforms.average2.value.x = averages[1][0] / 255;
            region.colorMaterial.uniforms.average2.value.y = averages[1][1];
        })

        console.log(new Date().getTime() - now);
    }
    
}


gfx.longTask = function (cb) {
    $(".working").css("display", "block");
    setTimeout(function() {
        try {
            cb();
        }catch(e){
            console.log(e);
        }
        $(".working").css("display", "none");
    }, 20);
}