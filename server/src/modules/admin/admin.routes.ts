import express from "express";
import { protectAdminRoute, validate } from "../../middleware/auth.middleware.js";
import { addSongDetails, createArtist, getArtistImageUploadUrl, getArtists, getUploadUrl, setImages3Key } from "./admin.controller.js";
import { addSongValidation } from "./validation/admin.validations.js";
import { createArtistLimiter, getArtistsLimiter, getUploadImageUrlLimiter, getUploadSongUrlLimiter, updateImages3keyLimiter, updateSongs3keyLimiter } from "../../middleware/ratelimit.js";


const router = express.Router();


// add validation =====>
// add rate limiting ==----==>

router.post("/getsonguploadurl",getUploadSongUrlLimiter,protectAdminRoute,getUploadUrl);
router.post("/createartist",createArtistLimiter,protectAdminRoute,createArtist);
router.post("/getimageurl",getUploadImageUrlLimiter,protectAdminRoute,getArtistImageUploadUrl);
router.put("/updateimages3key",updateImages3keyLimiter,protectAdminRoute,setImages3Key);
router.post("/addsongData",addSongValidation,validate,updateSongs3keyLimiter,protectAdminRoute,addSongDetails);
router.get("/getartists",getArtistsLimiter,protectAdminRoute,getArtists);

export default router;