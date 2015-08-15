document.addEventListener( "DOMContentLoaded", function () {

	document.getElementById('file').addEventListener('change', readFile, false);

	var content = document.getElementById("content");
	var download = document.getElementsByClassName("download");
	var tab1 = document.getElementById("tab1");
	var tab2 = document.getElementById("tab2");
	var tab3 = document.getElementById("tab3");
	var success = document.getElementById("success");
	var modal = document.getElementById("modal");
		
	var customerList = [];
	var invoiceList = [];
	var processed = [];
		
	var reader = new FileReader();

	
	String.prototype.htmlEscape = function() {
		return $('<div/>').text(this.toString()).html();
	};
	
	function readFile (evt) {
		customerList = [];
		invoiceList = [];
		var files = evt.target.files;
		var file = files[0];           
		if (file != undefined) {
			modal.style.display = "block";
		}
		reader.onload = function() {
			modal.style.display = "none";
			//toTable(parseCSV(this.result));
			try {
				downloadButton(0, invoicesToXML(loadInvoices(parseCSV(this.result))), file.name, "-output-xml.cei");
				downloadButton(1, invoiceCSV(), file.name, "-output-csv.csv");
				successState();
			} catch (err) {
				console.log();
				error(err);
			}
		}
		reader.readAsText(file);
	}
	
	function error (e) {
		tab3.style.display = "block";
		tab2.style.display = "none";
		tab1.style.display = "none";
		tab3.innerHTML = "<h3 style='color:red;'>Processing failed.</h3><p>" +	e + "</p>";
	};

	function successState() {
		success.innerHTML = "<h5>" + customerList.length + " customer" + (customerList.length > 1 ? "s" : "") + " and " + invoiceList.length + " invoice" + (invoiceList.length > 1 ? "s" : "") + " processed.</h5>";
		tab1.style.display = "none";
		tab2.style.display = "block";
	}
	
	function parseCSV (data) {
		data = data.htmlEscape();
		rows = data.split("\n");
		for (var i = 0; i < rows.length; i++) {
			rows[i] = rows[i].splitIgnore(",", '"');
		}
		return rows;
	}

	function invoiceCSV() {
		var result = "id,status\n";
		for (var i = 0; i < invoiceList.length; i++) {
			result += invoiceList[i] + ",processed\n";
		}
		return result;
	}
	
	function downloadButton(index, file, filename, suffix) {
		fp = filename.split(".csv")[0] + suffix;
		download[index].download = fp;
		download[index].innerHTML = fp;
		download[index].href = "data:text/plain," + encodeURIComponent(file);
	}
	
	function twoDigits(number) {
		if (number < 10) {
			return "0" + String(number);
		} else {
			return number;
		}
	}
	
	function formatDate(dateString) {
		// date string originally in MM/DD/YY, convert to YYYY-MM-DD
		var d = new Date(dateString);
		return d.getFullYear() + "-" + twoDigits(d.getMonth() + 1) + "-" + twoDigits(d.getDate());
	}
	
	function itemToXML(item) {
		result = "\t\t<item>\n";
		result += '\t\t\t<itemnum>' + item.item_code + '</itemnum>\n';
		result += '\t\t\t<description>' + item.item_display_output + '</description>\n';
		result += '\t\t\t<qty>' + item.item_quantity + '</qty>\n';
		result += '\t\t\t<unitprice>' + item.item_price + '</unitprice>\n';
		result += '\t\t\t<taxable>' + String(Number(item.item_tax_rate) > 0 ? 1 : 0) + '</taxable>\n';
		result += '\t\t</item>\n';
		
		return result;
	}
	
	function invoiceToXML (invoice) {

		// count customers and invoices here...
		if (invoice.location_computerease_id == undefined) {
			throw "location_computerease_id column is missing from source CSV file.";
		}
		
		if (customerList.indexOf(invoice.location_computerease_id) == -1) customerList.push(invoice.location_computerease_id);
		if (invoiceList.indexOf(invoice.invoice_number) == -1) invoiceList.push(invoice.invoice_number);
		
		result = '<invoice>\n';
		result += '\t<cusnum>' + invoice.location_computerease_id + '</cusnum>\n';  // might need a different field
		result += '\t<invnum>' + invoice.invoice_number + '</invnum>\n';
		result += '\t<notes>' + invoice.notes + '</notes>\n';
		result += '\t<invdate>' + formatDate(invoice.transaction_date) + '</invdate>\n';
		if (invoice.items != undefined) {
			result += '\t<items>\n';
			for (item_id in invoice.items) {
				result += itemToXML (invoice.items[item_id]);
			}
			result += '\t</items>\n';
		}
		result += '</invoice>\n';

		return result;
	}
	
	function invoicesToXML (invoices) {
		var result = 	'<?xml version="1.0" encoding="UTF-8"?>\n' +
						'<import type="freeform">\n';
		for (id in invoices) {
			result += invoiceToXML (invoices[id]);
		}
		result += '</import>\n';
		console.log(result);
		
		return result;
	}
	
	function loadInvoices (arr) {
		var invoices = {};
		var id = arr[0].indexOf("id");
		
		if (id == -1) {
			throw "Id column is missing from source CSV file.";
		}
		
		for (var i = 1; i < arr.length; i++) {
			var newInvoice = {items: {}};
			var newItem = {};
			for (var j = 0; j < arr[i].length; j++) {
				var entry = arr[i][j].replace(/"/g, '');
				if (arr[0][j].substring(0,4) == "item") {
					newItem[arr[0][j]] = entry;
				} else {
					newInvoice[arr[0][j]] = entry;
				}
			}
			if (invoices[arr[i][id]] == undefined && arr[i][id] != undefined) {
				invoices[arr[i][id]] = newInvoice;
				if (newItem.item_id != "") {
					invoices[arr[i][id]].items[newItem.item_id] = newItem;
				}
			}
		}
		return invoices;
	}
	
	function toTable (arr) {
		var table = document.createElement("table");
		var row = table.insertRow(0);
		for (var i = 0; i < arr[0].length; i++) {
			var cell = row.insertCell(i);
			cell.innerHTML = "<b>" + arr[0][i] + "</b>";
		}
		for (var j = 1; j < arr.length; j++) {
			var row = table.insertRow(j);
			for (var i = 0; i < arr[j].length; i++) {
				var cell = row.insertCell(i);
				cell.innerHTML = arr[j][i];
			}
		}
		content.appendChild(table);
	}

	String.prototype.splitIgnore = function (c, ignore) {
		var result = [];
		var buffer = '';
		var ignoring = false;
		for (var i = 0; i < this.length; i++) {
			if (ignoring == false) {
				if (this[i] == c) {
					result.push(buffer);
					buffer = '';
				} else if (this[i] == ignore) {
					ignoring = true;
					buffer += this[i];
				} else {
					buffer += this[i];
				}
			} else {
				if (this[i] == ignore) {
					buffer += this[i];
					ignoring = false;
				} else {
					buffer += this[i];
				}
			}
		}
		return result;
	};


});