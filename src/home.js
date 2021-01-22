import father from './father';
import mother from './mother';
import liLei from './liLei';
import hanMeiMei from './hanMeiMei';
import puppy from './puppy';

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
    this.init(table);
    this.buildMatrix();
};
// Object.assign(diapason, father, mother, liLei, hanMeiMei, puppy);
TableBuster.prototype = diapason;
window.TableBuster = TableBuster;
// export default TableBuster;