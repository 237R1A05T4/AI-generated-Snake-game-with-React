import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "ERR_NO_SIGNAL",
    artist: "SYS.ADMIN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "DATA_CORRUPTION",
    artist: "NULL_PTR",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "MEMORY_LEAK",
    artist: "0xDEADBEEF",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="flex flex-col p-6 bg-black border-4 border-[#f0f] box-glitch w-full max-w-sm">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
        preload="auto"
      />

      <div className="flex items-center gap-4 mb-8 border-b-4 border-[#0ff] pb-6">
        <div className={`relative w-20 h-20 bg-black border-4 border-[#0ff] flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
          <div className="text-[#f0f] text-4xl font-black">
            {isPlaying ? '>>' : '||'}
          </div>
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-xl text-[#0ff] tracking-widest mb-1">AUDIO_STREAM</span>
          <h3 className="text-2xl font-bold text-[#f0f] truncate glitch" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-xl text-[#0ff] truncate">
            SRC: {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <button
          onClick={prevTrack}
          className="px-4 py-2 bg-black border-4 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black transition-colors text-xl"
        >
          [PREV]
        </button>
        
        <button
          onClick={togglePlay}
          className="px-6 py-2 bg-black border-4 border-[#f0f] text-[#f0f] hover:bg-[#f0f] hover:text-black transition-colors text-2xl font-bold"
        >
          {isPlaying ? 'HALT' : 'EXEC'}
        </button>

        <button
          onClick={nextTrack}
          className="px-4 py-2 bg-black border-4 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black transition-colors text-xl"
        >
          [NEXT]
        </button>
      </div>

      <div className="flex items-center gap-4 px-2">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="text-[#f0f] hover:text-[#0ff] transition-colors text-xl whitespace-nowrap"
        >
          {isMuted || volume === 0 ? 'VOL: MUTED' : 'VOL: ACTIVE'}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            if (isMuted) setIsMuted(false);
          }}
          className="w-full h-4 bg-black border-2 border-[#0ff] appearance-none cursor-pointer accent-[#f0f]"
        />
      </div>
    </div>
  );
}
