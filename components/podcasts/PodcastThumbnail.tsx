import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
// import { Headphones, Loader } from "lucide-react-native";
// import moment from "moment";
// import { formatTime } from "@components/util/dates";
// import { IExplainerPodcast } from "src/interfaces";
import clsx from "clsx";
import { IExplainerPodcast } from "@/interfaces";
import moment from "moment";


interface PodcastThumbnailProps {
  podcast: IExplainerPodcast;
  className?: string;
}

export const PodcastThumbnail: React.FC<PodcastThumbnailProps> = ({
  podcast,
}) => {
  // Get duration from the single audio source
  console.log("Rendering PodcastThumbnail");

  let length = podcast.sectionAudios?.[0]?.duration || 0;
    
  return (
    <TouchableOpacity
      onPress={() => {
        // Handle navigation to podcast details
      }}
      className={clsx("flex flex-col gap-2 h-fit group")}
    >
      <View
        className={clsx(
          "w-full h-[175px]",
          "border-2 border-gray-200 dark:border-gray-800",
          "rounded-xl overflow-hidden",
          "relative"
        )}
      >
        {podcast.generating && (
          <View className="absolute top-0 left-0 inset-0 flex items-center justify-center">
            {/* <Loader className="animate-spin text-blue" /> */}
          </View>
        )}
        {podcast?.watchedDuration &&
          podcast.watchedDuration > 0 &&
          podcast.sectionAudios[0].duration && (
            <View className="absolute bottom-0 left-0 w-full bg-black/50 h-1">
              <View
                className="bg-blue h-full"
                style={{
                  width: `${
                    (podcast.watchedDuration /
                      podcast.sectionAudios[0].duration) *
                    100
                  }%`,
                }}
              />
            </View>
          )}

        {podcast.thumbnailUrl ? (
          <Image
            source={{ uri: podcast.thumbnailUrl }}
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <View className="w-full h-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
        )}

        <View className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {/* <Headphones className="w-12 h-12 text-white" /> */}
        </View>

        <View className="absolute bottom-2 right-2 bg-black/30 text-white px-2 py-0.5 rounded-md z-20">
          <Text className="text-xs">
            {/* {formatTime(Math.floor((length || 0) / 1000))} */}
          </Text>
        </View>

        <View className="absolute top-2 right-2 bg-black/30 rounded-full p-0 px-2">
          <Text className="text-white text-sm">{"Label"}</Text>
        </View>
      </View>

      <View className="w-full">
        <Text className="text-xl font-semibold truncate overflow-hidden">
          {podcast.title}
        </Text>
        <Text className="text-md text-gray-400">{podcast.user.name}</Text>
        <View className="text-md flex flex-row gap-2">
          <Text className=" text-gray-400">
        
            {moment(podcast.created).fromNow()}
          </Text>
          <Text className="text-gray-400">•</Text>
          <Text className=" text-gray-400">
            {podcast.views} {"Views"}
          </Text>
        </View>
        
      </View>
    </TouchableOpacity>
  );
};
