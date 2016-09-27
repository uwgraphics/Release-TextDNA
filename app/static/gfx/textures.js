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