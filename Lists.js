"use strict";

const cellAmountObj = {
	Input: 2, // amount of Input fields
	InputCol: 0, // amount of Input columns // 0=one row, 1=one col, 2=two col, ...
	Output: 3, // amount of Output fields
	OutputCol: 0 // amount of Output columns // 0=one row, 1=one col, 2=two col, ...
};
const InOutAmounts = {
	edit_trim: '1_1',
	edit_cases: '1_1',
	edit_repeat: '1_1',
	edit_series: '0_1',
	edit_split: '1_1',
	EditJoinOneList: '1_1',
	EditJoinTwoLists: '2_1',
	EditJoinText: '1_1',
	sort: '1_1',
	duplicates: '1_2',
	SetTheoryInterDiff: '2_3',
	SetTheoryUnion: '2_1',
	SetTheorySymmDiff: '2_1',
	compare: '2_0',
	compareDetails: '2_2'
};
var helpStatusActive = false;  // needed to close with ESC
var listMenuStatus = ''; // '', 'Input', 'Output' // needed to close with ESC
var activeSubButton = ''; // '', 'trim', 'cases', 'repeat', 'series', 'split', 'join'

function init() {
	tableEdit('Input', 'init');
	tableEdit('Output', 'init');
	onchangeCheckedLeadingZeros();
	document.getElementById('idEditJoinOneList').checked = true;
}

function showDialog(text) {
	var w = window.innerWidth;
	var h = window.innerHeight;
	var shadowHtml = '<a href="javascript:closeHelp()" class="HelpShadow" style="width: ' + w + 'px; height: ' + h + 'px;"></a>';
	var tableStart = '<table class="b1b"><tr><td> &nbsp; &nbsp; </td><td>'
	var tableEnd = '</td><td> &nbsp; &nbsp; </td></tr></table>'
	var closeButton = '<div style="text-align: right;"> <a href="javascript:closeHelp()" style="text-decoration: none"> &nbsp; &nbsp; x &nbsp; &nbsp; </a> </div>';
	document.getElementById('HelpShadow').innerHTML = shadowHtml;
	document.getElementById('HelpShadow').style.visibility = 'visible';
	document.getElementById('HelpPopup').innerHTML = tableStart + closeButton + text + tableEnd;
	document.getElementById('HelpPopup').style.visibility = 'visible';
	helpStatusActive = true;
} // function showDialog

function showHelp(helpType) {
	switch(helpType) {
		case 'overall':
			var helpHeader = 'Lists Tool';
			var helpBody = 'List names:<br><br>';
			helpBody += ' &nbsp; &nbsp; List A: the action does not use this list<br>';
			helpBody += ' &nbsp; &nbsp; <img src="assets/icon-input.svg" class="img-input-output" /> A: the action uses this list as input<br>';
			helpBody += ' &nbsp; &nbsp; <img src="assets/icon-output.svg" class="img-input-output" /> A: the action outputs to this list<br>';
			helpBody += ' &nbsp; &nbsp; <img src="assets/icon-input-output.svg" class="img-input-output" /> A: the action uses this list as input and outputs to this list<br>';
			helpBody += '<br>';
			helpBody += 'The line counters are updated:<br>';
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
			helpBody += '</ul>';
			helpBody += 'Hotkeys:<br><br>';
			helpBody += ' &nbsp; &nbsp; Esc: close all dialogs (list actions and help)<br><br><br>';
			break;
		case 'Series':
			var helpHeader = 'Series';
			var helpBody = 'Ascending and descending<br>';
			helpBody += '<span class="indentText">Ascending with first number smaller than second</span><br>';
			helpBody += '<span class="indentText">Descending with first number larger than second</span><br><br>';							
			helpBody += 'Leading zeros:<br>';
			helpBody += '<span class="indentText">Length of the number with the leading zeros</span><br>';
			helpBody += '<span class="indentText">0 = Fit length with biggest number</span><br><br>';
			break;
		case 'Join':
			var helpHeader = 'Join';
			var helpBody = '<ul>';
			helpBody += '  <li>One List<br>';
			helpBody += '    The elements of one list will be joined to one text<br>';
			helpBody += '    (separated with the delimiter).';
			helpBody += '  </li><br>';
			helpBody += '  <li>Two Lists<br>';
			helpBody += '    The elements of two list will be joined as elements<br>';
			helpBody += '    of one new list.';
			helpBody += '  </li><br>';
			helpBody += '  <li>Text<br>';
			helpBody += '    A text will be prepended or appended<br>';
			helpBody += '    to each element of one list.';
			helpBody += '  </li>';
			helpBody += '</ul><br><br>';
			break;
		case 'JoinTwoPos':
			var helpHeader = 'Join - Two Lists - Position';
			var helpBody = '<table>';
			helpBody += '  <tr>';
			helpBody += '    <td style="display: flex;">';
			helpBody += '    <div style="margin-left: auto">';
			helpBody += '    List A<div class="help-join-two-list">a-<br>a=<br>a~</div><br>';
			helpBody += '    </div>';
			helpBody += '    </td>';
			helpBody += '    <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>';
			helpBody += '    <td>List B<div class="help-join-two-list">b.<br>b,<br>b;</div><br></td>';
			helpBody += '  </tr>';
			helpBody += '  <tr>';
			helpBody += '    <td>';
			helpBody += '      <input type="radio" checked="checked"> <b>usual</b> position<br>';
			helpBody += '      Input <input type="checkbox" checked="checked"> A ';
			helpBody += '      <input type="checkbox" checked="checked"> B<br><br>';
			helpBody += '      The elements of the list<br>';
			helpBody += '      with&nbsp;the&nbsp;<b>lower</b>&nbsp;list&nbsp;name&nbsp;letter<br>';
			helpBody += '      will be on the <b>left</b>.<br>';
			helpBody += '      And the elements of the list<br>';
			helpBody += '      with&nbsp;the&nbsp;<b>higher</b>&nbsp;list&nbsp;name&nbsp;letter<br>';
			helpBody += '      will be on the <b>right</b>:<br>';
			helpBody += '      <div class="help-join-two-list">a-b.<br>a=b,<br>a~b;</div>';
			helpBody += '    </td>';
			helpBody += '    <td></td>';
			helpBody += '    <td>';
			helpBody += '      <input type="radio" checked="checked"> <b>flip</b> position<br>';
			helpBody += '      Input <input type="checkbox" checked="checked"> A ';
			helpBody += '      <input type="checkbox" checked="checked"> B<br><br>';
			helpBody += '      The elements of the list<br>';
			helpBody += '      with&nbsp;the&nbsp;<b>lower</b>&nbsp;list&nbsp;name&nbsp;letter<br>';
			helpBody += '      will be on the <b>right</b>.<br>';
			helpBody += '      And the elements of the list<br>';
			helpBody += '      with&nbsp;the&nbsp;<b>higher</b>&nbsp;list&nbsp;name&nbsp;letter<br>';
			helpBody += '      will be on the <b>left</b>:<br>';
			helpBody += '      <div class="help-join-two-list">b.a-<br>b,a=<br>b;a~</div>';
			helpBody += '    </td>';
			helpBody += '  </tr>';
			helpBody += '</table><br>';
			break;			
		case 'Duplicates':
			var helpHeader = 'Duplicates';
			var helpBody = '<table class="cellSpacing">';
			helpBody += '  <tr>';
			helpBody += '    <td colspan="4" class="cellBorder"><center><b>aa</b><br>bb<br><b>aa</b><br>cc</center></td>';
			helpBody += '  </tr>';
			helpBody += '  <tr>';
			// readonly does obviously not work with type=checkbox - but it works with type=text
			helpBody += '    <td colspan="2" class="cellBorder"><center><input type="checkbox" readonly="true"> only singles</center></td>';
			helpBody += '    <td colspan="2" class="cellBorder"><center><input type="checkbox" readonly="true" checked="checked"> only singles</center></td>';
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
			var helpHeader = 'Set Theory';
			var helpBody = 'intersection and difference sets<br>';
			helpBody += ' &nbsp; &nbsp; <img src="assets/SetTheory_IntersectionLeft.svg" />';
			helpBody += ' &nbsp; <img src="assets/SetTheory_DifferenceSet.svg" />';
			helpBody += ' &nbsp; <img src="assets/SetTheory_IntersectionRight.svg" /><br>';
			helpBody += 'union set<br>';
			helpBody += ' &nbsp; &nbsp; <img src="assets/SetTheory_UnionSet.svg" /><br>';
			helpBody += 'symmetric difference set<br>';
			helpBody += ' &nbsp; &nbsp; <img src="assets/SetTheory_SymetricDifferenceSet.svg" />';
			break;
		case 'Compare':
			var helpHeader = 'Compare';
			var helpBody = 'VSCodium / VS Code and other tools<br>';
			helpBody += 'have indisputable better compare features.<br>';
			helpBody += 'But they need to have the texts stored in files.<br><br>';
			helpBody += 'If you have your texts only in the clipboard,<br>';
			helpBody += 'then this tool comes into play.<br>';
			helpBody += 'The aim is to have a quick compare<br>';
			helpBody += 'without dealing with files and the later cleanup. &nbsp; <br><br>';
			helpBody += 'The tool compares the texts for:';
			helpBody += '<ul>';
			helpBody += '  <li>exact equality</li>';
			helpBody += '  <li>case insensitive equality</li>';
			helpBody += '  <li>\'trimmed\' equality&#185;</li>'; // &#185; ¹
			helpBody += '</ul>';
			helpBody += '&#185; without empty lines and whitespaces&#178; from both sides of the lines<br>'; // &#185; ¹  &#178; ²
			helpBody += '&#178; spaces, tabs and others<br><br>'; // &#178; ²
			break;
		default:
			var helpHeader = '¤¤¤';
			var helpBody = '¤¤¤ ¤¤¤';
			break;
	}
	showDialog('<b>' + helpHeader + '</b><br><br>' + helpBody);
	helpStatusActive = true;
}  // function showHelp

function closeHelp() {
	document.getElementById('HelpShadow').style.visibility = 'hidden';
	document.getElementById('HelpShadow').innerHTML = '';
	document.getElementById('HelpPopup').style.visibility = 'hidden';
	document.getElementById('HelpPopup').innerHTML = '';
	helpStatusActive = false;
}  // function closeHelp

document.onkeydown = function(evt) {
	if (evt.keyCode == 27) { // ESC-Key
		if (helpStatusActive) {
			closeHelp();
		} else if (listMenuStatus != '') {
			closeListMenu(listMenuStatus);
		}
    }
}; // event document.onkeydown

function showMessage(msgText) {
	var msgCode = '<br><div class="msgBox">';
	msgCode += '<div style="text-align: right;"><a href="javascript:clearMessage()" style="text-decoration: none"> &nbsp; &nbsp; &nbsp; x &nbsp; &nbsp; &nbsp; </a></div>';
	msgCode += msgText;
	msgCode += '<br></div>';
	document.getElementById('idMessage').innerHTML = msgCode;
} // function showMessage

function clearMessage() {
	document.getElementById('idMessage').innerHTML = '';
} // function clearMessage

function openListMenu(table) {
	// table: 'Input', 'Output'
	var parameterClose = "'" + table + "'";
	var parameterAdd = "'" + table + "', 'add'";
	var parameterCol = "'" + table + "', 'col'";
	var w = window.innerWidth;
    var h = window.innerHeight;
	var shadowHtml = '<a href="javascript:closeListMenu(' + parameterClose + ')" class="HelpShadow" ';
	shadowHtml += 'style="width: ' + w + 'px; height: ' + h + 'px;"></a>';
	document.getElementById('HelpShadow').innerHTML = shadowHtml;
	document.getElementById('HelpShadow').style.visibility = 'visible';
	var col = cellAmountObj[table + 'Col'];
	var cells = cellAmountObj[table];
	var menuHtml = '';
	menuHtml += '<div class="listMenuAbsolute">';
	menuHtml += '  <div style="text-align: right;">';
	menuHtml += '	<a href="javascript:closeListMenu(' + parameterClose + ')" style="text-decoration: none"> &nbsp; &nbsp; x &nbsp; &nbsp; </a>';
	menuHtml += '  </div>';
	menuHtml += '  <button onclick="tableEdit(' + parameterAdd + ')">Add list field</button><br><br>';
	menuHtml += '  Lists in <input type="number" id="idCol' + table + '" value="' + col + '" min="0" max="' + cells + '"> columns';
	menuHtml += '  (0: all in one line)<br>';
	menuHtml += '  <button onclick="tableEdit(' + parameterCol + ')">Arrange</button>';
	menuHtml += '</div>';
	document.getElementById('idRelativeDiv' + table).innerHTML = menuHtml;
	listMenuStatus = table;
}

function closeListMenu(table){
	document.getElementById('HelpShadow').style.visibility = 'hidden';
	document.getElementById('HelpShadow').innerHTML = '';
	document.getElementById('idRelativeDiv' + table).innerHTML = '';
	listMenuStatus = '';
}

function clearList(cellId) {
	document.getElementById(cellId).value = '';
	countLines(cellId);
}

function getCellName(table, number) {
	// table: 'Input' -> Roman, 'Output' -> Greek
	// Roman alphabet: 16 characters (65-90)
	// Greek alphabet: 24 characters (945-961, 963-969)
	var charAmount = (table == 'Input') ? 26 : 24;
	var startCharCode = (table == 'Input') ? 65 : 945;
	var cellName = '';
	var modulo;
	while (number > 0) {
		number--;
		modulo = number % charAmount;
		let sigmaGap = (table == 'Output' && modulo >= 17) ? 1 : 0;
		cellName = String.fromCharCode(startCharCode + sigmaGap + modulo) + cellName;
		number -= modulo;
		number /= charAmount;
	}
	return cellName;
}

function getRowTagByColAndCellAndTotal(tag, col, cell, total) {
	// calculates if the html tag for the table row is needed, if needed then returns the start or end tag
	// tag: 'start', 'end'
	// col: the amount of colums the table has
	// cell: the number of the cell
	// total: the amount of cells
	var code = (tag == 'start') ? '<div class="tr">' : '</div>';
	if (col == 0) { // start tag only for the first cell and end tag only for the last cell
		if (tag == 'start' && cell == 1) {
			return code;
		} else if (tag == 'end' && cell == total) {
			return code;
		} else {
			return '';
		}
	} else if (col == 1) { // start and end tags for all cells
		return code;
	} else {
		if (tag == 'end' && cell == total) { // end tag for all last cells 
			return code;
		} else if (tag == 'start') { // start tag for the cells after the n-th cells (includes the 0-th cell)
			return (cell % col == 1) ? code : '';
		} else { // tag == 'end' // end tag for all n-th cells
			return (cell % col == 0) ? code : '';
		}
	}
}
  
function tableEdit(table, operation) {
	// table: 'Input', 'Output'
	// operation: 'init', 'add', 'col'
	var tableName = 'id' + table + 'Table';
	var cellAmountOld = cellAmountObj[table];
	if (operation == 'add') {
		cellAmountObj[table]++;
	}
	var cellAmountNew = cellAmountObj[table];
	if (operation == 'col') {
		cellAmountObj[table + 'Col'] = 1 * document.getElementById('idCol' + table).value;
	}
	var col = cellAmountObj[table + 'Col'];
	var listValues = [];
	var listDescr = [];  
	// save data
	if (operation != 'init') {
		for (let i=1; i<=cellAmountOld; i++) {
		let cellID = (table == 'Input') ? getCellName(table, i) : i;
		listValues[i] = document.getElementById('List'+cellID).value;
		listDescr[i] = document.getElementById('Descr'+cellID).value;
		}
	}
	// build new table
	var code = '';
	for (let i=1; i<=cellAmountNew; i++) {
		let cellName = getCellName(table, i);
		let cellID = (table == 'Input') ? cellName : i;
		let cellParameter = "'List" + cellID + "'";
		// start of row
		code += getRowTagByColAndCellAndTotal('start', col, i, cellAmountNew);
		// cell with fields and values
		code +='<div class="td">';
		code += '<a href="javascript:clearList(' + cellParameter + ')" class="blackNoUnderline">';
		code +=  '<span id="idCellName' + cellID + '">List</span> ' + cellName;
		code += '</a>';
		code += '<input type="text" id="Descr' + cellID + '" class="Descr"> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ';
		code += '<span id=CounterList' + cellID + '></span> <br />';
		code += '<textarea id="List' + cellID + '" cols="38" rows="10"';
		code += '  onkeyup="countLines(' + cellParameter + ')" onchange="countLines(' + cellParameter + ')">';
		code += '</textarea> &nbsp; &nbsp; <br />';
		code +='</div>'; 
		// end of row
		code += getRowTagByColAndCellAndTotal('end', col, i, cellAmountNew);
	}
	document.getElementById(tableName).innerHTML = code;
	// restore data // if restore is done within building the table, there are issues with ending html tags
	if (operation != 'init') {
		for (let i=1; i<=cellAmountOld; i++) {
		let cellID = (table == 'Input') ? getCellName(table, i) : i;
		document.getElementById('List'+cellID).value = listValues[i];
		document.getElementById('Descr'+cellID).value = listDescr[i];
		}
		closeListMenu(table);
	}
	// count lines
	for (let i=1; i<=cellAmountNew; i++) {
		let cellID = (table == 'Input') ? getCellName(table, i) : i;
		countLines('List' + cellID);
	}
	// update input output radio buttons
	if (operation == 'add') {
		updateCheckboxesBothLines(); // in the function is checked if update is necessary
	}
	// update list name icons
	if (operation == 'init') {
		// not update of icon needed
	} else if (document.getElementsByClassName('pressedActionTopButton').length != 1) {
		// not update of icon needed
	} else if ( activeSubButton == '' 
		&& document.getElementById('idButtonEdit').classList.contains('pressedActionTopButton') ) {
		// not update of icon needed
	} else {
		updateListNameIcon(true);
	}
}
  
function getArea(level, area, type) {
	// level: 'top', 'sub'
	var areaArray = (level == 'top')
		? ['edit', 'sort', 'duplicates', 'setTheory', 'compare']
		: ['trim', 'cases', 'repeat', 'series', 'split', 'join'];
	var descriptionArray = ['Edit', 'Sort', 'Duplicates', 'Set Theory', 'Compare'];
	var buttonIdArray = (level == 'top')
		? ['idButtonEdit', 'idButtonSort', 'idButtonDuplicates', 'idButtonSetTheory', 'idButtonCompare']
		: ['idButtonTrim', 'idButtonCases', 'idButtonRepeat', 'idButtonSeries', 'idButtonSplit', 'idButtonJoin'];
	var areaIdArray = (level == 'top')
		? ['idEditArea', 'idSortArea', 'idDuplicatesArea', 'idSetTheoryArea', 'idCompareArea']
		: ['idTrimArea', 'idCasesArea', 'idRepeatArea', 'idSeriesArea', 'idSplitArea', 'idJoinArea'];
	var pos = areaArray.indexOf(area);
	if (type == 'allAreaIds') {
		return areaIdArray;
	} else if (pos == -1) {
		if (type == 'area') {
			pos = buttonIdArray.indexOf(area);
			if (pos == -1) {
				alert('Error:\n\'' + area + '\' not found\n(button-id in function getArea)');
			} else {
				return areaArray[pos];
			}
		} else {
			alert('Error:\n\'' + area + '\' not found\n(area in function getArea)');
		}
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
	var jscode = "javascript:selectAreaButton('top', '(" + area + ")')";
	var htmlcode = '<a href="' + jscode + '">Actions</a> &nbsp; &#10139; &nbsp; ' + getArea('top', area, 'description') + '<br />';
	return htmlcode;
} // function calcBreadcrumbs

function selectAreaButton(level, area) {
	// level: 'top', 'sub'
	// area: 'edit', 'sort', 'duplicates', 'setTheory', 'compare',   'trim', 'cases', 'repeat', 'series', 'split', 'join'
	const className = {
		top: 'pressedActionTopButton',
		sub: 'pressedActionSubButton'
	}
	if (area.charAt(0) != '(') { // if action-button pressed
		var coll = document.getElementsByClassName(className[level]);
		for (let i = coll.length-1; i >= 0; i--) {
			coll[i].classList.remove(className[level]);
		}
		var allAreaIds = getArea(level, '', 'allAreaIds');
		for (let i = 0; i < allAreaIds.length; i++) {
			document.getElementById( allAreaIds[i] ).style.display = 'none';
		}
		// document.getElementById('ActionArea').style.display = 'none';
		document.getElementById( getArea(level, area, 'buttonId') ).classList.add(className[level]);
		// document.getElementById('BreadcrumbsArea').innerHTML = calcBreadcrumbs (area);
		// document.getElementById('BreadcrumbsArea').style.display = 'inline';
		document.getElementById( getArea(level, area, 'areaId') ).style.display = 'inline';
	} else { // if breadcrumbs-link pressed // ### unused
		document.getElementById('ActionArea').style.display = 'inline';
		document.getElementById('BreadcrumbsArea').style.display = 'none';
		document.getElementById('BreadcrumbsArea').innerHTML = ' ';
		document.getElementById( getArea(level, area.slice(1, -1), 'areaId') ).style.display = 'none';
	} // if breadcrumbs-link pressed
	if (level == 'top') {
		if (area == 'edit' && activeSubButton == '') {
			document.getElementById('idInOut').innerHTML = '';
			updateListNameIcon(false);
		} else {
			showInOutCheckboxes(area);
			updateListNameIcon(true);
		}
	} else {
		activeSubButton = area;
		showInOutCheckboxes('edit');
		updateListNameIcon(true);
	}
	clearMessage();
} // function selectAreaButton

function onchangeJoinOptions() {
	document.getElementById('idJoinOneListArea').classList.add('hiddenFree');
	document.getElementById('idJoinTwoListsArea').classList.add('hiddenFree');
	document.getElementById('idJoinTextArea').classList.add('hiddenFree');
	if (document.getElementById('idEditJoinOneList').checked) {
		document.getElementById('idJoinOneListArea').classList.remove('hiddenFree');
	}
	if (document.getElementById('idEditJoinTwoLists').checked) {
		document.getElementById('idJoinTwoListsArea').classList.remove('hiddenFree');
	}
	if (document.getElementById('idEditJoinText').checked) {
		document.getElementById('idJoinTextArea').classList.remove('hiddenFree');
	}
	showInOutCheckboxes('edit');
	updateListNameIcon(true);
}

function onchangeSetTheoryOptions() {
	showInOutCheckboxes('setTheory');
	updateListNameIcon(true);
}

function onchangeCompareDetails() {
	showInOutCheckboxes('compare');
	updateListNameIcon(true);
}

function getInOutAmountsObjPropertyName(areaTop) {
	var propertyName = areaTop;
	if (areaTop == 'edit') {
		propertyName += '_' + activeSubButton;
	}
	if (propertyName == 'edit_join') {
		propertyName = document.querySelectorAll('input[name="JoinOptions"]:checked')[0].id.substring(2);
	}
	if (areaTop == 'setTheory') {
		propertyName = document.querySelectorAll('input[name="SetTheoryOptions"]:checked')[0].id.substring(2);
	}
	if (areaTop == 'compare' && document.getElementById('compareDetails').checked) {
		propertyName += 'Details';
	}
	return propertyName;
}

function updateCheckboxesBothLines() {
	var coll = document.getElementsByClassName('pressedActionTopButton');
	if (coll.length == 0) {
		// do nothing (action button still not pressed)
	} else if (coll.length == 1) {
		if ( ! ( document.getElementById('idButtonEdit').classList.contains('pressedActionTopButton')
			&& activeSubButton == ''
		)) {
			var typeArray = ['Input', 'Output'];
			var areaTop = getArea('top', coll[0].id, 'area');
			var ioaPropertyName = getInOutAmountsObjPropertyName(areaTop);
			var requiredAmounts = InOutAmounts[ioaPropertyName].split('_');
			var short;
			for (let i=0; i<=1; i++) { // loop through Input and Output
				short = (document.getElementById('id' + typeArray[i] + 'OtherLabel').style.display == 'none') ? false : true;
				updateCheckboxesOneLine(typeArray[i], requiredAmounts[i], short);
			}
		}
	} else {
		alert('Warning:\nInput and output checkboxes could not be updated.\n'
			+ '(Amount of pressed buttons: ' + coll.length + ')');
	}
}

function updateCheckboxesOneLine (type, requiredAmount, short) {
	// type: 'Input', 'Output'
	// short: true: only usual lists, false: all lists
	var tickedIdArray = [];
	// get current selections
	var tickedBoxList = document.querySelectorAll('input[name="' + type + 'Boxes"]:checked')
	for (let i=0; i<tickedBoxList.length; i++) {
		tickedIdArray.push(tickedBoxList[i].id.substring(('id'+type+'-').length))
	}
	document.getElementById('id' + type + 'Boxes').innerHTML = 
		getInOutCheckboxes(type, requiredAmount, tickedIdArray.join('_'), short);
	updateMessageAndGoButton(type, requiredAmount);
}

function updateListNameIcon(showIcons) {
	// showIcons: true (calc and show icons), false (show always text 'List' instead of icon, when there are no input/output radio buttons)
	var typeArray = ['Input', 'Output'];
	for (let j = 0; j < typeArray.length; j++) { // loop through 'Input' and 'Output'
		let type = typeArray[j];
		let cellAmount = cellAmountObj[type];
		let typeOther = (type == 'Input') ? 'Output' : 'Input';
		for (let i = 1; i <= cellAmount; i++) { // loop through the list fields of 'Input' and 'Output'
			var cellID = (type == 'Input') ? getCellName(type, i) : i;
			let code;
			if (showIcons) {
				let iconName = 'icon';
				let checkboxId = 'id' + type + '-' + type + '-' + i;
				if (document.getElementById(checkboxId).checked) { // tick in default listing
					iconName += '-' + type.toLowerCase();
				}
				if (document.getElementById('id' + typeOther + 'OtherLabel').style.display == 'none') { // other lists activated?
					checkboxId = 'id' + typeOther + '-' + type + '-' + i;
					if (document.getElementById(checkboxId).checked) { // tick in other listing
						iconName += '-' + typeOther.toLowerCase();
						iconName = (iconName == 'icon-output-input') ? 'icon-input-output' : iconName;
					}
				}
				iconName += '.svg';
				code = (iconName == 'icon.svg')
					? 'List'
					: '<img src="assets/' + iconName + '" class="img-input-output">';
			} else {
				code = 'List';
			}
			document.getElementById('idCellName' + cellID).innerHTML = code;
		}
	}
}

function updateMessageAndGoButton(type, requiredAmount)  {
	// type: 'Input', 'Output'
	var msg;
	var activeGoButton = false;
	var typeOther = (type == 'Input') ? 'Output' : 'Input';
	if (document.querySelectorAll('input[name="' + type + 'Boxes"]:checked').length == requiredAmount) {
		msg = '';
		if (document.getElementById(typeOther + 'Msg').innerHTML == '') {
			activeGoButton = true;
		}
	} else {
		msg = ' &nbsp; &nbsp; &nbsp; Please select ' + requiredAmount + ' lists';
	}
	document.getElementById(type + 'Msg').innerHTML = msg;
	if (activeGoButton) {
		document.getElementById('idButtonGo').classList.remove('pressedGoButton');
	} else {
		document.getElementById('idButtonGo').classList.add('pressedGoButton');
	}
}

function onchangeInOutCheckboxes(type, requiredAmount) {
	// type: 'Input', 'Output'
	updateMessageAndGoButton(type, requiredAmount);
	updateListNameIcon(true);
}

function getInOutCheckboxes(typeInOut, requiredAmount, tickedIdString, short) {
	// typeInOut: 'Input', 'Output'
	// short: true: only usual lists, false: all lists
	var tickedIds = tickedIdString.split('_');
	var typeArray = [];
	if (short) {
		typeArray[0] = typeInOut;
	} else {
		typeArray[0] = 'Input';
		typeArray[1] = 'Output';
	}
	var typeCheckboxRadio = (requiredAmount == 1) ? 'type="radio"' : 'type="checkbox"';
	var id;
	var ticked;
	var parameter = "'" + typeInOut + "', " + requiredAmount;
	var code = '';
	var styleHidden = '';
	if (requiredAmount == 0) {
		code += '---';
		styleHidden = ' style="visibility: hidden"';
	}
	for (let j=0; j<typeArray.length; j++) {
		code += (j==1) ? ' &nbsp; &nbsp; &nbsp; ' : '';
		for (let i=1; i<=cellAmountObj[typeArray[j]]; i++) {
			id = 'id' + typeInOut + '-' + typeArray[j] + '-' + i;
			ticked = (tickedIds.includes(typeArray[j]+'-'+i)) ? ' checked="checked"' : '';
			code += '<label' + styleHidden + '>';
			code += '  <input ' + typeCheckboxRadio + ' name="' + typeInOut + 'Boxes" id="' + id + '"';
			code += '    onchange="onchangeInOutCheckboxes(' + parameter + ');"' + ticked + '> ';
			code += getCellName(typeArray[j], i);
			code += '</label> &nbsp; ';
		}
	}
	if (! short) {
		styleHidden = ' style="display: none"';
	}
	code += '<label id="id' + typeInOut + 'OtherLabel"' + styleHidden + '> &nbsp; &nbsp; &nbsp; ';
	code += '  <input type="checkbox" id="id' + typeInOut + 'Other"';
	parameter +=  ", false";
	code += '    onchange="updateCheckboxesOneLine(' + parameter + ');"> ';
	code += (typeInOut == 'Input') ? ' output lists' : ' input lists';
	code += '</label> &nbsp; ';
	code += '<span id="' + typeInOut + 'Msg"></span>';
	return code;
}

function getProgressiveNumberString(type, end) {
	// type: 'Input', 'Output'
	var array = [];
	for (var i = 1; i <= end; i++) {
		array.push(type + '-' + i);
	}
	return array.join('_');
}

function showInOutCheckboxes(areaTop) {
	// areaTop: 'edit', 'sort', 'duplicates', 'setTheory', 'compare'
	var typeArray = ['Input', 'Output'];
	var ioaPropertyName = getInOutAmountsObjPropertyName(areaTop);
	var requiredAmounts = InOutAmounts[ioaPropertyName].split('_');
	var tickedIdString;
	var code;
	code = '<table>';
	for (let i=0; i<=1; i++) {
		code += '  <tr>';
		code += '    <td>' + typeArray[i] + '</td>';
		code += '    <td id="id' + typeArray[i] + 'Boxes">';
		tickedIdString = getProgressiveNumberString(typeArray[i], requiredAmounts[i]);
		code +=        getInOutCheckboxes(typeArray[i], requiredAmounts[i], tickedIdString, true);
		code += '    </td>';
		code += '  </tr>';
	}
	code += '  <tr>';
	code += '    <td colspan="2">';
	code += '      <button id="idButtonGo" onclick="goButton(' + `'` + areaTop + `'` + ')">Go</button>';
	code += '    </td>';
	code += '  </tr>';
	code += '</table>';
	document.getElementById('idInOut').innerHTML = code;
}

function goButton(area) {
	if (! document.getElementById('idButtonGo').classList.contains('pressedGoButton')) {
		var InOutArray = []; // two-dimensional array to store and pass IDs of ticks
		var typeArray = ['Input', 'Output'];
		var nodeList;
		var idPartsArray = [];
		var functionName = area;
		functionName = (area == 'edit') ? activeSubButton : functionName;
		// fill InOutArray with checked Input / Output radios
		for (let i = 0; i < typeArray.length; i++) {
			InOutArray[i] = [];
			nodeList = document.querySelectorAll('input[name="' + typeArray[i] + 'Boxes"]:checked')
			for (let j = 0; j < nodeList.length; j++) {
				idPartsArray = nodeList[j].id.split('-');
				if (idPartsArray[1] == 'Input') {
					InOutArray[i][j] = 'List' + getCellName('Input', idPartsArray[2]);
				} else {
					InOutArray[i][j] = 'List' + idPartsArray[2];
				}
			}
		}
		// call the specialist function
		window[functionName](InOutArray[0], InOutArray[1]);
	}
}

function countLines(fieldId) {
	var counter;
	if (document.getElementById(fieldId).value == '') {
		counter = 0;	
	} else {
		counter = document.getElementById(fieldId).value.split('\n').length;
	}
	document.getElementById('Counter' + fieldId).innerHTML = counter + ' lines';
	return counter;
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
	var trimmedLine;
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

function trim(inArray, outArray) {
	document.getElementById(outArray[0]).value = trimBlanksLines( document.getElementById(inArray[0]).value.split('\n') ).join('\n');
	countLines(outArray[0]);
} // function trim

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

function cases(inArray, outArray) {
	var inputStr = document.getElementById(inArray[0]).value;
	var outputStr = '';
	if (document.getElementById('idCasesLower').checked == false 
		&& document.getElementById('idCasesUpper').checked == false
		&& document.getElementById('idCasesProper').checked == false) { // no option selected
		alert('Please select an option.');
	} // no option selected
	
	if (document.getElementById('idCasesLower').checked) {
		outputStr = inputStr.toLowerCase();
	}
	
	if (document.getElementById('idCasesUpper').checked) {
		outputStr = inputStr.toUpperCase();
	}
	
	if (document.getElementById('idCasesProper').checked) {
		for (let i = 0; i < inputStr.length; i++ ) { // loop through list
			if (i == 0) {
				outputStr = outputStr + (inputStr.charAt(i)).toUpperCase();
			} else if (isLetterOrHighChar(inputStr.charAt(i)) && ! isLetterOrHighChar(inputStr.charAt(i-1))) {
				outputStr = outputStr + (inputStr.charAt(i)).toUpperCase();
			} else {
				outputStr = outputStr + (inputStr.charAt(i)).toLowerCase();
			}
		} // loop through list
	}
	document.getElementById(outArray[0]).value = outputStr;
	countLines(outArray[0]);
} // function cases

function repeat(inArray, outArray) {
	var amount = document.getElementById('RepeatTimes').value;
	var ListAArray = document.getElementById(inArray[0]).value.split('\n');
	var resultArray = [];
	for (let i = 0; i < ListAArray.length; i++ ) { // loop through list
		resultArray.push(ListAArray[i].repeat(amount));
	} // loop through list
	document.getElementById(outArray[0]).value = resultArray.join('\n');
	countLines(outArray[0]);
} // function repeat

function onchangeCheckedLeadingZeros() {
	if (document.getElementById('SeriesLeadingZero').checked) {
		document.getElementById('SeriesZeroAmount').classList.remove('hiddenFree');
	} else  {
		document.getElementById('SeriesZeroAmount').classList.add('hiddenFree');
	}
}

function addLeadingZeros(number, amount, end) {
	if (amount == 0) {
		amount = end.toString().length;
	}
	var amountZeros = amount - number.toString().length;
	if (amountZeros < 0) {
		amountZeros = 0;
	}
	return '0'.repeat(amountZeros) + number;
}

function series(inArray, outArray) {
	// to do: hexadeximal
	// to do: letter (upper and lower)
	var start = document.getElementById('SeriesStart').value * 1;
	var end = document.getElementById('SeriesEnd').value * 1;
	var haveLeadingZeros = document.getElementById('SeriesLeadingZero').checked;
	var amountLeadingZeros = document.getElementById('SeriesZeroAmount').value * 1;
	var resultArray = [];
	var ascending = (start < end) ? true : false;
	var nextLoop = true;
	while (nextLoop) {
		let number = start;
		if (haveLeadingZeros) {
			number = addLeadingZeros(number, amountLeadingZeros, end);
		}
		resultArray.push(number);
		if (ascending) {
			start++;
			nextLoop = (start <= end) ? true : false;
		} else {
			start--;
			nextLoop = (start >= end) ? true : false;
		}
	}
	document.getElementById(outArray[0]).value = resultArray.join('\n');
	countLines(outArray[0]);
} // function series

function split(inArray, outArray) {
	var delimiter = document.getElementById('SplitDelimiter').value;
	var doMasking = document.getElementById('SplitMasking').checked;
	clearMessage();
	if (doMasking) { // with activated masking
		// mixture of masked und unmasked parts are OK
		// masked parts with mask character in the middle is not allowed and the position is reported
		var textSource = document.getElementById(inArray[0]).value;
		var maskingChar = document.getElementById('SplitMaskingChar').value;
		var deliLen = delimiter.length;
		var maskLen = maskingChar.length;
		var i;
		var textOut = '';
		var posPartStart = 0;
		var status = 'start'; 
		// start:    in next loop: beginning mask or start of unmasked part or delimiter expected
		// masked:   in next loop: masked chars of part or ending mask expected
		// unmasked: in next loop: unmasked chars of part or ending mask expected
		// end:      in next loop: delimiter expected, because of ending mask
		var allOK = true;
		var errorMsg = 'Incorrect masks:';
		for (i = 0; i < textSource.length; i++) { // looping through string
			// until end of block is looped and then the block is copied to target
			// (seen afterwards: char by char would have been probably easier)
			if (textSource.substr(i, maskLen) == maskingChar) {
				if (status == 'start') { // start mask
					posPartStart = i + maskLen;
					status = 'masked';
					i = i + maskLen - 1;
				} else if (status == 'masked') { // end mask
					textOut += textSource.substring( posPartStart, i );
					status = 'end';
					i = i + maskLen - 1;
				} else if (status == 'end') { // mask char after masking
					i = i + maskLen - 1;
					allOK = false;
					errorMsg += '<div class="indentText">' + posPartStart.toString() + ' .. ' + (i).toString() + '</div>';
					status = 'unmasked'
				}
			} else if (textSource.substr(i, deliLen) == delimiter) {
				if (status == 'masked') {
					// skip (delimiter within mask);
				} else if (status == 'end') { // end of masked part
					textOut += '\n';
					i = i + deliLen - 1;
					posPartStart = i + 1;
					status = 'start';
				} else if (status == 'unmasked') { // end of part
					textOut += textSource.substring( posPartStart, i ) +  '\n';
					i = i + deliLen - 1;
					posPartStart = i + 1;
					status = 'start';
				} else if (status == 'start') { // empty string
					textOut += '\n';
					i = i + deliLen - 1;
					posPartStart = i + 1;
					status = 'start';
				}
			} else {
				if (status == 'start') { // first char of part
					status = 'unmasked'
				} else if (status == 'end') { // char after masking
					allOK = false;
					errorMsg += '<div class="indentText">' + posPartStart.toString() + ' .. ' + (i).toString() + '</div>';
					status = 'unmasked'
				} else { // looping through part (status: masked and unmasked)
					// skip
				}
			}
		} // looping through string
		if (status == 'masked') {
			allOK = false;
			errorMsg += '<div class="indentText">' + posPartStart.toString() + ' .. ' + (i).toString() + '</div>';
		} else if (status == 'unmasked') {
			textOut += textSource.substring( posPartStart, i );
		}
		document.getElementById(outArray[0]).value = textOut;
		if (!(allOK)) {
			showMessage('<span class="redText">' + errorMsg + '</span>');
		}
	} else { // withOut activated masking
		document.getElementById(outArray[0]).value = document.getElementById(inArray[0]).value.split(delimiter).join('\n');
	} // withOut activated masking
	countLines(outArray[0]);
} // function split

function prepend_append(textWithLinebreaks, preText, postText) {
	var textArray = textWithLinebreaks.split('\n');
	var newtextWithLinebreaks = '';
	for (let i = 0; i < textArray.length; i++) {
		newtextWithLinebreaks += preText + textArray[i] + postText;
		if (i+1 <  textArray.length) {
			newtextWithLinebreaks += '\n';
		}
	}
	return newtextWithLinebreaks;
} // function prepend_append

function joinOneList(inArray, outArray) {
	var delimiter = document.getElementById('JoinDelimiter').value;
	var doMasking = document.getElementById('JoinMasking').checked;
	if (doMasking) { // with masking
		document.getElementById(outArray[0]).value = prepend_append( 
			document.getElementById(inArray[0]).value, 
			document.getElementById('JoinMaskingChar').value, 
			document.getElementById('JoinMaskingChar').value 
		).split('\n').join(delimiter);
	} else { // withOut masking
		// check for occurences of delimiter
		let amount_delimiters = document.getElementById(inArray[0]).value.split(delimiter).length - 1;
		if (amount_delimiters > 0) {
			if (! confirm('The input contains ' + amount_delimiters 
				+ ' occurences of the delimiter.\nContinue anyway?')) {
				return;
			}
		}
		// join
		document.getElementById(outArray[0]).value 
			= document.getElementById(inArray[0]).value.split('\n').join(delimiter);
	} // withOut masking
}

function joinTwoLists(inArrayString, outString, leftIsLonger, usingfirsts) {
	// inArrayString: string with comma deimeted input list names: List*,List*
	// outString: output list name: List*
	// leftIsLonger: true = left list is longer, false right list is longer
	// usingfirsts: true = take first elements of longer list, false = take last elements of longer list
	closeHelp();	
	var inArray = inArrayString.split(',');
	var listArray1 = document.getElementById(inArray[0]).value.split('\n');
	var listArray2 = document.getElementById(inArray[1]).value.split('\n');
	var lenLongerList = (leftIsLonger) ? listArray1.length : listArray2.length;
	var lenShorterList = (leftIsLonger) ? listArray2.length : listArray1.length;
	var lenDiff = lenLongerList - lenShorterList;
	var listArrayNew = [];
	for (let i = 0; i < lenLongerList; i++) {
		// calc left element
		let leftElement = '';
		if (leftIsLonger) {
			leftElement = listArray1[i];
		} else if (usingfirsts) {
			if (i < lenShorterList) {
				leftElement = listArray1[i];
			}
		} else {
			if (i >= (lenDiff) ) {
				leftElement = listArray1[i - lenDiff];
			}
		}
		// calc right element
		let rightElement = '';
		if (! leftIsLonger) {
			rightElement = listArray2[i];
		} else if (usingfirsts) {
			if (i < lenShorterList) {
				rightElement = listArray2[i];
			}
		} else {
			if (i >= (lenDiff) ) {
				rightElement = listArray2[i - lenDiff];
			}
		}
		// join both elements
		listArrayNew[i] = leftElement + rightElement;
	}
	document.getElementById(outString).value = listArrayNew.join('\n');
} // function joinTwoLists

function joinTwoListsPreCheck(inArray, outArray) {
	if (document.getElementById('idJoinTwoPosFlip').checked) {
		inArray.reverse();
	}
	var lenInputLeft = countLines(inArray[0]);
	var lenInputRight = countLines(inArray[1]);
	if (lenInputLeft == lenInputRight) {
		joinTwoLists(inArray.join(','), outArray[0], true, true);
	} else {
		var leftIsLonger = (lenInputLeft > lenInputRight) ? true : false;
		var idLonger = (leftIsLonger) ? inArray[0].slice(-1) : inArray[1].slice(-1);
		var idShorter = (leftIsLonger) ? inArray[1].slice(-1) : inArray[0].slice(-1);
		var parameters_base = '`' + inArray.join(',') + '`, ';
		parameters_base += '`' + outArray[0] + '`, ' + leftIsLonger + ', ';
		var parameters;
		var img;
		var code = '';
		code += 'List ' + idLonger + ' is longer than list ' + idShorter + '.<br>';
		code += '<ul>';
		code += '<li>';
		code += 'Do you want to join the first elements of list ' + idLonger + '<br>';
		code += 'with the elements of list ' + idShorter + '?<br>';
		parameters = parameters_base + 'true';
		code += '<button onclick="joinTwoLists(' + parameters + ')" class="indentButton">';
		img = (leftIsLonger) ? 'assets/edit_join_two_left-longer-firsts.svg'
			: 'assets/edit_join_two_right-longer-firsts.svg';
		code += '<img src="' + img + '">';
		code += '</button><br>';
		code += '</li>';
		code += '<br>';
		code += '<li>';
		code += 'Do you want to join the last elements of list ' + idLonger + '<br>';
		code += 'with the elements of list ' + idShorter + '?<br>';
		parameters = parameters_base + 'false';
		code += '<button onclick="joinTwoLists(' + parameters + ')" class="indentButton">';
		img = (leftIsLonger) ? 'assets/edit_join_two_left-longer-lasts.svg'
			: 'assets/edit_join_two_right-longer-lasts.svg';
		code += '<img src="' + img + '">';
		code += '</button><br>';
		code += '</li>';
		code += '</ul>';
		code += '<br>';
		showDialog(code); 
	}
}

function joinText(inArray, outArray) {
	var text = document.getElementById('JoinText').value;
	var textBefore = document.getElementById('idJoinTextPosBefore').checked;
	var listArray = document.getElementById(inArray[0]).value.split('\n');
	for (let i = 0; i < listArray.length; i++) {
		if (textBefore) {
			listArray[i] = text + listArray[i];
		} else {
			listArray[i] = listArray[i] + text;
		}
	}
	document.getElementById(outArray[0]).value = listArray.join('\n');
}

function join(inArray, outArray) {
	// One List
	if (document.getElementById('idEditJoinOneList').checked) {
		joinOneList(inArray, outArray);
	}
	// Two Lists
	if (document.getElementById('idEditJoinTwoLists').checked) {
		joinTwoListsPreCheck(inArray, outArray);
	}
	// Text
	if (document.getElementById('idEditJoinText').checked) {
		joinText(inArray, outArray);
	}
	countLines(outArray[0]);
} // function join

function sort(inArray, outArray) {
	var ListAArray = document.getElementById(inArray[0]).value.split('\n');
	if (document.getElementById('idSortAlpha').checked) { // alphabetical
		ListAArray.sort(function(a, b){
    		if(a.toLowerCase() < b.toLowerCase()) { return -1; }
  			if(a.toLowerCase() > b.toLowerCase()) { return 1; }
	 		return 0;
		});
	} else if (document.getElementById('idSortAscii').checked) { // ASCII
		ListAArray.sort();
	} // ASCII
	document.getElementById(outArray[0]).value = ListAArray.join('\n');
	countLines(outArray.join('_'));
} // function sort

function duplicates(inArray, outArray) {
	var ListAArray = document.getElementById(inArray[0]).value.split('\n');
	var onlySingles = document.getElementById('duplicatesOnlySingles').checked;
	var len = ListAArray.length;
	var UniqueList = [];
	var DuplicatesList = [];
	for (let i = 0; i < len; i++) { // loop through list
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
	document.getElementById(outArray[0]).value = UniqueList.join('\n');
	document.getElementById(outArray[1]).value = DuplicatesList.join('\n');
	countLinesX(outArray.join('_'));
} // function duplicates

function setTheory(inArray, outArray) {
	// Schnittmenge _ intersection of A and B
	// Differenzmenge A \ B
	// Symmetrische Differenz _ symmetric difference of A and B
	// Vereinigungsmenge _ union of A and B
	var ListAArray = document.getElementById(inArray[0]).value.split('\n');
	var ListBArray = document.getElementById(inArray[1]).value.split('\n');
	var lenA = ListAArray.length;
	var lenB = ListBArray.length;
	var DifferenzmengeA = []; // relative complement of B in A
	var Schnittmenge = []; // intersection of A and B
	var DifferenzmengeB = []; // relative complement of A in B
	var Vereinigungsmenge = []; // union of A and B
	var SymDiffmenge = []; // symmetric difference of A and B
	if (document.getElementById('idSetTheoryInterDiff').checked == false 
		&& document.getElementById('idSetTheoryUnion').checked == false
		&& document.getElementById('idSetTheorySymmDiff').checked == false) { // no option selected
		alert('Please select an option.');
	} // no option selected
	if (document.getElementById('idSetTheoryInterDiff').checked) { // intersection and difference sets
		// DifferenzmengeA and Schnittmenge
		for (let i = 0; i < lenA; i++) { // loop through list A
			if(ListBArray.indexOf(ListAArray[i]) == -1) { // not found -> Differenzmenge
				DifferenzmengeA.push(ListAArray[i]);
			} else { // found -> Schnittmenge
				Schnittmenge.push(ListAArray[i]);
			} // found -> Schnittmenge
		} // loop through list A
		// DifferenzmengeB
		for (let i = 0; i < lenB; i++) { // loop through list B
			if(ListAArray.indexOf(ListBArray[i]) == -1) { // not found -> Differenzmenge
				DifferenzmengeB.push(ListBArray[i]);
			} // not found -> Differenzmenge
		} // loop through list B
		document.getElementById(outArray[0]).value = DifferenzmengeA.join('\n');
		document.getElementById(outArray[1]).value = Schnittmenge.join('\n');
		document.getElementById(outArray[2]).value = DifferenzmengeB.join('\n');
	} // intersection and difference sets

	if (document.getElementById('idSetTheoryUnion').checked) { // union set
		for (let i = 0; i < lenA; i++) { // loop through list A
			if(Vereinigungsmenge.indexOf(ListAArray[i]) == -1) { // not found -> first occurance
				Vereinigungsmenge.push(ListAArray[i]);
			} // not found -> first occurance
		} // loop through list A
		for (let i = 0; i < lenB; i++) { // loop through list B
			if(Vereinigungsmenge.indexOf(ListBArray[i]) == -1) { // not found -> first occurance
				Vereinigungsmenge.push(ListBArray[i]);
			} // not found -> first occurance
		} // loop through list B
		document.getElementById(outArray[0]).value = Vereinigungsmenge.join('\n');
	} // union set
	
	if (document.getElementById('idSetTheorySymmDiff').checked) { // symmetric difference set
		for (let i = 0; i < lenA; i++) { // loop through list A
			if(ListBArray.indexOf(ListAArray[i]) == -1) { // not found -> Differenzmenge
				SymDiffmenge.push(ListAArray[i]);
			} // not found -> first occurance
		} // loop through list A
		for (let i = 0; i < lenB; i++) { // loop through list A
			if(ListAArray.indexOf(ListBArray[i]) == -1) { // not found -> Differenzmenge
				SymDiffmenge.push(ListBArray[i]);
			} // not found -> first occurance
		} // loop through list A
		document.getElementById(outArray[0]).value = SymDiffmenge.join('\n');
	} // symmetric difference set
	
	countLinesX(outArray.join('_'));
} // function setTheory

function compare(inArray, outArray) {
	var showDetails = document.getElementById('compareDetails').checked;
	var ListA_Value = document.getElementById(inArray[0]).value;
	var ListB_Value = document.getElementById(inArray[1]).value;
	var ListA_Array = ListA_Value.split('\n');
	var ListB_Array = ListB_Value.split('\n');
	var ListA_ArrayLowerCase = ListA_Value.toLowerCase();
	var ListB_ArrayLowerCase = ListB_Value.toLowerCase();
	var ListA_ArrayTrimmed = trimBlanksLines(ListA_Array);
	var ListB_ArrayTrimmed = trimBlanksLines(ListB_Array);
	var ListA_ValueTrimmed = ListA_ArrayTrimmed.join('\n');
	var ListB_ValueTrimmed = ListB_ArrayTrimmed.join('\n');
	var ListA_ArrayLowerCaseTrimmed = ListA_ValueTrimmed.toLowerCase();
	var ListB_ArrayLowerCaseTrimmed = ListB_ValueTrimmed.toLowerCase();
	var result = '';
	var detailsA = '';
	var detailsB = '';
	if( ListA_Value == ListB_Value ) {
		result += 'Both lists are 100 % identical.';
	} else {
		if ( ListA_ArrayLowerCaseTrimmed == ListB_ArrayLowerCaseTrimmed ) {
			result += 'Both lists are similar except of:<br> &nbsp; ';
			if ( ListA_ValueTrimmed == ListB_ValueTrimmed ) {
				result += '=';
			} else {
				result += '&#8800;'; // &#8800; ≠
			}
			result += ' &nbsp; Capital and lowercase letters<br> &nbsp; ';
			if ( ListA_ArrayLowerCase == ListB_ArrayLowerCase ) {
				result += '=';
			} else {
				result += '&#8800;'; // &#8800; ≠
			}
			result += ' &nbsp; Beginning and ending whitespaces and empty lines';
		} else {
			result += 'The lists are different.';
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
		document.getElementById(outArray[0]).value = detailsA;
		detailsB = '# of lines: ' + ListB_Array.length + '\n';
		detailsB += '# of char: ' + ListB_Value.length + '\n';
		detailsB += '# of char without linebreaks: ' + (ListB_Value.length - ListB_Array.length + 1) + '\n\n';
		detailsB += 'After trimming:\n';
		detailsB += '# of lines: ' + ListB_ArrayTrimmed.length + '\n';
		detailsB += '# of char: ' + ListB_ValueTrimmed.length + '\n';
		detailsB += '# of char without linebreaks: ' + (ListB_ValueTrimmed.length - ListB_ArrayTrimmed.length + 1);
		document.getElementById(outArray[1]).value = detailsB;
	}
	showMessage(result + '<br>');
	countLinesX(outArray.join('_'));
} // function compare
