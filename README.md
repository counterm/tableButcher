# 表格单元格合并与分割操作库
提供一个基本JS实现的表格单元格控制库，可以实现基本的所有单元格操作，支持对合并后的单元格识别，继续进行准确的选择、合并等操作。


由于当前只是随意编写的代码，所以内里JS文件组成并不合理，会对调试造成一定影响，有需要的可以对所有子“角色”文件合并后使用。



基础表格演示 [DEMO](https://counterm.github.io/tableButcher/demo/panel.html)
VUE演示 [DEMO](https://counterm.github.io/tableButcher/demo/vue.html)


# 初始化

使用了两种初始化模式，分别针对普通HTML表格，和一般JS对象。后者适用于VUE等选框中的data。

## 原生表格初始化

参数：表格对象。

```
var tb = new TableBuster(document.querySelector('table'));
```

## 对象数据初始化

需要先初始化操作接口，再初始化数据对象。

参数：操作接口对象
```
var tb = new TableObjectBuster(nanny);
tb.init(columnsData);
```



# 操作库API

|方法|说明|示例|
|---|---|---|
|addCellToAllRow|向表格最右侧插入列。可传入方法针对所有新生成的列进行微调。传入的方法参数有单元格、行索引、列索引、表格对象、行对象。|tb.addCellToAllRow((td, rowIndex, cellIndex, table, tr) => {})|
|addNewRow|向表格底部插入行。可传入方法，同上。|tb.addNewRow((td, rowIndex, cellIndex, table, tr) => {})|
|insertCell|在所给出的单元格前插入列，可传入方法，同上。如果表格存在有单元格横跨插入的位置，会拉伸该单元格。|tb.insertCell(td, fn)|
|insertRow|在所给出的单元格上方插入行，可传入方法，同上。如果表格存在有单元格横跨插入的位置，会拉伸该单元格。|tb.insertRow(td, fn)|
|split|分割已合并的单元格。可传入方法对分割出的新单元格进行调整。|tb.split(td, fn)|
|merge|合并给出的单元格，可对多个已合并的单元格进行再合并。|tb.merge(td1, td2, td3)|
|deleteColumn|删除某个单元格所在的列。如果该单元格是合并过的，则会对其所影响的列都进行删除。如果所在的列存在合并的单元格，会对其进行缩减。|tb.deleteColumn(td)|
|deleteRow|删除某个单元格所在的行，如果该单元格是合并过的，则会对其所影响的行都进行删除。如果所在的行存在合并的单元格，会对其进行缩减。|tb.deleteRow(td)|
|refresh|刷新表格实例，如果表格被库以外的程序修改，需要调用refresh方法更新内部引用。|tb.refresh()|
| isTheFirstTd | 判断是否最左侧的单元格，返回布尔值 | tb.isTheFirstTd(td) |
| isTheLastTd | 判断是否最右侧的单元格，返回布尔值。 | tb.isTheLastTd(td) |
| isTheFirstTr | 判断是否最顶层的行，返回布尔值。参数可选，可给出行，或单元格。 | tb.isTheFirstTr(tr, null), tb.isTheFirstTr(null, td) |
| isTheLastTr | 判断是否最低层的行，返回布尔值。参数可选，可给出行，或单元格，如果给出单元格则判断单元格低部，而非判断所在的行。  |  tb.isTheLastTr(tr, null), tb.isTheLastTr(null, td)  |
| findTheTdNext | 查找右侧的单元格。只返回一个。 | tb.findTheTdNext(td) |
| findTheTdPrev | 查找左侧的单元格。只返回一个。 | tb.findTheTdPrev(td) |
| findTheTdAbove | 查找上方的单元格。只返回一个。 | tb.findTheTdAbove(td) |
| findTheTdUnder | 查找下方的单元格。只返回一个。 | tb.findTheTdUnder(td) |


# 操作接口
操作接口允许库支持更多的场景。库内部实现了nannyDom.js。测试目录test里面的nanny.js实现了数组形式的接口。

|方法|说明|参数|
|---|---|---|
|moveTdChilds|迁移某单元格中的内容到另一个单元格。|(源单元格，目标单元格)|
|newTd|新建单元格对象||
|delTd|删除单元格|（所在行对象，单元格对象）
|newTr|新建行||
|delTr|删除行|(表格，行对象)|
|getTdRowSpan|获取单元格行合并值|（单元格）|
|getTdColSpan|获取单元格列合并值|（单元格）|
|getRowByIndex|根据给出索引获取对应的行对象|（表格，索引值）|
|getRowByTd|根据给出的单元格，获取其所在的行|（表格，单元格）|
|getTdsInRow|获取某行的所有单元格|(行对象)|
|getTdInRow|根据索引获取某行的单元格|（行对象，索引值）|
|getRowSize|获取行大小|（表格）|
|eachRow|遍历行|（表格，方法（行对象，行索引））|
|insertEmptyRow|在表格中插入空行|（表格，位置索引值）|
|insertRowBefore|在表格某选择的行前插入行对象|（表格，选择的行，需要插入的行）|
|insertBeforeTd|在某单元格前插入一个单元格|（行，选择的单元格，插入的单元格）|
|insertAfterTd|在某单元格后插入一个单元格|（行，选择的单元格，插入的单元格）|
|appendTd|在某行后插入单元格|（行，插入的单元格）|
|setTdSpan|设置单元格的合并值，如果相对值为true，则只针对合并值作偏移处理。|（单元格，行合并值，列合并值，是否相对）|
