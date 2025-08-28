import { IExplainer, IExplainerPodcast, ILike } from "@/interfaces";
import { BookCheck, EllipsisVertical, Heart, MessageCircle, Notebook, Search, Share2, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CommentsPopup from "../explainers/Comments";
import axios from "axios";
import ShareExplainer from "../popups/ShareExplainer";
import { ExplainerType } from "@/utils/constant";


import tailwindConfig from "@/tailwind.config";
import ExplainerSettings from "../popups/ExplainerSettings";
const tailwindColors = tailwindConfig.theme?.extend?.colors;

export default function PodcastBottomContent({podcast, onLike, onDislike, likes}:{podcast:IExplainerPodcast, onLike:CallableFunction, onDislike:CallableFunction,likes:ILike[]}){
    const [commentsPopup, setCommentsPopup] = useState(false)
    const [sharePopup, setSharePopup] = useState(false)
    const [explainerSettingsPopup, setExplainerSettingsPopup] = useState(false)
    const [transcript,setTranscript] = useState()


    const iconActions = [
        {
            label: "Web Search",
            value: "webSearch",
            icon: <Search size={15} />,
            onPress: () => {
                console.log("Web Search pressed");
                // Add your web search logic here
            }
        },
        {
            label: "Flash Cards",
            value: "flashCards",
            icon: <Notebook size={15} />,
            onPress: () => {
                console.log("Flash Cards pressed");
                // Add your flash cards logic here
            }
        },
        {
            label: "Practice Quiz",
            value: "practiceQuiz",
            icon: <BookCheck size={15} />,
            onPress: () => {
                console.log("Practice Quiz pressed");
                // Add your practice quiz logic here
            }
        }
    ];

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
    },[podcast])
    return(
        <View className="flex flex-col gap-2 mt-8">
            {commentsPopup &&(
                <CommentsPopup explainer={podcast as any} onClose={()=>setCommentsPopup(false)} visible={commentsPopup}></CommentsPopup>
            )}
            {sharePopup &&(
                <ShareExplainer explainerType={ExplainerType.PODCAST} visible={sharePopup} onClose={()=>setSharePopup(false)} explainer={podcast as any}></ShareExplainer>
            )}
            {explainerSettingsPopup &&(
                <ExplainerSettings visible={explainerSettingsPopup} onClose={()=>setExplainerSettingsPopup(false)} explainer={podcast as IExplainer}/>
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
            {transcript &&(

                <TouchableOpacity className=" bg-slate-200 border p-4 mt-4 rounded-2xl overflow-hidden h-[400px] border-slate-300">
                    <Text className="text-2xl ">
                        
                        {transcript}
                    </Text>
                </TouchableOpacity>
            )}
            <View className="flex flex-row  mt-8 justify-between gap-4">
                {iconActions.map((icon)=>(
                    <TouchableOpacity className="flex flex-col gap-2 p-3 rounded-xl bg-slate-200 border border-slate-300">
                        <Text className="">{icon.label}</Text>
                        {icon.icon}
                    </TouchableOpacity>
                ))}
            </View>
            
        </View>
    )
}