import { Image } from 'expo-image';
import { Platform, StyleSheet, View,Text, ScrollView } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PodcastThumbnail } from '@/components/podcasts/PodcastThumbnail';


export default function PodcastScreen() {
  const [Podcasts,setPodcasts] = useState([])
  const [error,setError] = useState()
  const [loading,setLoading] = useState(false)
  const getPodcasts = ()=>{
    setLoading(true)
    console.log(process.env.EXPO_PUBLIC_API_URL)
    axios.post(`${process.env.EXPO_PUBLIC_API_URL}/explainers`,{sortType:"podcasts",pageNumber:1, resultsPerPage:10},{withCredentials:true}).then((res)=>{
        console.log(res.data)
        setPodcasts(res.data.explainers)
    }).catch(err=>{
        console.log(err.message)
        setError(err)
    }).finally(()=>setLoading(false))
  }
  useEffect(()=>{
    getPodcasts()
  },[])
  return (
    <SafeAreaView className='p-4 flex flex-col gap-2'>
        {loading &&(
            <Text>Loading</Text>
        )}
        <Text className='font-semibold text-3xl'>Discover Podcasts</Text>
        {/* <Text>{error}</Text> */}
        {/* <Text className='text-3xl'>Whh</Text> */}

        <ScrollView className=' space-y-4 mt-4'>
            {Podcasts.map((p,i)=>(
                <PodcastThumbnail podcast={p}/>
            ))}
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
