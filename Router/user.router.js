import express from 'express'
import { createUser, forgotPassword, loginUser, resetpassword, shortenUrl } from '../Controller/user.controller.js'
const router=express.Router()

router.post('/createUser',createUser)
router.post('/loginUser',loginUser)
router.post("/forgotpassword",forgotPassword);
router.post("/resetpassword",resetpassword);
router.post('/shortenUrl',shortenUrl)
export default router