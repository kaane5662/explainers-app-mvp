import { IExplainerPodcast } from "@/interfaces";
import { formatDuration } from "@/utils/time";
import Slider, { SliderComponent } from "@react-native-community/slider";
import { useAudioPlayer, AudioSource, useAudioPlayerStatus, setAudioModeAsync } from "expo-audio";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import tailwindConfig  from "@/tailwind.config";
import TrackPlayer, { State, usePlaybackState, useProgress } from "react-native-track-player";
const tailwindColors = tailwindConfig.theme?.extend?.colors;



export default function PodcastPlayer({podcast, onSkipPodcast, onTimeUpdate}:{podcast:IExplainerPodcast, onSkipPodcast:CallableFunction, onTimeUpdate:CallableFunction}){
    const durationInS = podcast.sectionAudios[0].duration/1000
    const sliderRef = useRef<Slider>()
    const progress = useProgress()
    const playState = usePlaybackState()
    // console.log(podcast.sectionAudios[0].streamUrl)
    
    // const player = useAudioPlayer({
    //     uri: podcast.sectionAudios[0].streamUrl,
    //     // headers: {
    //     //     'x-amz-acl': 'public-read'
    //     // }
    // })
    // const status = useAudioPlayerStatus(player)

    // useEffect(()=>{
    //     onTimeUpdate(status.currentTime)
    // },[status.currentTime])
    
    
    
    // useEffect(()=>{
    //     const configureAudio = async () => {
    //     try {
    //         await setAudioModeAsync({
            
    //         playsInSilentMode: true,
    //         shouldPlayInBackground:true,
            
            
            
    //         });
    //         console.log('Audio mode configured successfully');
    //         // player.play()
    //     } catch (error) {
    //         console.log('Error configuring audio mode:', error);
    //     }
    //     };
    
    //     // configureAudio();
        
    //     // return()=>{
    //     //     player.remove()
    //     // }
    // },[podcast])

    const onPlayPause = async ()=>{
        if(playState.state == State.Playing){
            await TrackPlayer.pause()
        }else{
            await TrackPlayer.play()
        }
    }

    const onSeekAudio = async(value: number) => {
        if (TrackPlayer) {
            await TrackPlayer.seekTo(value);
        }
    };
    return(
        <View className="flex mt-2 flex-col gap-0">
            <Slider 
            
            ref={sliderRef}
            minimumValue={0}
            maximumValue={progress.duration}
            value={progress.position}
            thumbTintColor={tailwindColors.blue}
            minimumTrackTintColor={tailwindColors.blue}
            // maximumTrackTintColor="blue"
            step={1}
            onValueChange={onSeekAudio}

            thumbStyle={{ width: 10, height: 10 }}
            >
            </Slider>
            <View className="flex items-center text-sm text-slate-400 flex-row justify-between">
                <Text className=" text-sm text-slate-400">{formatDuration(progress.position)}</Text>
                <Text className=" text-sm text-slate-400">{formatDuration(progress.duration)}</Text>
            </View>
            <View className=" gap-20 mt-2  self-center flex flex-row items-center">
                <TouchableOpacity className=" active:bg-slate-300 rounded-full p-2" onPress={()=>onSkipPodcast(-1)}>
                    <SkipBack fill={"black"}/>
                </TouchableOpacity>
                <TouchableOpacity className=" bg-blue rounded-full p-4">
                    {playState.state == State.Playing || playState.state == State.Buffering?(
                        <Pause
                        className=""
                        onPress={onPlayPause}
                        size={30} color={"white"} fill={"white"}/>
                    ):(
                        <Play
                        onPress={onPlayPause}
                        size={30} color={"white"} fill={"white"}/>
                    )}
                    

                </TouchableOpacity>
                <TouchableOpacity className="p-2 active:bg-slate-300 rounded-full" onPress={()=>onSkipPodcast(1)}>
                    <SkipForward fill={"black"}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}