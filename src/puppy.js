 // utils, a dog always hardworing.

export default {
    tableClassName: '_table-butcher_',
    init(table){
        this.dom = table;
    },

    getSpan(td){
        return [this.nanny.getTdRowSpan(td), this.nanny.getTdColSpan(td)];
    },


    getTdIndex(td){
        if (!td) return;
        const tr = td.parentNode;
        let rowIndex = -1,
            colIndex = -1;
        this.forEachRow((row, index)=>{
            if (row === tr){
                rowIndex = index;
                return true;
            }
        });

        const tds = this.nanny.getTdsInRow(tr);
        tds.forEach((val, index)=>{
            if (val === td){
                colIndex = index;
            }
        });

        return [rowIndex, colIndex];
    },

    getTdByIndex(tdRow, tdCol){
        if (tdRow == -1 || tdCol == -1){
            return null;
        }
        let inRow = -1, retTd;
        this.forEachRow((row, index)=>{
            if (tdRow == index){
                inRow = row;
                return true;
            }
        });
        if (inRow == -1){
            return null;
        }else{
            // retTd = inRow.querySelectorAll(':scope > td')[tdCol];
            retTd = this.nanny.getTdsInRow(inRow)[tdCol];
            return retTd;
        }
    },

    getTdMatrix(td) {
        return this.matrixTd2Mat(...this.getTdIndex(td));
    },

    getTdByMatrix(matRow, matCol){
        return this.getTdByIndex(...this.matrixMat2Td(matRow, matCol));
    },

    /**
     * calculate table rectangle size
     */
    getSize(){
        let sizeCol = 0, me = this, allTdSize=[];
        // find max column size
        this.forEachRow((row, rowIndex)=>{
            let thisRowSize = 0;
            this.nanny.getTdsInRow(row).forEach((td, colIndex)=>{
                let span = me.getSpan(td);
                thisRowSize += span[1];
            });
            allTdSize.push(thisRowSize);
        });
        if (allTdSize.length > 0) {
            sizeCol = Math.max(...allTdSize);
        }
        // this.forUnderTable( (td)=>{
        //     let span = me.getSpan(td);
        //     sizeCol += span[1];
        // }, '> tr:first-child > td');
        return [
            this.nanny.getRowSize(this.dom),
            sizeCol
        ];
    },

    /**
     * sort row by row
     * @param {Array[TD]} tds 
     */
    sort(arrTd){
        let me = this;
        arrTd.sort((a,b)=>{
            let aPos = me.getTdIndex(a), // Do not mind.
                bPos = me.getTdIndex(b); // Do not mind.
            if (aPos[0] != bPos[0]){
                return aPos[0] - bPos[0];
            }else{
                return aPos[1] - bPos[1];
            }
        })
        return arrTd;
    },

    /**
     * loop each td with tr and position detail
     */
    forEachCell(fn){
        const fnTR = (tr, rowIndex)=>{
            let tds = this.nanny.getTdsInRow(tr),
                colIndex = 0;
            for(let td of tds){
                fn(td, rowIndex, colIndex, tr);
                colIndex++;
            }
        };
        // this.forUnderTable(fnTR, '> tr');
        this.forEachRow(fnTR);
    },

    /**
     *
     * @param {fn}  receive arguments(element, index, all elements)
     */
    forEachRow(fn){
        this.nanny.eachRow(this.dom, fn);
    },


    /**
     * loop under the table
     */
    // forUnderTable(fn, selector = '> tr > td'){
    //     let elements = this.dom.querySelectorAll(`:scope > tbody ` + selector);
    //     let index = -1;
    //     for(let el of elements){
    //         index++;
    //         if (true === fn(el, index, elements)){
    //             return;
    //         }
    //     }
    // },

    /**
     * loop with table matrix
     * @param {function}    fn      invoke with argument (express number, row index, column index, row array)
     */
    forEachMatrix(fn){
        let indexOfRow = -1,
            indexOfCol = -1;
        for(let row of this.matrix){
            indexOfRow++;
            indexOfCol = -1;
            for(let col of row){
                indexOfCol++;
                if(true === fn(col, indexOfRow, indexOfCol, row)){
                    return;
                }
            }
        }
    },

    /**
     * find the first same expression number in table matrix
     * @param {integer} expNumber
     */
    findFirstTime(expNumber){
        let ret = null;
        this.forEachMatrix((val, row, col, arr)=>{
            if (val === expNumber){
                ret = [row, col];
                return true;
            }
        });
        return ret;
    }
};