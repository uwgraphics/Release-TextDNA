import csv
import json

with open('ShakeSpeareTextDNA.csv', 'rb') as csvfile:
    reader = csv.reader(csvfile)
    dataset = []
    for row in reader:
        dataset.append(row)
        print row

with open('testTextDNA3.json', 'w') as outfile:
    json.dump(dataset, outfile)
    