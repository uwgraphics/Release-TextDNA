
// Compute the Y value for a given sequence element
var computeY = function(h, seqId, sequenceMapping, sequenceOrder) {
	var hStep = h / (1.5 * sequenceMapping.length);
	return h * 1.5 * sequenceOrder[[sequenceMapping[seqId]]];
};

function trimArray(arr) {
	for (var i = 0; i < arr.length; i++) 
		arr[i] = arr[i].trim();
	return arr;
}

function buildSchema(arr) {
    var ret = [];
    for (var a in arr) {
        ret.push(arr[a].split(" ").slice(1).join(" "));
    }
    
    return ret;
}

function normalizeData(value, prop) {
    return (value - databounds[dataschema[prop]][MIN]) / (databounds[dataschema[prop]][MAX] + databounds[dataschema[prop]][MIN]);
}

/*function updateKeys(key) {
	console.log("updateKeys called!");
	
	// Update classes
	var rects = d3.select("body").select("svg").selectAll("rect")
	.each(function (d) {
			var classes = {};
			for (var i = 0; i < d.data.length; i++) {
				var key = d.data[i][dataKey].split("'").join("_");
				classes[key] = true;
			}
			d3.select(this).attr("class", "glyph");
			d3.select(this).classed(classes); 
		});
}*/

/*function createKeys(gfKeys) {
	var keySet = {};
	var keys = [];
	for (var key in gfKeys){
		if (keys.indexOf(gfKeys[key]) == -1)
			keys.push(gfKeys[key]);	
	}
	console.log(keys.length + " keys");
	keys.sort(function(a, b){// Sort primarily on frequency
		var aFreq = a.split("1").length;
		var bFreq = b.split("1").length;
		if (aFreq != bFreq)
			return aFreq > bFreq;
		else 
			// Sort secondarily on string
			return a > b;
	});
	for (var i = 0; i < keys.length; i++)
		keySet[keys[i]] = i;
	return keySet
}*/


// Sort the elements and return new objects with x, y (set to 0), and c computed
/*var layoutElements = function(data, w, h, xProp, cProp, blkW) {
	// For now, just return rank and count 
	var blkGap = 5;
	var layout = new Array();
	var maxC = new Array();
	var maxX = new Array();
	
	// Strip out the ranks
	for (var i = 0; i < data.length; i++) {
		layout[i] = new Array();
		maxC[i] = 0;
		maxX[i] = 0;
		for (var ortho in data[i]) {
			var obj = data[i][ortho];
			layout[i].push({'ortho': ortho, 'x': obj.rank, 'c': obj.count});
			
			// Track the normalization terms
			if (obj.count > maxC[i]) {
				maxC[i] = obj.count;
			}
			if (obj.rank > maxX[i]) {
				maxC[i] = obj.rank;
			}
		}
		
		// Sort on the X parameter	
		layout[i].sort(function(a, b) {return a.x - b.x});
	}
	
	// Normalize the resulting values
	for (var i = 0; i < data.length; i++) {
		layout[i].map(function(x) {return {'x': (w / maxX[i]) * x.x, 'c': x.c / maxC[i], 'y': i}});	
		
		// Break things into blocks
		var curLayout = layout[i].slice(0);
		layout[i] = new Array();
		var cutOff = 0;
		var temp = new Array();
		for (var j = 0; j < curLayout.length - 1; j++) {
			temp.push(curLayout[j]);
			if (curLayout[j] - curLayout[j + 1] < blkGap && curLayout[j] - cutOff < blkW) {
				layout[i].push(temp);
				temp = new Array();
				
			}
		}
	}
	
	return layout;
};*/
