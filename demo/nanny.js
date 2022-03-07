function getNanny() {
	return {
		deleteObjectInArray(arr, obj) {
			const index = arr.indexOf(obj)
			if (index > -1) {
				arr.splice(index, 1)
			}
		},
		newTd: () => { return {colspan: 1, rowspan: 1}},
		delTd(row, td) {
			this.deleteObjectInArray(row, td)
		},
		newTr: () => [],
		delTr(object, row) {
			this.deleteObjectInArray(object, row)
		},

		getTdRowSpan: (obj) => obj.rowspan,
		getTdColSpan: (obj) => obj.colspan,
		getRowByIndex: (object, index) => object[index],
		getRowByTd(object, td){
			let ret = null
			this.eachRow(object, (row) => {
				const index = row.indexOf(td)
				if (index > -1) {
					ret = row
				}
			})
			return ret
		},
		// return array
		getTdsInRow: (row) => row,
		getTdInRow: (row, index) => row[index],
		getRowSize: (object) => object.length,
		eachRow:(object, fn) => {
			if (object && object.length > 0) {
				object.forEach(fn)
			}
		},
		// 在索引index前插入行
		insertEmptyRow(object, index) {
			const newTr = this.newTr()
			object.splice(index, 0, newTr)
			return newTr
			// let colsize = 0
			// if (!object || object.length == 0) {
			// 	return
			// }
			// if (index < 0){
			// 	index = 0
			// }
			// if (index >= object.length) {
			// 	index = object.length
			// }
			// // How many cell in one row
			// let cellsize = object[0].reduce((total, col) => total + (+col.colspan), 0)
			// const ret = []
			// while(cellsize > 0) {
			// 	ret.push(this.newTd())
			// 	cellsize--
			// }
			// object.splice(index, 0, ret)
		},
		insertRowBefore(object, row, newRow) {
			const index = object.indexOf(row)
			object.splice(index, 0, newRow)
		},
		insertBeforeTd: (row, td, newEl) => {
			row.splice(row.indexOf(td), 0, newEl)
		},
		insertAfterTd: (row, td, newEl) => {
			row.splice(row.indexOf(td) + 1, 0, newEl)
		},
		appendTd: (row, newEl) => row.push(newEl),
		// 移动td内容到新td
		moveTdChilds: (tdSource, tdTarget) => {
			// if (!tdSource || !tdSource.list || tdSource.list.length == 0) { return }
			// if (!tdTarget.list) {
			// 	tdTarget.list = []
			// }
			// const insertIndex = tdTarget.list.length
			// tdTarget.list.splice(insertIndex, 0, ...tdSource.list)
			// // 清空源td内容
			// tdSource.list.length = 0
			if (tdSource.text) {
				if (tdTarget.text == null) {
					tdTarget.text = ''
				}
				tdTarget.text += tdSource.text
			}
		},

		/**
		 * @param {Element} td 			给哪个TD进行操作
		 * @param {Number} rowSpan 		td rowSpan设置值，当offset=true时，rowSpan则为相对变动的值
		 * @param {Number} colSpan 		td colSpan设置值，当offset=true时，colSpan则为相对变动的值
		 * @param {Boolean} offset 		指明是否把前两值作为相对变动的值
		 */
		setTdSpan(td, rowSpan, colSpan, offset = false){
			if (rowSpan !== null) {
				if (offset) {
					td.rowspan += rowSpan
				} else {
					td.rowspan = rowSpan
				}
			}
			if (colSpan !== null) {
				if (offset) {
					td.colspan += colSpan
				} else {
					td.colspan = colSpan
				}
			}
			return td
		}
	}
}

window.getNanny = getNanny