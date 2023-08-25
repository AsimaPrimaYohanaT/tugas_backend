const express = require('express');
const router = express.Router();
const helper = require(__class_dir + '/helper.class.js');
const m$user = require(__module_dir + '/user.module.js');
const m$login = require(__module_dir + '/login.module.js');

router.post('/register', async function (req, res, next) {
        const addUser = await m$user.add(req.body)
            helper.sendResponse(res, addUser);
        });

router.post('/login', async function (req, res, next) {
            const loginUser = await m$login.login(req.body)
                helper.sendResponse(res, loginUser);
            });

router.post('/addTask', async function(req,res,next){
    const authToken = req.headers.authorization;
    const addTask = await m$login.addTask(req.body, authToken)
    helper.sendResponse(res,addTask);
});

router.get('/getAllTask',async function(req,res,next){
    const authToken = req.headers.authorization;
    const getAllTask = await m$login.getTask(authToken)
    helper.sendResponse(res,getAllTask);
})

//delete user ga bisa karena merupakan foreign key
router.delete('/deleteTask',async function(req,res,next){
    const authToken = req.headers.authorization;
    const getAllTask = await m$login.deleteTask(req.body, authToken)
    helper.sendResponse(res,getAllTask);
})

router.put('/updateTask',async function(req,res,next){
    const authToken = req.headers.authorization;
    const updateTask = await m$login.updateTask(req.body, authToken)
    helper.sendResponse(res,updateTask);
})

router.put('/updateUser',async function(req,res,next){
    const authToken = req.headers.authorization;
    const updateUser = await m$login.updateUser(req.body, authToken)
    helper.sendResponse(res,updateUser);
})

router.delete('/deleteUser',async function(req,res,next){
    const authToken = req.headers.authorization;
    const deleteUser = await m$login.deleteUser(req.body, authToken)
    helper.sendResponse(res,deleteUser);
})

module.exports = router;
