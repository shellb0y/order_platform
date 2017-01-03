var router = require('koa-router')();
var marked = require('marked');
var fs = require('fs');
var path = require('path');

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

router.get('/', async function (ctx, next) {
    var doc = fs.readFileSync(path.join(process.cwd(), '/views/help.md'),'utf-8').toString();
    await ctx.render('help', {doc: doc.replace(/\n/ig,'\\n')});
});
module.exports = router;
