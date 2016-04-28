
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