import { IExplainer, IExplainerVideo } from '@/interfaces';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Animated, Easing, Dimensions, } from 'react-native';
import clsx from 'clsx';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { Play, Pause, ThumbsUp, ThumbsDown, Share, MessageCircle, ChevronLeft, X, Loader, EllipsisVertical } from 'lucide-react-native';

import tailwindConfig  from "@/tailwind.config";
import ShareExplainer from '../popups/ShareExplainer';
import { ExplainerType } from '@/utils/constant';
import ExplainerSettings from '../popups/ExplainerSettings';
import Comments from '../explainers/Comments';
import { useUser } from '@/hooks/useUser';
const tailwindColors = tailwindConfig.theme?.extend?.colors;

export default function VideoContent({ shortItem, shortIndex, index, likes,dislikes,onLike,onDislike }: { shortItem: IExplainerVideo,shortIndex:number, index:number, onLike:CallableFunction, onDislike:CallableFunction }) {

  const [sharePopup,setSharePopup] = useState(false)
  const [commentsPopup,setCommentsPopup] = useState(false)
  const [explainerSettings,setExplainerSettings] = useState(false)
  const {user} = useUser()
  return (

      <View className="z-10 flex flex-col gap-4 w-full" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: .4, shadowRadius: 8 }}>

        {sharePopup &&(
          <ShareExplainer explainer={shortItem as any} onClose={()=>setSharePopup(false)} visible={sharePopup} explainerType={ExplainerType.VIDEO}></ShareExplainer>
        )}
        {commentsPopup &&(
          <Comments user={user} id={shortItem.id} isPodcast={false} onClose={()=>setCommentsPopup(false)} visible={commentsPopup}/>
        )}
        <ExplainerSettings explainerType={ExplainerType.REEL} onClose={()=>setExplainerSettings(false)} visible={explainerSettings} explainer={shortItem as IExplainer}></ExplainerSettings>

        {/* controls */}
        <View className="flex flex-col ml-auto gap-4" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: .4, shadowRadius: 8 }}>
          <TouchableOpacity
            style={[
              { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: .4, shadowRadius: 8 }
            ]}
            className="flex flex-col items-center gap-2 rounded-full p-2 text-sm duration-300"
            onPress={index === shortIndex ? onLike : undefined}>
            <ThumbsUp
                color={likes.some((l) => l.id === shortItem.id)? tailwindColors.blue:"white"}
                fill={likes.some((l) => l.id === shortItem.id)? tailwindColors.blue:""}
              style={
                likes.some((l) => l.id === shortItem.id) ? { color: tailwindColors.blue} : null
              }
              className={`shadow-black text-white drop-shadow-xl ${likes.some((l) => l.id === shortItem.id) ? 'fill-blue' : ''}`}
            />
            <Text
              style={
                likes.some((l) => l.id === shortItem.id) ? { color: tailwindColors.blue } : null
              }
              className={`shadow-black text-white drop-shadow-xl ${likes.some((l) => l.id === shortItem.id) ? 'text-blue' : ''}`}>
              100
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-col items-center rounded-full p-2 text-sm duration-300 hover:text-red2"
            onPress={index === shortIndex ? onDislike : undefined}
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: .4, shadowRadius: 8 }}>
            <ThumbsDown color={"white"} className="shadow-black drop-shadow-xl" />
            {/* <Text className="shadow-black text-white drop-shadow-xl">Dislike</Text> */}
          </TouchableOpacity>

          <TouchableOpacity
          onPress={()=>setSharePopup(true)}
            className="bg-green-500 hover:bg-green-600 flex flex-col items-center rounded-full p-2 text-sm duration-300 hover:opacity-70"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: .4, shadowRadius: 8 }}
            // onPress={() => index === shortIndex && setSharePopup(true)}>
            >
            <Share color={"white"} className="shadow-black drop-shadow-xl" />
            {/* <Text className="shadow-black text-white drop-shadow-xl">Share</Text> */}
          </TouchableOpacity>

          <TouchableOpacity
            
            className="bg-yellow-500 hover:bg-yellow-600 flex flex-col items-center rounded-full p-2 text-sm duration-300 hover:opacity-70"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: .4, shadowRadius: 8 }}
            onPress={()=>setCommentsPopup(true)}
            // onPress={() => index === shortIndex && setCommentsPopup(true)}>
            >
            <MessageCircle color={"white"} className="shadow-black drop-shadow-xl" />
            {/* <Text className="shadow-black text-white drop-shadow-xl">Comment</Text> */}
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>setExplainerSettings(true)}  
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: .4, shadowRadius: 8 }}
          className='bg-yellow-500 hover:bg-yellow-600 flex flex-col items-center rounded-full p-2 text-sm duration-300 hover:opacity-70'>
            <EllipsisVertical color="white"/>
          </TouchableOpacity>
        </View>
        {/* video info */}
        <View className="flex flex-col gap-2" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: .4, shadowRadius: 8 }}>
          <TouchableOpacity
            onPress={() => router.push(`/profile/${shortItem.user.id}`)}
            className="flex flex-row items-center gap-2 text-sm duration-300 hover:opacity-70"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: .4, shadowRadius: 8 }}>
            {shortItem.user.imageUrl ? (
              <Image source={{ uri: shortItem.user.imageUrl }} className="h-6 w-6 rounded-full" />
            ) : (
              <View className="flex h-6 w-6 items-center justify-center rounded-full bg-blue">
                <Text>{shortItem.user.name.charAt(0)}</Text>
              </View>
            )}
            <Text className="text-white">{shortItem.user.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push(`/videos/${shortItem.id}`)} style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: .4, shadowRadius: 8 }}>
            <Text className="max-lg:text-md text-lg font-semibold text-white duration-300 hover:opacity-70">
              {shortItem.title}
            </Text>
          </TouchableOpacity>
          <Text className="overflow-x-auto text-sm text-slate-100" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: .4, shadowRadius: 8 }}>
            {shortItem.tags && shortItem.tags.length > 0
              ? shortItem.tags.map((t) => `#${t}`).join(' ')
              : 'No tags available'}
          </Text>
        </View>
        
      </View>
    
  );
}
