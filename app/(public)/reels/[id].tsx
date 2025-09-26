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

// import Video from 'react-native-video';
// import { toast } from 'react-toastify';
// import StreamPlayer from '@components/stream/Playe'r;
// import ShareVideo from '@components/[locale]/popups/ShareVideo';
// import Comments from '@components/[locale]/videos/VideoComments';


//  Short {
//   id: string;
//   title: string;
//   tags: string[];
//   sections?: string;
//   streamId?: string;
//   user: {
//     id: string;
//     name: string;
//     imageUrl?: string;
//   };
//   totalDuration?: number;
// }

// interface Props {
//   loggedIn: boolean;
//   user: {
//     id: string;
//     name: string;
//   };
// }

export default function ReelsContent() {
//   const clsx = useTailwind();
  const {id} = useLocalSearchParams()
  const router = useRouter();
  const [shortIndex, setShortIndex] = useState<number>(0);
  const [shorts, setShorts] = useState<IExplainerVideo[]>([]);
  const [startingShort,setStartingShort] = useState<IExplainerVideo>()
  
  const [sharePopup, setSharePopup] = useState<boolean>(false);
  const [commentsPopup, setCommentsPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPreloading, setIsPreloading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const playerRef = useRef<VideoPlayerRef | null>(null);
  const scrollY = new Animated.Value(0)
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

  const onTimeChange = async (t:number)=>{
    setCurrentTime(t)
  }

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
      {/* <Text>Hello</Text> */}
      {/* {sharePopup && shorts[shortIndex] && (
        <ShareVideo
          loggedIn={loggedIn}
          owner={false}
          explainerType="VIDEO"
          id={shorts[shortIndex].id}
          onSetShow={setSharePopup}
          explainer={shorts[shortIndex]}
        />
      )} */}
      
      <View className={clsx('h-full w-full bg-opacity-15 flex flex-col ')}>
        {/* {commentsPopup && shorts[shortIndex] && (
          <Animated.View
            style={[
              clsx('absolute z-50 p-4 bg-white2 dark:bg-dark2 w-11/12 h-5/6 shadow-xl rounded-xl'),
              { transform: [{ scale: scrollY.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] },
            ]}
          >
            <TouchableOpacity onPress={() => setCommentsPopup(false)} className={clsx('absolute top-2 right-2')}>
              <X />
            </TouchableOpacity>
            <Comments id={shorts[shortIndex].id} user={user} isPodcast={false} />
          </Animated.View>
        )} */}

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
                    //       {
                    //         scale: scrollY.interpolate({
                    //           inputRange: [index * 100 - 50, index * 100, index * 100 + 50],
                    //           outputRange: [0.95, 1, 0.95],
                    //           extrapolate: 'clamp',
                    //         }),
                    //       },
                    //     ],
                    //   },
                    // ]}
                  >
                    {/* {index === shortIndex && (
                      
                    )} */}
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

                    <View className="flex text-white w-full flex-col gap-4 z-[100000000] absolute bottom-0 p-2">
                      {/* <Animated.View
                        
                        className="h-full place-self-center z-10 absolute w-full flex items-center justify-center"
                      >
                        <TouchableOpacity
                          className="p-4 bg-blue rounded-full shadow-lg"
                          onPress={() => {
                            if (!playerRef.current) return;
                            let paused = playerRef.current.onPlayPause();
                            setPaused(paused);
                            setIsPlaying(true);
                          }}
                        >
                          {paused ? <Play color={"white"} className="text-white" /> : <Pause color={"white"} className="text-white" />}
                        </TouchableOpacity>
                      </Animated.View> */}

                      {/* <View className="flex flex-col gap-4 z-10 self-start">
                        <TouchableOpacity
                          onPress={() => router.push('/')}
                          className="bg-green-500 flex flex-col duration-300 hover:opacity-70 text-sm p-2 rounded-full hover:bg-green-600"
                        >
                          <ChevronLeft color={"white"} className="drop-shadow-xl" />
                          <Text className="drop-shadow-xl text-white">Back</Text>
                        </TouchableOpacity>
                      </View> */}
                      
                      
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