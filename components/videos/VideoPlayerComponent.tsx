// import React, { useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import React, { useRef, useImperativeHandle, forwardRef, useEffect, use } from 'react';
// import { View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import clsx from 'clsx';
import { useEvent, useEventListener } from 'expo';

export interface VideoPlayerRef {
  captureCurrentFrame: () => Promise<string | null>;
  getCurrentTime: () => number;
  onSeek: (time: number) => void;
  onPlayPause: () => boolean;
  isPlaying: () => boolean;
}

interface VideoPlayerComponentProps {
  videoUri: string;
  onTimeChange:CallableFunction
  // isPreloading:boolean
}

const VideoPlayerComponent = forwardRef<VideoPlayerRef, VideoPlayerComponentProps>(({ videoUri, onTimeChange }, ref) => {
  // console.log("Video component", videoUri)
  const player = useVideoPlayer(videoUri, (p) => {
    p.play();
    p.loop = true
    p.timeUpdateEventInterval =1
  });
 
  useEventListener(player, 'timeUpdate', ({ currentTime }) => {
    // console.log('Player is changing time:', currentTime);
    onTimeChange(currentTime)
  });
  
  const playerRef = useRef<any>(null);


  const captureCurrentFrame = async (): Promise<string | null> => {
    return null;
  };

  const getCurrentTime = (): number => {
    return player.currentTime
  };
  const isPlaying = (): boolean => {
    return player.playing;
  };

  const onSeek = (currentTime: number) => {
    player.currentTime = currentTime;
  };

  const onPlayPause = (): boolean => {
    if (player.playing) {
      player.pause();
      return false
    } else {
      player.play();
      return true
    }
  };

  useImperativeHandle(ref, () => ({
    captureCurrentFrame,
    getCurrentTime,
    onSeek,
    isPlaying,
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
          height:"100%",
          zIndex:10
        }}
        // className="w-full h-full"
        nativeControls={false}
      />
    </View>
  );
});

export default VideoPlayerComponent