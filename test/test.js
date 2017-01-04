/**
 * Created by zhangting on 16/12/9.
 */
var utility = require('../utility');
require('../date_ex');
require('../string_ex');
var db = require('../models/db');
var request = require('request-promise');
var crypto = require('crypto');
var logger = require('../logger');
//var redis = require("../redis");

//(async function () {
//    var date = new Date().format('yyyyMMddhhmmssS');
//    var random = utility.random_letter(4).toUpperCase();
//    var index = await redis.incrSync();
//    var trade_no = `${date}${random}A${index.toString().padLeft(5, '0')}`;
//    console.log(trade_no);
//})();

//logger.t("trace");
//logger.d("key","debug order_platform","order_platform");
//logger.i("key","info order_platform","order_platform");
//logger.w("key","warn order_platform","order_platform");
//logger.e("key","err order_platform","order_platform");


var dgram = require('dgram');
var host = '115.28.102.142';
var port = 55514;
var client = dgram.createSocket('udp4');
var data = {
    'program': program || 'order_platform',
    '@tags': key || [],
    'message': msg,
    '@fields.levelname': level
};
//
//data = JSON.stringify(data);
//var message = Buffer.from('test');
//client.send('order_platform', port, host, function (err, bytes) {
//    console.log('complete');
//    if (err)
//        console.error(err);
//    client.close();
//});

//logger.e("key",new Error('test error'));

//(async function () {
//    var ret = await db.sequelize.query(`update order_ set _data=JSON_REPLACE(_data,'$.status','11') where order_id=1`);
//    console.log(ret[0].affectedRows);
//})();

//(async function () {
//    var order = await db.sequelize.query(`select _data from order_ where _data->'$.status' = '下单成功,等待支付'`,
//        {type: db.sequelize.QueryTypes.SELECT}).catch((err)=> {
//        if (err instanceof Error)
//            throw err;
//        else
//            throw new Error(err);
//    });
//
//
//    //console.log(order);
//    order.forEach(async (o)=> {
//        var _o = JSON.parse(o._data);
//        //console.log(_o);
//        //console.log(_o.partner_price);
//        //console.log(_o.partner_order_id);
//        //console.log(_o.callback);
//        //console.log(_o.trade_no);
//        //console.log(JSON.parse(_o.partner).secret);
//
//        t = Date.now();
//        var _target = `${_o.partner_price}${_o.partner_order_id}${JSON.parse(_o.partner).secret}1${t}${_o.trade_no})`;
//        console.log('callback target:' + _target);
//        sign = crypto.createHash('md5').update(_target).digest('hex');
//        console.log('callback sign:' + sign);
//        var url = `${decodeURI(_o.callback)}?partner_order_id=${_o.partner_order_id}&trade_no=${_o.trade_no}&amount=${_o.partner_price}&success=1&t=${t}&sign=${sign}`;
//        request.get(url).catch((e)=>console.log(e));
//    });
//
//})();

//(async function () {
//    var order_id = await db.sequelize.query(`select order_id from order_ where _data->'$.trade_no'='20161215023325153UROAA00001'`,
//        {type: db.sequelize.QueryTypes.SELECT});
//    console.log(order_id[0].order_id);
//})();



