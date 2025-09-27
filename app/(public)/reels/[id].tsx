import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Animated, Easing, Dimensions, } from 'react-native';
import clsx from 'clsx';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Play, Pause, ThumbsUp, ThumbsDown, Share, MessageCircle, ChevronLeft, X, Loader, EllipsisVertical } from 'lucide-react-native';
import axios from 'axios';
import { IExplainer, IExplainerVideo } from '@/interfaces';
import VideoPlayerComponent, { VideoPlayerRef } from '@/components/videos/VideoPlayerComponent';
import Slider from '@react-native-community/slider';
import tailwindConfig from '@/tailwind.config';
import VideoContent from '@/components/videos/VideoContent';
import { ExplainerType } from '@/utils/constant';
import ExplainerSettings from '@/components/popups/ExplainerSettings';
import Generating from '@/components/explainers/Generating';
const { width, height } = Dimensions.get('window');

const tailwindColors = tailwindConfig.theme?.extend?.colors;



export default function ReelsContent() {
//   const clsx = useTailwind();
  const {id} = useLocalSearchParams()
  const router = useRouter();
  const [shortIndex, setShortIndex] = useState<number>(0);
  const [shorts, setShorts] = useState<IExplainerVideo[]>([]);
  const [startingShort,setStartingShort] = useState<IExplainerVideo>()
  

  const [loading, setLoading] = useState<boolean>(false);
  const [isPreloading, setIsPreloading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);
  const [showPlayButton,setShowPlayButton] = useState(false)

  
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const playerRef = useRef<VideoPlayerRef | null>(null);
  const scrollY = new Animated.Value(0)
  const animatePop = new Animated.Value(0)
  const lastScrollTime = useRef<number>(0);
  const accumulatedDelta = useRef<number>(0);
  // const scrollY = new Animated.Value(0);
  const scrollCooldown = 500; // 500ms cooldown between video changes
  const k = 8;

  const [likes, setLikes] = useState<IExplainerVideo[]>([]);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [dislikes, setDislikes] = useState<IExplainerVideo[]>([]);

  const getShorts = async (isPreload = false) => {
    // if (isPreload) {
    //   setIsPreloading(true);
    // } else {
    //   setLoading(true);
    // }
    // console.log("fetching reel")
    try {
      // console.log("Fetching shorts",id)
      setLoading(true)
      if(!initialized){
        console.log("What are you doing gang")
        const reelsPromise =  axios.get(`${process.env.EXPO_PUBLIC_API_URL}/videos/${id}`);
        const reccsPromise = axios.get(`${process.env.EXPO_PUBLIC_API_URL}/explainers/${id}/recommendations?explainerType=${ExplainerType.VIDEO}&type=reel`)
        const [video, reccs] = await Promise.all([reelsPromise,reccsPromise])
        console.log(video.data.explainer)
        // console.log("Reccs",reccs.data)
        setStartingShort(video.data.explainer)
        // setV(podcast.data.explainer)
        // console.log("Reccs",reccs.data.explainers.map((r)=>(r.id || "hahaha")))
        // console.log(response.data);
        setInitialized(true)
        let temp = [video.data.explainer, ...reccs.data.explainers]
        setShorts(temp)
        console.log(temp[1])
      }else{
        console.log("engagement stuff")
        const enagagedRecs= await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/explainers/reccomendations`,{
          likes: likes,
          dislikes: dislikes,
          type: "reel",
          initialized:true
          
        },{withCredentials:true})
        setLikes([])
        console.log(enagagedRecs.data.explainers)
        setShorts(prev=> [ ...enagagedRecs.data.explainers])
      }
      
    } catch (err: any) {
        console.log(err)
    //   toast.error(err.response.data.message);
    } finally {
      setLoading(false)
    }
  };

  const onView = ()=>{
    console.log("viewing")
    axios.get(`${process.env.EXPO_PUBLIC_API_URL}/videos/${shorts[shortIndex].id}/view`,{withCredentials:true})
        .then((res) => {
          console.log(res.data.message)
        })
        .catch((error) => {
          // console.error(error);
        });
  }

//   useEffect(() => {
//     // if (shorts[shortIndex] && playerRef.current && playerRef.current.getCurrentTime() >= 5) {
//     //   setLikes((prev) => [
//     //     ...prev,
//     //     {
//     //       title: shorts[shortIndex].title,
//     //       tags: shorts[shortIndex].tags,
//     //       id: shorts[shortIndex].id,
//     //       sections: shorts[shortIndex].sections || '',
//     //     },
//     //   ]);
//     // }
//     if (!loading && shortIndex >= shorts.length - k / 3) {
//       getShorts();
//     }
//   }, [shortIndex]);

  useEffect(() => {
    if (!loading && shortIndex+2 >= shorts.length) {
      console.log("Fetching")
      getShorts();
    }
  }, [shortIndex, id]);

  const onLike = async () => {
    const short = shorts[shortIndex];
    console.log("liking")
    if (short) {
      if (likes.some((l) => l.id === short.id)) {
        setLikes((prevLikes) => prevLikes.filter((like) => like.id !== short.id));
        // await likeVideo(short.id);
        return;
      }
      setLikes((prev) => [
        ...prev,
        {
          title: short.title,
          tags: short.tags,
          id: short.id,
          categoryId:short.categoryId,
          sections: short.sections || '',
        },
      ]);
      axios.get(`${process.env.EXPO_PUBLIC_API_URL}/videos/${shorts[shortIndex].id}/like`,{withCredentials:true})
        .then((res) => {
          console.log(res.data.message)
        })
        .catch((error) => {
          // console.error(error);
        });
    //   await likeVideo(short.id);
    }
  };

  const onFinishWatching = async () => {
    const short = shorts[shortIndex];
    if (!playerRef.current) return;
    if (playerRef.current?.getCurrentTime() >= 5) {
      setLikes((prev) => [
        ...prev,
        {
          title: short.title,
          tags: short.tags,
          id: short.id,
          sections: short.sections || '',
        },
      ]);
    } else {
      if (likes.some((l) => l.id === short.id)) return;
      if (dislikes.some((l) => l.id === short.id)) return;
      setDislikes((prev) => [
        ...prev,
        {
          title: short.title,
          tags: short.tags,
          id: short.id,
          sections: short.sections || '',
        },
      ]);
    }
  };

  const onDislike = async () => {
    const short = shorts[shortIndex];
    if (short) {
      setDislikes((prev) => [
        ...prev,
        {
          title: short.title,
          tags: short.tags,
          id: short.id,
          categoryId:short.categoryId,
          sections: short.sections || '',
        },
      ]);
      // setShortIndex(shortIndex + 1);
      // scrollViewRef.current?.scrollTo({ y: (shortIndex + 1) * height, animated: true });
    //   toast.info("We'll try not recommend you content similar");
    }
  };

  

  const handleScrollEnd = (event: any) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(contentOffsetY / height); // Use Math.round for snapping
    console.log("Vars", contentOffsetY, height);
    console.log("Switching index", newIndex);
    if (newIndex !== shortIndex) {
      setShortIndex(newIndex);
      console.log('Current video index:', newIndex);
      onView()
      // Here you can pause previous video and play current video
      // pauseVideo(currentVideoIndex);
      // playVideo(newIndex);
    }
  };
  if(startingShort?.generating){
    console.log(startingShort)
    return (<Generating explainerType={ExplainerType.REEL} explainer={startingShort as IExplainer}></Generating>)
  }
  return (
    <View className={clsx('')}>
      
      
      <View className={clsx('h-full w-full bg-opacity-15 flex flex-col ')}>
        

        {loading && (
          <View className={clsx('absolute w-full h-full items-center justify-center flex bg-black')}>
            <Loader color={"cyan"} size={20} className="text-blue animate-spin" />
          </View>
        )}

        {shorts && shorts.length > 0 && !loading && (
          <Animated.ScrollView
            scrollEventThrottle={1} // Adjusted to 16ms for smoother scrolling
            showsVerticalScrollIndicator={false}
            pagingEnabled
            style={{
              width:"100%",
              height:"100%"
            }}
            // snapToInterval={height}
            snapToAlignment={'center'}
            decelerationRate="fast"
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            onMomentumScrollEnd={handleScrollEnd}
          >
              {shorts.map((shortItem, index) => {
                const inputRange = [
                  (index - 1) * height,
                  index * height,
                  (index + 1) * height,
                ];
      
                const opacity = scrollY.interpolate({
                  inputRange,
                  outputRange: [0.5, 1, 0.5],
                  extrapolate: 'clamp',
                });
      
                const scale = scrollY.interpolate({
                  inputRange,
                  outputRange: [0.8, 1, 0.8],
                  extrapolate: 'clamp',
                });
                return(
                  <Animated.View
                    className={clsx('w-screen relative')}
                    style={{
                      height: height,
                      maxHeight: height,
                      minHeight: height
                    }}
                    key={index}
                    
                  >
                    
                    <View className='w-full h-full bg-black'>
                        {shortIndex == index ?(

                          <VideoPlayerComponent
                              onTimeChange={setCurrentTime}
                              ref={playerRef}
                              // onDurationUpdate={setCurrentTime}
                              // hideControls={true} 
                              // video={shortItem as IExplainerVideo} 
                              
                              videoUri={shortItem?.videoUrl} 
                          />
                        ):(
                          <View
                          className=' bg-black'
                          style={{
                            width:"100%",
                            height:"100%",
                            minHeight:"100%"
                          }}
                          >
                          </View>
                        )}
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        // console.log("hello")
                        const isPlaying = playerRef.current?.onPlayPause();
                        animatePop.resetAnimation()
                        // animatePop.setValue(0)
                        // console.log(!isPlaying)
                        setPaused(!isPlaying)
                        setShowPlayButton(true);
                        console.log("Started anum")
                        // Animate scale up with cubic bezier
                        Animated.timing(animatePop, {
                          toValue: 2,
                          duration: 300,
                          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
                          useNativeDriver: true,
                        }).start(({finished}) => {
                          // animatePop.resetAnimation()
                          if(finished){

                            console.log("Finished anum")
                            
                            setTimeout(() => {
                              setShowPlayButton(false);
                            }, 2000);
                          }
                        })
                        
                        
                      }}
                      style={{
                        position: 'absolute',
                        top: '25%',
                        left: '25%',
                        width: '50%',
                        height: '50%',
                        zIndex: 100000001,
                      }}
                    >
                      {showPlayButton && (
                        <Animated.View
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: [
                              { translateX: -25 }, 
                              { translateY: -25 },
                              { scale: animatePop }
                            ],
                            width: 50,
                            height: 50,
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            borderRadius: 25,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          {!paused ? (
                            <Pause color="black" size={24} />
                          ) : (
                            <Play color="black" size={24} />
                          )}
                        </Animated.View>
                      )}
                    </TouchableOpacity>

                    <View className="flex text-white w-full flex-col gap-4 z-[100000000] absolute bottom-4 p-2">
                      
                      
                      <VideoContent onDislike={onDislike} onLike={onLike} dislikes={dislikes} likes={likes} shortItem={shortItem} index={index} shortIndex={shortIndex}></VideoContent>
                      
                      
                          
                            
                             
                          <Slider
                            style={{ zIndex:100000000000 }}
                            
                            minimumValue={0}
                            maximumValue={shortItem.totalDuration || 0}
                            
                            value={currentTime} // Use a state variable to track current time
                            onValueChange={(newTime) => {
                             setCurrentTime(newTime) // Update current time every second
                            }}
                            onSlidingComplete={(newTime) => {
                              playerRef.current?.onSeek(newTime);
                            }}
                            thumbTintColor={tailwindColors.blue}
                            minimumTrackTintColor={tailwindColors.blue}
                            // maximumTrackTintColor="blue"
                            step={1}
                          />
                        
                    
                    
                    </View>
                  </Animated.View>
                )

            })}
            
          </Animated.ScrollView>
        )}
      </View>
    </View>
  );
}