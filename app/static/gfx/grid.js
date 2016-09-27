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