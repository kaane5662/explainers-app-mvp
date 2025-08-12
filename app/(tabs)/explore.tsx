import { Image } from 'expo-image';
import { Platform, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View,Text, ScrollView } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useSafeAreaEnv } from 'nativewind';
import { useState } from 'react';
import { Search, SearchIcon } from 'lucide-react-native';
// import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';
import { VIDEO_CATEGORIES } from '@/utils/common';
import ExplainerPagination from '@/components/explainers/ExplainerPagination';
import { ExplainerType } from '@/utils/constant';
import clsx from 'clsx';
import { router } from 'expo-router';

export default function Explore() {
  const [search,setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [explainerType,setExplainerType] = useState("podcasts")
  const sortTypes = [
    {label:"Videos", value:"videos"},
    {label:"Podcasts", value:"podcasts"}
  ]
  

  return (
    <SafeAreaView className='p-4 flex flex-col'>
      <ScrollView className='p-4'>
      

        <View className='flex flex-col gap-4'>
          <Text className=' font-bold text-4xl '>Explore</Text>
          <TouchableOpacity className='p-0 gap-4 bg-slate-200 rounded-xl flex flex-row items-center'>
            <Search size={20} className=' font-bold text-zinc-300 w-fit '></Search>
            <TextInput className='p-3' onChangeText={(t)=>setSearch(t)} placeholder='Search'>

            </TextInput>
          </TouchableOpacity>

        </View>
        
        {search.length > 0 && (
          // search filters
          <View>
            {/* <View className='flex flex-row gap-2 mt-4 p-2'>
              {sortTypes.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  className={clsx("px-4 p-2 rounded-full", s.value == explainerType ? "bg-blue" : "bg-slate-200")}
                  onPress={() => setExplainerType(s.value)}
                >
                  <Text className={clsx(s.value == explainerType && "text-white")}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
       */}
            <View className='flex flex-col gap-4 '>
              <View>
                <ExplainerPagination
                  pageResults={20}
                  name={''}
                  apiRoute={"/explainers"}
                  extraParams={{ sortType: explainerType, searchQuery:search }}
                  hideSearch
                  hideCount
                  hideSortBy
                  // hideSort
                />
              </View>
            </View>
          </View>
        )}
        
        {search.length < 1 &&(
          <View>
            {/* podcasts */}
            <View className='flex flex-col gap-4 mt-4'>
              <Text className='text-2xl font-semibold'>Trending Podcasts</Text>
              <View className='h-[250px]'>
                
                <ExplainerPagination
                  pageResults={20}
                  name={''}
                  apiRoute={ !selectedCategory ? "/explainers":`/explainers/category`}
                  sortExplainer='podcasts'
                  hideSearch
                  hideCount
                  hideSort
                  extraParams={{
                    searchQuery: search && search.length > 1 ? search : undefined,
                    category: selectedCategory?.id || null
                  }}
                  
                  />
                  
              </View>
                
              
            </View>
            {/* reels */}
            <View className='flex flex-col gap-4 mt-4'>
              <Text className='text-2xl font-semibold'>Trending Reels</Text>
              <View className='h-[300px]'>

                <ExplainerPagination
                  pageResults={20}
                  name={''}
                  apiRoute={ !selectedCategory ? "/explainers":`/explainers/category`}
                  sortExplainer='videos'
                  hideSearch
                  hideCount
                  extraParams={{
                    searchQuery: search && search.length > 1 ? search : undefined,
                    category: selectedCategory?.id || null
                  }}
                  hideSort
                  
                  />
                  
              </View>
                
              
            </View>
            {/* categories */}
            <View className='flex mt-8 flex-col gap-4 mb-32'>
              <Text className='text-2xl font-semibold'>Categories</Text>
              <ScrollView horizontal>
                <View className='flex flex-row gap-4'>
                  {VIDEO_CATEGORIES.map((category, i) => {
                    return (
                      <TouchableOpacity onPress={()=>router.push(`/category/${category.id}`)} style={{backgroundColor:category.color}} className='rounded-xl flex flex-col gap-2 p-2 h-fit w-[150px] bg-slate-200'>
                        <Text className='text-xl font-semibold '>{category.label}</Text>
                        <View className='text-white '>
                          {category.icon}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </View>
        )}
        

      </ScrollView>
    </SafeAreaView>
  );
}


