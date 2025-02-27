# TextDNA

Inspired by genome sequence alignment, TextDNA allows users to explore and analyze word usage across text collections of varying scale. This download comes with Python 2.7 scripts for users to curate their own TextDNA datasets from ASCII and pure UTF-8 plain text files. Explore live TextDNA datasets at the [website](http://graphics.cs.wisc.edu/Vis/SequenceSurveyor/TextDNA.html).

TextDNA was made possible by support from the Andrew W. Mellon Foundation grant for the Visualizing English Project and the National Science Foundation Comparisons award (NSF Award IIS-1162037). TextDNA is released under a BSD license.

Read more about TextDNA: D.A. Szafir, D. Stuffer, Y. Sohail, & M. Gleicher. “TextDNA: Visualizing Word Usage Patterns with Configurable Colorfields.” *Computer Graphics Forum.* 35 (3), 2016. (In the Proceedings of the 2016 Eurographics/IEEE Conference on Visualization) [PDF](http://graphics.cs.wisc.edu/Papers/2016/ASSG16/TextDNA.pdf)

**Program Requirements:** Chrome, and Python 2.7, and [XAMPP](http://sourceforge.net/projects/xampp/). Will run slowly on systems without dedicated graphics cards.

Setup
-----
1. Download and install XAMPP, a free virtual environment that runs an Apache server on your local machine.
2. When XAMPP is successfully installed, download TextDNA and put it in the htdocs folder of the XAMPP installation. This step allows TextDNA to run on the server, which will let you interact with your datasets through a browser.

Running TextDNA
--------------
1. Launch the XAMPP control panel and start the Apache server.
2. Open your chrome browser and enter the path to the TextDNA html viewer file within htdocs
  * http://localhost/Release-TextDNA/app/templates/list.html
3. Select the dataset you wish to view.
4. When you are finished with TextDNA, exit the browser and stop the server through the XAMPP control panel.

Generating Datasets
-------------------
Visualizing English Print provides two Python scripts to generate datasets from ASCII or pure UTF-8 plain text files.

**textDNACSVGenerator.py:** This python script reads in plain text files and generates a CSV dataset of their contents in the Release-TextDNA/data/csv/ folder of the TextDNA download. The script is flexible and has settings to generate either raw text or n-gram datasets. By default, the script takes a folder of plain text files and yields a data sequence per text file. There is a flag (--folder_sequences) that treats subfolders as sequences rather than single text files. For example, one can sort texts into folders by decades and have the script generate n-grams per decade by treating each subfolder as an entire data sequence.

*usage:* textDNACSVGenerator.py corpus_path output_dir &lt;mode&gt;

positional arguments
 * corpus_path: path to corpus to tag relative to the location of this script
 * output_dir: path to output folder relative to the location of this script
 * mode: flag for indicating whether the dataset will be ngram or raw text (options: ngram OR word_sequence)

optional arguments
 * --folder_sequences: treats named subfolders rather than individual text files as sequences
 * -h, --help: shows a help message about how to use the script and exit

The TextDNA download comes with sample datasets, and it has an output directory for your CSVs provided at Release-TextDNA/data/csvs.

CSVs take the name of the directory that contains the text files and indicate whether the dataset is n-gram or raw text (e.g., Shakespeare_Globe_word_sequence).

*Example Windows Commands*
 * python textDNACSVGenerator.py C:\LocalUsers\stuffer\textcorpora\Shakespeare_Globe data\csv word_sequence
 * python textDNACSVGenerator.py C:\LocalUsers\stuffer\textcorpora\Early_Modern_Plays data\csv ngram --folder_sequences

*Example Unix/Linux Commands*
 * python textDNACSVGenerator.py /c/LocalUsers/stuffer/textcorpora/Shakespeare_Globe/ data/csv/ word_sequence
 * python textDNACSVGenerator.py /c/LocalUsers/stuffer/textcorpora/EarlyModernPlays/ data/csv/ ngram --folder_sequences

**buildDataset.py:** This script takes formatted CSVs of sequence data and generates a JSON database file in Release-TextDNA/data/json folder. Then the script modifies Release-TextDNA/app/templates/list.html to link to the dataset.

*usage:* buildDataset.py csv_path

positional argument
 * --csv_path: path to the CSV file relative to the location of this script

*Example Windows Command*
 * python buildDataset.py data\csv\Shakespeare_Globe_word_sequence.csv

*Example Unix/Linux Command*
 * python buildDataset.py data/csv/Shakespeare_Globe_word_sequence.csv

Sample Datasets
---------------
VEP includes 6 sample datasets with this TextDNA download.

1. Simple Test Dataset
2. Shakespeare Folio (N-Grams)
3. Shakespeare Folio (Raw Text)
4. Top 200 Google N-Grams (1660-2009)
5. Top 1,000 Google N-Grams (1660-2009)
6. Top 5,000 Google N-Grams (1660-2009)

Read more about the datasets from the [TextDNA project site](http://graphics.cs.wisc.edu/Vis/SequenceSurveyor/TextDNA.html).

Credit
------
Credit for TextDNA belongs to Danielle Albers Szafir, who originally developed the program and website documentation under the guidance of Michael Gleicher and Robin Valenza. The TextDNA user interface was further developed by Yusef Sohail under the direction of Szafir. The two fine-tuned the system for raw text in consultation with Deidre Stuffer, who provided documentation for raw text manipulation and generated the test dataset with documentation to help users learn TextDNA functions. Erin Winter provided scripts to generate csv datasets from plaintext input for the public release.

Contact
-------
Danielle Albers Szafir
danielle.szafir@colorado.edu