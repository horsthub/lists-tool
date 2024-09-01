"use strict";

var HelpStatusActive = false;

function showHelp(helpType) {
	var w = window.innerWidth;
    var h = window.innerHeight;
	var shadowHtml = '<a href="javascript:closeHelp()" class="HelpShadow" style="width: ' + w + 'px; height: ' + h + 'px;"></a>';
	var tableStart = '<table class="b1b"><tr><td> &nbsp; &nbsp; </td><td>'
	var tableEnd = '</td><td> &nbsp; &nbsp; </td></tr></table>'
	var closeButton = '<div style="text-align: right;"> <a href="javascript:closeHelp()" style="text-decoration: none"> &nbsp; &nbsp; &nbsp; x &nbsp; &nbsp; &nbsp; </a> </div>';
	switch(helpType) {
		case 'overall':
			var helpHeader = '<b>Lists Tool</b>';
			var helpBody = 'The line counters are updated:<br>';
			helpBody += '<ul>';
			helpBody += '  <li>immediately:</li>';
			helpBody += '    <ul>';
			helpBody += '      <li>by input with the keyboard</li>';
			helpBody += '      <li>by pasting with the keyboard</li>';
			helpBody += '    </ul>';
			helpBody += '  <li>when leaving the field (or at next key press):</li>';
			helpBody += '    <ul>';
			helpBody += '      <li>by pasting with context menu</li>';
			helpBody += '    </ul>';
			helpBody += '</ul><br>';
			break;
		case 'Duplicates':
			var helpHeader = '<b>Duplicates</b>';
			var helpBody = '<table class="cellSpacing">';
			helpBody += '  <tr>';
			helpBody += '    <td colspan="4" class="cellBorder"><center><b>aa</b><br>bb<br><b>aa</b><br>cc</center></td>';
			helpBody += '  </tr>';
			helpBody += '  <tr>';
			// readonly does obviously not work with type=checkbox - but it works with type=text
			helpBody += '    <td colspan="2" class="cellBorder"><center><input type="checkbox" value="onlySingles" readonly="true"> only singles</center></td>';
			helpBody += '    <td colspan="2" class="cellBorder"><center><input type="checkbox" value="onlySingles" readonly="true" checked="checked"> only singles</center></td>';
			helpBody += '  </tr>';
			helpBody += '  <tr>';
			helpBody += '    <td width="125" class="cellBorder"><center><b>aa</b><br>bb<br>cc<br><br></center>first occurance of the duplicate is in the list of the singles</td>';
			helpBody += '    <td width="125" class="cellBorder"><center>aa<br><br><br><br></center>only the further occurance(s) of the duplicate(s)</td>';
			helpBody += '    <td width="125" class="cellBorder"><center>bb<br>cc<br><br><br></center>only singles</td>';
			helpBody += '    <td width="125" class="cellBorder"><center><b>aa</b><br>aa<br><br><br></center>first and further occurance(s) of the duplicate(s)</td>';
			helpBody += '  </tr>';
			helpBody += '</table><br>';
			break;
		case 'SetTheory':
			var helpHeader = '<b>Set Theory</b>';
			var helpBody = 'intersection and difference sets<br>';
			helpBody += ' &nbsp; &nbsp; <img src="SetTheory_IntersectionLeft.svg" />';
			helpBody += ' &nbsp; <img src="SetTheory_DifferenceSet.svg" />';
			helpBody += ' &nbsp; <img src="SetTheory_IntersectionRight.svg" /><br>';
			helpBody += 'union set<br>';
			helpBody += ' &nbsp; &nbsp; <img src="SetTheory_UnionSet.svg" /><br>';
			helpBody += 'symmetric difference set<br>';
			helpBody += ' &nbsp; &nbsp; <img src="SetTheory_SymetricDifferenceSet.svg" />';
			break;
		default:
			var helpHeader = '¤¤¤';
			var helpBody = '¤¤¤ ¤¤¤';
			break;
	}
	document.getElementById('HelpShadow').innerHTML = shadowHtml;
	document.getElementById('HelpShadow').style.visibility = 'visible';
	document.getElementById('HelpPopup').innerHTML = tableStart + closeButton + helpHeader + '<br><br>' + helpBody + tableEnd;
	document.getElementById('HelpPopup').style.visibility = 'visible';
	HelpStatusActive = true;
}  // function showHelp

function closeHelp() {
	document.getElementById('HelpShadow').style.visibility = 'hidden';
	document.getElementById('HelpShadow').innerHTML = ' ';
	document.getElementById('HelpPopup').style.visibility = 'hidden';
	document.getElementById('HelpPopup').innerHTML = ' ';
	HelpStatusActive = false;
}  // function closeHelp

document.onkeydown = function(evt) {
    if (evt.keyCode == 27) { // ESC-Key
        if (HelpStatusActive) {
			closeHelp();
		}
    }
}; // event document.onkeydown

function getArea(area, type) {
	var areaArray = ['edit', 'sort', 'duplicates', 'set theory', 'compare'];
	var descriptionArray = ['Edit', 'Sort', 'Duplicates', 'Set Theory', 'Compare'];
	var buttonIdArray = ['idButtonEdit', 'idButtonSort', 'idButtonDuplicates', 'idButtonSetTheory', 'idButtonCompare']
	var areaIdArray = ['idEditArea', 'idSortArea', 'idDuplicatesArea', 'idSetTheoryArea', 'idCompareArea'];
	var pos = areaArray.indexOf(area);
	if (type == 'allAreaIds') {
		return areaIdArray;
	} else if (pos == -1) {
		alert('Error: \'' + area + '\' not found (area in function getArea)');
	} else if (type == 'description') {
		return descriptionArray[pos];
	} else if (type == 'buttonId') {
		return buttonIdArray[pos];
	} else if (type == 'areaId') {
		return areaIdArray[pos];
	} else {
		alert('Error: \'' + type + '\' not found (type in function getArea)');
	}
} // function getArea

function calcBreadcrumbs(area) { // ### unused
	var jscode = 'javascript:selectAreaButton(\'(' + area + ')\')';
	var htmlcode = '<a href="' + jscode + '">Actions</a> &nbsp; &#10139; &nbsp; ' + getArea(area, 'description') + '<br />';
	return htmlcode;
} // function calcBreadcrumbs

function selectAreaButton(area) {
	if (area.charAt(0) != '(') { // if action-button pressed
		var coll = document.getElementsByClassName('pressedButton');
		for (let i = coll.length-1; i >= 0; i--) {
			coll[i].classList.remove('pressedButton');
		}
		var allAreaIds = getArea('', 'allAreaIds');
		for (let i = 0; i < allAreaIds.length; i++) {
			document.getElementById( allAreaIds[i] ).style.display = 'none';
		}
		// document.getElementById('ActionArea').style.display = 'none';
		document.getElementById( getArea(area, 'buttonId') ).classList.add('pressedButton');
		// document.getElementById('BreadcrumbsArea').innerHTML = calcBreadcrumbs (area);
		// document.getElementById('BreadcrumbsArea').style.display = 'inline';
		document.getElementById( getArea(area, 'areaId') ).style.display = 'inline';
	} else { // if breadcrumbs-link pressed // ### unused
		document.getElementById('ActionArea').style.display = 'inline';
		document.getElementById('BreadcrumbsArea').style.display = 'none';
		document.getElementById('BreadcrumbsArea').innerHTML = ' ';
		document.getElementById( getArea(area.slice(1, -1), 'areaId') ).style.display = 'none';
	} // if breadcrumbs-link pressed
} // function selectAreaButton

function countLines(fieldName) {
	var counter;
	if (document.getElementById(fieldName).value == '') {
		counter = 0;	
	} else {
		counter = document.getElementById(fieldName).value.split('\n').length;
	}
	document.getElementById('Counter' + fieldName).innerHTML = counter + ' lines';
} // function countLines

function countLinesX(which) {
	var fieldList = which.split('_');
	for (let i=0; i<fieldList.length; i++) {
		countLines(fieldList[i]);
	}
} // function countLinesX

function trimBlanksLines(array) {
	// this function expects an array
	// and returns an array 
	// 			with trimmed lines (spaces at the beginning and the end of the line are removed)
	//			and without empty lines (lines with only blanks are also removed)
	var trimmed = [];
	var trimmedLine = '';
	for ( var i = 0; i < array.length; i++) { // loop through the array
		trimmedLine = array[i].trim();
		if ( trimmedLine != '' ) { // valid line
			trimmed.push( trimmedLine );
		} // valid line
	} // loop through the array
	if (trimmed.length == 0) {
		trimmed.push( '' );
	}
	return trimmed;
} // function trimBlanksLines

function trim() {
	document.getElementById('List1').value = trimBlanksLines( document.getElementById('ListA').value.split('\n') ).join('\n');
	countLines('List1');
} // function trim

function lowercase() {
	document.getElementById('List1').value = document.getElementById('ListA').value.toLowerCase();
	countLines('List1');
} // function lowercase

function uppercase() {
	document.getElementById('List1').value = document.getElementById('ListA').value.toUpperCase();
	countLines('List1');
} // function uppercase

function isLetterOrHighChar(char) {
	var code = char.charCodeAt(0);
	if (code >= 65 && code <= 90) { // capital letters
		return true;
	} else if (code >= 97 && code <= 122) { // lowercase letters
		return true;
	} else if (code >= 128) { // second half of ACSII
		return true;
	} else { // non-letters of first half of ASCII
		return false;
	}
} // function isLetterOrHighChar

function propercase() {
	var inputStr = document.getElementById('ListA').value;
	var outputStr = '';
	for (let i = 0; i < inputStr.length; i++ ) { // loop through list
		if (i == 0) {
			outputStr = outputStr + (inputStr.charAt(i)).toUpperCase();
		} else if (isLetterOrHighChar(inputStr.charAt(i)) && ! isLetterOrHighChar(inputStr.charAt(i-1))) {
			outputStr = outputStr + (inputStr.charAt(i)).toUpperCase();
		} else {
			outputStr = outputStr + (inputStr.charAt(i)).toLowerCase();
		}
	} // loop through list
	document.getElementById('List1').value = outputStr;
	countLines('List1');
} // function propercase

function repeat() {
	var amount = document.getElementById('RepeatTimes').value;
	var ListAArray = document.getElementById('ListA').value.split('\n');
	var resultArray = [];
	for (let i = 0; i < ListAArray.length; i++ ) { // loop through list
		resultArray.push(ListAArray[i].repeat(amount));
	} // loop through list
	document.getElementById('List1').value = resultArray.join('\n');
	countLines('List1');
} // function repeat

function split() {
	var delimiter = document.getElementById('SplitDelimiter').value;
	var doMasking = document.getElementById('SplitMasking').checked;
	document.getElementById('splitErrorMsg').innerHTML = '';
	if (doMasking) { // with activated masking
		// mixture of masked und unmasked parts are OK
		// masked parts with mask character in the middle is not allowed and the position is reported
		var textSource = document.getElementById('ListA').value;
		var maskingChar = document.getElementById('SplitMaskingChar').value;
		var i;
		var textOut = '';
		var posPartStart = 0;
		var status = 'start'; 
		// start:    in next loop: beginning mask or start of unmaksed  part or delimiter expected
		// masked:   in next loop: masked chars of part or ending mask expected
		// unmasked: in next loop: unmasked chars of part or ending mask expected
		// end:      in next loop: delimiter expected, because of ending mask
		var allOK = true;
		var errorMsg = '<br/>Incorrect masks:';
		for (i = 0; i < textSource.length; i++) { // looping through string
			// textOut += i.toString() + ': ' + textSource[i] + '\n';
			switch(textSource[i]) {
				case maskingChar:
					if (status == 'start') { // start mask
						posPartStart = i + 1;
						status = 'masked';
					} else if (status == 'masked') { // end mask
						textOut += textSource.substring( posPartStart, i );
						status = 'end';
					} else if (status == 'end') { // mask char after masking
						allOK = false;
						errorMsg += '<div style="padding-left: 30px;">' + posPartStart.toString() + ' .. ' + (i).toString() + '</div>';
						status = 'unmasked'
					}
					break;
				case delimiter:
					if (status == 'masked') {
						// skip (delimiter within mask);
					} else if (status == 'end') { // end of part
						textOut += '\n';
						posPartStart = i + 1;
						status = 'start';
					} else if (status == 'unmasked') { // end of part
						textOut += textSource.substring( posPartStart, i ) +  '\n';
						posPartStart = i + 1;
						status = 'start';
					} else if (status == 'start') { // empty string
						textOut += '\n';
						posPartStart = i + 1;
						status = 'start';
					}
					break;
				default:
					if (status == 'start') { // first char of part
						status = 'unmasked'
					} else if (status == 'end') { // char after masking
						allOK = false;
						errorMsg += '<div style="padding-left: 30px;">' + posPartStart.toString() + ' .. ' + (i).toString() + '</div>';
						status = 'unmasked'
					} else { // looping through part (status: masked and unmasked)
						// skip
					}
			} // end of switch
		} // looping through string
		if (status == 'masked') {
			allOK = false;
			errorMsg += '<div style="padding-left: 30px;">' + posPartStart.toString() + ' .. ' + (i).toString() + '</div>';
		} else if (status == 'unmasked') {
			textOut += textSource.substring( posPartStart, i );
		}
		document.getElementById('List1').value = textOut;
		if (!(allOK)) {
			document.getElementById('splitErrorMsg').innerHTML = errorMsg;
		}
	} else { // withOut activated masking
		document.getElementById('List1').value = document.getElementById('ListA').value.split(delimiter).join('\n');
	} // withOut activated masking
	countLines('List1');
} // function split

function prepend_append(textWithLinebreaks, preText, postText) {
	var textArray = textWithLinebreaks.split('\n');
	var newtextWithLinebreaks = '';
	var i;
	for (i = 0; i < textArray.length; i++) {
		newtextWithLinebreaks += preText + textArray[i] + postText;
		if (i+1 <  textArray.length) {
			newtextWithLinebreaks += '\n';
		}
	}
	return newtextWithLinebreaks;
} // function prepend_append

function join() {
	var delimiter = document.getElementById('JoinDelimiter').value;
	var doMasking = document.getElementById('JoinMasking').checked;
	if (doMasking) { // with masking
		document.getElementById('List1').value = prepend_append( document.getElementById('ListA').value, document.getElementById('JoinMaskingChar').value, document.getElementById('JoinMaskingChar').value ).split('\n').join(delimiter);
	} else { // withOut masking
		document.getElementById('List1').value = document.getElementById('ListA').value.split('\n').join(delimiter);
	} // withOut masking
	countLines('List1');
} // function join

function sort() {
	var ListAArray = document.getElementById('ListA').value.split('\n');
	if (document.getElementById('idSortAlpha').checked) { // alphabetical
		ListAArray.sort(function(a, b){
    		if(a.toLowerCase() < b.toLowerCase()) { return -1; }
  			if(a.toLowerCase() > b.toLowerCase()) { return 1; }
	 		return 0;
		});
	} else if (document.getElementById('idSortAscii').checked) { // ASCII
		ListAArray.sort();
	} // ASCII
	document.getElementById('List1').value = ListAArray.join('\n');
	countLines('List1');
} // function sort

function searchDuplicates() {
	var ListAArray = document.getElementById('ListA').value.split('\n');
	var onlySingles = document.getElementById('duplicatesOnlySingles').checked;
	var len = ListAArray.length;
	var UniqueList = [];
	var DuplicatesList = [];
	var i;
	for ( i = 0; i < len; i++ ) { // loop through list
		if(onlySingles) { // only singles
			if(ListAArray.indexOf(ListAArray[i], i + 1) == -1 && DuplicatesList.indexOf(ListAArray[i]) == -1 ) { // not found -> single
				UniqueList.push(ListAArray[i]);
			} else { // found -> duplicate
				DuplicatesList.push(ListAArray[i]);
			} // found -> duplicate
		} else { // singles + first occurance
			if(UniqueList.indexOf(ListAArray[i]) == -1) { // not found -> first occurance
				UniqueList.push(ListAArray[i]);
			} else { // found -> n-th occurance
				DuplicatesList.push(ListAArray[i]);
			} // found -> n-th occurance
		} // singles + first occurance
	} // loop through list
	document.getElementById('List1').value = UniqueList.join('\n');
	document.getElementById('List2').value = DuplicatesList.join('\n');
	countLinesX('List1_List2');
} // function searchDuplicates

function setTheory() {
	// Schnittmenge _ intersection of A and B
	// Differenzmenge A \ B
	// Symmetrische Differenz _ symmetric difference of A and B
	// Vereinigungsmenge _ union of A and B
	var ListAArray = document.getElementById('ListA').value.split('\n');
	var ListBArray = document.getElementById('ListB').value.split('\n');
	var lenA = ListAArray.length;
	var lenB = ListBArray.length;
	var DifferenzmengeA = []; // relative complement of B in A
	var Schnittmenge = []; // intersection of A and B
	var DifferenzmengeB = []; // relative complement of A in B
	var Vereinigungsmenge = []; // union of A and B
	var SymDiffmenge = []; // symmetric difference of A and B
	var i;
	if (document.getElementById('idSetTheoryInterDiff').checked == false 
		&& document.getElementById('idSetTheoryUnion').checked == false
		&& document.getElementById('idSetTheorySymmDiff').checked == false) { // no option selected
		alert('Please select an option.');
	} // no option selected
	if (document.getElementById('idSetTheoryInterDiff').checked) { // intersection and difference sets
		// DifferenzmengeA and Schnittmenge
		for ( i = 0; i < lenA; i++ ) { // loop through list A
			if(ListBArray.indexOf(ListAArray[i]) == -1) { // not found -> Differenzmenge
				DifferenzmengeA.push(ListAArray[i]);
			} else { // found -> Schnittmenge
				Schnittmenge.push(ListAArray[i]);
			} // found -> Schnittmenge
		} // loop through list A
		// DifferenzmengeB
		for ( i = 0; i < lenB; i++ ) { // loop through list B
			if(ListAArray.indexOf(ListBArray[i]) == -1) { // not found -> Differenzmenge
				DifferenzmengeB.push(ListBArray[i]);
			} // not found -> Differenzmenge
		} // loop through list B
		document.getElementById('List1').value = DifferenzmengeA.join('\n');
		document.getElementById('List2').value = Schnittmenge.join('\n');
		document.getElementById('List3').value = DifferenzmengeB.join('\n');
	} // intersection and difference sets

	if (document.getElementById('idSetTheoryUnion').checked) { // union set
		for ( i = 0; i < lenA; i++ ) { // loop through list A
			if(Vereinigungsmenge.indexOf(ListAArray[i]) == -1) { // not found -> first occurance
				Vereinigungsmenge.push(ListAArray[i]);
			} // not found -> first occurance
		} // loop through list A
		for ( i = 0; i < lenB; i++ ) { // loop through list B
			if(Vereinigungsmenge.indexOf(ListBArray[i]) == -1) { // not found -> first occurance
				Vereinigungsmenge.push(ListBArray[i]);
			} // not found -> first occurance
		} // loop through list B
		document.getElementById('List1').value = Vereinigungsmenge.join('\n');
	} // union set
	
	if (document.getElementById('idSetTheorySymmDiff').checked) { // symmetric difference set
		for ( i = 0; i < lenA; i++ ) { // loop through list A
			if(ListBArray.indexOf(ListAArray[i]) == -1) { // not found -> Differenzmenge
				SymDiffmenge.push(ListAArray[i]);
			} // not found -> first occurance
		} // loop through list A
		for ( i = 0; i < lenB; i++ ) { // loop through list A
			if(ListAArray.indexOf(ListBArray[i]) == -1) { // not found -> Differenzmenge
				SymDiffmenge.push(ListBArray[i]);
			} // not found -> first occurance
		} // loop through list A
		document.getElementById('List1').value = SymDiffmenge.join('\n');
	} // symmetric difference set
	
	countLinesX('List1_List2_List3');
} // function setTheory

function clearCompareResult() {
	document.getElementById('compareResult').innerHTML = '';
} // function clearCompareResult

function compare() {
	var showDetails = document.getElementById('compareDetails').checked;
	var ListA_Value = document.getElementById('ListA').value;
	var ListB_Value = document.getElementById('ListB').value;
	var ListA_Array = ListA_Value.split('\n');
	var ListB_Array = ListB_Value.split('\n');
	var ListA_ArrayTrimmed = [];
	var ListB_ArrayTrimmed = [];
	var ListA_ValueTrimmed = '';
	var ListB_ValueTrimmed = '';
	var result = '';
	var detailsA = '';
	var detailsB = '';
	if( ListA_Value == ListB_Value ) {
		result = 'Both lists are 100 % identical.';
		if(showDetails) {
			ListA_ArrayTrimmed = trimBlanksLines(ListA_Array);
			ListB_ArrayTrimmed = trimBlanksLines(ListB_Array);
			ListA_ValueTrimmed = ListA_ArrayTrimmed.join('\n');
			ListB_ValueTrimmed = ListB_ArrayTrimmed.join('\n');
		}
	} else {
		ListA_ArrayTrimmed = trimBlanksLines(ListA_Array);
		ListB_ArrayTrimmed = trimBlanksLines(ListB_Array);
		ListA_ValueTrimmed = ListA_ArrayTrimmed.join('\n');
		ListB_ValueTrimmed = ListB_ArrayTrimmed.join('\n');
		if ( ListA_ValueTrimmed == ListB_ValueTrimmed ) {
			result = 'Besides for beginning and ending spaces (tabs) and empty lines the lists are identical.';
		} else {
			result = 'The lists are different.';
		}
	}
	if(showDetails) {
		detailsA = '# of lines: ' + ListA_Array.length + '\n';
		detailsA += '# of char: ' + ListA_Value.length + '\n';
		detailsA += '# of char without linebreaks: ' + (ListA_Value.length - ListA_Array.length + 1) + '\n\n';
		detailsA += 'After trimming:\n';
		detailsA += '# of lines: ' + ListA_ArrayTrimmed.length + '\n';
		detailsA += '# of char: ' + ListA_ValueTrimmed.length + '\n';
		detailsA += '# of char without linebreaks: ' + (ListA_ValueTrimmed.length - ListA_ArrayTrimmed.length + 1);
		document.getElementById('List1').value = detailsA;
		detailsB = '# of lines: ' + ListB_Array.length + '\n';
		detailsB += '# of char: ' + ListB_Value.length + '\n';
		detailsB += '# of char without linebreaks: ' + (ListB_Value.length - ListB_Array.length + 1) + '\n\n';
		detailsB += 'After trimming:\n';
		detailsB += '# of lines: ' + ListB_ArrayTrimmed.length + '\n';
		detailsB += '# of char: ' + ListB_ValueTrimmed.length + '\n';
		detailsB += '# of char without linebreaks: ' + (ListB_ValueTrimmed.length - ListB_ArrayTrimmed.length + 1);
		document.getElementById('List2').value = detailsB;
	}
	result = result + ' &nbsp; &nbsp; &nbsp; &nbsp; <a href="javascript:clearCompareResult()">&nbsp; x &nbsp;</a>';
	document.getElementById('compareResult').innerHTML = result;
	countLinesX('List1_List2');
} // function compare

function test() {
	//alert('hi x : ' + document.getElementById('ListA').value);
	//document.getElementById('ListA').value = 'hi world';
	var ListAArray = document.getElementById('ListA').value.split('\n');
	for(var i = 0;i < ListAArray.length;i++){
		alert(i + ' ' + ListAArray[i]);
	}
} // function test
