/**
 * Created by zt on 16/12/21.
 */
var db = require('../models/db');

db.sequelize.query(`call order_partner_select_proc('fbtest','所有','2016-12-15','2016-12-21',0,30)`, { type: db.sequelize.QueryTypes.SELECT}).then(data=> {
    console.log(data[0]);
    console.log(data[1]['0'].total_count);

    for(var i in data[0]){
        console.log(i);
    }
}).catch(err=> {
    console.log(err);
});