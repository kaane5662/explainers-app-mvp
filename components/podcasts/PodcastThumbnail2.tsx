import { IExplainerPodcast } from "@/interfaces";
import { Circle } from "lucide-react-native";
import moment from "moment";
import { View,Image,Text } from "react-native";

export default function PodcastThumbnail2({podcast}:{podcast:IExplainerPodcast}){
    return(
        <View className="flex flex-row gap-4 items-center w-full">
            <Image className="rounded-xl w-[75px] h-[75px]" src={podcast.thumbnailUrl} resizeMode="cover" />

            <View className="flex flex-col flex-1 gap-2">
                <View className="flex flex-row gap-2 items-center">
                    {podcast.user.imageUrl ? (
                        <Image
                            className="rounded-full w-4 h-4 object-left"
                            src={podcast.user.imageUrl}
                            resizeMode="cover"
                            
                            
                        />
                    ) : (
                        <View className="rounded-full w-4 h-4 bg-blue flex items-center justify-center">
                            <Text className="text-white text-xs font-bold">
                                {podcast.user.name.charAt(0)}
                            </Text>
                        </View>
                    )}
                    <Text className="text-slate-500 text-sm">{podcast.user.name}</Text>
                </View>
                <Text className="text-xl w-fit font-semibold -mt-2">{podcast.title}</Text>
                <View className="flex flex-row gap-2 items-center flex-wrap">
                    <Text className="text-md text-slate-500 flex-shrink">{moment(podcast.created).fromNow()}</Text>
                    <View className="rounded-full w-1 h-1 bg-slate-500"></View>
                    <Text className="text-md text-slate-500 flex-shrink">{podcast.views} listens</Text>
                </View>
            </View>
        </View>
    )
}