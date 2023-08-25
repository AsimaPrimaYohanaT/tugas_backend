const express = require('express');
const router = express.Router();
const helper = require(__class_dir + '/helper.class.js');
const m$user = require(__module_dir + '/user.module.js');

// router.post('/', async function (req, res, next) {
//         const addUser = await m$user.add(req.body)
//             helper.sendResponse(res, addUser);
//         });

router.get('/user', async function (req, res, next) {
            const list = [{
                nama: "Test",
                nik: "341000000000002"
            },]
            helper.sendResponse(res, list);
        });

module.exports = router;