/**
 * Created by zhangting on 16/12/9.
 */
var utility = require('../utility');
require('../date_ex');
require('../string_ex');
var db = require('../models/db');
//var redis = require("../redis");

//(async function () {
//    var date = new Date().format('yyyyMMddhhmmssS');
//    var random = utility.random_letter(4).toUpperCase();
//    var index = await redis.incrSync();
//    var trade_no = `${date}${random}A${index.toString().padLeft(5, '0')}`;
//    console.log(trade_no);
//})();


(async function () {
    var ret = await db.sequelize.query(`update order_ set _data=JSON_REPLACE(_data,'$.status','11') where order_id=1`);
    console.log(ret[0].affectedRows);
})();

