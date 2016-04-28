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
