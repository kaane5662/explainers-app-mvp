import { IExplainerPodcast } from "@/interfaces";
import { Link, router } from "expo-router";
import { Circle } from "lucide-react-native";
import moment from "moment";
import { View,Image,Text, TouchableOpacity } from "react-native";

export default function PodcastThumbnailSkeleton() {
    return (
        <View className="flex flex-row gap-4 items-center w-full animate-pulse">
            <View className="rounded-xl w-[75px] h-[75px] bg-slate-200" />

            <View className="flex flex-col gap-2">
                <View className="flex flex-row gap-2 items-center">
                    <View className="rounded-full w-4 h-4 bg-slate-200" />
                    <View className="h-4 w-20 bg-slate-200 rounded-md" />
                </View>
                <View className="h-6 w-3/4 bg-slate-200 rounded-md" />
                <View className="flex flex-row gap-2 items-center flex-wrap">
                    <View className="h-4 w-16 bg-slate-200 rounded-md" />
                    <View className="rounded-full w-1 h-1 bg-slate-200"></View>
                    <View className="h-4 w-16 bg-slate-200 rounded-md" />
                </View>
            </View>
        </View>
    );
}