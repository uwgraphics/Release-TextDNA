
gfx.LocalSeries = function (sequence, data) {
	this.sequence = sequence;
	this.data = data;

	var aux = [];
	for(var i = 0; i < data[0].length;i++){
		aux.push([]);
	}

	for(var n = 0; n < data[0].length;n++){
		if(data[0][n]!==undefined){
			for(var i = 0; i < data.length;i++){
				aux[n][i] = data[i][n];
			}
		}
	}

	this.lookup = aux;

}