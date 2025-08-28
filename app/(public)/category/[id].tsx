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
import { ALL_CATEGORY, VIDEO_CATEGORIES } from '@/utils/common';
import ExplainerPagination from '@/components/explainers/ExplainerPagination';
import { ExplainerType } from '@/utils/constant';
import clsx from 'clsx';
import { router, useLocalSearchParams } from 'expo-router';

export default function CategorySearch() {
    const {id} = useLocalSearchParams()
    const [search,setSearch] = useState('')
    // const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [explainerType,setExplainerType] = useState("podcasts")
    const selectedCategory = VIDEO_CATEGORIES.find((v) => v.id === id) || ALL_CATEGORY;
    
  
    return (
      <SafeAreaView className='p-4 flex flex-col'>
        <ScrollView className='p-4'>
          
            <View className='-p-4'>

                {/* <View className='p-2'>
                <TouchableOpacity onPress={() => setSelectedCategory(null)} className='ml-auto'>
                    <SearchIcon></SearchIcon>
                </TouchableOpacity>
                </View> */}
                <View
                style={{ backgroundColor: selectedCategory.color }}
                className='flex flex-col rounded-2xl gap-2 pb-8 p-4'
                // entering={Animated.spring({ damping: 20, stiffness: 100 }).from({ translateY: 100 })}
                >
                <View className='flex flex-row justify-between items-center'>
                    {selectedCategory.icon}
                    <TouchableOpacity
                        onPress={()=>router.push("/explore")}>
                        <Search></Search>
                    </TouchableOpacity>
                </View>
                <Text className='text-2xl mt-2 font-bold'>{selectedCategory.label}</Text>
                <Text className='text-slate-700 text-lg'>{selectedCategory.description}</Text>
                </View>
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
                <View className='h-[200px]'>
                  
                  <ExplainerPagination
                    pageResults={20}
                    name={''}
                    apiRoute={ !selectedCategory ? "/explainers":`/explainers/category`}
                    sortExplainer='podcasts'
                    hideSearch
                    hideCount
                    hideSort
                    numRows={2}
                    isShowCase
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
                <View className='h-[600px]'>
  
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
              
            </View>
          )}
          
  
        </ScrollView>
      </SafeAreaView>
    );
  }