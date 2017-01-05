/**
 * Created by zt on 17/1/5.
 */
const router = require('koa-router')();
const exec = require('child_process').exec;
const logger = require('../../logger');


router.post('/github', async(ctx, next) => {
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
});

module.exports = router;