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