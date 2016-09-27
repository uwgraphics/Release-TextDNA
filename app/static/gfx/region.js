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
