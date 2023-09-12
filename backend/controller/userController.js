import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'



// @desc Auth user/set token
// route Post /api/users/auth
// access public

const authUser=asyncHandler(async(req,res)=>{
   // res.status(401)
   // throw new Error('Something went wrong!')
   // res.status(200).json({message: 'Auth user'})

   const {email,password}=req.body
   const user= await User.findOne({email})
    
   if (user && (await user.matchPasswords(password)))
   {
       generateToken(res,user._id)
       res.status(201).json({
           _id: user._id,
           name: user.name,
           email: user.email
       })
   }else{
       res.status(400)
       throw new Error('Invalid email or password')
   }


})

// @desc Register a new user
// route Post /api/users
// access public

const registerUser=asyncHandler(async(req,res)=>{
    // res.status(401)
    // throw new Error('Something went wrong!')
    const {name, email, password}=req.body
    const userExists=await User.findOne({email})
    if(userExists)
    {
        res.status(400)
       throw new Error('User already exists')
    }
    const user=await User.create({
        name,
        email,
        password
    })
    if (user)
    {
        generateToken(res,user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    }else{
        res.status(400)
        throw new Error('Invalid user data')
    }


     //res.status(200).json({message: 'Register user'})
 })

// @desc Logout user
// route Post /api/users/logout
// access public

const logoutUser=asyncHandler(async(req,res)=>{
    // res.status(401)
    // throw new Error('Something went wrong!')

    res.cookie('jwt','', {
        httpOnly: true,
    expires: new Date(0)})
     res.status(200).json({message: 'User logged out'})
 })
  

 // @desc Get user profile
// route Get /api/users/profile
// access Private

const getUserProfile=asyncHandler(async(req,res)=>{
    // res.status(401)
    // throw new Error('Something went wrong!')

    const user ={
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }
    res.status(200).json({user})
    // res.status(200).json({message: 'User profile'})
 })


 // @desc Update user profile
// route Put /api/users/profile
// access Private

const updateUserProfile=asyncHandler(async(req,res)=>{
    // res.status(401)
    // throw new Error('Something went wrong!')
    // res.status(200).json({message: 'Update user profile'})

    const user = await User.findById(req.user._id)
    if(user){
        user.name=req.body.name || user.name
        user.email=req.body.email || user.email
        if(req.body.password){
        user.password=req.body.password
        }
       const updatedUser =await user.save()
       res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email
       })
    }else{
        res.status(404)
        throw new Error('User not found')

    }
 })
 
 

export{
    authUser,
    registerUser,
    updateUserProfile,
    getUserProfile,
    logoutUser
}