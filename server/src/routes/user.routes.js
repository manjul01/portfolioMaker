
import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { 

    changeCurrentPassword, 
    getCurrentUser, 
    loginUser, 
    logoutUser, 
    registerUser, 
    updateAccountDetails, 
    updateCover, 
    updateProfile

} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"



const router = Router()

router.route('/register').post(
    upload.fields([
        {
            name : "Cover",
            maxCount : 1
        },
        {
            name : "Profile",
            maxCount : 1
        }
    ]) , 
    registerUser
)


router.route('/login').post(loginUser)
router.route('/logout').post(verifyJWT , logoutUser)
router.route('/change-password').post(verifyJWT , changeCurrentPassword)
router.route('/get-current-user').get(verifyJWT , getCurrentUser)
router.route('/update-account-details').post(verifyJWT , updateAccountDetails)
router.route('/update-profile').post(verifyJWT , 
    upload.single(
        "Profile"
    ),
    updateProfile
    )
router.route('/update-cover').post(verifyJWT , 
    upload.single(
        "Cover"
    ),
    updateCover
    )

export default router