/**
 * Created by zt on 16/12/15.
 */
var router = require('koa-router')();
var db = require('../../models/db');

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
 * @apiSuccess {Object} price 价格
 * @apiSuccess {Number} enable 是否启用
 * @apiSuccess {String} secret 密钥
 * @apiSuccess {FLOAT} balance 余额
 * @apiSuccess {Number} partner 是否为一级合作伙伴(一级合作伙伴账号才有)
 * @apiSuccess {String[]} source 账号来源(一级合作伙伴账号才有,才可以查看账号情况)
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *      "_data": "{\"code\": \"AA\", \"name\": \"yichongbao_1213\", \"price\": {\"电信\": 97, \"移动\": 98, \"联通\": 98}, \"enable\": 1, \"secret\": \"d!GqE$Sz\", \"balance\": 99510, \"order_timeout\": \"600\"}"
 *  },
 *  {
 *      "_data": "{\"code\": \"AB\", \"name\": \"huifuxinxi\", \"price\": {\"电信\": 98, \"移动\": 98, \"联通\": 98}, \"enable\": 1, \"secret\": \"3!hw3nAP\", \"balance\": 100000, \"order_timeout\": \"30\"}"
 *  },
 *  {
 *      "_data": "{\"code\": \"ZZ\", \"name\": \"fbtest\", \"price\": {\"电信\": 97, \"移动\": 98, \"联通\": 98}, \"enable\": 1, \"secret\": \"0Y$$sTx0\", \"balance\": 99034, \"order_timeout\": \"0\"}"
 *  },
 *  {
 *      "_data": "{\"name\": \"xianshang\", \"partner\": 1, \"source\": [\"xiaoafei\"]}"
 *  }
 * ]
 * */
router.get('/', async(ctx, next)=> {
    var partners = await db.sequelize.query(`select _data from partner`,
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
 * @apiSuccess {Object} price 价格
 * @apiSuccess {Number} enable 是否启用
 * @apiSuccess {String} secret 密钥
 * @apiSuccess {Float} balance 余额
 * @apiSuccess {Number} partner 是否为一级合作伙伴(一级合作伙伴账号才有)
 * @apiSuccess {String[]} source 账号来源(一级合作伙伴账号才有,才可以查看账号情况)
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *  "_data": "{\"code\": \"ZZ\", \"name\": \"fbtest\", \"price\": {\"电信\": 97, \"移动\": 98, \"联通\": 98}, \"enable\": 1, \"secret\": \"0Y$$sTx0\", \"balance\": 99034, \"order_timeout\": \"0\"}"
 *  }
 * ]

 * HTTP/1.1 200 OK
 * [
 *  {
 *  "_data": "{\"name\": \"xianshang\", \"partner\": 1, \"source\": [\"xiaoafei\"]}"
 *  }
 * ]
 * */
router.get('/:partner_name', async (ctx, next)=> {
    var partners = await db.sequelize.query(`select _data from partner where _data->'$.name'='${ctx.params.partner_name}'`,
        {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });
    ctx.body = partners;
});

module.exports = router;