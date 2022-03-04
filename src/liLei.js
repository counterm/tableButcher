// A creative boy
// something about table matrix
let _refreshTimeout = 0;
export default {
    /*

    table expression
    0 0 0
    0 0 0
    0 0 0

    every number point to a td position.
    0 is a normal td, other number is a large td's placehodler.
    As a big cell, it place all the same number to mark the position, 
    except the first place. for example '3', first number will be '-3'.

    example:
    0 -1 1 0
    0 1 1 0

    <table>
        <tr>
            <td></td>
            <td colspan="2" rowspan="2"></td>
            <td></td>
        </tr>
        <tr>
            <td></td>
            <td></td>
        </tr>
    </table>

    */
    CELL_NORMAL       : 0,
    CELL_BIG          : 1,
    CELL_BIG_HEAD     : 2,
    matrix:[[]],
    refresh(){
        // let time = +new Date();
        // window.clearTimeout(_refreshTimeout);
        // _refreshTimeout = window.setTimeout(() => this.buildMatrix(), 300);
        this.buildMatrix();
        // console.log(`refresh time use: ${(+new Date() - time)}ms`);
    },


    buildMatrix(){
        let [sizeRow, sizeCol] = this.getSize(),
            tmpRow = sizeRow,
            maxFillNumber = 1; 
        // fill zero at all
        this.matrix = [];
        while(tmpRow > 0){
            const arr = Array.from('0'.repeat(sizeCol)).map(v => +v);
            this.matrix.push(arr);
            tmpRow--;
        }
        // recognize big cell
        this.forEachCell((td, rowIndex, colIndex, tr) => {
            let [rowSpan, colSpan] = this.getSpan(td);
            let [matRow, matCol] = this.matrixTd2Mat(rowIndex, colIndex);
            // checkout big cell and fill number
            if (rowSpan > 1 || colSpan > 1){
                // count actual column index
                this.fillBigInMat(maxFillNumber, matRow, matCol, rowSpan, colSpan);
                maxFillNumber++;
            }
        });
    },

    /**
     * 
     * @param {Function} fn (number, rowIndex, colIndex)
     */
    matrixFor(fn){
        let rowIndex = 0, colIndex = 0, ret;
        for(let row of this.matrix){
            colIndex = 0;
            for(let col of row){
                ret = fn(col, rowIndex, colIndex);
                if(ret == true)
                    return col;
                colIndex++;
            }
            rowIndex++;
        }
    },


    matrixForInArea(matFrom , matTo, fn){
        let rowLoop = [Math.min(matFrom[0], matTo[0]), Math.max(matFrom[0], matTo[0])],
            colLoop = [Math.min(matFrom[1], matTo[1]), Math.max(matFrom[1], matTo[1])];
        
        for(let iRow = rowLoop[0]; iRow <= rowLoop[1]; iRow++){
            for(let iCol = colLoop[0]; iCol <= colLoop[1]; iCol++){
                if (fn(this.matrix[iRow][iCol], iRow, iCol) === true){
                    break;
                }
            }
        }
    },


    // change axis
    matrixTd2Mat(tdRow, tdCol){
        let matRow = tdRow,
            matRowArr = this.matrix[tdRow],
            tdColIndex = -1,
            retMatCol = -1,
            me = this;
        matRowArr.forEach((expNumber, matColIndex)=>{
            if (me.cellCanCount(matRow, matColIndex)){
                tdColIndex++;
            }
            if (retMatCol == -1 && tdColIndex === tdCol){
                retMatCol = matColIndex;
            }
        });
        return [matRow, retMatCol];
    },


    // change axis
    matrixMat2Td(matRow, matCol){
        if (this.cellType(matRow, matCol) === this.CELL_BIG){
            [matRow, matCol] = this.findFirstNumberPosition(matRow, matCol);
        }
        let loopColIndex = 0, 
            tdRow = matRow,
            tdCol = -1;
        while(loopColIndex <= matCol){
            if (this.cellCanCount(matRow, loopColIndex)){
                tdCol++;
            } 
            loopColIndex++;
        }
        return [tdRow, tdCol];
        // matrix number
        // let number = this.matrix[matRow][matCol],
        //     count = -1;
        // if (this.cellCanCount(matRow, matCol)){
        //     count++;
        // }else{

        // }
        // try{
        //     number = ;
        // }catch(e){
        //     console.log(`matrixMat2Td fail. ${matRow}, ${matCol} overload.`);
        //     console.log(e);
        //     return null;
        // }

    },



    // in big cell area, fill number in it, except first number was multiply -1
    fillBigInMat(expNumber, startMatRow, startMatCol, rowSpan, cellSpan){
        let m = this.matrix;
        let endRow = startMatRow + rowSpan - 1,
            endCol = startMatCol + cellSpan - 1,
            indexRow = startMatRow, 
            indexCol;
        while(indexRow <= endRow){
            indexCol = startMatCol;
            while(indexCol <= endCol){
                m[indexRow][indexCol] = expNumber;
                indexCol++;
            }
            indexRow++;
        }
        // rewrite first number
        m[startMatRow][startMatCol] = -1 * expNumber;
    },


    // return [0,1,2]
    //   0: not a big cell
    //   1: is a big cell, not the first place
    //   2: is a big cell and is the first place
    cellType(matRowOrTd, matCol){
        let number = null, ret;
        
        if (matCol == null){
            // argument was td
            if (typeof matRowOrTd == 'number') {
                number = matRowOrTd;
            } else {
                [matRowOrTd, matCol] = this.matrixTd2Mat(...this.getTdIndex(matRowOrTd));
            }
        }
        
        if (number == null && matCol != null){
            number = this.matrix[matRowOrTd][matCol];
        }

        number = +number;
        if (number == 0){
            ret = this.CELL_NORMAL;
        }else if(number > 0){
            ret = this.CELL_BIG;
        }else{
            ret = this.CELL_BIG_HEAD;
        }
        
        return ret;
    },


    // judge the cell single or belong to big cell for that can not be count.
    cellCanCount(matRow, matCol){
        let type = this.cellType(...arguments);
        // If matrix unit number is not bigger than 0, it will specify to a true td.
        if (this.CELL_BIG != this.cellType(matRow, matCol)){
            return true;
        }else{
            return false;
        }
    },


    /**
     * td in matrix return matrix number of the head
     * @param {Array(x,y)} matRow 
     * @param {Array(x,y)} matCol 
     */
    findFirstNumberPosition(matRow, matCol){
        let m = this.matrix,
            number = this.matrix[matRow][matCol];

        if (this.CELL_BIG == this.cellType(matRow, matCol)){
            let rowIndex = matRow,
                colIndex = matCol,
                tmpNum = m[rowIndex][colIndex],
                targetNum = -1 * number;

            // move left in row
            while(colIndex >= 0){
                tmpNum = m[rowIndex][colIndex];
                if (tmpNum == targetNum){
                    return [rowIndex, colIndex];
                }else if(tmpNum == number){
                    colIndex--;
                }else{
                    // our of range, move up.
                    colIndex++;
                    break;
                }
            }

            colIndex = colIndex < 0 ? 0 : colIndex;
            rowIndex--;
            
            // move up in col
            while(rowIndex >= 0){
                tmpNum = m[rowIndex][colIndex];
                if (tmpNum == targetNum){
                    return [rowIndex, colIndex];
                }else if(tmpNum == number){
                    rowIndex--;
                }else{
                    // out of range
                    break;
                }
            }
            // can not found, return [-1, -1].
            return [-1, -1]
        }else{
            return [matRow, matCol];
        }
    },


    /**
     * find cell in matrix axis, and recognize all cell area in matrix axis, 
     * return the start and end.
     * @param {Array(x,y)} matRow 
     * @param {Array(x,y)} matCol 
     */
    getBigCellSize(matRow, matCol){
        let number = this.matrix[matRow][matCol],
            startNumber;
        let startPos = [], endPos = [];
        if (this.cellType(number) == this.CELL_NORMAL){
            return [[matRow, matCol], [matRow, matCol]];
        }else if (this.cellType(number) == this.CELL_BIG_HEAD){
            startNumber = number;
            number = -1 * number;
            startPos = [matRow, matCol];
        }else{
            startNumber = -1 * number;

            // findout start position
            this.matrixFor((numberSearch, rowIndex, colIndex)=>{
                if (numberSearch == startNumber){
                    startPos = [rowIndex, colIndex];
                }
            });
        }

        // find out end position
        let iRow = matRow, iCol = matCol, iNumber,
            maxRowBefore = this.matrix.length - 1,
            maxColBefore = this.matrix[0].length - 1;
        // search by row
        while(iRow <= maxRowBefore - 1){
            iNumber = this.matrix[iRow+1][iCol];
            if (number != iNumber){
                break;
            }
            iRow++;
        }
        // search by col
        while(iCol <= maxColBefore - 1){
            iNumber = this.matrix[iRow][iCol+1];
            if (number != iNumber){
                break;
            }
            iCol++;
        }
        endPos = [iRow, iCol];

        return [startPos, endPos];
    },


    /**
     * get all matrix unit of which was by TD holding
     * @param  {...any} arrTd 
     */
    getMatRectangeAreaByTd(...arrTd){
        let me = this,
            arrMat = [];
        arrTd.forEach(
            (td)=>{
                if (!td) return;
                if (me.cellType(td) == me.CELL_NORMAL){
                    arrMat.push(me.matrixTd2Mat(...me.getTdIndex(td)));
                }else{
                    arrMat.push(...me.getBigCellSize(...me.matrixTd2Mat(...me.getTdIndex(td))));
                }
            }
        );
        return this.getMatRectangeArea(...arrMat);
    },


    /**
     * give some matrix axis, return all matrix unit of which was by TD there.
     * @param  {...any} mats 
     */
    getMatRectangeArea(...mats){
        let area = [
                [mats[0][0], mats[0][1]],
                [mats[0][0], mats[0][1]]
            ],
            mat,
            areaJoin;
        mats.shift();

        while(mats.length > 0){
            mat = mats.pop();
            if (this.cellType(...mat) == this.CELL_NORMAL){
                areaJoin = [mat,mat];
            }else{
                areaJoin = this.getBigCellSize(...mat);
            }

            // expand area with the other.
            area = [
                    [Math.min(area[0][0], areaJoin[0][0]), Math.min(area[0][1], areaJoin[0][1])],
                    [Math.max(area[1][0], areaJoin[1][0]), Math.max(area[1][1], areaJoin[1][1])]
                ];
        }

        return area;
    },
};