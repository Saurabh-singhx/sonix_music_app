import express from "express";
import { protectAdminRoute, validate } from "../../middleware/auth.middleware.js";
import { addSongDetails, createArtist, getArtistImageUploadUrl, getArtists, getUploadUrl, setImages3Key } from "./admin.controller.js";
import { addSongValidation } from "./validation/admin.validations.js";


const router = express.Router();


// add validation =====>
// add rate limiting ==----==>

router.post("/getsonguploadurl",protectAdminRoute,getUploadUrl);
router.post("/createartist",protectAdminRoute,createArtist);
router.post("/getimageurl",protectAdminRoute,getArtistImageUploadUrl);
router.put("/updateimages3key",protectAdminRoute,setImages3Key);
router.post("/addsongData",protectAdminRoute,addSongValidation,validate,addSongDetails);
router.get("/getartists",protectAdminRoute,getArtists)
export default router;