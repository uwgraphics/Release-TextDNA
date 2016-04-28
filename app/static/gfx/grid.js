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