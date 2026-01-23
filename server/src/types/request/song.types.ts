

export interface songBody {
    song_title: string;
    artist_name: string;
    song_url:string;
    artist_id: string;
    duration: number;
    genre: string;
    release_date: string;
    cover_image_url: string;
    tags: string;
    mood: string; // happy, sad, chill, workout
    energy_level: string; // low, medium, high
    language: string;
    updated_at:Date
}