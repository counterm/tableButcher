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
    // Method can recognize each big cell, and expand them by increase their colspan.
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
        let [tdRowIndex, tdColIndex] = this.getTdMatrix(beforeThisTd);

        let newInsertTd = (rowIndex, cellIndex, row) => {
            let newTd = this.nanny.newTd();
            if (fn) {
                const retFn = fn(newTd, rowIndex, cellIndex, this.dom, row);
                retFn && newTd == retFn;
            }
            return newTd;
        };

        // if selected td was the first column
        if (tdColIndex == 0) {
            this.forEachRow((row, rowIndex) => {
                this.nanny.insertBeforeTd(row, this.nanny.getTdInRow(row, 0), newInsertTd(rowIndex, tdColIndex, row));
            });
            return;
        }

        // 
        const matrix = this.getTdMatrix(beforeThisTd);
        const colMatrix = matrix[1];
        const size = this.getSize();

        let index = -1;
        /*
         0 0 x 0 0 0 0
         0 0 x 0 0 0 0
         0 0 x 0 0 0 0
         0 0 x 0 0 0 0
         Scan one column, will meet normal td size, or big td.
         Big td has 4 placements.
         For example, it is now scanning to position (1, 2)

         1.In big td's head.
         0 0 0 0 0 0 0
         0 0 -1 1 1 0 0
         0 0 1 1 1 0 0

         2.In big td's left side.
         0 0 -1 1 1 0 0
         0 0 1 1 1 0 0
         0 0 0 0 0 0 0

         3.In big td's upper middle position.
         0 0 0 0 0 0 0
         0 -1 1 1 0 0 0
         0 1 1 1 0 0 0
         0 0 0 0 0 0 0

         4.In big td's middle or lower middle position.
         0 -1 1 1 0 0 0
         0 1 1 1 0 0 0
         0 0 0 0 0 0 0
         0 0 0 0 0 0 0
         */
        const operatorTd = [
            [], // insertBefore
            []  // increase colspan
        ]
        while (index < size[0] - 1) {
            index++;

            const insertBeforeThisTd = this.getTdByMatrix(index, colMatrix);
            const tdIsBig = this.cellType(insertBeforeThisTd) != this.CELL_NORMAL;

            if (!tdIsBig) {
                // this.nanny.insertBeforeTd(tr, insertBeforeThisTd, this.nanny.newTd());
                operatorTd[0].push(insertBeforeThisTd);
            } else {
                const firstMatrix = this.findFirstNumberPosition(index, colMatrix);
                // 1
                if (firstMatrix[0] == index && firstMatrix[1] == colMatrix) {
                    operatorTd[0].push(insertBeforeThisTd);
                } else if (firstMatrix[0] != index && firstMatrix[1] == colMatrix) {
                    // 2
                    const colSpan = this.nanny.getTdColSpan(insertBeforeThisTd);
                    const tdAfter = this.getTdByMatrix(index, colMatrix + colSpan);
                    operatorTd[0].push(tdAfter);
                } else if (firstMatrix[0] == index && firstMatrix[1] < colMatrix) {
                    // 3
                    operatorTd[1].push(insertBeforeThisTd);
                } else if (firstMatrix[0] < index && firstMatrix[1] < colMatrix) {
                    // 4
                    continue;
                } else {
                    console.error('Cases not treated.');
                }
            }
        }

        operatorTd[0].forEach(td => {
            const tr = this.nanny.getRowByTd(this.dom, td);
            this.nanny.insertBeforeTd(tr, td, this.nanny.newTd());
        });

        operatorTd[1].forEach(td => {
            this.nanny.setTdSpan(td, null, 1, true);
        })

        // const bigTdCount = [];
        // const prevTdMatrixColumnTail = matrix[1] - 1;
        /*
        this.forEachRow((row, indexRow) => {
            
            const td = this.getTdByMatrix(indexRow, prevTdMatrixColumnTail);
            if (bigTdCount.indexOf(td) == -1) {
                if (this.cellType(td) == this.CELL_NORMAL) {
                    this.nanny.insertAfterTd(row, td, newInsertTd(indexRow, tdColIndex, row));
                } else {
                    this.nanny.setTdSpan(td, null, 1, true);
                }
                bigTdCount.push(td);
            } else {
                const colSpan = this.nanny.getTdColSpan(td);
                if (prevTdMatrixColumnTail - colSpan >= 0) {
                    const td2 = this.getTdByMatrix(indexRow, prevTdMatrixColumnTail - colSpan);
                    this.nanny.insertAfterTd(row, td2, newInsertTd(indexRow, tdColIndex, row));
                } else { // The big cell was full of the first column
                    const td2 = this.getTdByMatrix(indexRow, 0);
                    this.nanny.insertBeforeTd(row, td2, newInsertTd(indexRow, tdColIndex, row));
                }
            }
        });
        */
        
        /*
        const matrix = this.getTdMatrix(beforeThisTd);
        const tdPosSize = this.getBigCellSize(matrix[0], matrix[1] - 1);
        const tbSize = this.getSize();

        // If left side is just a totally td.
        // Insert one cell to each row.
        if (tdPosSize[1][0] - tdPosSize[0][0] == tbSize[0] - 1) {  
            this.forEachRow((row, indexRow) => {
                const td = this.getTdByMatrix(indexRow, matrix[1] - 1);
                this.nanny.insertAfterTd(this.nanny.getRowByTd(this.dom, td), td, newInsertTd(indexRow, tdColIndex, row));
            });
        } else {
            const tdDone = [];
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
        */
        this.refresh();
        return this;
    }
};