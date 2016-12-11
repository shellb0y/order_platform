/**
 * Created by zt on 16/12/10.
 */
var router = require('koa-router')();
var db = require('../models/db');
var redis = require("../redis");
var utility = require('../utility');
require('../date_ex');
require('../string_ex');

router.post('/order', async (ctx, next)=> {
    if (ctx.request.body) {
        if (ctx.request.body.id) {
            db.order.update({
                _data: ctx.request.body.data,
                modified: Date.now()
            }, {where: {order_id: ctx.request.body.id}}).catch((err)=> {
                throw err;
            });

            ctx.body = 1;
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

router.post('/order/status', async (ctx, next)=> {
    var ret = await db.sequelize.query(`update order_ set _data=JSON_REPLACE(_data,'$.status','${ctx.request.body.status}') where order_id=${ctx.request.body.order_id}`);
    ctx.body = ret[0].affectedRows;
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