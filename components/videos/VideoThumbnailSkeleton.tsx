import { IExplainerPodcast, IExplainerVideo } from "@/interfaces";
import { router } from "expo-router";
import { Circle } from "lucide-react-native";
import moment from "moment";
import { View,Image,Text, TouchableOpacity } from "react-native";

export default function VideoThumbnailSkeleton(){
    return(
        <View className="flex flex-col gap-4 rounded-xl relative animate-pulse">
            <View className="rounded-xl h-fit aspect-square z-10 bg-slate-200" />

            <View className="flex gap-2 z-20">
                <View className="h-6 w-3/4 bg-slate-200 rounded-md" />
                <View className="flex flex-row gap-1.5 items-center flex-wrap">
                    <View className="flex flex-row gap-2 items-center">
                        <View className="rounded-full w-4 h-4 bg-slate-200" />
                        <View className="h-4 w-20 bg-slate-200 rounded-md" />
                    </View>
                    <View className="w-1 h-1 rounded-full bg-slate-200"></View>
                    <View className="h-4 w-16 bg-slate-200 rounded-md" />
                    <View className="rounded-full w-1 h-1 bg-slate-200"></View>
                    <View className="h-4 w-16 bg-slate-200 rounded-md" />
                </View>
            </View>
        </View>
    )
}