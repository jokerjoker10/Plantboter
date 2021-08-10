const router = require('express').Router();

router.get('/', function(req, res) {
    res.send('API Route: Please Read the documentation for information on usage.');
});

module.exports = router;