/**
 * Created by zt on 16/12/22.
 */
var redis = require("../redis");
var client = redis.createClient();
require('../date_ex');
var db = require('../models/db');

//(async ()=>{
//
//})();

//db.sequelize.query(`select _data from order_ where order_id>283`, {type: db.sequelize.QueryTypes.SELECT}).then(data=> {
//    for(var i in data){
//        //console.log(JSON.parse(data[i]._data).trade_no);
//        var _data = JSON.parse(data[i]._data);
//        var __data = {'trade_no': _data.trade_no, 'order_faild_time': new Date().format('yyyy-MM-dd hh:mm:ss')};
//        client.lpush('order_platform:phone_charge:order_faild', JSON.stringify(__data), function (err, data) {
//            console.log(data);
//        });
//    }
//}).catch(err=> {
//    throw err;
//});

db.sequelize.query(`select _data from order_ where _data->'$.status'='充值成功'`, {type: db.sequelize.QueryTypes.SELECT}).then(data=> {
    for(var i in data){
        //console.log(JSON.parse(data[i]._data).trade_no);
        var _data = JSON.parse(data[i]._data);
        var __data = {'trade_no': _data.trade_no, 'order_faild_time': new Date().format('yyyy-MM-dd hh:mm:ss')};
        client.lpush('order_platform:phone_charge:order_success', JSON.stringify(__data), function (err, data) {
            console.log(data);
        });
    }
}).catch(err=> {
    throw err;
});