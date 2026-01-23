import { useState } from 'react';
import { Upload, Music, Loader2, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAdminStore } from '@/store/admin/admin.store';
import { useAuthStore } from '@/store/auth/auth.store';

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

const SongsView = () => {
  const [trackFile, setTrackFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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
  const { getImageUploadUrl, getSongUploadUrl, songDataUpdate,isUploadingSong,artists,getArtists} = useAdminStore();
  const { authUser } = useAuthStore();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTrackFile(file);
      setFormData(prev => ({
        ...prev,
        title: file.name.replace(/\.[^/.]+$/, '')
      }));



      await getSongUploadUrl(
        {
          fileName: file.name.replace(/\.[^/.]+$/, ''),
          fileType: file.type,
          fileSize: file.size
        }
      )
    }
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const uploadPicUrlData = {
        fileSize: file.size,
        fileType: file.type,
        userId: authUser?.user_id,
        imageType: "cover"
      }
      await getImageUploadUrl(uploadPicUrlData);
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverPreview(null);
  };

  const handleInputChange = (field: keyof TrackFormData, value: string) => {

    
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackFile || !formData.title || !coverImage || !formData.artistId) return;

    setIsUploading(true);
    try {

      await songDataUpdate({
        song_title: formData.title,
        artist_id: formData.artistId,
        duration: trackFile.size,
        genre: formData.genre,
        release_date: formData.releaseDate,
        tags: formData.tags,
        mood: formData.mood,
        energy_level: formData.energyLevel,
        language: formData.language

      }, trackFile, coverImage)

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
    } catch (error) {
      toast.error('Failed to upload track');
    } finally {
      setIsUploading(false);
    }
  };


  const handleArtistData = async()=>{

    await getArtists();
    
  }

  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-2xl font-mono font-bold mb-2">Upload Track</h1>
        <p className="text-muted-foreground">Add new music to your library with detailed metadata.</p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Uploads Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Audio File Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-mono text-muted-foreground">AUDIO FILE *</Label>
              <div
                className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-foreground/50 transition-colors min-h-50 flex flex-col items-center justify-center"
                onClick={() => document.getElementById('upload-file-input')?.click()}
              >
                {trackFile ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <Music className="w-7 h-7 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-mono font-bold text-sm truncate max-w-50">{trackFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(trackFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <Button type="button" variant="outline" size="sm">
                      Change File
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-mono mb-1">Drop audio file here</p>
                    <p className="text-xs text-muted-foreground">or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-2">MP3, WAV, OGG</p>
                  </>
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
            <div className="space-y-2">
              <Label className="text-sm font-mono text-muted-foreground">COVER IMAGE</Label>
              <div
                className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-foreground/50 transition-colors min-h-50 flex flex-col items-center justify-center relative overflow-hidden"
                onClick={() => !coverPreview && document.getElementById('cover-image-input')?.click()}
              >
                {coverPreview ? (
                  <div className="relative w-full h-full text-white">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-full object-cover rounded-lg absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById('cover-image-input')?.click();
                        }}
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
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Image className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-mono mb-1">Drop cover image here</p>
                    <p className="text-xs text-muted-foreground">or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-2">JPG, PNG, WebP</p>
                  </>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Song Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-mono text-muted-foreground">
                SONG TITLE *
              </Label>
              <Input
                id="title"
                placeholder="Enter song title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="font-mono"
                required
              />
            </div>

            {/* Artist Selection */}
            <div className="space-y-2">
              <Label htmlFor="artist" className="text-sm font-mono text-muted-foreground">
                ARTIST
              </Label>
              <select
                id="artist"
                value={formData.artistId}
                onChange={(e) => handleInputChange('artistId', e.target.value)}
                onClick={handleArtistData}
                className="w-full h-10 px-3 rounded-md border border-input bg-background font-mono text-sm"
              >
                <option value="">Select artist</option>
                {artists?.map((artist) => (
                  <option key={artist.artist_id} value={artist.artist_id}>
                    {artist.artist_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Genre */}
            <div className="space-y-2">
              <Label htmlFor="genre" className="text-sm font-mono text-muted-foreground">
                GENRE
              </Label>
              <select
                id="genre"
                value={formData.genre}
                onChange={(e) => handleInputChange('genre', e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background font-mono text-sm"
              >
                <option value="">Select genre</option>
                {GENRES.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Release Date */}
            <div className="space-y-2">
              <Label htmlFor="releaseDate" className="text-sm font-mono text-muted-foreground">
                RELEASE DATE
              </Label>
              <Input
                id="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={(e) => handleInputChange('releaseDate', e.target.value)}
                className="font-mono"
              />
            </div>

            {/* Mood */}
            <div className="space-y-2">
              <Label htmlFor="mood" className="text-sm font-mono text-muted-foreground">
                MOOD
              </Label>
              <select
                id="mood"
                value={formData.mood}
                onChange={(e) => handleInputChange('mood', e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background font-mono text-sm"
              >
                <option value="">Select mood</option>
                {MOODS.map((mood) => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </select>
            </div>

            {/* Energy Level */}
            <div className="space-y-2">
              <Label htmlFor="energyLevel" className="text-sm font-mono text-muted-foreground">
                ENERGY LEVEL
              </Label>
              <select
                id="energyLevel"
                value={formData.energyLevel}
                onChange={(e) => handleInputChange('energyLevel', e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background font-mono text-sm"
              >
                <option value="">Select energy level</option>
                {ENERGY_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-mono text-muted-foreground">
                LANGUAGE
              </Label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background font-mono text-sm"
              >
                <option value="">Select language</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-mono text-muted-foreground">
                TAGS
              </Label>
              <Input
                id="tags"
                placeholder="e.g., summer, party, workout (comma separated)"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="font-mono"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!trackFile || !formData.title || isUploading}
            size="lg"
          >
            {isUploadingSong ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload Track
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SongsView;
