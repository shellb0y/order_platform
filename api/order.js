/**
 * Created by zt on 16/12/10.
 */
var router = require('koa-router')();
var db = require('../models/db');
var redis = require("../redis");
var utility = require('../utility');
require('../date_ex');
require('../string_ex');

router.get('/testtest/order', async (ctx, next)=> {
    var data = await db.sequelize.query(`select _data from order_`,
        {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });

    if (data.length > 0) {
        ctx.body = data;
    } else {
        ctx.body = '';
    }
});


router.post('/order', async (ctx, next)=> {
    if (ctx.request.body) {
        if (ctx.request.body.order_id) {
            db.order.update({
                _data: ctx.request.body.data,
                modified: Date.now()
            }, {where: {order_id: ctx.request.body.order_id}}).catch((err)=> {
                if (err instanceof Error)
                    throw err;
                else
                    throw new Error(err);
            });

            if (ctx.request.body.data.status == '下单成功') {
                db.sequelize.query(`update account_ set _data=JSON_INSERT(_data,'$.order_90_5_count',1)
                where account_id=${ctx.request.body.data.account.account_id}`).catch((err)=> {
                    if (err instanceof Error)
                        throw err;
                    else
                        throw new Error(err);
                });
            } else if (ctx.request.body.data.status == '下单失败' || ctx.request.body.data.status == '下单异常') {
                var redis_client = redis.createClient();
                redis_client.lpush('order_platform:phone_charge:order', ctx.request.body.data.trade_no);
                redis_client.quit();
            }

            ctx.body = ctx.request.body.id;
        } else {
            var order = await db.order.create({_data: ctx.request.body.data, created: Date.now()});
            if (order) {
                ctx.body = order.order_id;
            } else {
                ctx.body = -1;
            }
        }
    }
    else {
        ctx.body = 0;
    }
});

router.get('/order/paysuccess', async(ctx, next)=> {
    var orders = await db.sequelize.query(`select _data as data from order_ where _data->'$.status' = '充值成功'`, {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });

    ctx.body = orders;

    //if (orders.length > 0) {
    //    ctx.body = orders;
    //} else {
    //    ctx.body = {};
    //}

});

router.get('/order/:id', async (ctx, next)=> {
    var data = await db.sequelize.query(`select _data->'$.status' as status from order_ where _data->'$.pay_task_id' = '${ctx.params.id}' or _data->'$.trade_no'='${ctx.params.id}'`,
        {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });

    if (data.length > 0) {
        ctx.body = data[0].status.replace(/"/ig, '');
    } else {
        ctx.body = '';
    }
});

router.post('/order/status', async (ctx, next)=> {
    var callback_status = ctx.request.body.callback_status || '';
    var ret = await db.sequelize.query(`update order_ set _data=JSON_SET(_data,'$.status','${decodeURI(ctx.request.body.status)}','$.callback_status','${callback_status}')
    where _data->'$.pay_task_id'='${ctx.request.body.order_id}'`).catch((err)=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });

    //ctx.body = ret[0].affectedRows;
    ctx.body = 'success';
    //[OkPacket {
    //    fieldCount: 0,
    //    affectedRows: 1,
    //    insertId: 0,
    //    serverStatus: 2,
    //    warningCount: 0,
    //    message: '(Rows matched: 1  Changed: 0  Warnings: 0',
    //    protocol41: true,
    //    changedRows: 0
    //},
    //    OkPacket {
    //    fieldCount: 0,
    //    affectedRows: 1,
    //    insertId: 0,
    //    serverStatus: 2,
    //    warningCount: 0,
    //    message: '(Rows matched: 1  Changed: 0  Warnings: 0',
    //    protocol41: true,
    //    changedRows: 0
    //}]
});

module.exports = router;