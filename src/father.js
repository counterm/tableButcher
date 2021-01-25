// strong man
/*

*/
export default {
    split(td, decorater) {
        if (!td) return;
        if (!decorater) decorater = (td) => td;
        let [spanRow, spanCol] = this.getSpan(td);
        if (spanRow > 1 || spanCol > 1) {
            td.rowSpan = 1;
            td.colSpan = 1;
            // row 1
            let spanIndexCol = spanCol - 1;
            while (spanIndexCol > 0) {
                td.after(decorater(document.createElement('td'), 0,  spanIndexCol - 1));
                spanIndexCol--;
            }
            // other row
            let spanIndexRow = spanRow - 1 - 1;
            const arrTdIndex = this.getTdIndex(td);
            const arrTdMatrix = this.getTdMatrix(td);
            while (spanIndexRow >= 0) {
                spanIndexCol = spanCol - 1;
                const tr = td.parentNode.parentNode.childNodes[arrTdIndex[0] + (spanRow - 1 - spanIndexRow)];
                const tds = tr.childNodes;
                const firstTdMatrix = tds.length > 0 ? this.getTdMatrix(tds[0]) : Number.MAX_VALUE;
                /*
                    1. The td ready to merge was on the first cell index.
                    2. The row was empty.
                    3. The first td in the row must be after the td which ready to insert.
                 */
                if (arrTdMatrix[0] == 0 && tds.length == 0 && firstTdMatrix[1] <= arrTdMatrix[1]) {
                    while (spanIndexCol >= 0) {
                        tr.appendChild(decorater(document.createElement('td'), spanRow - 1 - spanIndexRow, spanCol - 1 - spanIndexCol));
                        spanIndexCol--;
                    }
                } else {
                    for (let index = 0; index < tds.length; index++) {
                        const tdFound = tds[index];
                        const tdFoundMatrix = this.getTdMatrix(tdFound);
                        if (tdFoundMatrix[1] > arrTdMatrix[1]) {
                            while (spanIndexCol >= 0) {
                                tdFound.before(decorater(document.createElement('td'), spanRow - 1 - spanIndexRow, spanCol - 1 - spanIndexCol));
                                spanIndexCol--;
                            }
                            break;
                        } else if (index + 1 == tds.length) {   // last position
                            while (spanIndexCol >= 0) {
                                tdFound.after(decorater(document.createElement('td'), spanRow - 1 - spanIndexRow, spanIndexCol - 1));
                                spanIndexCol--;
                            }
                        }
                    }
                }
                spanIndexRow--;
            }
        }
        this.refresh();
    },

    deleteColumn(td) {
        if (!td) return;
        // const size = td.colSpan;
        const [tdRowMatrix, tdColMatrix] = this.getTdMatrix(td);
        const tdColSpan = td.colSpan;
        let tdColCount = 0;

        while (tdColCount < tdColSpan) {
            this.deleteColumnHandler(tdColMatrix);
            this.refresh();
            tdColCount++;
        }
    },

    deleteColumnHandler(tdColMatrix) {
        const tdDone = [];
        const tbSize = this.getSize();
        let rowIndex = 0;

        while (rowIndex < tbSize[0]) {
            const tdFound = this.getTdByMatrix(rowIndex, tdColMatrix);
            if (tdFound && tdDone.indexOf(tdFound) == -1) {
                if (tdFound.colSpan > 1) {
                    tdFound.colSpan -= 1;
                } else {
                    tdFound.parentNode.removeChild(tdFound);
                }
                tdDone.push(tdFound);
                // fix some td rowSpan greater than 1, and delete wrong TDs in the next row.
                if (tdFound.rowSpan > 1) {
                    rowIndex += tdFound.rowSpan;
                    continue;
                }
            }
            rowIndex++;
        }
    },
    
    deleteRow(td) {
        if (!td) return;
        // const tr = td.parentNode;
        const [tdRowMatrix, tdColMatrix] = this.getTdMatrix(td);

        const tdRowSpan = td.rowSpan;
        let tdRowCount = 0;
        while (tdRowCount < tdRowSpan) {
            this.deleteRowHandler(tdRowMatrix);
            this.refresh();
            tdRowCount++;
        }
    },

    deleteRowHandler(tdRowMatrix) {
        const tr = this.dom.childNodes[0].childNodes[tdRowMatrix];
        const nextTr = tr.nextElementSibling;
        const tbSize = this.getSize();
        let colIndex = 0;
        const tdMarkShort = [];
        while (colIndex < tbSize[1]) {
            const cellType = this.cellType(tdRowMatrix, colIndex);

            // 
            if (cellType == this.CELL_BIG_HEAD) {
                const tdFound = this.getTdByMatrix(tdRowMatrix, colIndex);
                // move tdFound to next tr
                if (tdFound.rowSpan > 1 && tbSize[0] != tdRowMatrix) {
                    let nextTdColMatrix = colIndex + tdFound.colSpan;
                    while (nextTdColMatrix < tbSize[1]) {
                        const nextRowTd = this.getTdByMatrix(tdRowMatrix + 1, nextTdColMatrix);
                        if (nextRowTd.parentNode == nextTr) {
                            nextRowTd.before(tdFound);
                            break;
                        }
                        nextTdColMatrix++;
                    }
                    if (tdFound.parentNode != nextTr) {
                        nextTr.appendChild(tdFound);
                    }
                    // make sure short it.
                    tdFound.rowSpan--;
                    this.refresh();
                }

                colIndex += tdFound.colSpan;
            } else if(cellType == this.CELL_BIG) {
                const tdFound = this.getTdByMatrix(tdRowMatrix, colIndex);
                tdMarkShort.push(tdFound);
                this.refresh()
                colIndex += tdFound.colSpan;
            } else {
                colIndex++;
            }
        }
        tdMarkShort.forEach((td) => td.rowSpan--);
        tr.parentNode.removeChild(tr);
    }
};