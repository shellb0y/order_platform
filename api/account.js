/**
 * Created by zt on 16/12/11.
 */
'use strict'
var router = require('koa-router')();
var db = require('../models/db');

router.get('/jd/phone_charge', async (ctx, next)=> {
    var accounts = await db.sequelize.query(`select * from account_ where _data->'$.valid' is null and _data->'$.pc_cookie' is not null
     and _data->'$.order_90_5_count' is null order by rand() limit 1`,
        {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });

    if (accounts.length > 0) {
        ctx.body = accounts[0];
    } else {
        ctx.body = ''
    }

    //ctx.body = {
    //    "account_id": 162,
    //    "_data": "{\"password\": \"qq456789\", \"username\": \"jd_5cef10a31da83\"}",
    //    "created": "2016-12-12T01:54:30.000Z"
    //};
});

router.post('/', async(ctx, next)=> {
    console.log(ctx.request.body);
    await db.account.update({
        _data: ctx.request.body,
        modified: Date.now()
    }, {where: {account_id: ctx.request.body.account_id}}).catch((err)=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });

    ctx.body = 1;
});

module.exports = router;