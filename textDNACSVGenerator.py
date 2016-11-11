#Copyright (c) 2016, Danielle Albers Szafir, Deidre Stuffer, Yusef Sohail, & Michael Gleicher
#All rights reserved.
#
#Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
#
#1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
#
#2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
#
#THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

import argparse
import os
from collections import defaultdict
from operator import itemgetter
import csv
import math
from utilities.RegexTokenizer import RegexTokenizer


__author__ = 'wintere'



parser = argparse.ArgumentParser(description='textDNAGenerator <corpus_path (folder of texts OR folder of folders of texts)> <output_dir> <mode> (ngram or word_sequence)')
parser.add_argument('corpus_path', help='path to corpus to tag relative to the location of this script')
parser.add_argument('output_dir', help='path to output folder relative to the location of this script')
parser.add_argument('mode', help='flag for indicating whether the dataset is n-gram or raw text (options: ngram OR word_sequence')
parser.add_argument('--folder_sequences', help='treats named subfolders rather than individual text files as sequences. for use with ngram mode ONLY.', action="store_true")


# outputs a CSV to be fed into textDNA as input
# takes in a folder of plain text files or a folder of folders of plain text files (one subfolder per sequence)
def textDNA(args):
    corpus_path = args.corpus_path
    if not os.path.exists(corpus_path):
        raise ValueError("Invalid input corpus input path.", corpus_path, "does not exist on disk.")
    mode = args.mode
    output_dir = args.output_dir
    if not os.path.exists(output_dir):
        os.mkdir(output_dir)
    if mode != 'ngram' and mode != 'word_sequence':
        raise ValueError("Invalid mode. Please chose either ngram or word_sequence.")
    bad_files = []
    name = os.path.basename(corpus_path)

    # make output directory
    if not os.path.exists(args.output_dir):
        os.mkdir(args.output_dir)

    #initialize CSV
    path = os.path.join(output_dir, name + '_textDNA_' + mode + '.csv')
    f = open(path, 'w')
    w = csv.writer(f, delimiter=',', quoting=csv.QUOTE_MINIMAL, lineterminator='\n')
    if mode == 'ngram':
        w.writerow(
            ["sequence", "word", "rank", "INTEGER Count", "INTEGER Document Frequency", "FLOAT TFIDF", "FLOAT LogTFIDF"])
    elif mode == 'word_sequence':
        w.writerow(
            ["sequence", "word", "rank", "INTEGER Count"])
    # initialize tokenizer
    tokenizer = RegexTokenizer()


    if args.folder_sequences:
        if mode == "word_sequence":
            raise ValueError("Directory sequences are not compatible with sequences ranked by word.")
        else:
            for dirpath, subdirs, files in os.walk(corpus_path):
                for dir in subdirs:
                    sequenceNgramCounts = defaultdict(int)
                    sequenceDocumentCounts = defaultdict(int)
                    sequenceName = os.path.basename(dir)
                    print("Loading sequence " + sequenceName)
                    for file in os.listdir(os.path.join(dirpath, dir)):
                        if '.txt' in file:
                            f_path = os.path.join(dirpath, dir, file)
                            try:
                                tokens = tokenizeText(f_path, tokenizer)
                                # process out punctuation
                                tokens = ngramProcess(tokens)
                                # update corpus dictionaries
                                ngramUpdate(tokens, sequenceDocumentCounts, sequenceNgramCounts)
                            except NotImplementedError:
                                    bad_files.append(f_path)
                    ngramFormat(corpusNgramCounts=sequenceNgramCounts, documentNgramCounts=sequenceDocumentCounts, name=sequenceName, csvwriter=w)
    else:
        if mode == "ngram":
            print("Loading sequence " + os.path.basename(corpus_path))
        for dirpath, subdirs, files in os.walk(corpus_path):
            for file in files:
                if '.txt' in file:
                    filepath = os.path.join(dirpath, file)
                    try:
                        docCounts = defaultdict(int)
                        seqCounts = defaultdict(int)
                        tokens = tokenizeText(filepath, tokenizer)
                        #process out punctuation
                        tokens = ngramProcess(tokens)
                        # update corpus dictionaries
                        ngramUpdate(tokens, docCounts, seqCounts)
                        if mode == "word_sequence":
                            print("Loading sequence " + os.path.basename(filepath))
                            wordSeqFormat(tokens, docCounts, output_dir, os.path.basename(filepath), w)
                        if mode == "ngram":
                            ngramFormat(documentNgramCounts=docCounts, corpusNgramCounts=seqCounts,
                                        name=os.path.basename(filepath), csvwriter=w)
                    except NotImplementedError:
                        bad_files.append(filepath)

    print("Completed textDNA processing of corpus " + os.path.basename(corpus_path))
    if bad_files != []:
        print("Unable to ngram the following files" + str(bad_files))
    f.close()


# adds one sequence's worth of ngrams
# if done on a per-file basis
def ngramFormat(corpusNgramCounts, documentNgramCounts,name, csvwriter):
    rank = 0
    #get 1-gram tuples sorted alphabetically
    onegram_tups = []
    for key in sorted(corpusNgramCounts):
        df = documentNgramCounts[key]
        onegram_tups.append((key, corpusNgramCounts[key], df))
    #sort by, descending frequency, descending doc count, break ties alphabetically first
    descending_ranks = sorted(onegram_tups, key=itemgetter(1,2), reverse=True)
    for tup in descending_ranks:
        key = tup[0]
        value = tup[1]
        df = tup[2]
        idf = float(value) / df
        logidf = math.log10(float(idf))
        csvwriter.writerow([name,key,rank,value,df,idf,logidf])
        rank += 1

def wordSeqFormat(tokens, doccounts, output_dir, name, cwriter):
    rank = 0
    for token in tokens:
        cwriter.writerow([name, token, rank, doccounts[token]])
        rank += 1




# updates corpus wide dictionaries to reflect ngram counts from a document given a list of tokens
#  and returns the document l
def ngramUpdate(tokens, documentNgramCounts, corpusNgramCounts):
    doc_grams = defaultdict(int)
    for token in tokens:
        corpusNgramCounts[token] +=1
        doc_grams[token] += 1
    for key in doc_grams.keys():
        documentNgramCounts[key] += 1
    return doc_grams

# given a text path, reads in and tokenizes the given text
# returns a list of tokens
def tokenizeText(text_path, tokenizer):
    if not os.path.exists(text_path):
        raise ValueError("Text file '%s' does not exist." % text_path)
    text_contents = None
    text_file = None
    try:
        text_file = open(text_path, "r")
        text_contents = text_file.read()
    except UnicodeDecodeError:
        pass
    finally:
        if text_file is not None:
            text_file.close()
    if text_contents is None:
        raise NotImplementedError("Unable to decode input file %s" % text_path)

    # returns a list of tokens
    tokens = tokenizer.tokenize(text_contents)
    return tokens

# adapted from Ubiqu tasks for one grams
def ngramProcess(tokens):
    token_list = []
    for token in tokens:
        if token[RegexTokenizer.INDEXES["TYPE"]] == RegexTokenizer.TYPES["WORD"]:
            tokenString = token[RegexTokenizer.INDEXES["STRS"]][0]
            token_list.append(tokenString.lower()) #makes ngrams not case-sensitive
    return token_list

if __name__ == '__main__':
    args = parser.parse_args()
    textDNA(args)
