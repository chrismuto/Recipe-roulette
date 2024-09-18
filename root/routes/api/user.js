import express from "express";
import userController from "../../controllers/userController.js";
import verifyJWT from "../../middleware/verifyJWT.js";

const router = express.Router();

router.route('/')
    .get(verifyJWT, userController.getAllUsers)
    .post(userController.createNewUser) //move to authController so that this file can be hidden behind verifyJWT on main server file?
    .put(verifyJWT, userController.updateUser)
    .delete(verifyJWT, userController.deleteUser);

    router.route('/:id')
        .get(userController.getUser)

export default router;