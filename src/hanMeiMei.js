// tidy girl
// append column or row
export default {
    addRow(){
        this.forEachRow((row, rowIndex)=>{
             let td = document.createElement('td');
             row.append(td);
        });
        this.refresh();
        return this;
    },
    // can recognize each big cell, and expand them by increase their colspan.
    insertRow(beforeTd){
        // const beforeTr = beforeTd.parentNode;
        const [tdRowIndex, tdColIndex] = this.getTdIndex(beforeTd);
        let [sizeRow, sizeCell] = this.getSize();
        const fnAddTd = () => trHolder.append(document.createElement('td'));
        // first row.
        const trHolder = document.createElement('tr');
        if (tdRowIndex == 0) {
            while (sizeCell > 0) {
                fnAddTd();
                sizeCell--;
            }
        } else {
            // const tdBase = [];          // create row upon which TD.
            const trHolder = document.createElement('tr');
            let sizeIndex = 0;

            while (sizeIndex < sizeCell) {
                const tdFound = this.getTdByMatrix(tdRowIndex, sizeIndex);
                const cellType = this.cellType(tdRowIndex, sizeIndex);
                if (cellType == this.CELL_NORMAL) {
                    fnAddTd();
                    sizeIndex++;
                } else if (cellType == this.CELL_BIG_HEAD) {
                    let size = tdFound.colSpan;
                    while (size > 0) {
                        fnAddTd();
                        size--;
                    }
                    sizeIndex += tdFound.colSpan;
                } else if (cellType == this.CELL_BIG_HEAD || cellType == this.CELL_BIG) {
                    tdFound.rowSpan += 1;
                    sizeIndex += tdFound.colSpan;
                }
            }
        }
        beforeTd.parentNode.before(trHolder);
        this.refresh();
        return this;
    },
    addCell(){
        let [rowCount, colCount] = this.getSize(),
            newTr = this.dom.insertRow(rowCount);
        while(colCount>0){
            newTr.append(document.createElement('td'));
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
        //     newTr.append(document.createElement('td'));
        //     colCount--;
        // }
        // if beforeTd is the first of the row.
        
        let [tdRowIndex, tdColIndex] = this.getTdIndex(beforeThisTd);
        if (tdColIndex == 0) {
            this.forEachRow(row => {
                row.childNodes[0].before(document.createElement('td'));
            });
        } else {
            const tdDone = [];
            const matrix = this.getTdMatrix(beforeThisTd);
            this.forEachRow((row, indexRow) => {
                const td = this.getTdByMatrix(indexRow, matrix[1] - 1);
                if (tdDone.indexOf(td) == -1) {
                    if (this.cellType(td) == this.CELL_NORMAL) {
                        td.after(document.createElement('td'));
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