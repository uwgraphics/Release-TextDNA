/*#Copyright (c) 2016, Danielle Albers Szafir, Deidre Stuffer, Yusef Sohail, & Michael Gleicher
#All rights reserved.
#
#Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
#
#1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
#
#2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
#
#THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/

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
