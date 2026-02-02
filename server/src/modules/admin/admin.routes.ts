import express from "express";
import { protectAdminRoute, validate } from "../../middleware/auth.middleware.js";
import { addSongDetails, createArtist, getArtistImageUploadUrl, getArtists, getUploadUrl, setImages3Key } from "./admin.controller.js";
import { addSongValidation, createArtistValidator, getArtistImageUploadUrlValidator, getUploadUrlValidator, setImages3KeyValidator } from "./validation/admin.validations.js";
import { createArtistLimiter, getArtistsLimiter, getUploadImageUrlLimiter, getUploadSongUrlLimiter, updateImages3keyLimiter, updateSongs3keyLimiter } from "../../middleware/ratelimit.js";


const router = express.Router();


// add validation =====>
// add rate limiting ==----==>

router.post("/getsonguploadurl",
    getUploadUrlValidator,validate,
    getUploadSongUrlLimiter,
    protectAdminRoute,
    getUploadUrl
);
router.post("/createartist",
    createArtistValidator,validate,
    createArtistLimiter,
    protectAdminRoute,
    createArtist
);
router.post("/getimageurl",
    getArtistImageUploadUrlValidator,validate,
    getUploadImageUrlLimiter,
    protectAdminRoute,
    getArtistImageUploadUrl
);
router.put("/updateimages3key",
    setImages3KeyValidator,validate,
    updateImages3keyLimiter,
    protectAdminRoute,
    setImages3Key
);
router.post("/addsongData",
    addSongValidation,validate,
    updateSongs3keyLimiter,
    protectAdminRoute,
    addSongDetails
);
router.get("/getartists",
    getArtistsLimiter,
    protectAdminRoute,
    getArtists
);

export default router;