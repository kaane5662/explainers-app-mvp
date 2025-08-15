import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Animated, Easing, } from 'react-native';
import clsx from 'clsx';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Play, Pause, ThumbsUp, ThumbsDown, Share, MessageCircle, ChevronLeft, X, Loader } from 'lucide-react-native';
import axios from 'axios';
import { IExplainerVideo } from '@/interfaces';
import VideoPlayerComponent, { VideoPlayerRef } from '@/components/videos/VideoPlayerComponent';
import Slider from '@react-native-community/slider';

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
  const [likes, setLikes] = useState<IExplainerVideo[]>([]);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [dislikes, setDislikes] = useState<IExplainerVideo[]>([]);
  const [sharePopup, setSharePopup] = useState<boolean>(false);
  const [commentsPopup, setCommentsPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPreloading, setIsPreloading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const playerRef = useRef<VideoPlayerRef | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollTime = useRef<number>(0);
  const accumulatedDelta = useRef<number>(0);
  const scrollCooldown = 500; // 500ms cooldown between video changes
  const k = 8;

  const getShorts = async (isPreload = false) => {
    if (isPreload) {
      setIsPreloading(true);
    } else {
      setLoading(true);
    }
    // console.log("fetching reel")
    try {
      // console.log("Fetching shorts",id)
      let video = null
      if(!initialized){
        video = (await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/videos/${id}`,{withCredentials:true})).data.explainer
        console.log("Stream url",video.videoUrl)
      } 
      const res = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/shorts`, { likes, dislikes, initialized }, { withCredentials: true });
      // console.log("In video")
    //   console.log(res.)
      setShorts((prev) => [...prev, ...(video ? [video, ...res.data.shorts] : res.data.shorts)]);
      if (!initialized) setInitialized(true);
    } catch (err: any) {
        console.log(err)
    //   toast.error(err.response.data.message);
    } finally {
      if (isPreload) {
        setIsPreloading(false);
      } else {
        setLoading(false);
      }
    }
  };

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
    getShorts(true);
    if (!loading && !isPreloading && shorts.length > 0 && shortIndex >= shorts.length - 3) {
    }
  }, [shortIndex, shorts]);

  const onLike = async () => {
    const short = shorts[shortIndex];
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
          sections: short.sections || '',
        },
      ]);
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
          sections: short.sections || '',
        },
      ]);
      setShortIndex(shortIndex + 1);
    //   toast.info("We'll try not recommend you content similar");
    }
  };

  const scrollToIndex = (index: number) => {
    Animated.timing(scrollY, {
      toValue: index * 100, // Assuming each video takes 100 units of height
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setIsTransitioning(false);
    });
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(offsetY / 100); // Assuming each video takes 100 units of height
    if (newIndex !== shortIndex && newIndex >= 0 && newIndex < shorts.length) {
      const now = Date.now();
      if (now - lastScrollTime.current > scrollCooldown) {
        lastScrollTime.current = now;
        onFinishWatching();
        setShortIndex(newIndex);
      }
    }
  };

  return (
    <View className={clsx('flex justify-center items-center w-full h-screen')}>
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
      
      <View className={clsx('h-full w-full relative bg-opacity-15 flex flex-col ')}>
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
          <ScrollView
            // className={clsx('h-full w-full')}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            <View className='w-full h-full'>
              {/* {console.log(shorts)} */}
              {shorts.map((shortItem, index) => (
                <Animated.View
                  className={clsx('h-full w-full relative')}
                  key={index}
                  // style={[
                    
                  //   {
                  //     opacity: scrollY.interpolate({
                  //       inputRange: [index * 100 - 50, index * 100, index * 100 + 50],
                  //       outputRange: [0.7, 1, 0.7],
                  //       extrapolate: 'clamp',
                  //     }),
                  //     transform: [
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
                      <View className='w-full h-screen'>

                          <VideoPlayerComponent
                              ref={playerRef}
                              // onDurationUpdate={setCurrentTime}
                              // hideControls={true} 
                              // video={shortItem as IExplainerVideo} 
                              videoUri={shortItem?.videoUrl} 
                          />
                      </View>

                  <View className="flex justify-between text-white h-full flex-col gap-4 z-10 absolute bottom-0 p-2">
                    <Animated.View
                      style={{
                        opacity: isPlaying ? 1 : 0,
                      }}
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
                    </Animated.View>

                    <View className="flex flex-col gap-4 z-10 self-start">
                      <TouchableOpacity
                        onPress={() => router.push('/')}
                        className="bg-green-500 flex flex-col duration-300 hover:opacity-70 text-sm p-2 rounded-full hover:bg-green-600"
                      >
                        <ChevronLeft color={"white"} className="drop-shadow-xl" />
                        <Text className="drop-shadow-xl text-white">Back</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <View className="flex flex-col gap-4">
                      {/* video info */}
                      <View className="flex flex-row gap-12 justify-between z-10">
                        <View className="flex flex-col gap-2 mt-auto">
                          <TouchableOpacity
                            onPress={() => router.push(`/profile/${shortItem.user.id}`)}
                            className="flex flex-row gap-2 hover:opacity-70 duration-300 text-sm items-center"
                          >
                            {shortItem.user.imageUrl ? (
                              <Image source={{ uri: shortItem.user.imageUrl }} className="h-6 w-6 rounded-full" />
                            ) : (
                              <View className="rounded-full bg-blue h-6 w-6 flex justify-center items-center">
                                <Text>{shortItem.user.name.charAt(0)}</Text>
                              </View>
                            )}
                            <Text className='text-white'>{shortItem.user.name}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => router.push(`/videos/${shortItem.id}`)}>
                            <Text className="text-lg text-white hover:opacity-70 duration-300 max-lg:text-md font-semibold">
                              {shortItem.title}
                            </Text>
                          </TouchableOpacity>
                          <Text className="text-sm text-slate-300 overflow-x-auto">
                            {shortItem.tags && shortItem.tags.length > 0 ? shortItem.tags.map((t) => `#${t}`).join(' ') : 'No tags available'}
                          </Text>
                        </View>
                        {/* controls */}
                        {/* <View className="flex flex-col items-center gap-4">
                          <TouchableOpacity
                            style={[
                              likes.some((l) => l.id === shortItem.id) ? { backgroundColor: 'blue' } : null,
                            ]}
                            className="flex items-center flex-col text-sm p-2 rounded-full duration-300"
                            onPress={index === shortIndex ? onLike : undefined}
                          >
                            <ThumbsUp className={`drop-shadow-xl shadow-black ${likes.some((l) => l.id === shortItem.id) ? 'fill-blue' : ''}`} />
                            <Text className={`drop-shadow-xl shadow-black ${likes.some((l) => l.id === shortItem.id) ? 'text-blue' : ''}`}>Like</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            className="flex items-center flex-col text-sm p-2 rounded-full duration-300 hover:text-red2"
                            onPress={index === shortIndex ? onDislike : undefined}
                          >
                            <ThumbsDown className="drop-shadow-xl shadow-black" />
                            <Text className="drop-shadow-xl shadow-black">Dislike</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            className="bg-green-500 flex items-center flex-col duration-300 hover:opacity-70 text-sm p-2 rounded-full hover:bg-green-600"
                            onPress={() => index === shortIndex && setSharePopup(true)}
                          >
                            <Share className="drop-shadow-xl shadow-black" />
                            <Text className="drop-shadow-xl shadow-black">Share</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            className="bg-yellow-500 flex items-center flex-col duration-300 hover:opacity-70 text-sm p-2 rounded-full hover:bg-yellow-600"
                            onPress={() => index === shortIndex && setCommentsPopup(true)}
                          >
                            <MessageCircle className="drop-shadow-xl shadow-black" />
                            <Text className="drop-shadow-xl shadow-black">Comment</Text>
                          </TouchableOpacity>
                        </View> */}
                      </View>

                      {index === shortIndex && (
                        <View className="w-full h-fit z-10 p-2">
                          <View className="rounded-md bottom-0 left-0 w-full  bg-white/25 h-2">
                            <View
                              style={{
                                width: `${( (playerRef.current?.getCurrentTime() || 1) / (shortItem.totalDuration || 0)) * 100}%`,
                              }}
                              className="bg-blue rounded-md h-full relative"
                            >
                              <View
                                style={{
                                  transform: [{ translateX: 20 }],
                                }}
                                className="absolute right-0 overflow-visible top-0 w-3 h-full bg-white rounded-sm"
                              />
                            </View>
                            <Slider
                              // style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}
                              minimumValue={0}
                              maximumValue={shortItem.totalDuration || 0}
                              value={currentTime}
                              onSlidingComplete={(newTime) => {
                                setCurrentTime(newTime);
                                playerRef.current?.onSeek(newTime);
                              }}
                              minimumTrackTintColor="#0000FF"
                              maximumTrackTintColor="#FFFFFF"
                              thumbTintColor="#FFFFFF"
                            />
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}