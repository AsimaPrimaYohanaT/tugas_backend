const express = require('express');
const router = express.Router();
const helper = require(__class_dir + '/helper.class.js');
const m$task = require(__module_dir + '/task.module.js');

router.post('/', async function (req, res, next) {
        const addTask = await m$task.add(req.body)
            helper.sendResponse(res, addTask);
        });

router.put('/', async function (req, res, next){
    const putTask = await m$task.update(req.body)
    helper.sendResponse(res,putTask);
});

router.delete('/', async function (req, res, next){
    const deleteTask = await m$task.delete(req.body.id)
    helper.sendResponse(res,deleteTask);
});
router.get('/', async function (req, res, next){
    const getTask = await m$task.get(req.body.id)
    helper.sendResponse(res,getTask);
});


module.exports = router;