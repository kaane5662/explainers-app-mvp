import { IExplainer, IExplainerPodcast, ILike } from "@/interfaces";
import { BookCheck, EllipsisVertical, Heart, MessageCircle, Notebook, Search, Share2, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, ScrollView} from "react-native";
import CommentsPopup from "../explainers/Comments";
import axios from "axios";
import ShareExplainer from "../popups/ShareExplainer";
import { ExplainerType, iconActions } from "@/utils/constant";


import tailwindConfig from "@/tailwind.config";
import ExplainerSettings from "../popups/ExplainerSettings";
import Comments from "../explainers/Comments";
import { useUser } from "@/hooks/useUser";
import { LinearGradient } from "react-native-svg";
import { BlurView } from "expo-blur";
import WebSearchResults from "../popups/WebSearchResults";

const tailwindColors = tailwindConfig.theme?.extend?.colors;

interface SubtitleEntry {
    id: number;
    startTime: number; // in milliseconds
    endTime: number;   // in milliseconds
    text: string;
}

export default function PodcastBottomContent({podcast, onLike, onDislike, likes, currentTime}:{podcast:IExplainerPodcast, onLike:CallableFunction, onDislike:CallableFunction,likes:ILike[], currentTime:number}){
    const [commentsPopup, setCommentsPopup] = useState(false)
    const [sharePopup, setSharePopup] = useState(false)
    const [explainerSettingsPopup, setExplainerSettingsPopup] = useState(false)
    const [srtTranscript,setSrtTranscript] = useState<string|null>()
    const {user} = useUser()
    const [transcript,setTranscript] = useState()
    const [visiblePopup,setVisiblePopup] = useState<string|null>()
    const [subtitleEntries, setSubtitleEntries] = useState<SubtitleEntry[]>([])
    // console.log("current time from bottom", currentTime)
    
    function toMilliseconds(timestamp:string) {
        const [hours, minutes, rest] = timestamp.split(":");
        const [seconds, millis] = rest.split(",");
        return (
          parseInt(hours) * 3600000 +
          parseInt(minutes) * 60000 +
          parseInt(seconds) * 1000 +
          parseInt(millis)
        );
    }

    const parseSrt =(rawSrt:string)=>{
        // console.log(rawSrt)
        const entries = []
        let blocks = rawSrt.trim().split("\n\n")
        for(let block of blocks){
            let lines = block.split("\n")
            
            let entryId = parseInt(lines[0]);
            let times = lines[1].split(" ");
            let start = toMilliseconds(times[0]);
            let end = toMilliseconds(times[times.length - 1]);
            let text = lines.slice(2).join(" ").trim();
            
            entries.push({
                id: entryId,
                startTime: start,
                endTime: end,
                text: text
            });       

        }
        setSubtitleEntries(entries)

    }

    useEffect(()=>{
        console.log("change in srt")
        const fetchSrt = async()=>{
            // console.log("helo", podcast)
            if(!podcast.subtitleUrl) return
            

            let response = await fetch(podcast.subtitleUrl)
            const srtContent = await response.text();
            setSrtTranscript(srtContent)
            // console.log(srtContent)
            parseSrt(srtContent)
            
        }
        setSrtTranscript(null)
        fetchSrt()
    },[podcast])

    

    // const iconActions = [
    //     {
    //         label: "Web Search",
    //         value: "webSearch",
    //         icon: <Search size={18} />,
    //         color: "#FFB3BA", // darker pastel pink
    //         onPress: () => {
    //             console.log("Web Search pressed");
    //             setVisiblePopup("webSearch")
    //             // Add your web search logic here
    //         },
    //         popup: <WebSearchResults visible={true} id={podcast.id} explainerType={ExplainerType.PODCAST} onClose={()=>setVisiblePopup(null)}></WebSearchResults>
    //     },
    //     {
    //         label: "Flash Cards",
    //         value: "flashCards",
    //         icon: <Notebook size={18} />,
    //         color: "#B3E5B3", // darker pastel green
    //         onPress: () => {
    //             console.log("Flash Cards pressed");
    //             setVisiblePopup("flashCards")
    //             // Add your flash cards logic here
    //         },
    //         popup: <WebSearchResults visible={true} id={podcast.id} explainerType={ExplainerType.PODCAST} onClose={()=>setVisiblePopup(null)}></WebSearchResults>
    //     },
    //     {
    //         label: "Practice Quiz",
    //         value: "practiceQuiz",
    //         icon: <BookCheck size={18} />,
    //         color: "#B3C6FF", // darker pastel blue
    //         onPress: () => {
    //             console.log("Practice Quiz pressed");
    //             // Add your practice quiz logic here
    //         }
    //     }
    // ];

    useEffect(()=>{
        const fetchTranscript = async () => {
            try {
              const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/podcasts/${podcast.id}/transcript`);
            //   console.log(response.data)
              setTranscript(response.data.transcript.join("\n"));
            } catch (error) {
              console.error('Error fetching comments:', error);
            }
          };
      
          fetchTranscript();  
    },[podcast.id])
    return(
        <View className="flex flex-col gap-2 mt-8">
            {commentsPopup &&(
                <Comments user={user} id={podcast.id} isPodcast={true} onClose={()=>setCommentsPopup(false)} visible={commentsPopup}/>
            )}
            {sharePopup &&(
                <ShareExplainer explainerType={ExplainerType.PODCAST} visible={sharePopup} onClose={()=>setSharePopup(false)} explainer={podcast as any}></ShareExplainer>
            )}
            {explainerSettingsPopup &&(
                <ExplainerSettings explainerType={ExplainerType.PODCAST} visible={explainerSettingsPopup} onClose={()=>setExplainerSettingsPopup(false)} explainer={podcast as IExplainer}/>
            )}
            <View className="flex flex-row items-center gap-6">
                
                <TouchableOpacity
                onPress={()=>setCommentsPopup(true)}
                >
                    <MessageCircle size={20}/>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=>setSharePopup(true)}
                >
                    <Share2 size={20}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>onLike()} className=" ml-auto">
                    <Heart size={20} color={likes.some((l) => l.id === podcast.id) ? tailwindColors.blue : "black"} fill={likes.some((l) => l.id === podcast.id) ? tailwindColors.blue : "none"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setExplainerSettingsPopup(true)} className="">
                    <EllipsisVertical size={20} />
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={()=>onDislike()} className=" ml-auto">
                    <X  size={20}/>
                </TouchableOpacity> */}

            </View>
            
            
              <View className=" bg-slate-200 h-[400px] border p-4 mt-4 rounded-2xl border-slate-300 overflow-hidden relative" >
                <ScrollView
                ref={(ref) => {
                    if (ref && srtTranscript && subtitleEntries.length > 0) {
                        let scrollPosition = 0;
                        let currentSubtitleIndex = -1;
                        
                        for (let i = 0; i < subtitleEntries.length; i++) {
                            if (currentTime * 1000 >= subtitleEntries[i].startTime && currentTime * 1000 <= subtitleEntries[i].endTime) {
                                currentSubtitleIndex = i;
                                break;
                            }
                            // Estimate height based on text length (approximate 20px per line, ~50 chars per line)
                            const estimatedLines = Math.ceil(subtitleEntries[i].text.length / 35);
                            scrollPosition += estimatedLines * 26;
                        }
                        
                        if (currentSubtitleIndex >= 0) {
                            // Add some padding and ensure we don't scroll past content
                            scrollPosition = Math.max(0, scrollPosition - 50);
                            ref.scrollTo({ y: scrollPosition, animated: true });
                        }
                    }
                }}
                >

                    <Text className="text-2xl">
                    {!srtTranscript ? (
                        <Text className="text-black">{transcript}</Text>
                    ) : (
                        subtitleEntries.map((s) => (
                        <Text key={s.startTime} className={currentTime * 1000 >= s.startTime ? "text-black" : "text-slate-300"}>
                            {s.text+" "} 
                        </Text>
                        ))
                    )}
                    </Text>
                </ScrollView>
              </View>
            
            <View className="flex flex-col bg-slate-200 border-slate-300 border p-4 rounded-2xl  mt-8 justify-between gap-4">
                <Text className="font-semibold text-xl">Resources</Text>
                <View className="flex gap-2">

                    {iconActions.map((icon)=>(
                        <>
                            {visiblePopup == icon.value &&(
                                icon.popup(podcast.id,ExplainerType.PODCAST,()=>setVisiblePopup(null))
                            )}
                            <TouchableOpacity
                            onPress={()=>setVisiblePopup(icon.value)}
                            key={icon.color}
                            style={{backgroundColor:icon.color} as any}
                            className="flex flex-row items-center gap-2 p-5 rounded-xl border-slate-400 ">
                                <Text className="font-semibold">{icon.label}</Text>
                                <View className="ml-auto">

                                {icon.icon} 
                                </View>
                            </TouchableOpacity>
                        </>
                    ))}
                </View>
            </View>
            
        </View>
    )
}





