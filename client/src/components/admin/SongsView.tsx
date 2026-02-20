import { useState } from 'react';
import { Upload, Music, Loader2, Image, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAdminStore } from '@/store/admin/admin.store';
import { useAuthStore } from '@/store/auth/auth.store';
import type { artistGetUrlPayload } from '@/types/admin.types';

interface TrackFormData {
  title: string;
  artistName: string;
  artistId: string;
  genre: string;
  releaseDate: string;
  tags: string;
  mood: string;
  energyLevel: string;
  language: string;
}

const MOODS = ['Happy', 'Sad', 'Energetic', 'Calm', 'Romantic', 'Melancholic', 'Aggressive', 'Peaceful'];
const ENERGY_LEVELS = ['Low', 'Medium', 'High', 'Very High'];
const GENRES = ['Pop', 'Rock', 'Hip-Hop', 'R&B', 'Jazz', 'Classical', 'Electronic', 'Country', 'Reggae', 'Blues', 'Folk', 'Metal', 'Indie', 'Soul', 'Funk', 'Other'];
const LANGUAGES = ['English', 'Spanish', 'Hindi', 'French', 'German', 'Portuguese', 'Japanese', 'Korean', 'Chinese', 'Arabic', 'Other'];

interface ValidationErrors {
  [key: string]: string;
}

const SongsView = () => {
  const [trackFile, setTrackFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isDraggingAudio, setIsDraggingAudio] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState<TrackFormData>({
    title: '',
    artistName: '',
    artistId: '',
    genre: '',
    releaseDate: '',
    tags: '',
    mood: '',
    energyLevel: '',
    language: '',
  });

  const { getImageUploadUrl, getSongUploadUrl, songDataUpdate, isUploadingSong, artists, getArtists } = useAdminStore();
  const { authUser } = useAuthStore();

  // Validate all fields
  const validateField = (name: string, value: string): string => {
    if (!value || value.trim() === '') {
      return `${name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1').trim()} is required`;
    }
    return '';
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Check all required fields
    const requiredFields = ['title', 'artistId', 'genre', 'releaseDate', 'mood', 'energyLevel', 'language', 'tags'];

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof TrackFormData]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Check files
    if (!trackFile) {
      newErrors.trackFile = 'Audio file is required';
      isValid = false;
    }
    if (!coverImage) {
      newErrors.coverImage = 'Cover image is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTrackFile(file);
      setErrors(prev => ({ ...prev, trackFile: '' }));
      setFormData(prev => ({
        ...prev,
        title: file.name.replace(/\.[^/.]+$/, '')
      }));

      await getSongUploadUrl({
        fileName: file.name.replace(/\.[^/.]+$/, ''),
        fileType: file.type,
        fileSize: file.size
      });
    }
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setErrors(prev => ({ ...prev, coverImage: '' }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const uploadPicUrlData: artistGetUrlPayload = {
        fileSize: file.size,
        fileType: file.type,
        userId: authUser?.user_id,
        imageType: "cover",
      };
      await getImageUploadUrl(uploadPicUrlData);
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverPreview(null);
    setErrors(prev => ({ ...prev, coverImage: 'Cover image is required' }));
  };

  const handleInputChange = (field: keyof TrackFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof TrackFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await songDataUpdate({
        song_title: formData.title,
        artist_id: formData.artistId,
        duration: trackFile!.size,
        genre: formData.genre,
        release_date: formData.releaseDate,
        tags: formData.tags,
        mood: formData.mood,
        energy_level: formData.energyLevel,
        language: formData.language
      }, trackFile!, coverImage!);

      // Reset form
      setTrackFile(null);
      setCoverImage(null);
      setCoverPreview(null);
      setFormData({
        title: '',
        artistName: '',
        artistId: '',
        genre: '',
        releaseDate: '',
        tags: '',
        mood: '',
        energyLevel: '',
        language: '',
      });
      setErrors({});
      setTouched({});
      toast.success('Track uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload track');
    }
  };

  const handleArtistData = async () => {
    if (artists?.length === 0) {
      await getArtists();
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent, type: 'audio' | 'image') => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'audio') setIsDraggingAudio(true);
    else setIsDraggingImage(true);
  };

  const handleDragLeave = (e: React.DragEvent, type: 'audio' | 'image') => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'audio') setIsDraggingAudio(false);
    else setIsDraggingImage(false);
  };

  const handleDrop = (e: React.DragEvent, type: 'audio' | 'image') => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'audio') setIsDraggingAudio(false);
    else setIsDraggingImage(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (type === 'audio' && file.type.startsWith('audio/')) {
      setTrackFile(file);
      setErrors(prev => ({ ...prev, trackFile: '' }));
      setFormData(prev => ({
        ...prev,
        title: file.name.replace(/\.[^/.]+$/, '')
      }));
      getSongUploadUrl({
        fileName: file.name.replace(/\.[^/.]+$/, ''),
        fileType: file.type,
        fileSize: file.size
      });
    } else if (type === 'image' && file.type.startsWith('image/')) {
      setCoverImage(file);
      setErrors(prev => ({ ...prev, coverImage: '' }));
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
      getImageUploadUrl({
        fileSize: file.size,
        fileType: file.type,
        userId: authUser?.user_id,
        imageType: "cover",
      });
    }
  };

  const isFormValid = trackFile && coverImage && formData.title && formData.artistId &&
    formData.genre && formData.releaseDate && formData.mood &&
    formData.energyLevel && formData.language && formData.tags;

  return (
    <div className=" w-full sm:p-6 lg:p-8 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        {/* <div className="text-center space-y-2 animate-slide-down">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Upload Track
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Add new music to your library with detailed metadata
          </p>
        </div> */}

        {/* Main Form Card */}
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl animate-scale-up">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* File Uploads Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Audio File Upload */}
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <Label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  AUDIO FILE
                  <span className="text-red-500">*</span>
                </Label>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 min-h-50 flex flex-col items-center justify-center relative overflow-hidden group
                    ${isDraggingAudio
                      ? 'border-white bg-white/10 scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                      : errors.trackFile
                        ? 'border-red-500/50 bg-red-500/5'
                        : trackFile
                          ? 'border-green-500/50 bg-green-500/5'
                          : 'border-white/20 hover:border-white/50 hover:bg-white/5'
                    }`}
                  onClick={() => document.getElementById('upload-file-input')?.click()}
                  onDragOver={(e) => handleDragOver(e, 'audio')}
                  onDragLeave={(e) => handleDragLeave(e, 'audio')}
                  onDrop={(e) => handleDrop(e, 'audio')}
                >
                  {trackFile ? (
                    <div className="flex flex-col items-center gap-3 animate-scale-up">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
                        <Music className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-white text-sm truncate max-w-50">{trackFile.name}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {(trackFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2 border-white/20 hover:bg-white/10 hover:border-white/50 transition-all duration-200"
                      >
                        Change File
                      </Button>
                    </div>
                  ) : (
                    <div className={`transition-all duration-300 ${isDraggingAudio ? 'scale-110' : 'group-hover:scale-105'}`}>
                      <Upload className={`w-12 h-12 mx-auto mb-3 transition-colors duration-300 ${isDraggingAudio ? 'text-white' : 'text-gray-500'}`} />
                      <p className="text-sm font-medium text-white mb-1">Drop audio file here</p>
                      <p className="text-xs text-gray-500">or click to browse</p>
                      <p className="text-xs text-gray-600 mt-2">MP3, WAV, OGG</p>
                    </div>
                  )}

                  {errors.trackFile && (
                    <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1 text-red-400 text-xs animate-shake">
                      <AlertCircle className="w-3 h-3" />
                      {errors.trackFile}
                    </div>
                  )}

                  <input
                    id="upload-file-input"
                    type="file"
                    accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <Label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  COVER IMAGE
                  <span className="text-red-500">*</span>
                </Label>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 min-h-50 flex flex-col items-center justify-center relative overflow-hidden group
                    ${isDraggingImage
                      ? 'border-white bg-white/10 scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                      : errors.coverImage
                        ? 'border-red-500/50 bg-red-500/5'
                        : coverPreview
                          ? 'border-green-500/50'
                          : 'border-white/20 hover:border-white/50 hover:bg-white/5'
                    }`}
                  onClick={() => !coverPreview && document.getElementById('cover-image-input')?.click()}
                  onDragOver={(e) => handleDragOver(e, 'image')}
                  onDragLeave={(e) => handleDragLeave(e, 'image')}
                  onDrop={(e) => handleDrop(e, 'image')}
                >
                  {coverPreview ? (
                    <div className="relative w-full h-full min-h-48 animate-fade-in">
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="w-full h-full object-cover rounded-lg absolute inset-0"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 rounded-lg backdrop-blur-sm">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('cover-image-input')?.click();
                          }}
                          className="border-white/50 hover:bg-white/20"
                        >
                          Change
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCoverImage();
                          }}
                          className="bg-red-500/80 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 animate-scale-up">
                        <CheckCircle2 className="w-4 h-4 text-black" />
                      </div>
                    </div>
                  ) : (
                    <div className={`transition-all duration-300 ${isDraggingImage ? 'scale-110' : 'group-hover:scale-105'}`}>
                      <Image className={`w-12 h-12 mx-auto mb-3 transition-colors duration-300 ${isDraggingImage ? 'text-white' : 'text-gray-500'}`} />
                      <p className="text-sm font-medium text-white mb-1">Drop cover image here</p>
                      <p className="text-xs text-gray-500">or click to browse</p>
                      <p className="text-xs text-gray-600 mt-2">JPG, PNG, WebP</p>
                    </div>
                  )}

                  {errors.coverImage && (
                    <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1 text-red-400 text-xs animate-shake">
                      <AlertCircle className="w-3 h-3" />
                      {errors.coverImage}
                    </div>
                  )}

                  <input
                    id="cover-image-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleCoverImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Track Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
              {/* Song Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  SONG TITLE
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter song title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  onBlur={() => handleBlur('title')}
                  className={`bg-neutral-800 border-white/10 text-white placeholder:text-gray-600 focus:border-white focus:ring-white/20 transition-all duration-200 ${errors.title ? 'border-red-500/50 focus:border-red-500' : ''}`}
                />
                {errors.title && (
                  <p className="text-red-400 text-xs flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Artist Selection */}
              <div className="space-y-2">
                <Label htmlFor="artist" className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  ARTIST
                  <span className="text-red-500">*</span>
                </Label>
                <select
                  id="artist"
                  value={formData.artistId}
                  onChange={(e) => handleInputChange('artistId', e.target.value)}
                  onBlur={() => handleBlur('artistId')}
                  onClick={handleArtistData}
                  className={`w-full h-10 px-3 rounded-md border bg-neutral-800 text-white text-sm focus:border-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-200 ${errors.artistId ? 'border-red-500/50' : 'border-white/10'}`}
                >
                  <option value="" className="bg-neutral-800">Select artist</option>
                  {artists?.map((artist) => (
                    <option key={artist.artist_id} value={artist.artist_id} className="bg-neutral-800">
                      {artist.artist_name}
                    </option>
                  ))}
                </select>
                {errors.artistId && (
                  <p className="text-red-400 text-xs flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="w-3 h-3" />
                    {errors.artistId}
                  </p>
                )}
              </div>

              {/* Genre */}
              <div className="space-y-2">
                <Label htmlFor="genre" className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  GENRE
                  <span className="text-red-500">*</span>
                </Label>
                <select
                  id="genre"
                  value={formData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                  onBlur={() => handleBlur('genre')}
                  className={`w-full h-10 px-3 rounded-md border bg-neutral-800 text-white text-sm focus:border-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-200 ${errors.genre ? 'border-red-500/50' : 'border-white/10'}`}
                >
                  <option value="" className="bg-neutral-800">Select genre</option>
                  {GENRES.map((genre) => (
                    <option key={genre} value={genre} className="bg-neutral-800">{genre}</option>
                  ))}
                </select>
                {errors.genre && (
                  <p className="text-red-400 text-xs flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="w-3 h-3" />
                    {errors.genre}
                  </p>
                )}
              </div>

              {/* Release Date */}
              <div className="space-y-2">
                <Label htmlFor="releaseDate" className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  RELEASE DATE
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => handleInputChange('releaseDate', e.target.value)}
                  onBlur={() => handleBlur('releaseDate')}
                  className={`bg-neutral-800 border-white/10 text-white focus:border-white focus:ring-white/20 transition-all duration-200 ${errors.releaseDate ? 'border-red-500/50 focus:border-red-500' : ''}`}
                />
                {errors.releaseDate && (
                  <p className="text-red-400 text-xs flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="w-3 h-3" />
                    {errors.releaseDate}
                  </p>
                )}
              </div>

              {/* Mood */}
              <div className="space-y-2">
                <Label htmlFor="mood" className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  MOOD
                  <span className="text-red-500">*</span>
                </Label>
                <select
                  id="mood"
                  value={formData.mood}
                  onChange={(e) => handleInputChange('mood', e.target.value)}
                  onBlur={() => handleBlur('mood')}
                  className={`w-full h-10 px-3 rounded-md border bg-neutral-800 text-white text-sm focus:border-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-200 ${errors.mood ? 'border-red-500/50' : 'border-white/10'}`}
                >
                  <option value="" className="bg-neutral-800">Select mood</option>
                  {MOODS.map((mood) => (
                    <option key={mood} value={mood} className="bg-neutral-800">{mood}</option>
                  ))}
                </select>
                {errors.mood && (
                  <p className="text-red-400 text-xs flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="w-3 h-3" />
                    {errors.mood}
                  </p>
                )}
              </div>

              {/* Energy Level */}
              <div className="space-y-2">
                <Label htmlFor="energyLevel" className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  ENERGY LEVEL
                  <span className="text-red-500">*</span>
                </Label>
                <select
                  id="energyLevel"
                  value={formData.energyLevel}
                  onChange={(e) => handleInputChange('energyLevel', e.target.value)}
                  onBlur={() => handleBlur('energyLevel')}
                  className={`w-full h-10 px-3 rounded-md border bg-neutral-800 text-white text-sm focus:border-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-200 ${errors.energyLevel ? 'border-red-500/50' : 'border-white/10'}`}
                >
                  <option value="" className="bg-neutral-800">Select energy level</option>
                  {ENERGY_LEVELS.map((level) => (
                    <option key={level} value={level} className="bg-neutral-800">{level}</option>
                  ))}
                </select>
                {errors.energyLevel && (
                  <p className="text-red-400 text-xs flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="w-3 h-3" />
                    {errors.energyLevel}
                  </p>
                )}
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  LANGUAGE
                  <span className="text-red-500">*</span>
                </Label>
                <select
                  id="language"
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  onBlur={() => handleBlur('language')}
                  className={`w-full h-10 px-3 rounded-md border bg-neutral-800 text-white text-sm focus:border-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-200 ${errors.language ? 'border-red-500/50' : 'border-white/10'}`}
                >
                  <option value="" className="bg-neutral-800">Select language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang} className="bg-neutral-800">{lang}</option>
                  ))}
                </select>
                {errors.language && (
                  <p className="text-red-400 text-xs flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="w-3 h-3" />
                    {errors.language}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  TAGS
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tags"
                  placeholder="e.g., summer, party, workout"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  onBlur={() => handleBlur('tags')}
                  className={`bg-neutral-800 border-white/10 text-white placeholder:text-gray-600 focus:border-white focus:ring-white/20 transition-all duration-200 ${errors.tags ? 'border-red-500/50 focus:border-red-500' : ''}`}
                />
                {errors.tags && (
                  <p className="text-red-400 text-xs flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="w-3 h-3" />
                    {errors.tags}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <Button
                type="submit"
                className={`w-full py-6 text-lg font-semibold rounded-xl transition-all duration-300 transform
                  ${isFormValid
                    ? 'bg-white text-black hover:bg-gray-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                    : 'bg-white/20 text-white/50 cursor-not-allowed'
                  }`}
                disabled={!isFormValid || isUploadingSong}
              >
                {isUploadingSong ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5" />
                    <span>Upload Track</span>
                  </div>
                )}
              </Button>

              {!isFormValid && !isUploadingSong && (
                <p className="text-center text-gray-500 text-xs mt-2 animate-fade-in">
                  Fill in all required fields to enable upload
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Add these animations to your global CSS or tailwind config */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-slide-down {
          animation: slide-down 0.6s ease-out forwards;
        }
        .animate-scale-up {
          animation: scale-up 0.5s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default SongsView;