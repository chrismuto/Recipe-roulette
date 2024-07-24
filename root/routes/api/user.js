import express from "express";
import userController from "../../controllers/userController.js"

const router = express.Router();

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createNewUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

    router.route('/:id')
        .get(userController.getUser)

export default router;