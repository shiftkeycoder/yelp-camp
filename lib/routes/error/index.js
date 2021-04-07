const express = require('express');
const router = express.Router();
const Fail = require('./include/fail');

router.all('*', async (req, res) => {
    const fail = new Fail('Page Not Found', 404);
    res.render('error/page_fail', {
        status: fail.statusCode,
        message: fail.message,
        stack: fail.stack
    });
});

module.exports = router;