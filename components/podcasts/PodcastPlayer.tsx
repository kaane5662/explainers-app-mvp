import { IExplainerPodcast } from "@/interfaces";
import { formatDuration } from "@/utils/time";
import Slider, { SliderComponent } from "@react-native-community/slider";
import { useAudioPlayer, AudioSource, useAudioPlayerStatus, setAudioModeAsync } from "expo-audio";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Text, View } from "react-native";

import tailwindConfig  from "@/tailwind.config";
const tailwindColors = tailwindConfig.theme?.extend?.colors;



export default function PodcastPlayer({podcast}:{podcast:IExplainerPodcast}){
    const durationInS = podcast.sectionAudios[0].duration/1000
    const sliderRef = useRef<Slider>()
    // console.log(podcast.sectionAudios[0].streamUrl)
    
    const player = useAudioPlayer({
        uri: podcast.sectionAudios[0].streamUrl,
        // headers: {
        //     'x-amz-acl': 'public-read'
        // }
    })
    const status = useAudioPlayerStatus(player)

    
    
    
    
    useEffect(()=>{
        const configureAudio = async () => {
        try {
            await setAudioModeAsync({
            
            playsInSilentMode: true,
            
            });
            console.log('Audio mode configured successfully');
        } catch (error) {
            console.log('Error configuring audio mode:', error);
        }
        };
    
        configureAudio();
        
        // return()=>{
        //     player.remove()
        // }
    },[])

    const onPlayPause = async ()=>{
        if(player.playing){
            player.pause()
        }else{
            player.play()
        }
    }

    const onSeekAudio = async(value: number) => {
        if (player) {
            await player.seekTo(value);
        }
    };
    return(
        <View className="flex mt-2 flex-col gap-0">
            <Slider 
            
            ref={sliderRef}
            minimumValue={0}
            maximumValue={durationInS}
            value={player.currentTime}
            thumbTintColor={tailwindColors.blue}
            minimumTrackTintColor={tailwindColors.blue}
            // maximumTrackTintColor="blue"
            step={1}
            onValueChange={onSeekAudio}

            thumbStyle={{ width: 10, height: 10 }}
            >
            </Slider>
            <View className="flex items-center text-sm text-slate-400 flex-row justify-between">
                <Text className=" text-sm text-slate-400">{formatDuration(player.currentTime)}</Text>
                <Text className=" text-sm text-slate-400">{formatDuration(durationInS)}</Text>
            </View>
            <View className=" gap-20 mt-2  self-center flex flex-row items-center">
                <SkipBack fill={"black"}/>
                <View className=" bg-blue rounded-full p-4">
                    {player.playing?(
                        <Pause
                        className=""
                        onPress={onPlayPause}
                        size={30} color={"white"} fill={"white"}/>
                    ):(
                        <Play
                        onPress={onPlayPause}
                        size={30} color={"white"} fill={"white"}/>
                    )}
                    

                </View>
                <SkipForward fill={"black"}/>
            </View>
        </View>
    )
}