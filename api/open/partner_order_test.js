/**
 * Created by zt on 16/12/7.
 */
'use strict'
var router = require('koa-router')();
var db = require('../../models/db');
var request = require('request-promise');
var crypto = require('crypto');

var debug = 1;

function md5(text) {
    return crypto.createHash('md5').update(text).digest('hex');
}

router.get('/order', async function (ctx, next) {
    console.log(ctx.request.query);

    var sign = ctx.request.query.sign;
    var t = ctx.request.query.t;
    var id = ctx.request.query.id;
    var amount = ctx.request.query.amount;
    var callback = ctx.request.query.callback;
    var mobile = ctx.request.query.mobile;
    var partner = ctx.request.query.partner;
    var secret = 'y(T|D/g6';
    var ret = {};

    if (!sign) {
        ret = {'success': false, 'error': {'code': 'DATA_INVALID', 'message': 'missing parameter sign'}};
        ctx.body = ret;
        return;
    } else if (!t) {
        ret = {'success': false, 'error': {'code': 'DATA_INVALID', 'message': 'missing parameter t'}};
        ctx.body = ret;
        return;
    } else if (!id) {
        ret = {'success': false, 'error': {'code': 'DATA_INVALID', 'message': 'missing parameter id'}};
        ctx.body = ret;
        return;
    } else if (!mobile) {
        ret = {'success': false, 'error': {'code': 'DATA_INVALID', 'message': 'missing parameter mobile'}};
        ctx.body = ret;
        return;
    } else if (!partner) {
        ret = {'success': false, 'error': {'code': 'DATA_INVALID', 'message': 'missing parameter partner'}};
        ctx.body = ret;
        return;
    }
    else if (!amount) {
        ret = {'success': false, 'error': {'code': 'DATA_INVALID', 'message': 'missing parameter amount'}};
        ctx.body = ret;
        return;
    }
    else if (!callback) {
        ret = {'success': false, 'error': {'code': 'DATA_INVALID', 'message': 'missing parameter callback'}};
        ctx.body = ret;
        return;
    }
    else if (!secret) {
        ret = {'success': false, 'error': {'code': 'DATA_INVALID', 'message': 'partner invalid'}};
        ctx.body = ret;
        return;
    }

    if (!(parseFloat(amount) == 100)) {
        ret = {'success': false, 'error': {'code': 'DATA_INVALID', 'message': 'amount not support'}};
        ctx.body = ret;
        return;
    }

    var data = amount + callback + id + mobile + partner + secret + t;
    var _sign = md5(data);

    if (_sign == sign) {
        ret = {'success': true, 'data': {'trade_no': '2016120810000000000001'}};
        t = Date.now();
        var _target = `${amount}${id}${secret}1${t}2016120810000000000001)`;
        console.log('callback target:' + _target);
        sign = md5(_target);
        console.log('callback sign:' + sign);
        var url = `${decodeURI(callback)}?partner_order_id=${id}&trade_no=JDPH2016120810000000000001&amount=${amount}&success=1&t=${t}&sign=${sign}`;
        var resp = await request.get(url).catch((e)=>console.log(e));
        console.log(resp);

    }
    else {
        ret = {'success': false, 'error': {'code': 'SIGN_INVALID', 'message': 'signature verification failed'}}
    }

    if (debug)
        ret.debug = {'target': data, 'sign': _sign};


    ctx.body = ret;
});

router.get('/order/status', async function (ctx, next) {
    var secret = 'y(T|D/g6';
    var trade_no = ctx.request.query.trade_no;
    var sign = ctx.request.query.sign;
    var t = ctx.request.query.t;
    var partner = ctx.request.query.partner;
    var ret = {};

    if (!sign) {
        ret = {'success': false, 'error': {'code': 'DATA_INVALID', 'message': 'missing parameter sign'}};
        ctx.body = ret;
        return;
    } else if (!t) {
        ret = {'success': false, 'error': {'code': 'DATA_INVALID', 'message': 'missing parameter t'}};
        ctx.body = ret;
        return;
    } else if (!trade_no) {
        ret = {'success': false, 'error': {'code': 'DATA_INVALID', 'message': 'missing parameter trade_no'}};
        ctx.body = ret;
        return;
    } else if (!partner) {
        ret = {'success': false, 'error': {'code': 'DATA_INVALID', 'message': 'missing parameter partner'}};
        ctx.body = ret;
        return;
    }

    console.log(ctx.request.query.sign);
    var data = partner + secret + t + trade_no;
    var _sign = md5(data);

    if (_sign == sign) {
        ret = {'success': true, 'data': {'status': '等候处理'}};
    }
    else {
        ret = {'success': false, 'error': {'code': 'SIGN_INVALID', 'message': 'signature verification failed'}}
    }

    if (debug)
        ret.debug = {'target': data, 'sign': _sign};


    ctx.body = ret;
});

router.get('/partner/balance', async function (ctx, next) {
    var secret = 'y(T|D/g6';
    var partner = ctx.request.query.partner;
    var sign = ctx.request.query.sign;
    var t = ctx.request.query.t;
    var ret = {};

    if (!sign) {
        ret = {'success': false, 'error': {'code': 'DATA_INVALID', 'message': 'missing parameter sign'}};
        ctx.body = ret;
        return;
    } else if (!t) {
        ret = {'success': false, 'error': {'code': 'DATA_INVALID', 'message': 'missing parameter t'}};
        ctx.body = ret;
        return;
    } else if (!partner) {
        ret = {'success': false, 'error': {'code': 'DATA_INVALID', 'message': 'missing parameter partner'}};
        ctx.body = ret;
        return;
    }

    var data = partner + secret + t;
    var _sign = md5(data);

    if (_sign == sign) {
        ret = {'success': true, 'data': {'balance': 9999.99}};
    }
    else {
        ret = {'success': false, 'error': {'code': 'SIGN_INVALID', 'message': 'signature verification failed'}}
    }

    if (debug)
        ret.debug = {'target': data, 'sign': _sign};


    ctx.body = ret;
});

router.get('/test', async function (ctx) {
    throw new Error('test')
});

module.exports = router;