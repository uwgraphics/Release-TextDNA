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

    gfx.blkH = (gfx.sceneHeight - gfx.PAD * sequences.length) / (sequences.length + 1);
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
            $("svg").append(makeSVG("line", {x1 : src.x, y1 : src.y, x2 : canvasSpace.x, y2 : canvasSpace.y, style : 'stroke:' + rgb + ';stroke-width:2'}));
            }
            src = canvasSpace;
        }
    })

    console.log("MARKED");


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