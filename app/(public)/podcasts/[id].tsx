import { IExplainerPodcast } from '@/interfaces';
import axios from 'axios';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { createAudioPlayer, useAudioPlayer } from 'expo-audio';
import PodcastPlayer from '@/components/podcasts/PodcastPlayer';
import PodcastHeader from '@/components/podcasts/PodcastHeader';
import Generating from '@/components/explainers/Generating';
import { ExplainerType } from '@/utils/constant';

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

  if(Podcast?.generating) return(
    <SafeAreaView>
        <Generating explainerType={ExplainerType.PODCAST} explainer={Podcast as any}></Generating>
    </SafeAreaView>
  )

  return (
    <SafeAreaView >
			<View className='p-8'>
				{Podcast && (
					<PodcastHeader podcast={Podcast}/>
				)}
			</View>
    </SafeAreaView>
  );
}