// strong man
/*

*/
export default {
    split(td, decorater) {
        if (!td) return;
        if (!decorater) decorater = (td) => td;
        let [spanRow, spanCol] = this.getSpan(td);
        if (spanRow > 1 || spanCol > 1) {
            this.nanny.setTdSpan(td, 1, 1);
            // row 1
            let spanIndexCol = spanCol - 1;
            while (spanIndexCol > 0) {
                this.nanny.insertAfterTd(
                    this.nanny.getRowByTd(this.dom, td), 
                    td,
                    decorater(this.nanny.newTd(), 0,  spanIndexCol - 1)
                );
                spanIndexCol--;
            }
            // other row
            let spanIndexRow = spanRow - 1 - 1;
            const arrTdIndex = this.getTdIndex(td);
            const arrTdMatrix = this.getTdMatrix(td);
            while (spanIndexRow >= 0) {
                spanIndexCol = spanCol - 1;
                const tr = this.nanny.getRowByIndex(this.dom, arrTdIndex[0] + (spanRow - 1 - spanIndexRow));
                const tds = this.nanny.getTdsInRow(tr);
                const firstTdMatrix = tds.length > 0 ? this.getTdMatrix(tds[0]) : Number.MAX_VALUE;
                /*
                    1. The td ready to merge was on the first cell index.
                    2. The row was empty.
                    3. The first td in the row must be after the td which ready to insert.
                 */
                if (arrTdMatrix[0] == 0 && tds.length == 0 && firstTdMatrix[1] <= arrTdMatrix[1]) {
                    while (spanIndexCol >= 0) {
                        this.nanny.appendTd(
                            tr,
                            decorater(this.nanny.newTd(), spanRow - 1 - spanIndexRow, spanCol - 1 - spanIndexCol)
                        );
                        spanIndexCol--;
                    }
                } else {
                    for (let index = 0; index < tds.length; index++) {
                        const tdFound = tds[index];
                        const tdFoundMatrix = this.getTdMatrix(tdFound);
                        if (tdFoundMatrix[1] > arrTdMatrix[1]) {
                            while (spanIndexCol >= 0) {
                                this.nanny.insertBeforeTd(
                                    tr,
                                    tdFound,
                                    decorater(this.nanny.newTd(), spanRow - 1 - spanIndexRow, spanCol - 1 - spanIndexCol)
                                );
                                spanIndexCol--;
                            }
                            break;
                        } else if (index + 1 == tds.length) {   // last position
                            while (spanIndexCol >= 0) {
                                this.nanny.insertAfterTd(
                                    tr,
                                    tdFound,
                                    decorater(this.nanny.newTd(), spanRow - 1 - spanIndexRow, spanIndexCol - 1)
                                );
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
        const tdColSpan = this.nanny.getTdColSpan(td);
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
                let span = this.nanny.getTdColSpan(tdFound);
                if (span > 1) {
                    this.nanny.setTdSpan(tdFound, null, span - 1);
                } else {
                    this.nanny.delTd(this.nanny.getRowByIndex(this.dom, rowIndex), tdFound);
                }
                tdDone.push(tdFound);
                // fix some td rowSpan greater than 1, and delete wrong TDs in the next row.
                const rowSpan = this.nanny.getTdRowSpan(tdFound);
                if (rowSpan > 1) {
                    rowIndex += rowSpan;
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

        const tdRowSpan = this.nanny.getTdRowSpan(td);
        let tdRowCount = 0;
        while (tdRowCount < tdRowSpan) {
            this.deleteRowHandler(tdRowMatrix);
            this.refresh();
            tdRowCount++;
        }
    },

    deleteRowHandler(tdRowMatrix) {
        const tr = this.nanny.findRowByIndex(this.dom, tdRowMatrix);
        // const nextTr = tr.nextElementSibling;
        const nextTr = this.nanny.findRowByIndex(this.dom, tdRowMatrix + 1);
        const tbSize = this.getSize();
        let colIndex = 0;
        const tdMarkShort = [];
        while (colIndex < tbSize[1]) {
            const cellType = this.cellType(tdRowMatrix, colIndex);

            // 
            if (cellType == this.CELL_BIG_HEAD) {
                const tdFound = this.getTdByMatrix(tdRowMatrix, colIndex);
                const tdRowSpan = this.nanny.getTdRowSpan(tdFound);
                const tdColSpan = this.nanny.getTdColSpan(tdFound);
                // move tdFound to next tr
                if (tdRowSpan > 1 && tbSize[0] != tdRowMatrix) {
                    let nextTdColMatrix = colIndex + tdColSpan;
                    while (nextTdColMatrix < tbSize[1]) {
                        const nextRowTd = this.getTdByMatrix(tdRowMatrix + 1, nextTdColMatrix);
                        const row = this.nanny.getRowByIndex(this.dom, tdRowMatrix + 1);
                        if (row == nextTr) {
                            // nextRowTd.before(tdFound);
                            this.nanny.insertBeforeTd(row, nextRowTd, tdFound);
                            break;
                        }
                        nextTdColMatrix++;
                    }
                    const tdFoundInRow = this.nanny.getRowByTd(tdFound);
                    if (tdFoundInRow != nextTr && nextTr) {
                        this.nanny.appendTd(nextTr, tdFound);
                    }
                    // make sure short it.
                    this.nanny.setTdSpan(tdFound, -1, null, true);
                    // tdFound.rowSpan--;
                    this.refresh();
                }

                // colIndex += tdFound.colSpan;
                colIndex += tdColSpan;
            } else if(cellType == this.CELL_BIG) {
                const tdFound = this.getTdByMatrix(tdRowMatrix, colIndex);
                tdMarkShort.push(tdFound);
                this.refresh();
                const tdColSpan = this.nanny.getTdColSpan(tdFound);
                // colIndex += tdFound.colSpan;
                colIndex += tdColSpan;
            } else {
                colIndex++;
            }
        }
        tdMarkShort.forEach((td) => this.nanny.setTdSpan(td, -1, null, true));
        this.nanny.delTr(this.dom, tr);
    }
};