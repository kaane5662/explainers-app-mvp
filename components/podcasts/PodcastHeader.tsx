import { IExplainerPodcast } from '@/interfaces';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import moment from 'moment';
import PodcastPlayer from '@/components/podcasts/PodcastPlayer';
import clsx from 'clsx';
import { router } from 'expo-router';

export default function PodcastHeader({ podcast, hideControls=false }: { podcast: IExplainerPodcast, hideControls?:boolean }) {
  return (
    <View className="flex flex-col ">
      <View className={clsx(" w-full overflow-hidden rounded-2xl ", !hideControls ?"h-[400px]":"h-fit")}>
        {!hideControls && (
            <View>
            {podcast.thumbnailUrl ? (
              <Image
                className="  h-full w-full"
                source={{ uri: podcast.thumbnailUrl }}
                // resizeMode="cover"
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <View className="h-full w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
            )}
            </View>

        )}
      </View>
      <Text className="mt-2 text-2xl font-semibold">{podcast.title}</Text>
      <TouchableOpacity 
      onPress={()=>router.push(`/profile/${podcast.user.id}`)}
      className="flex flex-row items-center gap-2">
        {podcast.user?.imageUrl ? (
          <Image
            className="h-4 w-4 rounded-full object-left"
            source={{ uri: podcast.user.imageUrl }}
            resizeMode="cover"
          />
        ) : (
          <View className="flex h-4 w-4 items-center justify-center rounded-full bg-blue">
            <Text className="text-xs font-bold text-white">{podcast.user.name.charAt(0)}</Text>
          </View>
        )}
        <Text className="text-sm text-slate-500">{podcast.user.name}</Text>
      </TouchableOpacity>

      <View className="text-md mt-1 flex flex-row gap-2">
        <Text className="text-gray-400">{moment(podcast.created).fromNow()}</Text>
        <Text className="text-gray-400">•</Text>
        <Text className="text-gray-400">
          {podcast.views} {'listens'}
        </Text>
      </View>
      {/* {!hideControls &&(
        <PodcastPlayer podcast={podcast}></PodcastPlayer>
      )} */}
    </View>
  );
}
