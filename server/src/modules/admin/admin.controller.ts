import prisma from "../../lib/prisma.js";
import { Request, Response } from "express";

// export const switchToAdmin = async (req : Request< {},{},{secret_key:string}>, res : Response) => {

//     const { secret_key }  = req.body;
//     const email = req.user.user_email;
//     try {
//         if (!secret_key) {
//             return res.status(400).json({ message: "fill all feilds" })
//         }

//         const stored_key = process.env.ADMIN_SECRET_KEY;

//         if (stored_key !== secret_key) {
//             return res.status(400).json({ message: "invalid key" });
//         }

//         const newUser = await prisma.user.update({
//             where: {
//                 user_email: email
//             },
//             data: {
//                 role: "ADMIN",
//             },
            
//             select: {
//                 user_id: true,
//                 user_email: true,
//                 user_name: true,
//                 user_profile_pic: true,
//                 gender: true,
//                 date_of_birth: true,
//                 role: true
//             }
//         })

//         return res.status(200).json({ message: "successfull" ,newUser})
//     } catch (error) {
//         console.log("error in signup controller", error.message);
//         return res.status(500).json({ message: "Internal server error" })
//     }
// }

export const uploadSong = (req:Request,res:Response)=>{

    const user = req.user;

    try {
       return res.status(200).json({message:"everything ok ",user}) 
    } catch (error) {
        const err = error as Error;
        console.log("error in signup controller", err.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}