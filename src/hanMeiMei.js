// tidy girl
// append column or row
export default {
    addCellToAllRow(){
        this.forEachRow((row, rowIndex)=>{
            let td = this.nanny.newTd();
            this.nanny.appendTd(row, td);
        });
        this.refresh();
        return this;
    },
    // can recognize each big cell, and expand them by increase their colspan.
    insertRow(beforeTd){
        // const beforeTr = beforeTd.parentNode;
        const [tdRowIndex, tdColIndex] = this.getTdIndex(beforeTd);
        let [sizeRow, sizeCell] = this.getSize();
        const trHolder = this.nanny.newTr();
        const fnAddTd = () => this.nanny.appendTd(trHolder, this.nanny.newTd());
        // first row.
        if (tdRowIndex == 0) {
            while (sizeCell > 0) {
                fnAddTd();
                sizeCell--;
            }
        } else {
            // const tdBase = [];          // create row upon which TD.
            let sizeIndex = 0;

            while (sizeIndex < sizeCell) {
                const tdFound = this.getTdByMatrix(tdRowIndex, sizeIndex);
                const cellType = this.cellType(tdRowIndex, sizeIndex);
                const colSpan = this.nanny.getTdColSpan(tdFound);
                if (cellType == this.CELL_NORMAL) {
                    fnAddTd();
                    sizeIndex++;
                } else if (cellType == this.CELL_BIG_HEAD) {
                    let size = colSpan;
                    while (size > 0) {
                        fnAddTd();
                        size--;
                    }
                    sizeIndex += colSpan;
                } else if (cellType == this.CELL_BIG_HEAD || cellType == this.CELL_BIG) {
                    this.nanny.setTdSpan(tdFound, 1, null, true);
                    sizeIndex += colSpan;
                }
            }
        }
        beforeTd.parentNode.before(trHolder);
        this.refresh();
        return this;
    },
    addNewRow(){
        let [rowCount, colCount] = this.getSize(),
            newTr = this.nanny.insertRow(this.dom, rowCount);
        while(colCount>0){
            this.nanny.appendTd(newTr, this.nanny.newTd());
            colCount--;
        }
        this.refresh();
        return this;
    },
    insertCell(beforeThisTd){
        // el matrix axis
        // let [rowIndex, colIndex] = this.getTdIndex(beforeTd),
        //     [rowCount, colCount] = this.getSize(),
        //     newTr = this.dom.insertRow(rowIndex);
        // while(colCount>0){
        //     newTr.append(this.nanny.newTd());
        //     colCount--;
        // }
        // if beforeTd is the first of the row.
        
        let [tdRowIndex, tdColIndex] = this.getTdIndex(beforeThisTd);
        if (tdColIndex == 0) {
            this.forEachRow(row => {
                this.nanny.insertBeforeTd(row, this.nanny.getTdInRow(row, 0), this.nanny.newTd());
            });
        } else {
            const tdDone = [];
            const matrix = this.getTdMatrix(beforeThisTd);
            this.forEachRow((row, indexRow) => {
                const td = this.getTdByMatrix(indexRow, matrix[1] - 1);
                if (tdDone.indexOf(td) == -1) {
                    if (this.cellType(td) == this.CELL_NORMAL) {
                        td.after(this.nanny.newTd());
                    } else {    // big cell
                        td.colSpan += 1;
                    }
                    tdDone.push(td);
                }
            });
        }
        this.refresh();
        return this;
    }
};