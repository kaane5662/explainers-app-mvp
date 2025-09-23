import { IExplainerPodcast } from "@/interfaces";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { Circle } from "lucide-react-native";
import moment from "moment";
import { View,Text, TouchableOpacity } from "react-native";

export default function PodcastThumbnail2({podcast}:{podcast:IExplainerPodcast}){
    return(
        <Link 
        href={`/podcasts/${podcast.id}`}>
        <View
        className="flex flex-row gap-4 items-center w-full">
            <Image style={{ borderRadius: 12, width: 75, height: 75 }} source={podcast.thumbnailUrl} contentFit="cover" />

            <View className="flex flex-col gap-2">
                <TouchableOpacity 
                onPress={()=>router.push(`/profile/${podcast.user.id}`)}
                className="flex flex-row gap-2 items-center">
                    {podcast.user.imageUrl ? (
                        <Image
                            style={{ borderRadius: 5, width: 14, height: 14 }}
                            source={podcast.user.imageUrl}
                            contentFit="cover"
                            
                            
                        />
                    ) : (
                        <View className="rounded-full w-4 h-4 bg-blue flex items-center justify-center">
                            <Text className="text-white text-xs font-bold">
                                {podcast.user.name.charAt(0)}
                            </Text>
                        </View>
                    )}
                    <Text className="text-slate-500 text-sm">{podcast.user.name}</Text>
                </TouchableOpacity>
                <Text className="text-xl font-semibold max-w-[85%] -mt-2" numberOfLines={2} ellipsizeMode="tail">{podcast.title}</Text>
                <View className="flex flex-row gap-2 items-center flex-wrap">
                    <Text className="text-md text-slate-500 flex-shrink">{moment(podcast.created).fromNow()}</Text>
                    <View className="rounded-full w-1 h-1 bg-slate-500"></View>
                    <Text className="text-md text-slate-500 flex-shrink">{podcast.views} listens</Text>
                </View>
            </View>
        </View>
        </Link>
    )
}