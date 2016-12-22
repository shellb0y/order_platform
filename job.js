/**
 * Created by zt on 16/12/9.
 */
var redis = require("./redis");
var cronJob = require("cron").CronJob;
var db = require('./models/db');
var request = require('request-promise');
var crypto = require('crypto');
var log = require('./logger');
require('./date_ex');

var program = 'order_platform_callback';

module.exports = function () {
    //new cronJob('0 0 0 * * *', function () {
    //    var client = redis.createClient();
    //    client.set('order_platform:trade_index', 0, (err, data)=> {
    //        if (!err)
    //            console.log(data);
    //        else
    //            console.error(err);
    //
    //        client.quit();
    //    });
    //}, null, true);

    //orderSuccessMonitor();
    //orderFaildMonitor();
};


async function orderSuccessMonitor() {
    var client = redis.createClient();
    setInterval(async function () {
        var data = await redis.brpopSync(client, 'order_platform:phone_charge:order_success', 1);
        //console.log(data);
        if (!data) return;
        var order = JSON.parse(data[1]);
        //console.log(order);
        var partner = order.partner;
        //console.log(partner);
        log.i(order.trade_no, `callback partner ${partner.name}
        GET ${order.callback}`, program);

        var t = new Date();
        request({
            uri: order.callback,
            qs: {
                'partner_price': order.partner_price,
                'success': order.success,
                't': t,
                'trade_no': order.trade_no,
                'sign': crypto.createHash('md5').update(`${order.partner_price}${partner.secret}${order.success}${t.getTime()}${order.trade_no}`).digest('hex')
            },
            json: true
        }).then((resp)=> {
            var callback_status = '回调失败';
            if (resp && resp.success)
                callback_status = '回调成功';

            db.sequelize.query(`update order_ set _data=JSON_SET(_data,
                    '$.status','充值成功','$.callback_status','${callback_status}','$.order_sync_jd_status_time','${order.order_sync_jd_status_time}',
                    '$.order_callback_time','${t.format('yyyy-MM-dd hh:mm:ss')}','$.order_callback_complete_time','${new Date().format('yyyy-MM-dd hh:mm:ss')}')
                     where _data->'$.trade_no'='${order.trade_no}'`).catch((err)=> {
                if(!err) {
                    client.lpush('order_platform:phone_charge:order_save_faild', data[1]);
                    log.e(order.trade_no, err, program);
                }
            });
            db.sequelize.query(`update partner set _data=json_set(_data,'$.balance',_data->'$.balance'-${order.partner_price})
                     where _data->'$.name'='${partner.name}'`).catch((err)=> {
                if(!err) {
                    client.lpush('order_platform:phone_charge:order_save_faild', data[1]);
                    log.e(order.trade_no, err, program);
                }
            });
            db.sequelize.query(`update account_ set _data=json_set(_data,'$.pay_status',1,'$.discount',${order.discount},'$.unused_discount',_data->'$.unused_discount'-${order.discount}) where account_id=${order.account_id};`).catch((err)=> {
                if(!err) {
                    client.lpush('order_platform:phone_charge:order_save_faild', data[1]);
                    log.e(order.trade_no, err, program);
                }
            });

            client.del(`order_platform:phone_charge:trade_no:${order.trade_no}`);
        }).catch(function (err) {
            log.e(order.trade_no, err, program);
            client.lpush('order_platform:phone_charge:order_success', data[1]);
        });
    }, 5000);
}

async function orderFaildMonitor() {
    var client = redis.createClient();
    setInterval(async function () {
        var data = await redis.brpopSync(client, 'order_platform:phone_charge:order_faild', 1);
        //console.log(data);
        if (!data) return;
        var _data = JSON.parse(data[1]);

        //console.log(_data);

        var orders = await db.sequelize.query(`select _data from order_ where _data->'$.trade_no' = '${_data.trade_no}' or _data->'$.pay_task_id'='${_data.trade_no}'`,
            {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
            log.e(_data.trade_no, err, program);
            client.lpush('order_platform:phone_charge:order_faild', data[1]);
        });

        var order = {};
        var secret = '';
        if (orders.length > 0) {
            order = JSON.parse(orders[0]._data);
        } else {
            log.e(order.trade_no, `cant find order ${order.trade_no}`, program);
            return;
        }

        //console.log(order);

        log.i(order.trade_no, `callback partner ${order.partner.name}
        GET ${order.callback}`, program);

        var t = new Date();
        request({
            method: 'GET',
            uri: order.callback,
            qs: {
                'partner_price': 0,
                'success': 0,
                't': t,
                'trade_no': order.trade_no,
                'sign': crypto.createHash('md5').update(`0${order.partner.name}0${t.getTime()}${order.trade_no}`).digest('hex')
            },
            json: true
        }).then(function (repos) {
            var callback_status = '回调失败';
            if (repos && repos.success)
                callback_status = '回调成功';

            db.sequelize.query(`update order_ set _data=JSON_SET(_data,
                    '$.status','充值失败','$.callback_status','${callback_status}','$.order_faild_time','${_data.order_faild_time}',
                    '$.order_callback_time','${t.format('yyyy-MM-dd hh:mm:ss')}','$.order_callback_complete_time','${new Date().format('yyyy-MM-dd hh:mm:ss')}')
                     where _data->'$.trade_no'='${order.trade_no}'`).catch((err)=> {
                if(!err) {
                    client.lpush('order_platform:phone_charge:order_save_faild', data[1]);
                    log.e(err);
                }
            }).then(data=>{
                client.del(`order_platform:phone_charge:trade_no:${order.trade_no}`);
            });
        }).catch(function (err) {
            log.e(order.trade_no, err, program);
            client.lpush('order_platform:phone_charge:order_faild', data[1]);
        });
    }, 5000);
}
