export default {
	newTd: () => document.createElement('td'),
	delTd: (row, td) => row.removeChild(td),
	newTr: () => document.createElement('tr'),
	delTr: (table, row) => table.childNodes[0].removeChild(row),

	findRowByIndex: (table, rowIndex) => table.childNodes[0].childNodes[rowIndex],

	getTdRowSpan: (obj) => obj.rowSpan,
	getTdColSpan: (obj) => obj.colSpan,
	getRowByIndex: (table, index) => table.childNodes[0].childNodes[index],
	getRowByTd(table, td){
		let ret = null;
		this.eachRow(table, (row) => {
			const index = Array.prototype.indexOf.call(row.childNodes, td);
			if (index > -1) {
				ret = row
			}
		});
		return ret;
	},
	// return array
	getTdsInRow: (row) => row.childNodes,
	getTdInRow: (row, index) => row.childNodes[index],
	getRowSize: (table) => {
		if (table && table.childNodes && table.childNodes.length > 0) {
			return table.childNodes[0].childNodes.length;
		} else {
			return 0;
		}
	},
	eachRow:(table, fn) => {
		if (table && table.childNodes && table.childNodes.length > 0) {
			table.childNodes[0].childNodes.forEach(fn)
		}
	},

	insertRow: (table, index) => table.insertRow(index),
	insertBeforeTd: (row, td, newEl) => td.before(newEl),
	insertAfterTd: (row, td, newEl) => td.after(newEl),
	appendTd: (tr, el) => tr.appendChild(el),
	moveTdChilds: (tdSource, tdTarget) => {
		if (!tdSource || !tdSource.childNodes || tdSource.childNodes.length == 0) { return }
		tdSource.childNodes.forEach(node => tdTarget.append(node))
	},

	/**
	 * @param {Element} td 			给哪个TD进行操作
	 * @param {Number} rowSpan 		td rowSpan设置值，当offset=true时，rowSpan则为相对变动的值
	 * @param {Number} colSpan 		td colSpan设置值，当offset=true时，colSpan则为相对变动的值
	 * @param {Boolean} offset 		指明是否把前两值作为相对变动的值
	 */
	setTdSpan(td, rowSpan, colSpan, offset = false){
		if (rowSpan) {
			if (offset) {
				td.rowSpan += rowSpan;
			} else {
				td.rowSpan = rowSpan;
			}
		}
		if (colSpan) {
			if (offset) {
				td.colSpan += colSpan;
			} else {
				td.colSpan = colSpan;
			}
		}
		return td;
	}
}

/*
fix keyword:
colSpan, rowSpan,
parentNode
appendChild, append
before, after
document, createElement
*/