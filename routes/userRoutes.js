import UserController from "../controllers/userController.js";
import express from "express";
import multer from "multer";

const router = express.Router()
const userController = new UserController();

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, 'public')
    },
    filename: (request, file, callback) => {
        callback(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
    }
})

const uploadfile = multer({
    storage: storage
})

router.get('/get-all-users', userController.getAllUsers)
router.get('/user-details/:id', userController.getSingleUser)
router.post('/create-user', userController.createuser)
router.put('/update-user/:id', userController.updateUser)
router.delete('/delete-user/:id', userController.deleteUser)
router.post('/login-user', userController.loginuser)

export default router