import express from 'express'
import { authUser, registerUser, updateUserProfile, getUserProfile,logoutUser } from "../controller/userController.js"
const router=express.Router()
import { protect } from '../middleware/authMiddleware.js'
router.post('/',registerUser)
router.post('/auth',authUser)
router.post('/logout',logoutUser)
router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile)


export default router