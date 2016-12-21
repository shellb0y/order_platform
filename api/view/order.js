/**
 * Created by zt on 16/12/15.
 */
var router = require('koa-router')();
var db = require('../../models/db');

/**
 * @api {GET} /order 获取订单列表
 * @apiName GET_ACCOUNTS
 * @apiVersion 1.0.0
 * @apiGroup Order
 *
 * @apiDescription 获取账号
 *
 * @apiParam {String}   source      商户名,商户只能看自己的订单,一级合作伙伴和管理员可以查看所有商户(传入中文"所有")的订单
 * @apiParam {String}   status      状态(对商户和一级合作伙伴而言:暂时只有三个状态:充值成功|充值失败|充值中,对管理员而言可以访问/order/status(获取订单状态)获取所有状态)
 * @apiParam {String}   from        开始时间
 * @apiParam {String}   to          结束时间
 * @apiParam {Number}   page_index          页码,从0开始
 * @apiParam {Number}   page_size           每页数据条数
 *
 * @apiSuccess {Object} list 数据列
 * @apiSuccess {String} list.money 订单交易金额
 * @apiSuccess {Number} list.amount 充值金额
 * @apiSuccess {String} list.dxqids 优惠券ID
 * @apiSuccess {String} list.mobile 充值手机号
 * @apiSuccess {String} list.status 状态(商户和一级合作伙伴需要包装一下状态,只显示三个状态:充值成功|充值失败|充值中
 * @apiSuccess {Object} list.account 略.详见获取账号列表接口
 * @apiSuccess {Object} list.partner 略.详见获取商户接口
 * @apiSuccess {String} list.areaName 手机号所在省份
 * @apiSuccess {String} list.areaName 手机号运营商
 * @apiSuccess {String} list.callback 订单回调地址
 * @apiSuccess {Number} list.discount 优惠金额
 * @apiSuccess {Float} list.jd_price 计算得出的订单金额
 * @apiSuccess {String} list.trade_no 订单交易号
 * @apiSuccess {String} list.jd_order_id 京东订单ID
 * @apiSuccess {String} list.pay_task_id 支付ID
 * @apiSuccess {Number} list.order_timeout 订单超时时间
 * @apiSuccess {String} list.partner_price 合作伙伴价格
 * @apiSuccess {String} list.callback_status 订单回调状态
 * @apiSuccess {String} list.partner_order_id 商户订单号
 * @apiSuccess {Date} list.order_request_time 订单接收时间
 * @apiSuccess {Date} list.order_handler_time 订单处理时间
 * @apiSuccess {Date} list.order_handler_complete_time 订单处理完成时间
 * @apiSuccess {Date} list.order_faild_time 订单失败时间
 * @apiSuccess {Date} list.pay_callback_time 支付完成时间
 * @apiSuccess {Date} list.order_callback_time 订单回调时间
 * @apiSuccess {Date} list.order_callback_complete_time 订单回调完成时间
 * @apiSuccess {Number} total 总页数
 * @apiSuccess {Number} pageCurrent 当前页码
 * @apiSuccess {Object} stat 统计数据,建议在页面动态生成
 *
 * @apiExample Example usage:
 * curl -i /api/view/account?source=xiaoafei&status=%E6%89%80%E6%9C%89&from=2016-12-1&to=2016-12-20&page_index=0&page_size=30
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 {
   "list": [
     {
       "money": 9400,
       "amount": "100",
       "dxqids": "8146039734",
       "mobile": "18942529630",
       "status": "充值失败",
       "account": {
         "valid": 1,
         "cookie": "pin=nveci682185781; wskey=AAFYWJkBAEAFL-f97v1_a7IJxHa3bYeB-EBJyxhj9-thJaKVI1tMf9TPmhooqWA9vSdSMvcg5sLUFydNO2ZfkNnkm2RSItik; whwswswws=00",
         "source": "xiaoafei",
         "password": "ojijejaneb",
         "username": "nveci682185781",
         "pc_cookie": "pt_key=app_openAAFYVfvCADB4DZi87pnMAUqUtbSXIN8d3HzzqhsMc5t_hs4OV6AZm8HBU7xLdnB1DAaaKHkdwyI; pt_pin=nveci682185781; pwdt_id=nveci682185781; sid=4d1c6f60dd5fbe420fd8002b1ff1d8dw; guid=b52238fadaf58b777a0251ee58c56914a7509258bebdaf1fbaf6b25cf91f36bf; thor1=; wskey=AAFXz-aEAEDe3-g0O81BvyUqHh0DhB9HLCYY3W8b-Fnkl0vpVUzW4pjL4orYmCfg5vjhOu7GaNpM1-oW46MrkbRXMUkyvpon; pin=nveci682185781; uuid=586159291101182-282c137bf37b ;sid=4d1c6f60dd5fbe420fd8002b1ff1d8dw",
         "account_id": 594
       },
       "partner": {
         "code": "ZZ",
         "name": "fbtest",
         "enable": 1,
         "secret": "0Y$$sTx0",
         "balance": 9999999,
         "order_timeout": "0"
       },
       "areaName": "湖南",
       "callback": "http://192.168.3.113:3000/v1/api/callback",
       "discount": 5,
       "jd_price": 94,
       "trade_no": "20161220103342872LYXEZZA00001",
       "jd_order_id": "47781193057",
       "pay_task_id": "6ff1f3feb57546cd9fd856985029cab9",
       "providerName": "电信",
       "order_timeout": "Tue Dec 20 2016 10:33:42 GMT+0800 (CST)0",
       "partner_price": 97,
       "callback_status": "回调成功",
       "order_faild_time": "2016-12-20 11:52:47.403000",
       "partner_order_id": "12321",
       "pay_callback_time": "2016-12-20 11:31:29",
       "order_handler_time": "2016-12-20 10:33:44.272000",
       "order_request_time": "2016-12-20 10:33:42",
       "order_callback_time": "2016-12-20 12:03:44",
       "order_handler_complete_time": "2016-12-20 10:35:47.143000",
       "order_callback_complete_time": "2016-12-20 12:03:44"
     },
     ...
   ],
   "total": 8,
   "pageCurrent": 1,
   "stat": {
     "总金额": 400,
     "对账金额": 388
   }
 }
 * */
router.get('/', async (ctx, next)=> {
    var orders = await db.sequelize.query(
        `call order_partner_select_proc('${ctx.request.query.source}','${ctx.request.query.status}',
        '${ctx.request.query.from}','${ctx.request.query.to}',${ctx.request.query.page_index},${ctx.request.query.page_size})`,
        {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });
    ctx.body = orders;

    if (ctx.request.query.debug) {
        ctx.body = accounts;
    } else {
        var data = [];
        for (var i in orders[0]) {
            data.push(JSON.parse(orders[0][i]._data));
        }

        ctx.body = {
            list: data,
            total: orders[1]['0'].total_count,
            pageCurrent: Number(ctx.request.query.page_index) + 1,
            stat: {
                '总金额': orders[2]['0'].total_price,
                '对账金额': orders[2]['0'].partner_price
            }
        };
    }
});


/**
 * @api {GET} /order/status 获取订单状态
 * @apiName GET_ORDER_STATUS
 * @apiVersion 1.0.0
 * @apiGroup Order
 *
 * @apiDescription 获取订单状态,只有管理员才调用
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
     {
       "status": "\"充值成功\""
     },
     {
       "status": "\"下单失败\""
     },
     {
       "status": "\"充值失败\""
     },
     {
       "status": "\"正在下单\""
     }
 ]
 * */
router.get('/status', async (ctx, next)=> {
    var status = await db.sequelize.query(`select distinct _data->'$.status' as status from order_`,
        {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });
    ctx.body = status;
});

module.exports = router;