import React from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePlaylists } from '@/hooks/usePlaylists';

interface AddToPlaylistButtonProps {
  trackId: string;
  variant?: 'icon' | 'button';
}

export const AddToPlaylistButton: React.FC<AddToPlaylistButtonProps> = ({
  trackId,
  variant = 'icon',
}) => {
  const { playlists, addTrackToPlaylist } = usePlaylists();

  const handleAddToPlaylist = (playlistId: string) => {
    addTrackToPlaylist.mutate({ playlistId, trackId });
  };

  if (playlists.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === 'icon' ? (
          <Button size="icon" variant="ghost" className="w-8 h-8">
            <Plus className="w-4 h-4" />
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add to Playlist
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {playlists.map((playlist) => (
          <DropdownMenuItem
            key={playlist.id}
            onClick={() => handleAddToPlaylist(playlist.id)}
          >
            {playlist.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
