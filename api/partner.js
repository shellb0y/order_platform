/**
 * Created by zt on 16/12/11.
 */
'use strict'
var router = require('koa-router')();
var db = require('../models/db');

router.get('/:name', async(ctx, next)=> {
    var partner = await db.sequelize.query(`select _data from partner where _data->'$.name' = '${ctx.params.name}'`,
        {type: db.sequelize.QueryTypes.SELECT}).catch(err=> {
        if (err instanceof Error)
            throw err;
        else
            throw new Error(err);
    });
    if (partner.length > 0)
        ctx.body = partner[0]._data;
    else
        ctx.body = '';
});

module.exports = router;