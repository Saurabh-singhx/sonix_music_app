import React, { useRef, useState, useEffect, useCallback } from "react";
import type { ReactNode, MouseEventHandler, UIEvent } from "react";
import { motion, useInView } from 'motion/react';
import './AnimatedList.css';
import type { song } from "@/types/user.types";
import { formattedDate } from "@/helpers/user.helpers";
interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      style={{ marginBottom: '1rem', cursor: 'pointer' }}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps {
  items?: song[];
  onItemSelect?: (item: song, index: number) => void;

  loadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;

  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
  playing: boolean;
  currentTime: string;
  duration: number;
  playlistSelect?:boolean;

  onPlaylistSongAdd?:(item:song)=>void;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  items,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  displayScrollbar = true,
  initialSelectedIndex = -1,
  playing,
  hasMore,
  loadMore,
  loading,
  playlistSelect = false,
  onPlaylistSongAdd

}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState<boolean>(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);
  const handleItemClick = useCallback(
    (item: song, index: number) => {
      setSelectedIndex(index);

      if (onItemSelect && !playlistSelect) {
        onItemSelect(item, index);
      }
    },
    [onItemSelect]
  );

  const handleScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
    if (bottomDistance < 200 && hasMore && !loading) {
      loadMore?.();
    }

  }, [hasMore, loading, loadMore]);

  useEffect(() => {
    if (!enableArrowNavigation || !items) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement | null;
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: 'smooth'
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  const handlePlaylistSongAdd = (item:song) =>{
    if(onPlaylistSongAdd){
      onPlaylistSongAdd(item)
    }
  }

  return (
    <div className={`scroll-list-container ${className}`}>
      <div ref={listRef}className={`scroll-list ${!displayScrollbar ? 'no-scrollbar' : ''} h-[100%]`} onScroll={handleScroll}>
        {items?.map((track, index) => {
          const isActive =  selectedIndex === index;
          return (
            <AnimatedItem
              key={index}
              delay={0.1}
              index={index}
              // onMouseEnter={() => handleItemMouseEnter(index)}
              onClick={() => handleItemClick(track, index)}
            >
              {/* <div className={`item ${selectedIndex === index ? 'selected' : ''} ${itemClassName} `}>
              <p className="item-text">{item.song_title}</p>
            </div> */}

              <motion.div
                key={track.song_id}
                layout
                className={`
                              w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left group relative overflow-hidden
                              ${isActive
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-accent/50 border border-transparent'
                  }
                            `}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                  />
                )}

                {/* Track Number / Visualizer */}
                <div className={`
                              w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-medium text-sm
                              ${isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground group-hover:bg-background'
                  }
                            `}>
                  {isActive && playing ? (
                    <div className="flex gap-0.5 items-end h-4">
                      {[1, 2, 3].map(i => (
                        <motion.div
                          key={i}
                          animate={{ height: [4, 16, 8, 16, 4] }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut"
                          }}
                          className="w-1 bg-current rounded-full"
                        />
                      ))}
                    </div>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Track Details */}
                <div className="min-w-0 flex-1">
                  <p className={`font-semibold truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>
                    {track.song_title}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {track.artist.artist_name}
                  </p>
                </div>

                {/* Duration / Options */}
                {
                  !playlistSelect &&(<div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {formattedDate(track.release_date)}
                  </span>
                  {/* <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button> */}
                </div>)
                }

                {
                  playlistSelect &&(
                    <div>
                      <button
                      onClick={()=>handlePlaylistSongAdd(track)}
                      className="py-2 px-4 bg-primary-foreground text-white rounded-3xl hover:bg-white hover:text-black"
                      >
                        Add
                      </button>
                    </div>
                  )
                }
              </motion.div>
            </AnimatedItem>
          )
        })}
      </div>
      {showGradients && (
        <>
          <div className="top-gradient" style={{ opacity: topGradientOpacity }}></div>
          <div className="bottom-gradient" style={{ opacity: bottomGradientOpacity }}>
          </div>
        </>
      )}
    </div>
  );
};

export default AnimatedList;
