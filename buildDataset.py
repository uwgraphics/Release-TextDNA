### Python code to do data processing and management
import csv
import sqlite3
import datetime
import json
import sys
import os

csv_path = sys.argv[1]

# check to verify csv_path is to a file
if not os.path.isfile(os.path.abspath(csv_path)):
	print "Path ", csv_path, "not valid. Usage: {0} [csv_path]".format(__file__)
	sys.exit(0)


defaults = ["sequence", "word", "rank", "frequency", "groupedFrequency"]

lastHeader = None

# Aggregate function to create a list of sequences
class ListSeqs:
    def __init__(self):
        self.seqs = []
        
    def step(self, value):
        self.seqs.append(value)
        
    def finalize(self):
        return self.seqs
    

# Rearrange data entry to conform to the expected order
def rearrange(row, seqId, header):
    datapoint = (row[header.index('word')].strip(), seqId, row[header.index('rank')], 0, "")
    for i in range(0, len(header)):
        if not header[i] in defaults:
            datapoint += (row[i], )
    return datapoint


# Parse a formatted N-Gram file
def parseNgramFile(csvfile):
    header = []
    seqs = []
    data =[]
    seqIdx = 0
    
    db = sqlite3.connect(csvfile.name + ".db")
    db.create_aggregate("listseqs", 1, ListSeqs)
    c = db.cursor()
    
    reader = csv.reader(csvfile, delimiter=',')
    for row in reader:
        if len(header) == 0:
            # Fetch the header
            header = map(str.strip, row)
            seqIdx = row.index('sequence')
            
            # Add any missing elements to the word database
            c.execute("DROP TABLE IF EXISTS sequences")
            c.execute("DROP TABLE IF EXISTS words")
            c.execute("CREATE TABLE IF NOT EXISTS sequences (id INTEGER PRIMARY KEY, seqName STRING, seqOrder INTEGER)")
            createWordTable = "CREATE TABLE IF NOT EXISTS words (word STRING, seqId INTEGER, rank INTEGER, frequency INTEGER, groupedFrequency STRING"
            for trait in header:
                if not (trait.strip() in defaults):
                    key = trait.split(" ")
                    createWordTable += ", " + " ".join(key[1:]) + " " + key[0]
                    print "trait is " + trait
            createWordTable += ");"
            
            c.execute(createWordTable)            
            c.execute('''CREATE INDEX IF NOT EXISTS idx1 on words(word)''') 
            c.execute('''CREATE INDEX IF NOT EXISTS idx2 on words(seqId)''')
            
            db.commit()
            
        else:
            if not row[seqIdx].strip() in seqs:
                c.execute("INSERT INTO sequences VALUES (?,?,?)", (str(len(seqs)), row[seqIdx].strip(), str(len(seqs))))
                seqs.append(row[seqIdx].strip())
            
            # Create the value tuple
            data.append(rearrange(row, seqs.index(row[seqIdx]), header))
            
    # Batch insert
    queryString = "(" + ("?, " * (len(row) + 2))[0:-2] + ")"
    c.executemany('INSERT INTO words VALUES ' + queryString, data)
    
    # Darive the secondary params
    c.execute("SELECT word, group_concat(seqId) FROM words GROUP BY word")
    for word in c.fetchall():
        gf = "0" * len(seqs)
        for s in str.split(str(word[1]), ','):
            idx = int(s)
            gf = gf[:idx] + gf[idx:idx+1].replace('0', '1') + gf[idx+1:]
        frequency = gf.count('1')
        c.execute("UPDATE words SET frequency=?, groupedFrequency=? WHERE word=?", (frequency, "'"+gf+"'", word[0]))
    
    db.commit()
    db.close()
    return (header, seqs)
   

# Build the secondary data
def composeSecondaryData(csvfile, numSeqs):
    # Compute the grouped frequency lists
    db = sqlite3.connect(csvfile.name + ".db")
    c = db.cursor()
    c.execute("SELECT word, group_concat(seqId) FROM words GROUP BY word")
    
    # Derive the frequencies
    for word in c.fetchall():
        gf = "0" * numSeqs
        for s in str.split(str(word[1]), ','):
            idx = int(s)
            gf = gf[:idx] + gf[idx:idx+1].replace('0', '1') + gf[idx+1:]
        frequency = gf.count('1')
        c.execute("UPDATE words SET frequency=?, groupedFrequency=? WHERE word=?", (frequency, "'"+gf+"'", word[0]))
    
    # Push updates to the table
    db.commit()
    db.close()
    
# Pull down data from the database
def fetchDataForDisplay(csvfile, header, orderBy):
    db = sqlite3.connect(csvfile.name + ".db")
    c = db.cursor()
    c.execute("SELECT * FROM words JOIN sequences WHERE words.seqId = sequences.id ORDER BY " + "rank" + " ASC")   #no idea if this works. shrug. 
    tempData = c.fetchall()
    data = {}
    for d in tempData:
        if not (d[-3] in data):
            data[d[-3]] = []
        data[d[-3]].append(list(d))
    c.execute("SELECT id, seqName, seqOrder, COUNT(word) as length FROM sequences, words WHERE id = seqId GROUP BY id ORDER BY id ")
    seqs = c.fetchall()
    
    # Determine the local extrema
    maxs = []
    mins = []
    for i in header:
        key = str.split(i, " ")[-1]
        print i
        try: 
            c.execute("SELECT MAX("+key+"), MIN("+key+") FROM words")
            extrema = c.fetchall()
            maxs.append(extrema[0][0])
            mins.append(extrema[0][1])
        except sqlite3.Error as e:
            print "failed on " + key
            maxs.append(0)
            mins.append(0)
    #seqCounts = c.fetchall()
    db.close()
    return [maxs, mins, seqs, data]

# Update the header to reflect the database schema
def generateSchema(header):
    baseHeader = ["STRING word", "INT seqId", "INT rank", "INT frequency", "STRING groupedFrequency"]
    modHeader = header[:]
    for column in defaults:
        if column in modHeader:
            modHeader.remove(column)
    baseHeader.extend(modHeader)
    baseHeader.extend(["INT seqId", "STRING seqName", "INT seqOrder"])
    return baseHeader
    
# Construct dataset -- takes in a file pointer, outputs a JSON dataset sorted according to the default params
def build(fileptr):  
    # Parse data from file
    startTime = datetime.datetime.now();
    if (fileptr.name[-3:] == "zip"):
        (header, seqs) = parseTextFile(fileptr)
    else:
        (header, seqs) = parseNgramFile(fileptr)
        
    print("parsed file in " + str(datetime.datetime.now() - startTime))
    startTime = datetime.datetime.now()
    
    # Add supplemental frequency data
    #rawData = composeSecondaryData(len(seqs))
    dataset = [generateSchema(header)]
    dataset.extend(fetchDataForDisplay(fileptr, dataset[0], "rank"))
    print "formatted data in " + str(datetime.datetime.now() - startTime)
    
    # Return the JSONified dataset
    fname = "app/static/json/"+fileptr.name[len(os.path.abspath(__file__))-2:fileptr.name.rindex(".")] + ".json"
    with open(fname, 'w') as outfile:
        json.dump(dataset, outfile)
        
    # Put the dataset in the list (referenced by the filename)
    updateList(fileptr.name[len(os.path.abspath(__file__))-2:fileptr.name.rindex(".")]);
    
def updateList(fname):
    flag = "<ul>My Data:</ul>"
    with open("app/templates/list.html", "r") as f:
        lines = f.readlines();
        print lines
        f.close()
        
        # Find the right line
        for idx in range(0, len(lines)):
            l = lines[idx]
            if (l.strip()==flag):
                lines.insert(idx+1, "<ul><a href=\"viewer.html?file=" + fname + "\">" + fname + "</a></ul>\n")
                break
        
        # Write the updated file
        f = open("app/templates/list.html", "w")
        lines = "".join(lines)
        f.write(lines)
        f.close()
    



def buildClientData(orderBy):
    startTime = datetime.datetime.now();
    dataset = [generateSchema(['sequence', 'word', 'rank', 'INTEGER count'])]
    dataset.extend(fetchDataForDisplay(dataset[0], orderBy))
    return { "data" : dataset}
	
build(open(os.path.abspath(csv_path)))

"""
function processCSV(data) {
	// First line is the labeling
	var properties = trimArray(data[0].split(","));
	buildPropertyArray(properties);
	
	var datatypes = trimArray(data[1].split(","));
	buildDropdowns(properties, datatypes);
	
	sequences = {};
	// TODO: Allow for flexible keying
	var seqIdx = properties.indexOf("sequence");
	
	// Build the sequence data into an associative array, keyed on sequence name, containing an array of data objects keyed on each property
	for (var s = 2; s < data.length; s++) {
		var dataArr = trimArray(data[s].split(","));
		
		if (sequences[dataArr[seqIdx]] == undefined) {
			sequences[dataArr[seqIdx]] = {"data":[]};
			numSeqs++;
		}
		
		var element = {};
		
		for (var d = 0; d < dataArr.length; d++){
			element[properties[d]] = cast(dataArr[d], datatypes[d]);
			if (properties[d] == "count") {
				element[properties[d]] = Math.log(element[properties[d]]);
			}
			checkBounds(element[properties[d]], properties[d]);
		}
		
		sequences[dataArr[seqIdx]].data.push(element);
	}
	
	computeGF();
}

function cast(element, datatype) {
	if (datatype == DATATYPE.INTEGER.name)
		return parseInt(element);
	else if (datatype == DATATYPE.NUMBER.name)
		return parseFloat(element);
	else
		return element;
}
function checkBounds(data, prop) {
	if (propertyBounds[prop].length == 0) {
		propertyBounds[prop] = [data, data];
	} else if (data < propertyBounds[prop][MIN]) {
		propertyBounds[prop][MIN] = data;
	} else if (data > propertyBounds[prop][MAX]) {
		propertyBounds[prop][MAX] = data;
	}
}

function normalize(data, prop) {
	return (data - propertyBounds[prop][MIN]) / (propertyBounds[prop][MAX]-propertyBounds[prop][MIN]);
}

// Sort the elements and return new objects with x, y (set to 0), and c computed
var layoutElements = function(data, w, h, xProp, cProp, blkW) {
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
};

// Compute the Y value for a given sequence element
var computeY = function(h, seqId, sequenceMapping, sequenceOrder) {
	var hStep = h / (1.5 * sequenceMapping.length);
	return h * 1.5 * sequenceOrder[[sequenceMapping[seqId]]];
};
"""