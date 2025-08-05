import { IExplainerPodcast } from '@/interfaces';
import axios from 'axios';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { createAudioPlayer, useAudioPlayer } from 'expo-audio';
import PodcastPlayer from '@/components/podcasts/PodcastPlayer';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const [loading,setLoading] = useState(false)
  const [Podcast,setPodcast] = useState<IExplainerPodcast>()
	const player = useAudioPlayer()
  const fetchPodcastDetails = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/podcasts/${id}`);
      console.log(response.data);
			setPodcast(response.data.explainer)
        // setPodcast(response.dataP)
    } catch (error) {
      console.error('Error fetching podcast details:', error);
    }finally{
        setLoading(false)
    }
  };


  useEffect(() => {
    if (id) {
      fetchPodcastDetails();
    }
  }, [id]);

  return (
    <SafeAreaView >
			<View className='p-8'>
				{Podcast && (
					<View className="flex flex-col ">
						<View className="w-full border-2 rounded-2xl overflow-hidden h-[400px] border-gray-200 dark:border-gray-800">
							{Podcast.thumbnailUrl ? (
								<Image
									className='  w-full h-full'
									source={{ uri: Podcast.thumbnailUrl }}
									// resizeMode="cover"
									style={{ width: "100%", height:"100%"}}
								/>
							) : (
								<View className="w-full h-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
							)}
						</View>
						<Text className="text-2xl font-semibold mt-2">{Podcast.title}</Text>
						<View className="flex flex-row gap-2 items-center">
                    {Podcast.user.imageUrl ? (
                        <Image
                            className="rounded-full w-4 h-4 object-left"
                            src={Podcast.user.imageUrl}
                            resizeMode="cover"
                            
                            
                        />
                    ) : (
                        <View className="rounded-full w-4 h-4 bg-blue flex items-center justify-center">
                            <Text className="text-white text-xs font-bold">
                                {Podcast.user.name.charAt(0)}
                            </Text>
                        </View>
                    )}
                    <Text className="text-slate-500 text-sm">{Podcast.user.name}</Text>
            </View>
						
						<View className="text-md flex flex-row gap-2 mt-1">
							<Text className="text-gray-400">
								{moment(Podcast.created).fromNow()}
							</Text>
							<Text className="text-gray-400">•</Text>
							<Text className="text-gray-400">
								{Podcast.views} {"listens"}
							</Text>
						</View>
						<PodcastPlayer podcast={Podcast}></PodcastPlayer>
					</View>
				)}
			</View>
    </SafeAreaView>
  );
}