import father from './father';
import mother from './mother';
import liLei from './liLei';
import hanMeiMei from './hanMeimei';

let diapason = { dom : null },
    home = function(table){ 
        this.dom = table;
        this.scan();
    };
Object.assign(diapason, father, mother, liLei, hanMeiMei);
home.prototype = diapason;
export default home;