import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Text,SafeAreaView,ScrollView, ActivityIndicator, Touchable, TouchableOpacity } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, router } from 'expo-router';
import ExplainerPagination from '@/components/explainers/ExplainerPagination';
import ProfileDropdown from '@/components/profile/ProfileDropdown';
import axios, { AxiosError } from 'axios';
import { use, useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { BadgeCent, Coins, Heart, Settings, Users } from 'lucide-react-native';
// import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';



export default function HomeScreen() {
  const { user, loading, error, refetch } = useUser();
  

  return (
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    //   headerImage={
    //     <Image
    //       source={require('@/assets/images/partial-react-logo.png')}
    //       style={styles.reactLogo}
    //     />
    //   }>
    //   <Link href={"/podcasts/689b7a5804a920394497d4a2"}>Podcast</Link>
    //   <Link href={"/profile/689b82fb04a920394497d4a4"}>Profile</Link>
      
    //   <ThemedView style={styles.titleContainer}>
    //     <ThemedText type="title">Welcome!</ThemedText>
    //     <View className='p-4 text-2xl'>
    //       <Text className=" text-blue2 font-bold">HEllo World</Text>
    //     </View>
    //     <HelloWave />
    //   </ThemedView>
    //   <Link href={"/login"}>Login</Link>
    //   <Link href={"/signup"}>Signup</Link>
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type="subtitle">Step 1: Try it</ThemedText>
    //     <ThemedText>
    //       Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
    //       Press{' '}
    //       <ThemedText type="defaultSemiBold">
    //         {Platform.select({
    //           ios: 'cmd + d',
    //           android: 'cmd + m',
    //           web: 'F12',
    //         })}
    //       </ThemedText>{' '}
    //       to open developer tools.
    //     </ThemedText>
    //   </ThemedView>
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type="subtitle">Step 2: Explore</ThemedText>
    //     <ThemedText>
    //       {`Tap the Explore tab to learn more about what's included in this starter app.`}
    //     </ThemedText>
    //   </ThemedView>
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
    //     <ThemedText>
    //       {`When you're ready, run `}
    //       <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
    //       <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
    //       <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
    //       <ThemedText type="defaultSemiBold">app-example</ThemedText>.
    //     </ThemedText>
    //   </ThemedView>
    // </ParallaxScrollView>
    <SafeAreaView>
      <ScrollView>
        <View className='flex flex-col p-4 gap-2'>
          
              
            {!user? (
              <ActivityIndicator color={"blue"}></ActivityIndicator>
            ):(
              <View className='flex flex-row gap-4 items-center'>
                <ProfileDropdown user={user}></ProfileDropdown>
                <View className='flex flex-col gap-1'>
                  <Text className='text-slate-700 font-semibold'>Welcome {user.name}</Text>
                  <Text className='text-slate-500 text-sm'>{user.credits} credits</Text>
                  
                </View>
                <View className='ml-auto flex flex-row gap-2 opacity-50'>
                  <TouchableOpacity onPress={()=>router.push("(platform)/engagement")}>
                    <Heart size={24}></Heart>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>router.push("(platform)/following")}>
                    <Users size={24}></Users>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>router.push("/(settings)")}>
                    <Settings size={24}/>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
          
          <View className='flex flex-col mt-4 gap-4'>
            <Text className='font-semibold text-2xl'>Keep Listening</Text>
            <View className='h-[300px]'>

              <ExplainerPagination
              pageResults={20}
              name={''}
              apiRoute={ "/explainers/user-history"}
              sortExplainer='podcasts'
              hideSearch
              hideCount
              hideSort
              isShowCase
              extraParams={{
                sortBy:"created",
                sortOrder:"desc"
              }}
              
              />
            </View>
          </View>
          <View className='flex flex-col gap-4 mt-4'>
            <Text className='font-semibold text-2xl'>For You</Text>
            <View className=''>

              <ExplainerPagination
              pageResults={20}
              name={''}
              apiRoute={ "/user/for-you"}
              // sortExplainer='podcasts'
              hideSearch
              hideCount
              hideSort
              // isShowCase
              // extraParams={{
              //   searchQuery: search && search.length > 1 ? search : undefined,
              //   category: selectedCategory?.id || null
              // }}
              
              />
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
