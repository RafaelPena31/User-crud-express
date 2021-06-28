const Router = require('express').Router;
const userController = require('./controller/usercontroller');

const router = Router();

router.get('/', userController.listUsers);
router.put('/:id', userController.update);
router.post('/', userController.create);
router.delete('/:id', userController.delete);
router.post('/login', userController.login);
router.post('/search', userController.search);
router.post('/create/many', userController.createMany);
router.delete('/delete/many', userController.deleteMany);

module.exports = { router };
