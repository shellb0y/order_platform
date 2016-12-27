/**
 * Created by zt on 16/12/15.
 */
var router = require('koa-router')();
var db = require('../../models/db');

/**
 * @api {GET} /account 获取账号列表
 * @apiName GET_ACCOUNTS
 * @apiVersion 1.0.0
 * @apiGroup Account
 *
 * @apiDescription 获取账号
 *
 * @apiParam {String}   source      账号来源,根据角色从/account/source或者/account/source/{partner_name}接口获取,管理员可以查看单个来源或者传入"所有"来查看所有账号状态
 * @apiParam {String}   status      成功|失败|未使用|所有
 * @apiParam {String}   from        开始时间
 * @apiParam {String}   to          结束时间
 * @apiParam {Number}   page_index          页码,从0开始
 * @apiParam {Number}   page_size           每页数据条数
 *
 * @apiSuccess {Object} list 数据列
 * @apiSuccess {String} list.cost 账号成本
 * @apiSuccess {Number} list.source 是否启用
 * @apiSuccess {String} list.password 账号密码
 * @apiSuccess {String} list.username 账号用户名
 * @apiSuccess {String} list.cookie app cookie
 * @apiSuccess {String} list.pc_cookie pc cookie
 * @apiSuccess {Number} list.account_id 账号ID
 * @apiSuccess {Number} list.order_count 账号订单数
 * @apiSuccess {Number} list.pay_status 账号订单支付状态,0未支付,1已支付
 * @apiSuccess {Number} list.valid 账号是否有效,0无效1有效
 * @apiSuccess {String} list.valid_message 账号无效原因
 * @apiSuccess {String} list.unused_discount 未使用的优惠券金额
 * @apiSuccess {Number} total 总页数
 * @apiSuccess {Number} pageCurrent 当前页码
 * @apiSuccess {Object} stat 统计数据,已用中文标注,建议在页面动态生成
 *
 * @apiExample Example usage:
 * curl -i /api/view/account?source=xiaoafei&status=%E6%89%80%E6%9C%89&from=2016-12-1&to=2016-12-20&page_index=0&page_size=30
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
  "list": [
    {
      "cost": 0,
      "source": "xiaoafei",
      "password": "vbnm1357",
      "username": "luyi56352",
      "unused_discount": 5
    },
    {
      "cost": 0,
      "source": "xiaoafei",
      "password": "peishi12196",
      "username": "nubeiemea",
      "unused_discount": 5
    },
    ...
  ],
  "total": 390,
  "pageCurrent": 1,
  "stat": {
    "账号总数": 390,
    "优惠券总额": 1950,
    "已使用优惠券金额": 10,
    "使用成功账号数": 2,
    "使用失败账号数": 195,
    "未使用账号数": 192
  }
}
 * */
router.get('/', async (ctx, next)=> {
    var accounts = await db.sequelize.query(
        `call account_select_proc('${ctx.request.query.source}','${ctx.request.query.status}',
        '${ctx.request.query.from}','${ctx.request.query.to}',${ctx.request.query.page_index},${ctx.request.query.page_size})`,
        {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });

    if (ctx.request.query.debug) {
        ctx.body = accounts;
    } else {
        var data = [];
        for (var i in accounts[0]) {
            data.push(JSON.parse(accounts[0][i]._data));
        }

        ctx.body = {
            list: data,
            total: accounts[1]['0'].total_count,
            pageCurrent: Number(ctx.request.query.page_index) + 1,
            stat: {
                '账号总数': accounts[2]['0'].account_count,
                '优惠券总额': accounts[2]['0'].total_discount,
                '已使用优惠券金额': accounts[2]['0'].used_discount,
                '使用成功账号数': accounts[3]['0'].account_count_success,
                '使用失败账号数': accounts[4]['0'].account_count_faild,
                '未使用账号数': accounts[5]['0'].account_count_unused
            }
        };
    }
});

/**
 * @api {GET} /account/source 获取账号来源
 * @apiName GET_ACCOUNT_SOURCE
 * @apiVersion 1.0.0
 * @apiGroup Account
 *
 * @apiDescription 获取账号来源,只有管理员才调用
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * ['xiaoafei']
 * */
router.get('/source', async (ctx, next)=> {
    var sources = await db.sequelize.query(`select distinct(_data->'$.source') as source from partner where _data->'$.partner' = 1`,
        {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });

    if (sources.length > 0)
        ctx.body = JSON.parse(sources[0].source);
    else
        ctx.body = [];
});


/**
 * @api {GET} /account/source/{partner} 获取一级合作伙伴账号来源
 * @apiName GET_PARTNER_ACCOUNT_SOURCE
 * @apiVersion 1.0.0
 * @apiGroup Account
 *
 * @apiDescription 获取一级合作伙伴账号来源
 *
 * @apiExample Example usage:
 * curl -i /api/view/account/source/fbtest
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * ['xiaoafei']
 * */
router.get('/source/:partner_name', async (ctx, next)=> {
    var sources = await db.sequelize.query(`select distinct(_data->'$.source') as source from partner where _data->'$.name'='${ctx.params.partner_name}'`,
        {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });

    if (sources.length > 0)
        ctx.body = JSON.parse(sources[0].source);
    else
        ctx.body = [];
});


router.post('/upload', async(ctx, next)=> {
    var data = [];
    for (var a of ctx.request.body.data) {
        data.push({
            _data: {
                username: a.split('----')[0],
                password: a.split('----')[1],
                pay_password: a.split('----')[2],
                pc_cookie: a.split('----')[3],
                source: 'xiaoafei',
                cost: ctx.request.body.cost,
                valid: 1,
                unused_discount: 5
            },
            created: Date.now()
        });
    }

    db.account.bulkCreate(data);
    ctx.body = 1;
});


module.exports = router;