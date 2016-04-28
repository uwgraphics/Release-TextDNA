var DATATYPE = {
	STRING: {name: "STRING"},
	NUMBER: {name: "FLOAT"},
	INTEGER: {name: "INT"}
	};
	
var COLORMAP = {
	BLUE_YELLOW: {name: "Blue-Yellow", values: [[255, 255, 217], [237, 248, 177], [199, 233, 180], [127, 205, 187], [65, 182, 196], [29, 145, 192], [34, 94, 168], [12, 44, 132]], highlight: "red"},
	RED_BLUE: {name: "Red-Blue", values: [[165,0,38],[215,48,39],[244,109,67],[253,174,97],[254,224,144],[255,255,191],[224,243,248],[171,217,233],[116,173,209],[69,117,180],[49,54,149]], highlight: "limegreen"}, 
	PURPLE_ORANGE: {name: "Purple-Orange", values: [[127,59,8],[179,88,6],[224,130,20],[253,184,99],[254,224,182],[247,247,247],[216,218,235],[178,171,210],[128,115,172],[84,39,136],[45,0,75]], highlight: "limegreen"}
};

var EXCLUSIONS = ["seqId", "seqName", "seqOrder"];
	
//var sequences = {};
var numSeqs = 0;
var propertyBounds = {};
var MIN = 0;
var MAX = 1;

var refTable;

function maxSeq(series) {
	var maxLength = 0;
	numSeqs = 0;
	for (var i in series) {
		if (series[i].data.length > maxLength)
			maxLength = series[i].data.length;
		numSeqs++;
	}
	return maxLength;
}


function stringify(dataArr) {
	var out = "sequence: " + dataArr.data[0][dataschema.indexOf("seqName")] + ", ";
   // console.log(orderProp, dataschema[orderProp]);
	var colorRange = [Number.MAX_VALUE, Number.MIN_VALUE];
	var orderRange = [Number.MAX_VALUE, Number.MIN_VALUE];	
    var words = []
	for (var i = 0; i < dataArr.data.length; i++) {
		if (dataArr.data[i][colorProp] < colorRange[MIN])
			colorRange[MIN] = dataArr.data[i][colorProp];
		if (dataArr.data[i][colorProp] > colorRange[MAX])
			colorRange[MAX] = dataArr.data[i][colorProp];
		if (dataArr.data[i][orderProp] < orderRange[MIN])
			orderRange[MIN] = dataArr.data[i][orderProp];
		if (dataArr.data[i][orderProp] > orderRange[MAX])
			orderRange[MAX] = dataArr.data[i][orderProp];
        words.push(dataArr.data[i][dataschema.indexOf("word")]);
	}
	
	// TODO: write out the range of x and color values included
	out += colorProp + ": " + colorRange[MIN] + " to " + colorRange[MAX] + ", " + orderProp + ": " +  orderRange[MIN] + " to " + orderRange[MAX];
    $("#words").html("<b>Words:</b><br/> " + words.join("<br/>"));
	return out;
}


function stringifyLocalSeries(localSeries) {
	var out = "sequence: " + localSeries[0][dataschema.indexOf("seqName")] + ", ";
   // console.log(orderProp, dataschema[orderProp]);
	var colorRange = [Number.MAX_VALUE, Number.MIN_VALUE];
	var orderRange = [Number.MAX_VALUE, Number.MIN_VALUE];	
	for (var i = 0; i < localSeries.length; i++) {
		if (localSeries[i][colorProp] < colorRange[MIN])
			colorRange[MIN] = localSeries[i][colorProp];
		if (localSeries[i][colorProp] > colorRange[MAX])
			colorRange[MAX] = localSeries[i][colorProp];
		if (localSeries[i][orderProp] < orderRange[MIN])
			orderRange[MIN] = localSeries[i][orderProp];
		if (localSeries[i][orderProp] > orderRange[MAX])
			orderRange[MAX] = localSeries[i][orderProp];
	}
	// TODO: write out the range of x and color values included
	out += colorProp + ": " + colorRange[MIN] + " to " + colorRange[MAX] + ", " + orderProp + ": " +  orderRange[MIN] + " to " + orderRange[MAX];
	return out;

}


// Debug function to create random data series
function constructRandomDataSeries(numSeries, seriesLength) {
	var data = new Array();
	for (var i = 0; i < numSeries; i++) {
		data.push(new Array());
		for (var j = 0; j < seriesLength; j++) {
			data[i].push({	name: "element " + i,
							element: i + j, 
							rank: j, 
							count: Math.random()
			});
		}
	}
	return data;
}

function buildGUI(dataschema) {
	// TODO: Also construct the min/max array
	buildDropdowns(dataschema);
}

function cast(element, datatype) {
	if (datatype == DATATYPE.INTEGER.name)
		return parseInt(element);
	else if (datatype == DATATYPE.NUMBER.name)
		return parseFloat(element);
	else
		return element;
}

function buildPropertyArray(properties) {
	propertyBounds = {};
	for (var i = 0; i < properties.length; i++) {
		propertyBounds[properties[i]] = [];	
	}
}

function buildDropdowns(properties) {
  //  console.log("properties " + properties);
	for (var i = 0; i < properties.length; i++){
        var propStr = properties[i].split(" ");
        var prop = propStr.slice(1).join(" ");
        if (EXCLUSIONS.indexOf(prop)>-1)
            continue;
        var datatype = propStr[0];
		$("#datakey").append(new Option(prop, prop));
		if (datatype != DATATYPE.STRING.name) {
			$("#order").append(new Option(prop, prop));
			$("#color").append(new Option(prop, prop));
		}
	}
}

// Create the bounds dictionary with the maxes and mins for each property
function buildDatabounds(dataschema, maxs, mins) {
    var boundsDict = {};
    for (var i = 0; i < dataschema.length; i++) {
        var key = dataschema[i].split(" ");
        boundsDict[key.slice(1).join(" ")] = [mins[i], maxs[i]];
    }
        
    return boundsDict;
}

