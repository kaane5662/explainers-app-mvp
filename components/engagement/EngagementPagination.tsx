import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import clsx from 'clsx';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IUser } from '@/interfaces';
// import { Image } from 'expo-image';
import axios from 'axios';
import { Activity, Heart, User, User2 } from 'lucide-react-native';
import { router } from 'expo-router';
import tailwindConfig from '@/tailwind.config';

let colors = tailwindConfig.theme?.extend?.colors

export default function EngagementPagination ({engagementType}:{engagementType:'followers'|"likes"|"comments"})  {
  const [engagements, setEngagements] = useState<any[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const resultsPerPage = 2;
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchEngagement = async () => {
      try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user/engagement?engagementType=${engagementType}`, {
            resultsPerPage:resultsPerPage,
            pageNumber:pageNumber
        },{withCredentials:true});
        const data = response.data;
        // console.log(data)
        setEngagements(prev => [...prev, ...data.engagement]);
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
    };

    fetchEngagement();
  }, [pageNumber]);

  const loadMoreFollowers = () => {
    setPageNumber(prevPageNumber => prevPageNumber + 1);
  };

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isNearEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - 10;
    if (isNearEnd) {
        console.log("is near end")
      loadMoreFollowers();
    }
  };


function ImageProfile({user}:{user:IUser}){
    return (
        user.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className="object-cover w-5 h-5 rounded-full"
            />
        ) : (
            <View className="flex items-center justify-center bg-blue w-5 h-5 rounded-full font-medium text-lg">
              <Text className="text-white">{user.name?.[0]?.toUpperCase() || '?'}</Text>
            </View>
        )
    );
  }

  return (
    <View className="flex flex-col gap-2">
      {/* <Text className='text-2xl font-semibold'>Following</Text> */}
      <ScrollView 
        // horizontal 
        // className='flex-row' 
        // onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        <View className='flex flex-col gap-2 items-center'>

            {engagements.map((engagement, index) => {
                if(engagementType == "likes")
                    return(
                        <TouchableOpacity 
                        // onPress={()=>router.push("/")}
                        className=' relative bg-white w-full gap-1 rounded-xl p-4'>
                            <View className=' absolute top-2 right-2'>
                                <Heart color={colors.blue} fill={colors.blue} size={12}></Heart>

                            </View>
                            <View className='flex flex-row items-center gap-2'>
                                <ImageProfile user={engagement.user}></ImageProfile>
                                <Text className='font-semibold'>{engagement?.user?.name}</Text>
                                <Text className='text-sm text-slate-400'>liked</Text>
                            </View>
                            <Text numberOfLines={1} className='text-sm text-slate-500 '>{engagement.title}</Text>
                        </TouchableOpacity>
                    )
                if(engagementType == "comments")
                    return(
                        <TouchableOpacity 
                        // onPress={()=>router.push("/")}
                        className='  bg-white w-full h-fit gap-0 rounded-xl p-4'>
                            {/* <View className=' absolute top-2 right-2'>
                                <Heart color={colors.blue} fill={colors.blue} size={16}></Heart>

                            </View> */}
                            <View className='flex flex-row items-center gap-2'>
                                <ImageProfile user={engagement.user}></ImageProfile>
                                <Text className='font-semibold'>{engagement?.user?.name}</Text>
                                <Text className='text-sm text-slate-400'>commented on</Text>
                            </View>
                            <Text numberOfLines={1} className=' text-sm text-slate-500'>{engagement.title}</Text>
                            <Text numberOfLines={1} className=' mt-1 text-sm  '>{engagement.text}</Text>
                        </TouchableOpacity>
                    )
                if(engagementType == "followers")
                    return(
                        <TouchableOpacity 
                        // onPress={()=>router.push("/")}
                        className=' relative bg-white w-full gap-0 rounded-xl p-4'>
                            <View className=' absolute top-2 right-2'>
                                <User color={colors.blue} fill={colors.blue} size={16}></User>

                            </View>
                            <View className='flex flex-row items-center gap-2'>
                                <ImageProfile user={engagement.user}></ImageProfile>
                                <Text className='font-semibold'>{engagement?.user?.name}</Text>
                                <Text className='text-sm  text-slate-400'>followed you</Text>
                            </View>
                            
                        </TouchableOpacity>
                    )
            })}
            <TouchableOpacity onPress={()=>setPageNumber(pageNumber+1)} className=' items-center'>
                <Text className='text-slate-500 mt-2 text-sm'>View More</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
