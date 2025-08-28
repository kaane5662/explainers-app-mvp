import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import clsx from 'clsx';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IUser } from '@/interfaces';
// import { Image } from 'expo-image';
import axios from 'axios';
import { Activity } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ProfileFollowers ()  {
  const [followers, setFollowers] = useState<IUser[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const resultsPerPage = 10;
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user/following`, {
            resultsPerPage:resultsPerPage,
            pageNumber:pageNumber
        },{withCredentials:true});
        const data = response.data;
        // console.log(data)
        setFollowers(prevFollowers => [...prevFollowers, ...data.profiles]);
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
    };

    fetchFollowers();
  }, [pageNumber]);

  const loadMoreFollowers = () => {
    setPageNumber(prevPageNumber => prevPageNumber + 1);
  };

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isNearEnd = layoutMeasurement.width + contentOffset.x >= contentSize.width - 20;
    if (isNearEnd) {
        console.log("is near end")
      loadMoreFollowers();
    }
  };

  return (
    <View className="flex flex-col gap-2">
      <Text className='text-2xl font-semibold'>Following</Text>
      <ScrollView 
        horizontal 
        // className='flex-row' 
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        <View className='flex flex-row gap-2 items-center'>

            {followers.map((follower, index) => (
            <View key={index} className='p-2'>
                {/* {console.log("followr",follower)} */}
                <View className='flex flex-col items-center gap-2'>
                    {follower.imageUrl ? (
                    <TouchableOpacity onPress={()=>router.push(`/profile/${follower.id}`)} className='w-20 h-20 bg-blue rounded-full'>
                        <Image src={follower.imageUrl} className='w-20 h-20 rounded-full' />
                    </TouchableOpacity>
                    ) : (
                    <TouchableOpacity onPress={()=>router.push(`/profile/${follower.id}`)} className='w-20 h-20 bg-blue rounded-full flex items-center justify-center'>
                        <Text className='text-center font-semibold text-xl text-white'>{follower.name.charAt(0)}</Text>
                    </TouchableOpacity>
                    )}
                    <Text className='text-sm'>{follower.name}</Text>
                </View>
            </View>
            ))}
            <ActivityIndicator className='px-4'></ActivityIndicator>
        </View>
      </ScrollView>
    </View>
  );
}
