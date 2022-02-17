import father from './father';
import mother from './mother';
import liLei from './liLei';
import hanMeiMei from './hanMeiMei';
import puppy from './puppy';
import nannyDom from './nannyDom';
import nannyObj from './nannyObj';

// output layer
let diapason = {
    dom: null,
    ...father,
    ...mother,
    ...liLei,
    ...hanMeiMei,
    ...puppy
};

// entry class
const TableBuster = function(table){ 
    this.nanny = nannyDom;
    this.init(table);
    this.buildMatrix();
};
const TableObjectBuster = function (object) {
    this.nanny = nannyObj;
    this.initObject(object);
    this.buildMatrix();
};
// Object.assign(diapason, father, mother, liLei, hanMeiMei, puppy);
TableBuster.prototype = diapason;
TableObjectBuster.prototype = diapason;

export { TableObjectBuster, TableBuster };

window.TableBuster = TableBuster;
// export default TableBuster;