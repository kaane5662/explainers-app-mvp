import { IExplainerPodcast } from "@/interfaces";
import { BookCheck, Heart, MessageCircle, Notebook, Search, Share2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CommentsPopup from "../explainers/Comments";
import axios from "axios";

export default function PodcastBottomContent({podcast}:{podcast:IExplainerPodcast}){
    const [commentsPopup, setCommentsPopup] = useState(false)
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
              console.log(response.data)
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
            <View className="flex flex-row opacity-50  items-center gap-6">
                
                <TouchableOpacity
                onPress={()=>setCommentsPopup(true)}
                >
                    <MessageCircle size={20}/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Share2 size={20}/>
                </TouchableOpacity>
                <TouchableOpacity className=" ml-auto">
                    <Heart  size={20}/>
                </TouchableOpacity>

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