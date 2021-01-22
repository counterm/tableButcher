// strong man
/*

*/
export default {
    split(td, decorater) {
        if (!td) return;
        if (!decorater) decorater = (td) => td;
        let [spanRow, spanCell] = this.getSpan(td);
        if (spanRow > 1 || spanCell > 1) {
            td.rowSpan = 1;
            td.colSpan = 1;
            // row 1
            let spanIndexCell = spanCell - 1;
            while (spanIndexCell > 0) {
                td.after(decorater(document.createElement('td'), 0,  spanIndexCell - 1));
                spanIndexCell--;
            }
            // other row
            let spanIndexRow = spanRow - 1 - 1;
            const arrTdIndex = this.getTdIndex(td);
            const arrTdMatrix = this.getTdMatrix(td);
            while (spanIndexRow >= 0) {
                spanIndexCell = spanCell - 1;
                const tr = td.parentNode.parentNode.childNodes[arrTdIndex[0] + (spanRow - 1 - spanIndexRow)];
                const tds = tr.childNodes;
                const firstTdMatrix = tds.length > 0 ? this.getTdMatrix(tds[0]) : Number.MAX_VALUE;
                /*
                    1. The td ready to merge was on the first cell index.
                    2. The row was empty.
                    3. The first td in the row must be after the td which ready to insert.
                 */
                if (arrTdMatrix[0] == 0 && tds.length == 0 && firstTdMatrix[1] <= arrTdMatrix[1]) {
                    while (spanIndexCell >= 0) {
                        tr.appendChild(decorater(document.createElement('td'), spanRow - 1 - spanIndexRow, spanCell - 1 - spanIndexCell));
                        spanIndexCell--;
                    }
                } else {
                    for (let index = 0; index < tds.length; index++) {
                        const tdFound = tds[index];
                        const tdFoundMatrix = this.getTdMatrix(tdFound);
                        if (tdFoundMatrix[1] > arrTdMatrix[1]) {
                            while (spanIndexCell >= 0) {
                                tdFound.before(decorater(document.createElement('td'), spanRow - 1 - spanIndexRow, spanCell - 1 - spanIndexCell));
                                spanIndexCell--;
                            }
                            break;
                        } else if (index + 1 == tds.length) {   // last position
                            while (spanIndexCell >= 0) {
                                tdFound.after(decorater(document.createElement('td'), spanRow - 1 - spanIndexRow, spanIndexCell - 1));
                                spanIndexCell--;
                            }
                        }
                    }
                }
                spanIndexRow--;
            }
        }
        this.refresh();
    },
    /*
    DIR_HORIZON:    0,  // left and right
    DIR_VERTICAL:   1,  // up and down
    cut(td, direction){
        let me = this,
            spanName = (direction == this.DIR_HORIZON) ? "colSpan" : "rowSpan",
            matTd = this.matrixTd2Mat(...this.getTdIndex(td)),
            lineArea = (direction == this.DIR_HORIZON) 
                ? [[0, matTd[1]], [this.matrix.length-1, matTd[1]]]         // 
                : [[matTd[0], 0],[matTd[0], this.matrix[0].length - 1]],
            sameTdLine = [],
            tdType = this.cellType(td);
        
        // left and right
        if (direction == this.DIR_HORIZON){
            if (tdType == this.CELL_NORMAL){
                this.cutSingle();
            }
        }else{ 
            // up and down
            // direction == this.DIR_VERTICAL
            if (tdType == this.CELL_NORMAL){
                
            }
        }

        // if selected TD was a big cell
        if (this.cellType(td) == this.CELL_BIG){
            let insertIndex = this.getTdIndex(td);
            let tdParentRow = td.parentNode;
            

            if (td[spanName] > 1){
                td[spanName] = td[spanName] - 1;
                if (direction == this.DIR_HORIZON){
                    // row edit
                    tdParentRow.insertCell(insertIndex);

                    // find the next row and previous column td
                    let downPrevTd = this.getTdByMatrix(matTd[0]+1, matTd[0]-1);
                    if (downPrevTd != null){
                        downPrevTd.parentNode.insertAfter(downPrevTd, td);
                    }else{
                        // There is not any td before target's column
                        let nextRow = tdParentRow.nextSibling;
                        // Is not any row after target's row.
                        if (nextRow == null){
                            // add a row
                            let newTr = document.createElement('tr');
                            newTr.append(td);
                            tdParentRow.parent.insertAfter(tdParentRow, newTr);
                        }else{
                            // 
                            let anyTdInNextRow = nextRow.querySelector('td');
                            // have some td
                            if (anyTdInNextRow){
                                nextRow.insertBefore(anyTdInNextRow, td);
                            }else{ 
                                nextRow.append(td);
                            }
                        }
                    }
                }else{
                    // column edit
                    td.parentNode.insertCell(insertIndex);
                    let firstMat = this.findFirstNumberPosition(td);
                    
                }
                return;
            }
        }

        // find out other cell in the same line
        // cut left and right, same line was the same column
        // cut up and down ,same line was the same row
        this.matrixForInArea(lineArea[0], lineArea[1], (num, iRow, iCol)=>{
            let tdFound = this.getTdByMatrix(iRow, iCol);
            if (td != tdFound && sameTdLine.indexOf(tdFound) == -1){
                sameTdLine.push(tdFound);
            }
        });

        // expand the whole row or column line
        sameTdLine.forEach((tdFound, index)=>{
            if (tdFound[spanName] > 1){
                tdFound[spanName] = tdFound[spanName] - 1;
                tdFound.parentNode
            }
        });
    }
    */
};