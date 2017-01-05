/**
 * Created by zt on 16/12/7.
 */
'use strict';
var router = require('koa-router')();
var db = require('../../models/db');
var request = require('request-promise');
var crypto = require('crypto');
var redis = require("../../redis");
//var redis2 = require("../../redis2");
var utility = require('../../utility');
require('../../date_ex');
require('../../string_ex');
var logger = require('../../logger');

var debug = 1;
var program = 'order_platform_api';

function md5(text) {
    return crypto.createHash('md5').update(text).digest('hex');
}

//@apiIgnore
/**
 * @api {GET} /order 提交订单
 * @apiName PostOrder
 * @apiVersion 1.0.0
 * @apiGroup Order
 *
 * @apiDescription 提交订单
 *
 * @apiParam {String}   id            商户订单号
 * @apiParam {String}   mobile        待充值的手机号
 * @apiParam {String}   amount        金额,暂时只支持100元的话费充值
 * @apiParam {String}   partner       商户号
 * @apiParam {String}   callback      商户回调地址
 * @apiParam {Number}   t             时间戳
 * @apiParam {String}   sign          签名,按参数字母升序将值连接成一个字符串并用md5加密,md5({amount}{callback}{id}{mobile}{partner}{secret(密钥)}{t})
 *
 * @apiExample Example usage:
 * curl -i http://139.199.65.115:3000/v1/api/order?amount={amount}&callback={urlencode(callback)}&id={id}&mobile={mobile}&partner={partner}&t={t}&sign={sign}
 *
 * @apiExample Callback(GET):
 * curl -i http://xxxxxx?trade_no={交易号}&amount={金额}&success={1(成功)|0(失败)}&t={时间戳}&sign=md5({amount}{secret(密钥)}{success}{t}{trade_no})
 * HTTP/1.1 200
 * {
 *   "success":1(成功)|0(失败),
 * }
 * 注:如果返回0,会重试3次
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "data":{"trade_no":"JDPH2016120810000000000001"}
 *     }
 *
 * @apiError DATA_INVALID   parameter error.
 * @apiError SIGN_INVALID   signature verification failed.
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 OK
 *     {
 *       "success":false,
 *       "error": {"code":"DATA_INVALID","message":"{parameter error}"}
 *     }
 *
 *     HTTP/1.1 200 OK
 *     {
 *       "success":false,
 *       "error": {"code":"SIGN_INVALID","message":"signature verification failed."}
 *     }
 * */
router.get('/order', async function (ctx, next) {
    logger.i('/v1/api/order', ctx.request.query, program);

    var sign = ctx.request.query.sign;
    var t = ctx.request.query.t;
    var id = ctx.request.query.id;
    var amount = ctx.request.query.amount;
    var callback = ctx.request.query.callback;
    var mobile = ctx.request.query.mobile;
    var partner = ctx.request.query.partner;
    var secret = '';
    var ret = {};

    if (!sign) {
        ret = {'success': false, 'error': {'code': 'PARM_SIGN_INVALID', 'message': 'missing parameter sign'}};
        ctx.body = ret;
        return;
    } else if (!t) {
        ret = {'success': false, 'error': {'code': 'PARM_T_INVALID', 'message': 'missing parameter t'}};
        ctx.body = ret;
        return;
    } else if (!id) {
        ret = {'success': false, 'error': {'code': 'PARM_ID_INVALID', 'message': 'missing parameter id'}};
        ctx.body = ret;
        return;
    } else if (!mobile) {
        ret = {'success': false, 'error': {'code': 'PARM_MOBILE_INVALID', 'message': 'missing parameter mobile'}};
        ctx.body = ret;
        return;
    } else if (!partner) {
        ret = {'success': false, 'error': {'code': 'PARM_PARTNER_INVALID', 'message': 'missing parameter partner'}};
        ctx.body = ret;
        return;
    }
    else if (!amount) {
        ret = {'success': false, 'error': {'code': 'PARM_AMOUNT_INVALID', 'message': 'missing parameter amount'}};
        ctx.body = ret;
        return;
    }
    else if (!callback) {
        ret = {'success': false, 'error': {'code': 'PARM_CALLBACK_INVALID', 'message': 'missing parameter callback'}};
        ctx.body = ret;
        return;
    }

    if (!(/^1[34578]\d{9}$/.test(mobile))) {
        ret = {'success': false, 'error': {'code': 'PARM_MOBILE_INVALID', 'message': 'mobile invalid'}};
        ctx.body = ret;
        return;
    }

    if (!(parseFloat(amount) == 100)) {
        ret = {'success': false, 'error': {'code': 'PARM_AMOUNT_INVALID', 'message': 'amount not support'}};
        ctx.body = ret;
        return;
    }

    var partners = await db.sequelize.query(`select _data from partner where _data->'$.enable' = 1 and _data->'$.name' = '${partner}'`,
        {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });

    var _partner = {};
    if (partners.length > 0) {
        _partner = JSON.parse(partners[0]._data);
        secret = _partner.secret;
    } else {
        ctx.body = {'success': false, 'error': {'code': 'PARM_PARTNER_INVALID', 'message': 'partner not found'}};
        return;
    }

    var data = amount + callback + id + mobile + partner + secret + t;
    var _sign = md5(data);

    if (_sign == sign) {
        if (_partner.balance < parseFloat(amount)) {
            ctx.body = {'success': false, 'error': {'code': 'ACCOUNT_INVALID', 'message': 'balance not enough'}};
            return;
        }

        var redis_client = redis.createClient();

        if (await redis.hgetSync(redis_client, 'order_platform:config', 'order_accept') == '0') {
            ctx.body = {'success': false, 'error': {'code': 'RESOURCE_INVALID', 'message': 'resource not enough'}};
            return;
        }

        var partner_order_key = `order_platform:partner_orderid:${partner}:${id}`;
        if (!await redis.setnxSync(redis_client, partner_order_key, 1)) {
            ctx.body = {'success': false, 'error': {'code': 'REQUEST_INVALID', 'message': 'repeat request'}};
            return;
        }

        redis_client.expire(partner_order_key, 24 * 60 * 60);

        var date = new Date().format('yyyyMMddhhmmssS');
        var random = utility.random_letter(4).toUpperCase();
        var index = await redis.incrSync(redis_client);
        var code = _partner.code;
        var trade_no = `${date}${random}${code}A${(index + '').padLeft(5, '0')}`;
        var order_timeout = 0;

        if (_partner.order_timeout) {
            order_timeout = new Date().getTime() + _partner.order_timeout * 1000;
        }

        var order = {
            'trade_no': trade_no,
            'mobile': mobile,
            'amount': amount,
            'callback': callback,
            'partner_order_id': id,
            'partner': JSON.stringify(_partner),
            'order_request_time': new Date().format('yyyy-MM-dd hh:mm:ss'),
            'order_timeout': order_timeout
        };

        logger.d(['/v1/api/order',mobile,trade_no], order, program);

        redis_client.hmset(`order_platform:phone_charge:trade_no:${trade_no}`, order);
        redis_client.expire(`order_platform:phone_charge:trade_no:${trade_no}`, 11 * 60 * 60);
        redis_client.lpush('order_platform:phone_charge:order', trade_no);
        redis_client.quit();

        ret = {'success': true, 'data': {'trade_no': trade_no}};
        logger.d(['/v1/api/order',mobile,trade_no], "accpet", program);
    }
    else {
        logger.d(['/v1/api/order',mobile,id], 'SIGN_INVALID', program);
        ret = {'success': false, 'error': {'code': 'SIGN_INVALID', 'message': 'signature verification failed'}}
    }

    if (debug)
        ret.debug = {'target': data, 'sign': _sign};


    ctx.body = ret;
});

/**
 * @api {get} /order/status 获取订单状态
 * @apiName GetOrderStatus
 * @apiVersion 1.0.0
 * @apiGroup Order
 *
 * @apiDescription 通过交易号查询订单状态
 *
 * @apiParam {String}   trade_no      订单交易号
 * @apiParam {String}   partner       商户号
 * @apiParam {Number}   t             时间戳
 * @apiParam {String}   sign          签名,按参数字母升序将值连接成一个字符串并用md5加密,md5({partner}{secret(密钥)}{t}{trade_no})
 *
 * @apiExample Example usage:
 * curl -i http://139.199.65.115:3000/v1/api/order/status?trade_no={trade_no}&t={t}&sign={sign}&partner={partner}
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "data":{"status":"充值中|充值成功|充值失败"}
 *     }
 *
 * @apiError DATA_INVALID   parameter error.
 * @apiError SIGN_INVALID   signature verification failed.
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 OK
 *     {
 *       "success":false,
 *       "error": {"code":"DATA_INVALID","message":"{parameter error}"}
 *     }
 *
 *     HTTP/1.1 200 OK
 *     {
 *       "success":false,
 *       "error": {"code":"SIGN_INVALID","message":"signature verification failed."}
 *     }
 * */
router.get('/order/status', async function (ctx, next) {
    var trade_no = ctx.request.query.trade_no;
    var sign = ctx.request.query.sign;
    var t = ctx.request.query.t;
    var partner = ctx.request.query.partner;
    var ret = {};

    if (!sign) {
        ret = {'success': false, 'error': {'code': 'PARM_SIGN_INVALID', 'message': 'missing parameter sign'}};
        ctx.body = ret;
        return;
    } else if (!t) {
        ret = {'success': false, 'error': {'code': 'PARM_T_INVALID', 'message': 'missing parameter t'}};
        ctx.body = ret;
        return;
    } else if (!trade_no) {
        ret = {'success': false, 'error': {'code': 'PARM_TRADE_NO_INVALID', 'message': 'missing parameter trade_no'}};
        ctx.body = ret;
        return;
    } else if (!partner) {
        ret = {'success': false, 'error': {'code': 'PARM_PARTNER_INVALID', 'message': 'missing parameter partner'}};
        ctx.body = ret;
        return;
    }

    var partners = await db.sequelize.query(`select _data from partner where _data->'$.name' = '${partner}'`,
        {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });

    var _partner = {};
    if (partners.length > 0) {
        _partner = JSON.parse(partners[0]._data);
    } else {
        ctx.body = {'success': false, 'error': {'code': 'PARM_PARTNER_INVALID', 'message': 'partner not found'}};
        return;
    }

    var data = partner + _partner.secret + t + trade_no;
    var _sign = md5(data);

    if (_sign == sign) {

        ret = {'success': true, 'data': {'status': ''}};
        var redis_client = redis.createClient();
        if (await redis.existSync(redis_client, `order_platform:phone_charge:trade_no:${trade_no}`).catch(err=> {
                if (err instanceof Error)
                    throw err;
                else
                    throw new Error(err);
            })) {
            ret.data.status = '充值中';
        } else {
            var orders = await db.sequelize.query(`select _data from order_ where _data->'$.trade_no' = '${trade_no}'`,
                {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
                if (err instanceof Error)
                    throw err;
                else
                    throw new Error(err);
            });
            if (orders.length > 0) {
                var status = orders[0]._data;
                if (status != '充值成功' && status != '充值失败') {
                    status = '充值中';
                }
                ret.data.status = JSON.parse(orders[0]._data).status;
            }
            else
                ret = {'success': false, 'error': {'code': 'ORDER_INVALID', 'message': 'order not found'}};
        }
    }
    else {
        ret = {'success': false, 'error': {'code': 'SIGN_INVALID', 'message': 'signature verification failed'}}
    }

    if (debug)
        ret.debug = {'target': data, 'sign': _sign};


    ctx.body = ret;
});

/**
 * @api {get} /partner/balance 获取账户余额
 * @apiName GetPartnerBalance
 * @apiVersion 1.0.0
 * @apiGroup Order
 *
 * @apiDescription 获取商户账户余额
 *
 * @apiParam {String}   partner       商户号
 * @apiParam {Number}   t             时间戳
 * @apiParam {String}   sign          签名,按参数字母升序将值连接成一个字符串并用md5加密,md5({partner}{secret(密钥)}{t})
 *
 * @apiExample Example usage:
 * curl -i http://139.199.65.115:3000/v1/api/partner/balance?partner={partner}&t={t}&sign={sign}
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "data":{"balance":9999.99}
 *     }
 *
 * @apiError DATA_INVALID   parameter error.
 * @apiError SIGN_INVALID   signature verification failed.
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 OK
 *     {
 *       "success":false,
 *       "error": {"code":"DATA_INVALID","message":"{parameter error}"}
 *     }
 *
 *     HTTP/1.1 200 OK
 *     {
 *       "success":false,
 *       "error": {"code":"SIGN_INVALID","message":"signature verification failed."}
 *     }
 * */
router.get('/partner/balance', async function (ctx, next) {
    var secret;
    var partner = ctx.request.query.partner;
    var sign = ctx.request.query.sign;
    var t = ctx.request.query.t;
    var ret = {};

    if (!sign) {
        ret = {'success': false, 'error': {'code': 'PARM_SIGN_INVALID', 'message': 'missing parameter sign'}};
        ctx.body = ret;
        return;
    } else if (!t) {
        ret = {'success': false, 'error': {'code': 'PARM_T_INVALID', 'message': 'missing parameter t'}};
        ctx.body = ret;
        return;
    } else if (!partner) {
        ret = {'success': false, 'error': {'code': 'PARM_PARTNER_INVALID', 'message': 'missing parameter partner'}};
        ctx.body = ret;
        return;
    }

    var partners = await db.sequelize.query(`select _data from partner where _data->'$.name' = '${partner}'`,
        {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });

    var _partner = {};
    if (partners.length > 0) {
        _partner = JSON.parse(partners[0]._data);
        secret = _partner.secret;
    } else {
        ctx.body = {'success': false, 'error': {'code': 'PARM_PARTNER_INVALID', 'message': 'partner not found'}};
        return;
    }

    var data = partner + secret + t;
    var _sign = md5(data);

    if (_sign == sign) {
        ret = {'success': true, 'data': {'balance': _partner.balance}};
    }
    else {
        ret = {'success': false, 'error': {'code': 'SIGN_INVALID', 'message': 'signature verification failed'}}
    }

    if (debug)
        ret.debug = {'target': data, 'sign': _sign};


    ctx.body = ret;
});

router.get('/test', async function (ctx, next) {
    var Redis2 = require('ioredis');
    var redis2 = new Redis2({
        port: 6379,          // Redis port
        host: '139.199.65.115',   // Redis host
        family: 4,           // 4 (IPv4) or 6 (IPv6)
        password: 'melodicdeath',
        db: 0
    });

    ctx.body = await new Promise((resolve, reject)=> {
        redis2.exists("1111", function (err, data) {
            if (err)
                reject(err);
            else
                resolve('1');
        });
    });
});

router.get('/callback', async (ctx, next)=> {
    console.log(ctx.request.query);
    ctx.body = {'success': 4}
});

module.exports = router;