const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
//const render = require('koa-ejs');
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')({formLimit: '2mb'});
const logger = require('koa-logger');
const compress = require('koa-compress');

const help = require('./routes/help');
const order = require('./api/order');
const partner_order_api = require('./api/open/partner_order');
const partner_api = require('./api/partner');
const account_api = require('./api/account');
const deploy_api = require('./api/deploy');
const view_account_api = require('./api/view/account');
const view_order_api = require('./api/view/order');
const view_partner_api = require('./api/view/partner');
const view_system_api = require('./api/view/system');
const partner_order_api_test = require('./api/open/partner_order_test');
const __static = require('koa-static');
const __static_folder = require('koa-static-folder');

// middlewares
app.use(convert(compress()));
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
//app.use(__static(__dirname + '/apidoc'));
app.use(__static_folder('./doc'));
app.use(__static_folder('./node_modules'));
app.use(__static(__dirname + '/public'));

app.use(views(__dirname + '/views', {
    extension: 'ejs'
}));

//render(app, {
//    root: __dirname + '/views',
//    layout: 'layout',
//    viewExt: 'html',
//    cache: false,
//    debug: true
//});
//app.context.render = co.wrap(app.context.render);

// logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

//router.use('/doc/api', __static(__dirname + '/apidoc'));
router.use('/help', help.routes(), help.allowedMethods());
router.use('/v1/api', partner_order_api.routes(), partner_order_api.allowedMethods());
router.use('/test/api', partner_order_api_test.routes(), partner_order_api_test.allowedMethods());
router.use('/api', order.routes(), order.allowedMethods());
router.use('/api/partner', partner_api.routes(), partner_api.allowedMethods());
router.use('/api/account', account_api.routes(), account_api.allowedMethods());
router.use('/api/deploy', deploy_api.routes(), deploy_api.allowedMethods());
router.use('/api/view/account', view_account_api.routes(), view_account_api.allowedMethods());
router.use('/api/view/order', view_order_api.routes(), view_order_api.allowedMethods());
router.use('/api/view/partner', view_partner_api.routes(), view_partner_api.allowedMethods());
router.use('/api/view/system', view_system_api.routes(), view_system_api.allowedMethods());

app.use(router.routes(), router.allowedMethods());
// response

onerror(app);
app.on('error', function (err, ctx) {
    console.error(err, ctx);
    //logger.error('server error', err, ctx);
});


module.exports = app;