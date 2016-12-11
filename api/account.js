/**
 * Created by zt on 16/12/11.
 */
'use strict'
var router = require('koa-router')();
var db = require('../models/db');

router.get('/',async (ctx,next)=>{
    ctx.body = '';
});

module.exports = router;