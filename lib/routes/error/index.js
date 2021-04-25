const express = require('express');
const router = express.Router();
const Fail = require('./include/fail');
const { NODE_ENV } = process.env;

router.all('*', async (req, res) => {
    const fail = new Fail('Page Not Found', 404);
    res.render('error/page_fail', {
        status: fail.statusCode,
        message: fail.message,
        stack: fail.stack,
        mode: NODE_ENV
    });
});

module.exports = router;