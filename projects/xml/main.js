document.addEventListener( "DOMContentLoaded", function () {

	document.getElementById('file').addEventListener('change', readFile, false);

	var content = document.getElementById("content");
	var download = document.getElementById("download");
		
	function readFile (evt) {
		var files = evt.target.files;
		var file = files[0];           
		var reader = new FileReader();
		reader.onload = function() {
			//toTable(parseCSV(this.result));
			downloadButton(invoicesToXML(loadInvoices(parseCSV(this.result))), file.name);
		}
		reader.readAsText(file)
	}

	function parseCSV (data) {
		rows = data.split("\n");
		for (var i = 0; i < rows.length; i++) {
			rows[i] = rows[i].splitIgnore(",", '"');
		}
		return rows;
	}

	function downloadButton(xml, filename) {
		fp = filename.split("-input.csv")[0] + "-output-xml.cei";
		console.log('here', download);
		download.download = fp;
		download.innerHTML = fp;
		download.href = "data:text/plain," + encodeURIComponent(xml);
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
		console.log(invoice);
		result = '<invoice>\n';
		result += '\t<cusnum>' + invoice.customer_computerease_id + '</cusnum>\n';
		result += '\t<invnum>' + invoice.invoice_number + '</invnum>\n';
		result += '\t<notes>' + invoice.notes + '</notes>\n';
		result += '\t<invdate>' + formatDate(invoice.transaction_date) + '</invdate>\n';
		result += '\t<items>\n';
		for (item_id in invoice.items) {
			result += itemToXML (invoice.items[item_id]);
		}
		result += '\t</items>\n';
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
			if (invoices[arr[i][id]] == undefined) {
				invoices[arr[i][id]] = newInvoice;
			}
			invoices[arr[i][id]].items[newItem.item_id] = newItem;
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