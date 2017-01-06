/**
 * Created by zt on 17/1/5.
 */
const router = require('koa-router')();
const exec = require('child_process').exec;
const logger = require('../logger');
const path = require('path');


router.post('/github', async(ctx, next) => {
    if (ctx.request.body.ref == 'refs/heads/master') {
        logger.i('deploy', ctx.request.body, 'order_platform');
        exec(path.join(process.cwd(), '/server_production/deploy.sh'), function (error, stdout, stderr) {
            logger.i('deploy', stdout, 'order_platform');
            logger.e('deploy', `stderr:${stderr}`, 'order_platform');
            if (error !== null) {
                logger.e('deploy', `exec error:${error}`, 'order_platform');
            }
        });

        logger.i('deploy', 'Deploy Done', 'order_platform');
        ctx.body = 'Deploy Done.';
    } else {
        ctx.status = 201;
        ctx.body = 'Not master.Deploy abort.';
    }
});

module.exports = router;