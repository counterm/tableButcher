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
        // el matrix axis
        let [rowIndex, colIndex] = this.getTdIndex(beforeTd);
        let [matRow, matCol] = this.matrixTd2Mat(rowIndex, colIndex);
        let me = this
        this.forEachRow((row, index)=>{
            let [rowEach, colEach] = me.matrixMat2Td(matRow, matCol);
            row.insertCell(colEach);
        });
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
        
        let [rowIndex, colIndex] = this.getTdIndex(beforeThisTd);
        if (colIndex == 0) {
            this.forEachRow(row => {
                row.childNodes[0].before(document.createElement('td'));
            });
        } else {
            const tdProcessed = [];
            const matrix = this.getTdMatrix(beforeThisTd);
            this.forEachRow((row, indexRow) => {
                const td = this.getTdByMatrix(indexRow, matrix - 1);
                if (td in tdProcessed == false) {
                    if (this.cellType(td) == this.CELL_NORMAL) {
                        td.after(document.createElement('td'));
                    } else {    // big cell
                        td.colSpan += 1;
                    }
                    tdProcessed.push(td);
                }
            });
        }
        this.refresh();
        return this;
    }
};