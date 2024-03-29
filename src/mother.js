// merge, nice women
export default {
    /**
     * 
     * @param {Element} tdFrom 
     * @param {Element} tdTo 
     */
    merge(tdFrom, tdTo) {
        if (tdFrom == null && tdTo == null) return;
        else if (tdFrom == null) tdFrom = tdTo;
        else if (tdTo == null) tdTo = tdFrom;
        let selectionTd = this.selectionByTd(tdFrom, tdTo),
            arrTdInArea = selectionTd.td,
            [matFrom, matTo] = selectionTd.area,
            rowSpan = matTo[0] - matFrom[0] + 1,
            colSpan = matTo[1] - matFrom[1] + 1,
            firstTd = arrTdInArea.shift();
        
        // remove node
        arrTdInArea.forEach((td, index)=>{
            this.nanny.moveTdChilds(td, firstTd);
            const tr = this.nanny.getRowByTd(this.dom, td);
            this.nanny.delTd(tr, td);
        });

        // merge node
        this.nanny.setTdSpan(firstTd, rowSpan, colSpan);
        // firstTd.rowSpan = rowSpan;
        // firstTd.colSpan = colSpan;

        this.refresh();
    },

    /**
     * 
     * @param {*} td           relative td
     * @param {*} direction    0 up, 1 right, 2 down, 3 left
     * 
     */
    mergeTo(td, direction) {
        const tdMatrix = this.getTdMatrix(td);
        const nextMatrix = [...tdMatrix];
        switch (direction) {
            case 0:
                nextMatrix[0]--;
                break;
            case 1:
                const colSpan = this.nanny.getTdColSpan(td);
                nextMatrix[1] += colSpan;
                break;
            case 2:
                const rowSpan = this.nanny.getTdRowSpan(td);
                nextMatrix[0] += rowSpan;
                break;
            default:
                nextMatrix[1]--;
                break;
        }
        const nextTd = this.getTdByMatrix(...nextMatrix);
        if (nextTd) {
            this.merge(td, nextTd);
            return this.matrixMat2Td(...tdMatrix);
        } else {
            return null;
        }
    },


    /**
     * 
     * @param {Element} tdFrom 
     * @param {Element} tdTo 
     */
    findAreaTd(tdFrom, tdTo) {
        if (tdFrom == null && tdTo == null) return;
        else if (tdFrom == null) tdFrom = tdTo;
        else if (tdTo == null) tdTo = tdFrom;
        let selection = this.selectionByTd(tdFrom, tdTo);
        return selection.td;
    },




    /**
     * All TDs in rectange selection.
     * @param {Element} tdFrom
     * @param {Element} tdTo
     */
    selectionByTd(tdFrom, tdTo) {
        if (tdFrom == null && tdTo == null) return;
        else if (tdFrom == null) tdFrom = tdTo;
        else if (tdTo == null) tdTo = tdFrom;
        let queue = [tdFrom, tdTo],
            index = 0,
            tdFromPosition = this.getMatRectangeAreaByTd(tdFrom),
            tdFromAndEndPosition = this.getMatRectangeAreaByTd(tdFrom, tdTo),
            area = [
                tdFromPosition[0][0], tdFromPosition[0][1],  // left top
                tdFromPosition[1][0], tdFromPosition[1][1]   // right bottom
            ],
            me = this;


        // find other TD inner area
        // TODO: can be optimized.
        this.matrixForInArea(
            tdFromAndEndPosition[0], tdFromAndEndPosition[1], 
            (num, rowIndex, colIndex)=>{
                let td = me.getTdByMatrix(rowIndex, colIndex);
                if (queue.indexOf(td) == -1){
                    queue.push(td);
                }
            }
        );

        // find big cell expand
        while(index < queue.length){
            let newFound = false,
                newArea = area.concat(),
                tdArea = this.getMatRectangeAreaByTd(queue[index]);

            if (tdArea[0][0] < newArea[0]){
                newArea[0] = tdArea[0][0];
                newFound = true;
            }
            if (tdArea[0][1] < newArea[1]){
                newArea[1] = tdArea[0][1];
                newFound = true;
            }
            if (tdArea[1][0] > newArea[2]){
                newArea[2] = tdArea[1][0];
                newFound = true;
            }
            if (tdArea[1][1] > newArea[3]){
                newArea[3] = tdArea[1][1];
                newFound = true;
            }

            if (newFound == true){
                let me = this;
                this.matrixForInArea(
                    [newArea[0], newArea[1]],
                    [newArea[2], newArea[3]],
                    (num, rowIndex, colIndex)=>{
                        if (rowIndex < area[0] || rowIndex > area[2] || colIndex < area[1] || colIndex > area[3]){ // out of the past area 
                            // find head unit of big cell
                            if (me.cellCanCount(rowIndex, colIndex) == false){
                                [rowIndex, colIndex] = me.findFirstNumberPosition(rowIndex, colIndex);
                                if (rowIndex == -1 || colIndex == -1)
                                    return;    
                            }
                            let td = me.getTdByMatrix(rowIndex, colIndex);
                            if (queue.indexOf(td) == -1){
                                queue.push(td);
                            }
                        }
                    }
                );
                area = newArea;
            }
            index++;
        }
        queue = this.sort(queue);
        return {td:queue, area: [[area[0], area[1]], [area[2], area[3]]]};
    },

};