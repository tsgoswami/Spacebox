import * as express from "express";
import multer from "multer";
import { GetStorage } from "../../utility/uploader";
import { LoadAuthorization, ValidateBearerToken, ValidateBasicAuth, LoadAuthorizedUser } from "../../middleware/common.middleware";
import { ForgetPassword, LoginByEmailAndPassword, Register, ResetPassword, VerifyEmailAndActivateAccount } from "./user.controller";
import { EditProfile, GetProfile } from "./controllers/user.profile.controller";
import { CreatePost, DeletePostById, EditPost, GetPost, GetPostByUserId } from "./controllers/user.post.controller";
import { CreateJob, DeleteJob, EditJob, GetJobs, GetJobsById, GetJobsByUserId } from "./controllers/user.job.controller";
import { ValidateForgetPassword, ValidateRegistration, ValidateResetPassword, ValidateUser } from "./user.validator";
import { GetProfileValidator, EditProfileValidator } from "./validators/profile.validator";
import { JobValidator } from "./validators/job.validator";

class UserRouting {
    public router: express.Router;
    public upload = multer({ storage: GetStorage() });
    constructor() {
        this.router = express.Router();
        this.configRoutes();
    }

    public configRoutes() {

        // Registration Routes
        this.router.post('/register', [...ValidateRegistration], Register);
        this.router.post('/verify-email/:id/:token', VerifyEmailAndActivateAccount);

        // Login Routes
        this.router.get('/authentication', [...ValidateBasicAuth, ...LoadAuthorization], LoginByEmailAndPassword);

        // Forget Password
        this.router.post('/forget-password',[...ValidateForgetPassword], ForgetPassword);
        this.router.post('/verify-reset-token/:id/:token',[...ValidateUser], VerifyEmailAndActivateAccount);
        this.router.post('/reset-password',[...ValidateResetPassword], ResetPassword);

        // User Routes
        this.router.get('/profile/:id', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser, ...GetProfileValidator], GetProfile);
        this.router.post('/profile', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser, this.upload.single('profile'), ...EditProfileValidator], EditProfile);

        // Post Routes
        this.router.post('/add/post', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser, this.upload.single('post')], CreatePost);
        this.router.get('/post', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], GetPost);
        this.router.get('/post/:id', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], GetPostByUserId);
        this.router.delete('/post/:id', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], DeletePostById);
        this.router.post('/post/:id', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser, this.upload.single('edit')], EditPost);

        // Job Routes
        this.router.post('/add/job', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser, ...JobValidator], CreateJob);
        this.router.get('/jobs', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], GetJobs);
        this.router.get('/job/:id', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], GetJobsById);
        this.router.get('/job/user/:userId', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], GetJobsByUserId);
        this.router.post('/job/:id', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser, ...JobValidator], EditJob);
        this.router.delete('/delete/:jobId/:userId', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], DeleteJob);
    }
}

const UserRouter = new UserRouting().router;
export {
    UserRouter,
}