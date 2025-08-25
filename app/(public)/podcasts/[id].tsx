import { IExplainerPodcast, IExplainerVideo } from '@/interfaces';
import axios from 'axios';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { createAudioPlayer, useAudioPlayer } from 'expo-audio';
import PodcastPlayer from '@/components/podcasts/PodcastPlayer';
import PodcastHeader from '@/components/podcasts/PodcastHeader';
import Generating from '@/components/explainers/Generating';
import { ExplainerType } from '@/utils/constant';
import PodcastBottomContent from '@/components/podcasts/PodcastBottomContent';
// import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const [loading,setLoading] = useState(false)
  const [podcasts,setPodcasts] = useState<IExplainerPodcast[]>()
  const [podcast,setPodcast] = useState<IExplainerPodcast>()
  const [currentPodcastIndex,setCurrentPodcastIndex] = useState(0)
  const [canChange,setCanChange] = useState(true)
	const player = useAudioPlayer()
  const fetchPodcastDetails = async () => {
    setLoading(true)
    try {
      const podcastPromise =  axios.get(`${process.env.EXPO_PUBLIC_API_URL}/podcasts/${id}`);
      const reccsPromise = axios.get(`${process.env.EXPO_PUBLIC_API_URL}/explainers/${id}/recommendations?explainerType=${ExplainerType.PODCAST}&type=podcast`)
      const [podcast, reccs] = await Promise.all([podcastPromise,reccsPromise])
      
      setPodcast(podcast.data.explainer)
      // console.log("Reccs",reccs.data.explainers.map((r)=>(r.id || "hahaha")))
      // console.log(response.data);
      let temp = [podcast.data.explainer, ...reccs.data.explainers]
			setPodcasts(temp)
      console.log(temp[1])
        // setPodcast(response.dataP)
    } catch (error) {
      console.error('Error fetching podcast details:', error);
    }finally{
        setLoading(false)
    }
  };

  const switchPodcast = (direction: number) => {
    if (podcasts) {
      if(!canChange) return
      setCanChange(false)
      const newIndex = currentPodcastIndex + direction;
      if (newIndex >= 0 && newIndex < podcasts.length-1) {
        console.log("Podcast",podcasts[newIndex])
        setCurrentPodcastIndex(newIndex);
        // setPodcast(podcasts[newIndex]);
      }
      setTimeout(()=>setCanChange(true),500)
    }
  };


  useEffect(() => {
    if (id) {
      fetchPodcastDetails();
    }
  }, [id]);


  if(podcast?.generating) return(
    <SafeAreaView>
        <Generating explainerType={ExplainerType.PODCAST} explainer={podcast as any}></Generating>
    </SafeAreaView>
  )

  return (
    <ScrollView >
			<View className='p-8'>
				{podcasts && podcasts.length > 0 && (
          <View className=' flex mt-10 flex-col gap-2'>
            <PodcastHeader podcast={podcasts[currentPodcastIndex]}/>
            {/* {console.log(podcasts[1])} */}
            <PodcastPlayer onSkipPodcast={switchPodcast} podcast={podcasts[currentPodcastIndex]}></PodcastPlayer>
            <PodcastBottomContent podcast={podcasts[currentPodcastIndex]}></PodcastBottomContent>
          </View>
				)}
			</View>
    </ScrollView>
  );
}