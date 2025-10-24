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
import TrackPlayer, {useTrackPlayerEvents, State, Event, usePlaybackState} from 'react-native-track-player';
import { AArrowUp } from 'lucide-react-native';
// import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const [loading,setLoading] = useState(false)
  const [podcasts,setPodcasts] = useState<IExplainerPodcast[]>([])
  const [podcast,setPodcast] = useState<IExplainerPodcast>()
  const [currentPodcastIndex,setCurrentPodcastIndex] = useState(0)
  const [currentTime,setCurrentTime] = useState(0)
  const [canChange,setCanChange] = useState(true)
	const player = useAudioPlayer()

  // recc stuff
  const [likes,setLikes] = useState([])
  const [dislikes,setDislikes] = useState([])
  const [initialized,setInitialized] = useState(false)

  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async(event) => {
    if (event.type === Event.PlaybackActiveTrackChanged) {
      let newTrackIndex = await TrackPlayer.getActiveTrackIndex()
      newTrackIndex = newTrackIndex || 0
      setCurrentPodcastIndex(newTrackIndex)
    }
    
  });


  const fetchPodcastDetails = async () => {
    setLoading(true)
    try {

      if(!initialized){
        setInitialized(true)
        const podcastPromise =  axios.get(`${process.env.EXPO_PUBLIC_API_URL}/podcasts/${id}`);
        const reccsPromise = axios.get(`${process.env.EXPO_PUBLIC_API_URL}/explainers/${id}/recommendations?explainerType=${ExplainerType.PODCAST}&type=podcast`)
        const [podcast, reccs] = await Promise.all([podcastPromise,reccsPromise])
        
        setPodcast(podcast.data.explainer)
        // console.log("Reccs",reccs.data.explainers.map((r)=>(r.id || "hahaha")))
        // console.log(response.data);
        
        let temp = [podcast.data.explainer, ...reccs.data.explainers]
        
        await TrackPlayer.add(
          temp.map((t:IExplainerPodcast) => ({
            url: t.sectionAudios[0].streamUrl, // Load media from the network
            title: t.title,
            artist: t.user.name || 'Unknown Artist',
            // album: t.album || '',
            // genre: t.genre || '',
            date: t.created.toString() || '', // Assumes RFC 3339 string
            artwork: t.thumbnailUrl, // Load artwork from the network
            duration: t.totalDuration || 0 // Duration in seconds
          }))
        );
        TrackPlayer.play()
        setPodcasts(temp)
        // console.log(temp[1])
      }else{
        console.log("new engaged recs")
        const enagagedRecs= await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/explainers/reccomendations`,{
          likes: likes,
          dislikes: dislikes,
          type: "podcast",
          initialized:true
          
        },{withCredentials:true})
        setLikes([])
        setDislikes([])
        setPodcasts(prev=> [...prev, ...enagagedRecs.data.explainers])
        await TrackPlayer.add(
          enagagedRecs.data.explainers.map((t:IExplainerPodcast) => ({
            url: t.sectionAudios[0].streamUrl, // Load media from the network
            title: t.title,
            artist: t.user.name || 'Unknown Artist',
            // album: t.album || '',
            // genre: t.genre || '',
            date: t.created.toString() || '', // Assumes RFC 3339 string
            artwork: t.thumbnailUrl, // Load artwork from the network
            duration: t.totalDuration || 0 // Duration in seconds
          }))
        );
      }
        // setPodcast(response.dataP)
    } catch (error) {
      console.error('Error fetching podcast details:', error);
    }finally{
        setLoading(false)
    }
  };


  const switchPodcast = async(direction: number) => {
    if (podcasts) {
      if(!canChange) return
      setCanChange(false)
      if(direction == 1){
        await TrackPlayer.skipToNext()
      }else{
        await TrackPlayer.skipToPrevious()
      }
      let newIndex = await TrackPlayer.getActiveTrackIndex()
      newIndex = newIndex || 0
      viewPodcast(podcasts[newIndex].id)
      setCurrentPodcastIndex(newIndex)
      
      setTimeout(()=>setCanChange(true),500)
    }
  };

  const viewPodcast = async (podcastId:string)=>{
    console.log(podcastId)
    axios.get(`${process.env.EXPO_PUBLIC_API_URL}/podcasts/${podcastId}/view`,{withCredentials:true})
    .then((res) => {
      console.log(res.data.message)
    })
    .catch((error) => {
      console.error(error);
    });
  }

  const onLike = async () => {
    const podcast = podcasts[currentPodcastIndex];
    console.log("liking")
    if (podcast) {
      if (likes.some((l) => l.id === podcast.id)) {
        setLikes((prevLikes) => prevLikes.filter((like) => like.id !== podcast.id));
        // await likeVideo(short.id);
        return;
      }
      setLikes((prev) => [
        ...prev,
        {
          title: podcast.title,
          tags: podcast.tags,
          id: podcast.id,
          categoryId:podcast.categoryId || "uhh",
          sections: podcast.sections || '',
        },
      ]);
      axios.get(`${process.env.EXPO_PUBLIC_API_URL}/podcasts/${podcast.id}/like`,{withCredentials:true})
        .then((res) => {
          console.log(res.data.message)
        })
        .catch((error) => {
          // console.error(error);
        });
    //   await likeVideo(short.id);
    }
  };

  // const onFinishWatching = async () => {
  //   const short = shorts[shortIndex];
  //   if (!playerRef.current) return;
  //   if (playerRef.current?.getCurrentTime() >= 5) {
  //     setLikes((prev) => [
  //       ...prev,
  //       {
  //         title: short.title,
  //         tags: short.tags,
  //         id: short.id,
  //         sections: short.sections || '',
  //       },
  //     ]);
  //   } else {
  //     if (likes.some((l) => l.id === short.id)) return;
  //     if (dislikes.some((l) => l.id === short.id)) return;
  //     setDislikes((prev) => [
  //       ...prev,
  //       {
  //         title: short.title,
  //         tags: short.tags,
  //         id: short.id,
  //         sections: short.sections || '',
  //       },
  //     ]);
  //   }
  // };

  const onDislike = async () => {
    const podcast = podcasts[currentPodcastIndex];
    if (podcast) {
      setDislikes((prev) => [
        ...prev,
        {
          title: podcast.title,
          tags: podcast.tags,
          id: podcast.id,
          categoryId:podcast.categoryId,
          sections: podcast.sections || '',
        },
      ]);
      // setShortIndex(shortIndex + 1);
      // scrollViewRef.current?.scrollTo({ y: (shortIndex + 1) * height, animated: true });
    //   toast.info("We'll try not recommend you content similar");
    }
  };
  


  useEffect(() => {
    if (currentPodcastIndex+3 >= podcasts.length && !loading) {
      console.log("Refetching")
      fetchPodcastDetails();
    }
  }, [id, currentPodcastIndex]);

  useEffect(()=>{
    const getCurrentTrack = async ()=>{
      let trackIndex = await TrackPlayer.getActiveTrackIndex()
      trackIndex = trackIndex || 0
      if(podcasts.length > 0){

        setCurrentPodcastIndex(trackIndex)
      }
    }
    getCurrentTrack()
    // return ()=>{
    //   TrackPlayer.reset()
    // }
    // TrackPlayer.reset()
  },[])

  useEffect(()=>{
    TrackPlayer.reset()
  },[id])




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
            <PodcastPlayer onTimeUpdate={setCurrentTime} onSkipPodcast={switchPodcast} podcast={podcasts[currentPodcastIndex]}></PodcastPlayer>
            <PodcastBottomContent currentTime={currentTime} likes={likes} onDislike={onDislike} onLike={onLike} podcast={podcasts[currentPodcastIndex]}></PodcastBottomContent>
          </View>
				)}
			</View>
    </ScrollView>
  );
}