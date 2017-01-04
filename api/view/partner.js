/**
 * Created by zt on 16/12/15.
 */
var router = require('koa-router')();
var db = require('../../models/db');
require('../../date_ex');

/**
 * @api {GET} /partner 获取商户
 * @apiName GET_PARTNER
 * @apiVersion 1.0.0
 * @apiGroup Partner
 *
 * @apiDescription 获取所有商户
 *
 * @apiSuccess {String} code 商户编码
 * @apiSuccess {String} name 商户名称
 * @apiSuccess {String} remark 备注
 * @apiSuccess {Object} price 价格
 * @apiSuccess {Number} enable 是否启用
 * @apiSuccess {String} secret 密钥
 * @apiSuccess {FLOAT} balance 余额
 * @apiSuccess {String} hand_modified 手动修改时间
 * @apiSuccess {String} modified 修改时间
 * @apiSuccess {String} charge_time 充值时间
 * @apiSuccess {Number} partner 是否为一级合作伙伴(一级合作伙伴账号才有)
 * @apiSuccess {String[]} source 账号来源(一级合作伙伴账号才有,才可以查看账号情况)
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *    {
 *      "partner_id": 1,
 *      "_data": "{\"code\": \"AA\", \"name\": \"yichongbao_1213\", \"price\": {\"电信\": 97, \"移动\": 98, \"联通\": 98}, \"enable\": 1, \"remark\": \"易充宝\", \"secret\": \"d!GqE$Sz\", \"balance\": 98040, \"charge_time\": \"2016-12-01\", \"hand_modified\": \"\", \"order_timeout\": \"600\"}",
 *      "created": "2016-12-11"
 *    },
 *    {
 *      "partner_id": 2,
 *      "_data": "{\"code\": \"AB\", \"name\": \"huifuxinxi\", \"price\": {\"电信\": 98, \"移动\": 98, \"联通\": 98}, \"enable\": 1, \"remark\": \"惠付信息\", \"secret\": \"3!hw3nAP\", \"balance\": 96766, \"charge_time\": \"2016-12-01\", \"hand_modified\": \"\", \"order_timeout\": \"30\"}",
 *      "created": "2016-12-15"
 *    },
 *    {
 *      "partner_id": 3,
 *      "_data": "{\"code\": \"ZZ\", \"name\": \"fbtest\", \"price\": {\"电信\": 97, \"移动\": 98, \"联通\": 98}, \"enable\": 1, \"remark\": \"测试\", \"secret\": \"0Y$$sTx0\", \"balance\": 100000, \"charge_time\": \"2017-01-04 10:29:07\", \"hand_modified\": \"2017-01-04 10:28:25\", \"order_timeout\": \"0\"}",
 *      "created": "2016-12-19"
 *    },
 *    {
 *      "partner_id": 4,
 *      "_data": "{\"name\": \"xianshang\", \"remark\": \"线尚\", \"source\": [\"xiaoafei\"], \"partner\": 1}",
 *      "created": "2016-12-21"
 *    }
 * */
router.get('/', async(ctx, next)=> {
    var partners = await db.sequelize.query(`select * from partner`,
        {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });
    ctx.body = partners;
});


/**
 * @api {GET} /partner/{partner_name} 根据商户名称获取商户
 * @apiName GET_PARTNER
 * @apiVersion 1.0.0
 * @apiGroup Partner
 *
 * @apiDescription 根据商户名称获取商户
 *
 * @apiSuccess {String} code 商户编码
 * @apiSuccess {String} name 商户名称
 * @apiSuccess {String} remark 备注
 * @apiSuccess {Object} price 价格
 * @apiSuccess {Number} enable 是否启用
 * @apiSuccess {String} secret 密钥
 * @apiSuccess {Float} balance 余额
 * @apiSuccess {String} charge_time 充值时间
 * @apiSuccess {String} hand_modified 手动修改时间
 * @apiSuccess {String} modified 修改时间
 * @apiSuccess {Number} partner 是否为一级合作伙伴(一级合作伙伴账号才有)
 * @apiSuccess {String[]} source 账号来源(一级合作伙伴账号才有,才可以查看账号情况)
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *     "partner_id": 1,
 *     "_data": "{\"code\": \"AA\", \"name\": \"yichongbao_1213\", \"price\": {\"电信\": 97, \"移动\": 98, \"联通\": 98}, \"enable\": 1, \"remark\": \"易充宝\", \"secret\": \"d!GqE$Sz\", \"balance\": 98040, \"charge_time\": \"2016-12-01\", \"hand_modified\": \"\", \"order_timeout\": \"600\"}",
 *     "created": "2016-12-11"
 *  }
 * ]

 * HTTP/1.1 200 OK
 * [
 *  {
 *  "partner_id": 1,
 *  "_data": "{\"name\": \"xianshang\", \"partner\": 1, \"source\": [\"xiaoafei\"]}"
 *  "created": "2016-12-11"
 *  }
 * ]
 * */
router.get('/:partner_name', async (ctx, next)=> {
    var partners = await db.sequelize.query(`select * from partner where _data->'$.name'='${ctx.params.partner_name}'`,
        {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });
    ctx.body = partners;
});


/**
 * @api {PUT} /partner/charge 商户账户充值
 * @apiIgnore
 * @apiName PARTNER_CHARGE
 * @apiVersion 1.0.0
 * @apiGroup Partner
 *
 * @apiDescription 商户账户充值
 *
 * @apiSuccess {Boolean} success 是否成功
 *
 * @apiExample Example usage:
 * curl -X PUT -d "money=100000&id=3" -H "Content-Type:application/x-www-form-urlencoded;charset=utf-8" -i /api/view/partner/charge
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *  "success": true
 *  }
 * ]
 * */
router.put('/charge', async (ctx, next)=> {
    var ret = await db.sequelize.query(`update partner set _data=json_set(_data,'$.balance',${ctx.request.body.money}
    ,'$.charge_time','${new Date().format("yyyy-MM-dd hh:mm:ss")}') where partner_id = ${ctx.request.body.id}`).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });
    if(ret[0].affectedRows == 1)
        ctx.body = {'success':true};
    else
        ctx.body = {'success':false};
});

/**
 * @api {PUT} /partner/balance 商户账户加减款
 * @apiName PARTNER_BALANCE
 * @apiVersion 1.0.0
 * @apiGroup Partner
 *
 * @apiParam {decimal}  money       金额,减款时传入负数
 * @apiParam {Number}   id          商户ID
 *
 * @apiDescription 商户账户加减款
 *
 * @apiSuccess {Boolean} success 是否成功
 *
 * @apiExample Example usage:
 * curl -X PUT -d "money=98&id=3" -H "Content-Type:application/x-www-form-urlencoded;charset=utf-8" -i /api/view/partner/balance
 *
 * @apiExample Example usage:
 * curl -X PUT -d "money=-98&id=3" -H "Content-Type:application/x-www-form-urlencoded;charset=utf-8" -i /api/view/partner/balance
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *  "success": true
 *  }
 * ]
 * */
router.put('/balance', async (ctx, next)=> {
    var ret = await db.sequelize.query(`update partner set _data=json_set(_data,'$.balance',_data->'$.balance'+${ctx.request.body.money},'$.hand_modified','${new Date().format("yyyy-MM-dd hh:mm:ss")}')
        where partner_id = ${ctx.request.body.id}`).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });

    if(ret[0].affectedRows == 1)
        ctx.body = {'success':true};
    else
        ctx.body = {'success':false};
});


module.exports = router;