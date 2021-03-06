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
    var program = 'order_platform_ordersuccess';
    var client = redis.createClient();
    setInterval(async function () {
        var data = await redis.brpopSync(client, 'order_platform:phone_charge:order_success', 1);
        //console.log(data);
        log.i('queue', data, program);
        if (!data) return;
        var order = JSON.parse(data[1]);
        //console.log(order);
        var partner = order.partner;
        //console.log(partner);
        log.i(order.trade_no, `callback partner ${partner.name}
        GET ${order.callback}`, program);

        var t = new Date();
        var time = t.getTime();
        request({
            uri: order.callback,//http://127.0.0.1:3000/v1/api/callback
            qs: {
                'amount': order.partner_price,
                'success': 1,
                't': time,
                'trade_no': order.trade_no,
                'sign': crypto.createHash('md5').update(`${order.partner_price}${partner.secret}1${time}${order.trade_no}`).digest('hex')
            },
            json: true
        }).then((resp)=> {
            var callback_status = '回调失败';
            if (resp && resp.success)
                callback_status = '回调成功';

            //db.sequelize.query(`update order_ set _data=JSON_SET(_data,
            //        '$.status','充值成功','$.callback_status','${callback_status}','$.order_sync_jd_status_time','${order.order_sync_jd_status_time}',
            //        '$.order_callback_time','${t.format('yyyy-MM-dd hh:mm:ss')}','$.order_callback_complete_time','${new Date().format('yyyy-MM-dd hh:mm:ss')}')
            //         where _data->'$.trade_no'='${order.trade_no}'`).catch((err)=> {
            //    if(!err) {
            //        client.lpush('order_platform:phone_charge:order_save_faild', data[1]);
            //        log.e(order.trade_no, err, program);
            //    }
            //});
            //db.sequelize.query(`update partner set _data=json_set(_data,'$.balance',_data->'$.balance'-${order.partner_price})
            //         where _data->'$.name'='${partner.name}'`).catch((err)=> {
            //    if(!err) {
            //        client.lpush('order_platform:phone_charge:order_save_faild', data[1]);
            //        log.e(order.trade_no, err, program);
            //    }
            //});
            //db.sequelize.query(`update account_ set _data=json_set(_data,'$.pay_status',1,'$.discount',${order.discount},'$.unused_discount',_data->'$.unused_discount'-${order.discount}) where account_id=${order.account.account_id};`).catch((err)=> {
            //    if(!err) {
            //        client.lpush('order_platform:phone_charge:order_save_faild', data[1]);
            //        log.e(order.trade_no, err, program);
            //    }
            //});

            db.sequelize.query(
                `call order_success_tran_update('${callback_status}','${order.order_sync_jd_status_time}',
                    '${t.format('yyyy-MM-dd hh:mm:ss')}','${new Date().format('yyyy-MM-dd hh:mm:ss')}',
                    '${order.trade_no}',${order.partner_price},'${partner.name}',${order.discount},${order.account.account_id})`).then(data=> {
                if (!data['0'].t_error) {
                    client.del(`order_platform:phone_charge:trade_no:${order.trade_no}`);
                    log.i(order.trade_no, 'all success', program);
                }
                else {
                    client.lpush('order_platform:phone_charge:order_save_faild', order.trade_no);
                    log.e(order.trade_no, 'handle faild', program);
                }
            }).catch(err=> {
                log.e(order.trade_no, err, program);
                client.lpush('order_platform:phone_charge:order_save_faild', order.trade_no);
            });
        }).catch(function (err) {
            log.e(order.trade_no, err, program);
            client.lpush('order_platform:phone_charge:order_success', data[1]);
        });
    }, 5000);
}

async function orderFaildMonitor() {
    var program = 'order_platform_orderfaild';
    var client = redis.createClient();
    setInterval(async function () {
        var data = await redis.brpopSync(client, 'order_platform:phone_charge:order_faild', 1);
        //console.log(data);
        log.i('queue', data, program);
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
        var time = t.getTime();
        request({
            method: 'GET',
            uri: order.callback,
            qs: {
                'amount': 0,
                'success': 0,
                't': time,
                'trade_no': order.trade_no,
                'sign': crypto.createHash('md5').update(`0${order.partner.secret}0${time}${order.trade_no}`).digest('hex')
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
                if (!err) {
                    client.lpush('order_platform:phone_charge:order_save_faild', data[1]);
                    log.e(order.trade_no, err, program);
                }
            }).then(data=> {
                client.del(`order_platform:phone_charge:trade_no:${order.trade_no}`);
                log.i(order.trade_no, 'all success', program);
            });
        }).catch(function (err) {
            log.e(order.trade_no, err, program);
            client.lpush('order_platform:phone_charge:order_faild', data[1]);
        });
    }, 5000);
}
