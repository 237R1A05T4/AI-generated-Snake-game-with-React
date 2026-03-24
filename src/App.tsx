import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#0ff] font-sans flex flex-col items-center justify-center p-4 relative tear">
      <div className="static-overlay" />
      <div className="scanlines" />

      <header className="mb-12 text-center z-10 w-full">
        <h1 className="text-6xl md:text-8xl font-black glitch tracking-widest" data-text="SYS.SNAKE_PROTOCOL">
          SYS.SNAKE_PROTOCOL
        </h1>
        <p className="text-[#f0f] text-2xl mt-4 animate-pulse tracking-widest">
          &gt; STATUS: ONLINE // AWAITING_INPUT_
        </p>
      </header>

      <main className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start justify-center w-full max-w-6xl z-10">
        <div className="flex-1 flex justify-center lg:justify-end w-full">
          <SnakeGame />
        </div>
        <div className="flex-1 flex justify-center lg:justify-start w-full">
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
