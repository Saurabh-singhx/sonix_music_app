import { useAdminStore } from "@/store/admin/admin.store";
import type { artistGetUrlPayload } from "@/types/admin.types";
import { CloudUploadIcon, CheckCircle2, Camera, Users, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Spinner replacement for CircularProgress
const Spinner = ({ size = 20, dark = false }: { size?: number; dark?: boolean }) => (
  <Loader2
    className={`animate-spin ${dark ? "text-black" : "text-white"}`}
    style={{ width: size, height: size }}
  />
);

// LinearProgress replacement
const ProgressBar = ({ value }: { value: number }) => (
  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
    <motion.div
      className="h-full bg-white rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    />
  </div>
);

// TextField replacement
const Field = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 1,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}) => {
  const baseClass =
    "w-full bg-white/[0.03] border border-white/20 rounded-2xl px-5 py-4 text-white text-base placeholder:text-white/30 outline-none transition-all duration-200 focus:border-white focus:ring-2 focus:ring-white/20 hover:border-white/50 resize-none";

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white/60">{label}</label>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={baseClass}
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={baseClass}
        />
      )}
    </div>
  );
};

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
    uploadProgress,
  } = useAdminStore();

  const [artistData, setArtistData] = useState({
    artist_name: "",
    artist_bio: "",
  });

  const handleArtistData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArtistData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArtistCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createArtist(artistData);
    setArtistData({ artist_name: "", artist_bio: "" });
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setImageLoaded(false);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);

      const uploadPicUrlData: artistGetUrlPayload = {
        fileSize: file.size,
        fileType: file.type,
        userId: createdArtistData?.artist_id,
        imageType: "profile",
      };
      getImageUploadUrl(uploadPicUrlData);
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
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
    if (selectedFile) uploadArtistProfileImage(selectedFile);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageLoaded(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageLoaded(false);
    setArtistData({ artist_name: "", artist_bio: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-6xl mx-auto flex flex-col gap-5">

        {/* TOP SECTION */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

          {/* Header */}
          <div className="mb-6 text-center">
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
            >
              {createdArtistData?.artist_id ? "Upload Profile Image" : "Create New Artist"}
            </motion.h1>
            <p className="text-gray-400 text-sm sm:text-base mt-2">
              {createdArtistData?.artist_id
                ? "Complete the profile by adding a photo"
                : "Add a new artist to your collection"}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <AnimatePresence mode="wait">
              {createdArtistData?.artist_id ? (
                <motion.form
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={handleUpload}
                  className="space-y-6"
                >
                  {/* Success Message */}
                  <div className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl p-4">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">
                      Artist "{createdArtistData.artist_name}" created successfully!
                    </span>
                  </div>

                  {/* Image Drop Zone */}
                  <div
                    className={`relative group cursor-pointer transition-all duration-300 ${dragActive ? "scale-105" : ""}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !selectedFile && fileInputRef.current?.click()}
                  >
                    <div
                      className={`relative mx-auto w-40 h-40 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 transition-all duration-500
                        ${dragActive ? "border-white shadow-[0_0_30px_rgba(255,255,255,0.3)]" : "border-white/20 group-hover:border-white/50"}
                        ${!selectedFile ? "bg-neutral-800" : ""}
                      `}
                    >
                      {previewUrl ? (
                        <motion.div
                          initial={{ scale: 1.1, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                          className="relative w-full h-full"
                        >
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
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
                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                            className="absolute top-2 right-2 w-8 h-8 bg-white hover:bg-gray-200 text-black rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg font-bold"
                          >
                            ×
                          </button>
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-white transition-colors duration-300">
                          <div className={`p-4 rounded-full bg-white/5 mb-3 transition-transform duration-300 ${dragActive ? "scale-110 bg-white/10" : "group-hover:scale-110"}`}>
                            <CloudUploadIcon className="w-10 h-10 sm:w-12 sm:h-12" />
                          </div>
                          <span className="text-sm font-medium">Drop image here or click</span>
                          <span className="text-xs text-gray-500 mt-1">Supports: JPG, PNG, WebP</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />

                  {/* Progress Bar */}
                  <AnimatePresence>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2 max-w-md mx-auto"
                      >
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <ProgressBar value={uploadProgress} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    {!selectedFile ? (
                      <label className="w-full sm:w-auto min-w-40 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl border-2 border-white/30 text-white font-semibold hover:border-white hover:bg-white/10 transition-all duration-300 hover:scale-105 text-base">
                          <CloudUploadIcon className="w-5 h-5" />
                          Select Image
                        </div>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                      </label>
                    ) : (
                      <button
                        type="submit"
                        disabled={isGettingUrloadImageUrl}
                        className="w-full sm:w-auto min-w-40 py-3 px-6 rounded-xl bg-white text-black font-semibold text-base shadow-lg hover:shadow-white/25 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isGettingUrloadImageUrl ? <Spinner size={20} dark /> : "Upload Photo"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto min-w-40 py-3 px-6 rounded-xl border-2 border-white/20 text-gray-400 font-semibold text-base hover:border-white/50 hover:text-white hover:bg-white/5 transition-all duration-300"
                    >
                      Create Another
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key="create"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={handleArtistCreate}
                  className="max-w-lg mx-auto space-y-6"
                >
                  <div className="space-y-5">
                    <Field
                      label="Artist Name"
                      name="artist_name"
                      value={artistData.artist_name}
                      onChange={handleArtistData}
                      placeholder="Enter artist name"
                      required
                    />
                    <Field
                      label="Artist Bio"
                      name="artist_bio"
                      value={artistData.artist_bio}
                      onChange={handleArtistData}
                      placeholder="Tell us about the artist..."
                      multiline
                      rows={4}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isCreatingArtist || !artistData.artist_name.trim()}
                    className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg shadow-lg hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isCreatingArtist ? (
                      <>
                        <Spinner size={24} dark />
                        <span>Creating Artist...</span>
                      </>
                    ) : (
                      "Create Artist"
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* BOTTOM SECTION: Artist List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">All Artists</h2>
            </div>
            <span className="text-gray-400 text-sm">Total: 0</span>
          </div>

          <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No artists yet</p>
            <p className="text-gray-500 text-sm">Create your first artist using the form above</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default ArtistView;