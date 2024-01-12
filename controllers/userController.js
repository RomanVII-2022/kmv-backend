import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import axios from "axios";

class UserController {
    getAllUsers = async (request, response, next) => {
        try {
            const users = await User.find()
            return response.status(200).json({
                "status": 200,
                "data": users,
                "success": true
            })
        } catch (error) {
            next(error)
        }
    }

    createuser = async (request, response, next) => {
        try {

            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(request.body.password, salt);

            const userData = {
                firstname: request.body.firstname,
                lastname: request.body.lastname,
                email: request.body.email,
                idnumber: request.body.idnumber,
                password: hash,
                phonenumber: request.body.phonenumber,
                profileimage: request.body.file
            }

            const newUser = await User.create(userData)

            return response.status(201).json({
                "message": "User created successfully",
                "data": newUser,
                "success": true,
                "status": 201
            })
        } catch (error) {
            next(error)
        }
    }

    updateUser = async (request, response, next) => {
        try {
            const { id } = request.params
            const updateduser = await User.findByIdAndUpdate(id, {$set: request.body}, {new: true})
            if (updateduser) {
                return response.status(202).json({
                    "message": "User updated successfully",
                    "data": updateduser,
                    "success": true,
                    "status": 202
                })
            }else {
                return response.status(404).send({'message': "User not found"})
            }
        } catch (error) {
            next(error)
        }
    }

    getSingleUser = async (request, response, next) => {
        try {
            const { id } = request.params
            const user = await User.findById(id)
            if (user) {
                return response.status(200).json({
                    "data": user,
                    "success": true,
                    "status": 200
                })
            }else {
                return response.status(404).send({'message': "User not found"})
            }
        } catch (error) {
            next(error)
        }
    }

    deleteUser = async (request, response, next) => {
        try {
            const { id } = request.params
            const deleteduser = await User.findByIdAndDelete(id)
            if (deleteduser) {
                return response.status(200).json({
                    "message": "User deleted successfully",
                    "data": id,
                    "success": true,
                    "status": 200
                })
            }else {
                return response.status(404).send({'message': "User not found"})
            }
        } catch (error) {
            next(error)
        }
    }

    loginuser = async (request, response, next) => {
        try {
            const user = await User.findOne({email: request.body.email})
            if (user) {
                const isCorrectPassword = await bcrypt.compare(request.body.password, user.password);
                if (isCorrectPassword) {
                    const token = jwt.sign({data: {...user}}, process.env.SECRETKEYJWT, { expiresIn: '1h' })
                    // const taskResponse = await axios.post('http://127.0.0.1:8000/send-email', {email: request.body.email})
                    return response.cookie('access-token', token, {httpOnly: true}).status(200).json({
                        "message": "User login was successful.",
                        "data": token,
                        "success": true
                    })
                }else {
                    return response.status(400).send({"message": "Kindly check pasword and try again."})
                }
            }else {
                return response.status(404).send({"message": "Kindly ensure you have entered the right credentials."})
            }
        } catch (error) {
            next(error)
        }
    }
    
}

export default UserController