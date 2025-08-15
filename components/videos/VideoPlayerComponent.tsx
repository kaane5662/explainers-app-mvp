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
  // console.log("Video component", videoUri)
  const player = useVideoPlayer("https://customer-byoxbsa3xbt3c5ht.cloudflarestream.com/8b2223468882afe06f518d613ff4f4ee/manifest/video.m3u8",

    player=>{player.play()}
  );
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
    // console.log(player.currentTime)
    return player.currentTime
  };

  const onSeek = (currentTime: number) => {
    player.currentTime = currentTime
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
    <View className={clsx('w-full h-full bg-black')}>
      <VideoView
        className='w-screen h-screen'
        ref={playerRef}
        player={player}
        style={{
          width:"100%",
          height:"100%"
        }}
        // className="w-full h-full"
        nativeControls={false}
      />
    </View>
  );
});

export default VideoPlayerComponent