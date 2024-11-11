import React, { useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, currentTime, onTimeUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 0.5) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current?.paused) {
      videoRef.current.play();
    } else {
      videoRef.current?.pause();
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-black h-full">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        src={videoUrl}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => skipTime(-10)}
            className="p-1 text-white hover:text-blue-400 transition-colors"
          >
            <SkipBack size={20} />
          </button>
          <button
            onClick={handlePlayPause}
            className="p-1 text-white hover:text-blue-400 transition-colors"
          >
            <Play size={20} />
          </button>
          <button
            onClick={() => skipTime(10)}
            className="p-1 text-white hover:text-blue-400 transition-colors"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;