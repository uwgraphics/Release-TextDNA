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

<?php

ini_set('display_errors',1);
error_reporting(E_ALL & ~E_NOTICE);

function fetchData($filename) {
			# Open the file
			$file = fopen($filename, "r");
			if ($file == false) {
				echo "alert(\"Error!\")";
				exit();
			};
			
			# Encode in JSON
			$data_arr = array();
			$mappings = array();
			$orthos = array();
			
			while (($line = fgets($file)) !== false) {
				# Unformat the sequence
				$buffer = explode(",", str_replace("\r\n", "", $line));
				
				if (count($buffer) < 4) {
					continue;
				}
				
				# Form the element entry
				$element = array("rank" => (int) $buffer[2], "count" => (float) $buffer[3]);
				
				# Track element ortholog
				if (!array_key_exists($buffer[1], $orthos))	{
					$orthos[$buffer[1]] = count($orthos); 
				}
				
				$ortho = (int) $orthos[$buffer[1]];
				
				# Fetch the sequence id
				if (!array_key_exists($buffer[0], $mappings)) {
					$seqId = count($mappings);
					$mappings[$buffer[0]] = $seqId;
					$data_arr[$seqId] = array('length' => 0, 'elements' => array());
				} else {
					$seqId = (int) $mappings[$buffer[0]];
				}
				
				# Initialize the appropriate element array
				if (!array_key_exists($ortho, $data_arr[$seqId]['elements'])) {
					$data_arr[$seqId]['elements'][$ortho] = array();
				}
				
				# Add the entry
				$data_arr[$seqId]['elements'][$ortho][] = $element;
				
				# Track the maximum length
				if ((int) $buffer[2] > $data_arr[$seqId]['length']) {
					 $data_arr[$seqId]['length'] = (int) $buffer[2];
				}
			}
			
			# Format the data as JSON
			$values = json_encode($data_arr);
			echo $values;
			echo ";\nvar orderMapping = ";
			asort($mappings, SORT_NUMERIC);
			echo json_encode(array_keys($mappings));
			
			#Close the file
			fclose($file);
}

?>