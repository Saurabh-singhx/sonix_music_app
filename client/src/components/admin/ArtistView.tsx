import { useAdminStore } from "@/store/admin/admin.store";
import { Button, CircularProgress, LinearProgress, styled, TextField } from "@mui/material";
import { CloudUploadIcon, User } from "lucide-react";
import { useState } from "react";

function ArtistView() {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { createArtist, isCreatingArtist, getImageUploadUrl, isGettingUrloadImageUrl, createdArtistData, uploadArtistProfileImage, uploadProgress } = useAdminStore();

    const [artistData, setArtistData] = useState({
        artist_name: "",
        artist_bio: ""
    });

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });


    const handleArtistData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setArtistData(prev => ({ ...prev, [name]: value }));
    };

    const handleArtistCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await createArtist(artistData);

        setArtistData({
            artist_name: "",
            artist_bio: "",
        });

        setSelectedFile(null);
        setPreviewUrl("");
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;

        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);

            // Create a URL for immediate preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);

            const uploadPicUrlData = {
                fileSize: file.size,
                fileType: file.type,
                userId: createdArtistData?.artist_id,
                imageType: "profile"
            }
            getImageUploadUrl(uploadPicUrlData);

        } else {
            setSelectedFile(null);
            setPreviewUrl(null);
            alert('Please select an image file.');
        }
    };

    const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedFile) {
            // Logic to upload the selectedFile to a server (e.g., using fetch or axios)
            console.log('Uploading file:', selectedFile.name);
            uploadArtistProfileImage(selectedFile);
        } else {
            alert('No file selected.');
        }
    };

    return (
        <div className=" font-s font-medium text-3xl text-white flex items-center justify-center">

            {/* artist start here ==----==> */}


            <div className=" w-full p-4 flex flex-col gap-4">

                <span>Create Artists</span>
                {/* {
            createdArtistData?.artist_id ?():()
          } */}

                {
                    createdArtistData?.artist_id ? (<form action="" className="flex flex-col justify-between" onSubmit={handleUpload}>
                        <div className="flex flex-col items-center p-4">
                            <div className="flex flex-col border border-white h-52 w-[40%] rounded-full items-center justify-center overflow-hidden">
                                {previewUrl ? (
                                    <div style={{ marginTop: '20px' }}>
                                        <img
                                            src={previewUrl}
                                            alt="Selected Preview"
                                            style={{ maxWidth: '300px', maxHeight: '300px', border: '1px solid #ccc' }}
                                        />
                                    </div>
                                ) : (<User size={100} className="hover:" />)}

                            </div>


                        </div>
                        {
                            selectedFile ? (<Button
                                variant="outlined"
                                disabled={isGettingUrloadImageUrl}
                                type="submit"
                                sx={{
                                    borderColor: "white",
                                    color: "white",
                                    minWidth: 140,

                                    "&:hover": {
                                        borderColor: "white",
                                        backgroundColor: "rgba(255,255,255,0.08)",
                                    },

                                    "&.Mui-disabled": {
                                        borderColor: "#d1d5db",
                                        color: "#9ca3af",
                                    },
                                }}

                            >Upload Pic</Button>) : (<Button
                                component="label"
                                role={undefined}
                                variant="outlined"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                                sx={{
                                    borderColor: "white",
                                    color: "white",
                                    minWidth: 140,

                                    "&:hover": {
                                        borderColor: "white",
                                        backgroundColor: "rgba(255,255,255,0.08)",
                                    },

                                    "&.Mui-disabled": {
                                        borderColor: "#d1d5db",
                                        color: "#9ca3af",
                                    },


                                }}
                            >
                                select files
                                <VisuallyHiddenInput
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    multiple
                                />
                            </Button>)
                        }
                        <LinearProgress variant="determinate" value={uploadProgress} />
                    </form>) : (<form action="" className="flex flex-col gap-4 py-2" onSubmit={handleArtistCreate}>

                        <TextField
                            name="artist_name"
                            value={artistData.artist_name}
                            onChange={handleArtistData}
                            id="outlined-basic" label="Artist Name" variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                },
                            }}
                        />

                        <TextField
                            name="artist_bio"
                            focused
                            id="outlined-multiline-static"
                            label="Artist Bio"
                            multiline
                            rows={4}
                            placeholder="Artist's Bio"
                            value={artistData.artist_bio}
                            onChange={handleArtistData}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                },
                            }}
                        />

                        <Button
                            variant="outlined"
                            type="submit"
                            disabled={isCreatingArtist}
                            sx={{
                                borderColor: "white",
                                color: "white",
                                minWidth: 140,

                                "&:hover": {
                                    borderColor: "white",
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                },

                                "&.Mui-disabled": {
                                    borderColor: "#d1d5db",
                                    color: "#9ca3af",
                                },


                                borderRadius: "12px",

                            }}
                        >
                            {isCreatingArtist ? (
                                <CircularProgress size={20} sx={{ color: "white" }} />
                            ) : (
                                "Create"
                            )}
                        </Button>

                    </form>)
                }

            </div>

            {/* song creation start here  */}


            {/* <div className="w-1/2 p-4">
          <span>Create song</span>

        </div> */}
        </div>
    )
}

export default ArtistView