import { IExplainerPodcast, IExplainerVideo } from "@/interfaces";
import { router } from "expo-router";
import { Circle } from "lucide-react-native";
import moment from "moment";
import { View,Image,Text, TouchableOpacity } from "react-native";

export default function VideoThumbnail({video}:{video:IExplainerVideo}){
    return(
        <TouchableOpacity 
        onPress={()=>{
            console.log(video)
            router.push(`/reels/${video.id}`)
        }
            }
        className="flex flex-col  gap-4 ">
            <Image className="rounded-xl h-fit aspect-video" src={video.thumbnailUrl} resizeMode="cover" />

            <View className="flex gap-2">
                <View className="flex flex-row gap-2 items-center">
                    {video.user.imageUrl ? (
                        <Image
                            className="rounded-full w-4 h-4 object-left"
                            src={video.user.imageUrl}
                            resizeMode="cover"
                            
                            
                        />
                    ) : (
                        <View className="rounded-full w-4 h-4 bg-blue flex items-center justify-center">
                            <Text className="text-white text-xs font-bold">
                                {video.user.name.charAt(0)}
                            </Text>
                        </View>
                    )}
                    <Text className="text-slate-500 text-sm">{video.user.name}</Text>
                </View>
                <Text className="text-xl w-fit font-semibold -mt-2">{video.title}</Text>
                <View className="flex flex-row gap-2 items-center flex-wrap">
                    <Text className="text-md text-slate-500 flex-shrink">{moment(video.created).fromNow()}</Text>
                    <View className="rounded-full w-1 h-1 bg-slate-500"></View>
                    <Text className="text-md text-slate-500 flex-shrink">{video.views} listens</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}