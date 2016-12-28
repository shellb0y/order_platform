/**
 * Created by zt on 16/12/27.
 */
var router = require('koa-router')();
var db = require('../../models/db');
var redis = require("../../redis");
require('../../date_ex');

/**
 * @api {POST} /callback/paysuccess 支付成功回调
 * @apiName CALLBACK_PAYSUCCESS
 * @apiVersion 1.0.0
 * @apiGroup System
 *
 * @apiDescription 支付成功回调,调用之后,系统会去同步订单状态并且给商户回调,当成功时会减少账户余额,请谨慎调用
 *
 * @apiExample Example usage:
 * curl -X POST -d "trade_no=1111" -H "Content-Type:application/x-www-form-urlencoded;charset=utf-8" -i /api/view/system/callback/paysuccess
 *
 * @apiSuccess {Boolean} success 是否成功
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "success": true
 * }
 *
 * HTTP/1.1 200 OK
 * {
 *   "success": false,
 *   "err":""
 * }
 * */
router.post('/callback/paysuccess', async(ctx, next)=> {
    var redis_client = redis.createClient();
    var data =await redis.lpushSync(redis_client, 'order_platform:phone_charge:order_pay_success', ctx.request.body.trade_no).catch((err)=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });
    redis_client.quit();

    console.log(`manual callback paysuccess:${data.trade_no},push order_pay_success,${data}`);
    ctx.body = {'success': true};
});

/**
 * @api {POST} /callback/success 订单成功回调
 * @apiName CALLBACK_SUCCESS
 * @apiVersion 1.0.0
 * @apiGroup System
 *
 * @apiDescription 订单成功回调,调用之后,系统不会去同步订单状态,而是直接回调商户并减少商户余额,请谨慎调用
 *
 * @apiExample Example usage:
 * curl -X POST -d "trade_no=1111" -H "Content-Type:application/x-www-form-urlencoded;charset=utf-8" -i /api/view/system/callback/paysuccess
 *
 * @apiSuccess {Boolean} success 是否成功
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "success": true
 * }
 *
 * HTTP/1.1 200 OK
 * {
 *   "success": false,
 *   "err":"找不到订单"
 * }
 * */
router.post('/callback/success', async(ctx, next)=> {
    var trade_no = ctx.request.body.trade_no;
    if (!trade_no) {
        ctx.body = {'success': false, 'err': '找不到订单'};
        return;
    }

    var order = await db.sequelize.query(`select _data from order_ where _data->'$.pay_task_id' = '${trade_no}' or _data->'$.trade_no'='${trade_no}'`,
        {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });

    if (order.length == 0) {
        ctx.body = {'success': false, 'err': '找不到订单'};
        return;
    }

    order = JSON.parse(order[0]._data);
    order.order_sync_jd_status_time = new Date().format('yyyy-MM-dd hh:mm:ss');

    var redis_client = redis.createClient();
    var data = await redis.lpushSync(redis_client, 'order_platform:phone_charge:order_success', JSON.stringify(order)).catch((err)=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });
    redis_client.quit();
    console.log(`manual callback order_success:${order.trade_no},push order_success,${data}`);
    ctx.body = {'success': true};
});

/**
 * @api {POST} /callback/faild 订单失败回调
 * @apiName CALLBACK_FAILD
 * @apiVersion 1.0.0
 * @apiGroup System
 *
 * @apiDescription 订单失败回调,调用之后,系统不会去同步订单状态,而是直接回调商户,请谨慎调用
 *
 * @apiExample Example usage:
 * curl -X POST -d "trade_no=1111" -H "Content-Type:application/x-www-form-urlencoded;charset=utf-8" -i /api/view/system/callback/paysuccess
 *
 * @apiSuccess {Boolean} success 是否成功
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "success": true
 * }
 *
 * HTTP/1.1 200 OK
 * {
 *   "success": false,
 *   "err":""
 * }
 * */
router.post('/callback/faild', async(ctx, next)=> {
    var data = {'trade_no': ctx.request.body.trade_no, 'order_falid_time': new Date().format('yyyy-MM-dd hh:mm:ss')};
    var redis_client = redis.createClient();
    var data = await redis_client.lpushSync(redis_client, 'order_platform:phone_charge:order_faild', JSON.stringify(data)).catch((err)=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });

    redis_client.quit();
    console.log(`manual callback order_faild:${data.trade_no},push order_faild,${data}`);
    ctx.body = {'success': true};
});


/**
 * @api {GET} /queue 获取队列信息
 * @apiName GET_QUEUE
 * @apiVersion 1.0.0
 * @apiGroup System
 *
 * @apiDescription 获取队列信息
 *
 * @apiExample Example usage:
 * curl -i /api/view/system/queue
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "支付队列": 0,
 *   "成功队列": 0,
 *   "失败队列": 0
 * }
 * */
router.get('/queue', async(ctx, next)=> {
    ctx.body = {'支付队列': 0, '成功队列': 0, '失败队列': 0};
});


module.exports = router;