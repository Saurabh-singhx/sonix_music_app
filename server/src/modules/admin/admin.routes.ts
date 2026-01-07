import express from "express";
import { protectAdminRoute } from "../../middleware/auth.middleware.js";
import { addSongDetails, createArtist, getArtistImageUploadUrl, getUploadUrl, setImages3Key } from "./admin.controller.js";


const router = express.Router();


// add validation =====>
// add rate limiting ==----==>

router.post("/getsonguploadurl",protectAdminRoute,getUploadUrl);
router.post("/createartist",protectAdminRoute,createArtist);
router.post("/getimageurl",protectAdminRoute,getArtistImageUploadUrl);
router.put("/updateimages3key",protectAdminRoute,setImages3Key);
router.post("/addsong",protectAdminRoute,addSongDetails);

export default router;