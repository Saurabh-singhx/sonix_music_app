import { useAdminStore } from "@/store/admin/admin.store";
import type { artistGetUrlPayload } from "@/types/admin.types";
import { Button, CircularProgress, LinearProgress, styled, TextField, Fade, Grow, Zoom } from "@mui/material";
import { CloudUploadIcon, CheckCircle2, Camera, Users } from "lucide-react";
import { useState, useRef } from "react";

function ArtistView() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { 
        createArtist, 
        isCreatingArtist, 
        getImageUploadUrl, 
        isGettingUrloadImageUrl, 
        createdArtistData, 
        uploadArtistProfileImage, 
        uploadProgress 
    } = useAdminStore();

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
        setArtistData({ artist_name: "", artist_bio: "" });
    };

    const processFile = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setImageLoaded(false);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);

            const uploadPicUrlData: artistGetUrlPayload = {
                fileSize: file.size,
                fileType: file.type,
                userId: createdArtistData?.artist_id,
                imageType: "profile"
            };
            getImageUploadUrl(uploadPicUrlData);
        } else {
            alert('Please select a valid image file.');
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedFile) {
            uploadArtistProfileImage(selectedFile);
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setImageLoaded(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setImageLoaded(false);
        setArtistData({ artist_name: "", artist_bio: "" });
        if (fileInputRef.current) fileInputRef.current.value = '';
        // Reset the store state if needed
        // useAdminStore.getState().resetCreatedArtist?.();
    };

    return (
        <div className="min-h-screen w-full ">
            <div className="max-w-6xl mx-auto flex flex-col gap-5">
                
                {/* TOP SECTION: Create/Upload Form */}
                <Grow in={true} timeout={600} className="">
                    <div>
                        {/* Header */}
                        <div className="mb-6 text-center">
                            <Zoom in={true} timeout={800}>
                                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                                    {createdArtistData?.artist_id ? 'Upload Profile Image' : 'Create New Artist'}
                                </h1>
                            </Zoom>
                            <p className="text-gray-400 text-sm sm:text-base mt-2">
                                {createdArtistData?.artist_id 
                                    ? 'Complete the profile by adding a photo' 
                                    : 'Add a new artist to your collection'}
                            </p>
                        </div>

                        {/* Form Card */}
                        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
                            
                            {createdArtistData?.artist_id ? (
                                <Fade in={true} timeout={500}>
                                    <form onSubmit={handleUpload} className="space-y-6">
                                        {/* Success Message */}
                                        <div className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                                            <CheckCircle2 className="w-5 h-5 text-white" />
                                            <span className="text-white font-medium">Artist "{createdArtistData.artist_name}" created successfully!</span>
                                        </div>

                                        {/* Image Preview Area */}
                                        <div 
                                            className={`relative group cursor-pointer transition-all duration-300 ${
                                                dragActive ? 'scale-105' : ''
                                            }`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            onClick={() => !selectedFile && fileInputRef.current?.click()}
                                        >
                                            <div className={`
                                                relative mx-auto w-40 h-40 sm:w-52 sm:h-52 rounded-full overflow-hidden
                                                border-4 transition-all duration-500
                                                ${dragActive 
                                                    ? 'border-white shadow-[0_0_30px_rgba(255,255,255,0.3)]' 
                                                    : 'border-white/20 group-hover:border-white/50'
                                                }
                                                ${selectedFile ? '' : 'bg-neutral-800'}
                                            `}>
                                                {previewUrl ? (
                                                    <Zoom in={true} timeout={400}>
                                                        <div className="relative w-full h-full">
                                                            <img
                                                                src={previewUrl}
                                                                alt="Preview"
                                                                className={`w-full h-full object-cover transition-all duration-700 ${
                                                                    imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                                                                }`}
                                                                onLoad={() => setImageLoaded(true)}
                                                            />
                                                            {/* Hover Overlay */}
                                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                                <div className="text-center">
                                                                    <Camera className="w-8 h-8 text-white mx-auto mb-2" />
                                                                    <span className="text-white text-sm font-medium">Change Photo</span>
                                                                </div>
                                                            </div>
                                                            {/* Remove Button */}
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRemoveImage();
                                                                }}
                                                                className="absolute top-2 right-2 w-8 h-8 bg-white hover:bg-gray-200 text-black rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg font-bold"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    </Zoom>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-white transition-colors duration-300">
                                                        <div className={`
                                                            p-4 rounded-full bg-white/5 mb-3 transition-transform duration-300
                                                            ${dragActive ? 'scale-110 bg-white/10' : 'group-hover:scale-110'}
                                                        `}>
                                                            <CloudUploadIcon className="w-10 h-10 sm:w-12 sm:h-12" />
                                                        </div>
                                                        <span className="text-sm font-medium">Drop image here or click</span>
                                                        <span className="text-xs text-gray-500 mt-1">Supports: JPG, PNG, WebP</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <VisuallyHiddenInput
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />

                                        {/* Progress Bar */}
                                        {uploadProgress > 0 && uploadProgress < 100 && (
                                            <Fade in={true}>
                                                <div className="space-y-2 max-w-md mx-auto">
                                                    <div className="flex justify-between text-xs text-gray-400">
                                                        <span>Uploading...</span>
                                                        <span>{uploadProgress}%</span>
                                                    </div>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={uploadProgress}
                                                        className="h-2 rounded-full bg-white/10"
                                                        sx={{
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: 'white',
                                                                borderRadius: '9999px',
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </Fade>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                                            {!selectedFile ? (
                                                <Button
                                                    component="label"
                                                    variant="outlined"
                                                    startIcon={<CloudUploadIcon className="w-5 h-5" />}
                                                    className="w-full sm:w-auto min-w-40 py-3 rounded-xl border-2 border-white/30 text-white hover:border-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
                                                    sx={{
                                                        textTransform: 'none',
                                                        fontSize: '1rem',
                                                        fontWeight: 600,
                                                        borderColor: 'rgba(255,255,255,0.3)',
                                                        color: 'white',
                                                        '&:hover': {
                                                            borderColor: 'white',
                                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                                        }
                                                    }}
                                                >
                                                    Select Image
                                                    <VisuallyHiddenInput
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                    />
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    disabled={isGettingUrloadImageUrl}
                                                    className="w-full sm:w-auto min-w-40 py-3 rounded-xl bg-white text-black font-semibold shadow-lg hover:shadow-white/25 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    sx={{
                                                        textTransform: 'none',
                                                        fontSize: '1rem',
                                                        backgroundColor: 'white',
                                                        color: 'black',
                                                        fontWeight: 600,
                                                        '&:hover': {
                                                            backgroundColor: '#f0f0f0',
                                                        },
                                                        '&.Mui-disabled': {
                                                            backgroundColor: '#404040',
                                                            color: '#808080',
                                                        }
                                                    }}
                                                >
                                                    {isGettingUrloadImageUrl ? (
                                                        <CircularProgress size={20} sx={{ color: 'black' }} />
                                                    ) : (
                                                        'Upload Photo'
                                                    )}
                                                </Button>
                                            )}
                                            
                                            {/* Create Another Artist Button */}
                                            <Button
                                                variant="outlined"
                                                onClick={handleReset}
                                                className="w-full sm:w-auto min-w-40 py-3 rounded-xl border-2 border-white/20 text-gray-400 hover:border-white/50 hover:text-white hover:bg-white/5 transition-all duration-300"
                                                sx={{
                                                    textTransform: 'none',
                                                    fontSize: '1rem',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Create Another
                                            </Button>
                                        </div>
                                    </form>
                                </Fade>
                            ) : (
                                <Fade in={true} timeout={500}>
                                    <form onSubmit={handleArtistCreate} className="max-w-lg mx-auto space-y-6">
                                        <div className="space-y-5">
                                            {/* Artist Name Input */}
                                            <TextField
                                                name="artist_name"
                                                value={artistData.artist_name}
                                                onChange={handleArtistData}
                                                label="Artist Name"
                                                placeholder="Enter artist name"
                                                fullWidth
                                                required
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '16px',
                                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                                        '& fieldset': {
                                                            borderColor: 'rgba(255,255,255,0.2)',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: 'rgba(255,255,255,0.5)',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: 'white',
                                                            borderWidth: '2px',
                                                            boxShadow: '0 0 20px rgba(255,255,255,0.2)',
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: 'rgba(255,255,255,0.6)',
                                                        '&.Mui-focused': {
                                                            color: 'white',
                                                        },
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        color: 'white',
                                                        fontSize: '1.1rem',
                                                        padding: '16px 20px',
                                                    },
                                                    marginBottom:"25px"
                                                }}
                                            />

                                            {/* Artist Bio Input */}
                                            <TextField
                                                name="artist_bio"
                                                value={artistData.artist_bio}
                                                onChange={handleArtistData}
                                                label="Artist Bio"
                                                placeholder="Tell us about the artist..."
                                                multiline
                                                rows={4}
                                                fullWidth
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '16px',
                                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                                        '& fieldset': {
                                                            borderColor: 'rgba(255,255,255,0.2)',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: 'rgba(255,255,255,0.5)',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: 'white',
                                                            borderWidth: '2px',
                                                            boxShadow: '0 0 20px rgba(255,255,255,0.2)',
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: 'rgba(255,255,255,0.6)',
                                                        '&.Mui-focused': {
                                                            color: 'white',
                                                        },
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        color: 'white',
                                                        fontSize: '1rem',
                                                        lineHeight: 1.6,
                                                        padding: '16px 20px',
                                                    },
                                                }}
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={isCreatingArtist || !artistData.artist_name.trim()}
                                            fullWidth
                                            className="py-4 rounded-xl bg-white text-black font-bold text-lg shadow-lg hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            sx={{
                                                textTransform: 'none',
                                                backgroundColor: 'white',
                                                color: 'black',
                                                fontWeight: 700,
                                                '&:hover': {
                                                    backgroundColor: '#f0f0f0',
                                                },
                                                '&.Mui-disabled': {
                                                    backgroundColor: '#404040',
                                                    color: '#808080',
                                                }
                                            }}
                                        >
                                            {isCreatingArtist ? (
                                                <div className="flex items-center gap-3">
                                                    <CircularProgress size={24} sx={{ color: 'black' }} />
                                                    <span>Creating Artist...</span>
                                                </div>
                                            ) : (
                                                'Create Artist'
                                            )}
                                        </Button>
                                    </form>
                                </Fade>
                            )}
                        </div>
                    </div>
                </Grow>

                {/* BOTTOM SECTION: Artist List Placeholder */}
                <Grow in={true} timeout={800}>
                    <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Users className="w-6 h-6 text-white" />
                                <h2 className="text-2xl font-bold text-white">All Artists</h2>
                            </div>
                            <span className="text-gray-400 text-sm">Total: 0</span>
                        </div>

                        {/* Empty State */}
                        <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl">
                            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg mb-2">No artists yet</p>
                            <p className="text-gray-500 text-sm">Create your first artist using the form above</p>
                        </div>

                        {/* TODO: Map through your artists list here */}
                        {/* Example structure:
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {artists.map((artist) => (
                                <div key={artist.id} className="bg-black/50 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-white/30 transition-colors">
                                    <img src={artist.image} alt={artist.name} className="w-16 h-16 rounded-full object-cover" />
                                    <div>
                                        <h3 className="text-white font-semibold">{artist.name}</h3>
                                        <p className="text-gray-400 text-sm line-clamp-1">{artist.bio}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        */}
                    </div>
                </Grow>
            </div>
        </div>
    );
}

export default ArtistView;