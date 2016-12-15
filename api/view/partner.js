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
 * @apiSuccess {Nunber} enable 是否启用
 * @apiSuccess {String} secret 密钥
 * @apiSuccess {FLOAT} balance 余额
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   [
 *        {
 *          "_data": "{\"code\": \"AA\", \"name\": \"yichongbao_1213\", \"enable\": 1, \"secret\": \"d!GqE$Sz\", \"balance\": 9999999}"
 *        },
 *        {
 *          "_data": "{\"code\": \"AB\", \"name\": \"huifuxinxi\", \"enable\": 1, \"secret\": \"3!hw3nAP\", \"balance\": 9999999}"
 *        }
 *   ]
 * */
router.get('/', async(ctx, next)=> {
    var partners = await db.sequelize.query(`select _data from partner`,
        {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });
    console.log(partners);
    ctx.body = partners;
});

router.get('/:partner_name', async (ctx, next)=> {
    ctx.body = '';
});

module.exports = router;