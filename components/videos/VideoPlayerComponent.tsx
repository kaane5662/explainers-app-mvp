// import React, { useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
// import { View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import clsx from 'clsx';

export interface VideoPlayerRef {
  captureCurrentFrame: () => Promise<string | null>;
  getCurrentTime: () => number;
  onSeek: (time: number) => void;
  onPlayPause: () => boolean;
}

interface VideoPlayerComponentProps {
  videoUri: string;
}

const VideoPlayerComponent = forwardRef<VideoPlayerRef, VideoPlayerComponentProps>(({ videoUri }, ref) => {
  const player = useVideoPlayer(videoUri);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      // Cleanup if necessary
    };
  }, []);

  const captureCurrentFrame = async (): Promise<string | null> => {
    // Implement frame capture logic if applicable
    return null;
  };

  const getCurrentTime = (): number => {
    return playerRef.current?.getCurrentTime() || 0;
  };

  const onSeek = (currentTime: number) => {
    if (playerRef.current) {
      playerRef.current.seek(currentTime);
    }
  };

  const onPlayPause = (): boolean => {
    if (playerRef.current) {
      if (playerRef.current.isPlaying()) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
      return !playerRef.current.isPlaying();
    }
    return false;
  };

  useImperativeHandle(ref, () => ({
    captureCurrentFrame,
    getCurrentTime,
    onSeek,
    onPlayPause,
  }));

  return (
    <View className={clsx('relative w-full h-full bg-black')}>
      <VideoView
        
        ref={playerRef}
        player={player}
        // className="w-full h-full"
        nativeControls={false}
      />
    </View>
  );
});

export default VideoPlayerComponent