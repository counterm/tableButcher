// tidy girl
// append column or row
export default {
    addCellToAllRow(fn){
        let [sizeRow, sizeCell] = this.getSize();
        this.forEachRow((row, rowIndex)=>{
            let td = this.nanny.newTd();
            if (fn) {
                const retFn = fn(td, rowIndex, sizeCell, this.dom, row);
                retFn && td == retFn;
            }
            this.nanny.appendTd(row, td);
        });
        this.refresh();
        return this;
    },
    // can recognize each big cell, and expand them by increase their colspan.
    insertRow(beforeTd, fn){
        const [tdRowIndex, tdColIndex] = this.getTdIndex(beforeTd);
        let [sizeRow, sizeCell] = this.getSize();
        const trHolder = this.nanny.newTr();

        const fnAddTd = (cellIndex) => {
            let td = this.nanny.newTd();
            if (fn) {
                const retFn = fn(td, tdRowIndex, cellIndex, this.dom, trHolder);
                retFn && td == retFn;
            }
            this.nanny.appendTd(trHolder, td);
        };

        // first row.
        if (tdRowIndex == 0) {
            let cellIndex = 0;
            while (cellIndex < sizeCell) {
                fnAddTd(cellIndex);
                cellIndex++;
            }
        } else {
            // const tdBase = [];          // create row upon which TD.
            let sizeIndex = 0;

            while (sizeIndex < sizeCell) {
                const tdFound = this.getTdByMatrix(tdRowIndex, sizeIndex);
                const cellType = this.cellType(tdRowIndex, sizeIndex);
                const colSpan = this.nanny.getTdColSpan(tdFound);
                if (cellType == this.CELL_NORMAL) {
                    fnAddTd(sizeIndex);
                    sizeIndex++;
                } else if (cellType == this.CELL_BIG_HEAD) {
                    let size = colSpan;
                    while (size > 0) {
                        fnAddTd(sizeIndex);
                        size--;
                    }
                    sizeIndex += colSpan;
                } else if (cellType == this.CELL_BIG_HEAD || cellType == this.CELL_BIG) {
                    this.nanny.setTdSpan(tdFound, 1, null, true);
                    sizeIndex += colSpan;
                }
            }
        }
        const tdInRow = this.nanny.getRowByTd(this.dom, beforeTd);
        this.nanny.insertRowBefore(this.dom, tdInRow, trHolder);
        this.refresh();
        return this;
    },
    addNewRow(fn){
        let [rowCount, colCount] = this.getSize();
        const newTr = this.nanny.insertEmptyRow(this.dom, rowCount);
        let index = 0;
        while(colCount>0){
            let newTd = this.nanny.newTd();
            if (fn) {
                const retFn = fn(newTd, rowCount, index, this.dom, newTr);
                retFn && newTd == retFn;
            }
            this.nanny.appendTd(newTr, newTd);
            colCount--;
            index++;
        }
        this.refresh();
        return this;
    },
    insertCell(beforeThisTd, fn){
        let [tdRowIndex, tdColIndex] = this.getTdIndex(beforeThisTd);

        let newInsertTd = (rowIndex, cellIndex, row) => {
            let newTd = this.nanny.newTd();
            if (fn) {
                const retFn = fn(newTd, rowIndex, cellIndex, this.dom, row);
                retFn && newTd == retFn;
            }
            return newTd;
        };

        if (tdColIndex == 0) {
            this.forEachRow((row, rowIndex) => {
                this.nanny.insertBeforeTd(row, this.nanny.getTdInRow(row, 0), newInsertTd(rowIndex, tdColIndex, row));
            });
        } else {
            const tdDone = [];
            const matrix = this.getTdMatrix(beforeThisTd);
            this.forEachRow((row, indexRow) => {
                const td = this.getTdByMatrix(indexRow, matrix[1] - 1);
                if (tdDone.indexOf(td) == -1) {
                    if (this.cellType(td) == this.CELL_NORMAL) {
                        this.nanny.insertAfterTd(this.nanny.getRowByTd(this.dom, td), td, newInsertTd(indexRow, tdColIndex, row));
                    } else {    // big cell
                        this.nanny.setTdSpan(td, null, 1, true);
                    }
                    tdDone.push(td);
                }
            });
        }
        this.refresh();
        return this;
    }
};