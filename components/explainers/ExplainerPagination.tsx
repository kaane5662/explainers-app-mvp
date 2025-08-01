"use client";

// import SkeletonVideoThumbnail from "../videos/SkeletionVideoThumbnail";
import Pagination from "../ui/Pagination";
// import VideoThumbnail from "@components/[locale]/videos/VideoThumbnail";
import axios from "axios";
// import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, JSX, useRef } from "react";

// import { toast } from "react-toastify";

import clsx from "clsx";
// import SpecialButton from "../common/SpecialButton";
import { PodcastThumbnail } from "../podcasts/PodcastThumbnail";
// import { getWatchedUpToExplainerLengths } from "@utils/api/explainers";
import { IExplainerPodcast, IExplainerVideo } from "@/interfaces";
import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Loader, Search, SearchX } from 'lucide-react-native';
import { Picker } from "@react-native-picker/picker";
import PodcastThumbnail2 from "../podcasts/PodcastThumbnail2";
import VideoThumbnail from "../videos/VideoThumbnail";
interface IExplainer extends IExplainerVideo, IExplainerPodcast {}

export default function ExplainerPagination({
  name,
  apiRoute,
  pageResults,
  setPollVideos: setPollExplainers,
  extraParams,
  hideSearch = false,
  hideCreateButton = false,
  hideSort = false,
  hideCount = false,
  pageNumber = 1,
  hideSortBy = false,
  customResults,
  sortExplainer
}: {
  name: string | JSX.Element;
  apiRoute?: string;
  pageResults?: number;
  setPollVideos?: CallableFunction;
  extraParams?: Record<string, any>;
  hideSearch?: boolean;
  hideCreateButton?: boolean;
  hideSort?: boolean;
  hideCount?: boolean;
  pageNumber?: number;
  hideSortBy?: boolean;
  sortExplainer?:string;
  customResults?: IExplainer[];
}) {
 
  const resultsPerPage = pageResults || 3;
  const [page, setPage] = useState(pageNumber);
  const [Explainers, setExplainers] = useState<IExplainer[]>(customResults || []);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [count, setCount] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(!!customResults ? false : true);
  const [sortBy, setSortBy] = useState("views");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortType, setSortType] = useState(sortExplainer||"all");

  // Track last used parameters to prevent unnecessary fetches
  const lastFetchParams = useRef({
    query: searchQuery,
    page: page,
    sortBy: sortBy,
    sortOrder: sortOrder,
    type: sortType,
    ...extraParams,
  });

  // Effect to update Explainers when customResults changes
  useEffect(() => {
    
    if (customResults) {
      setExplainers(customResults);
      setTotalPages(customResults.length === 0 ? 0 : 1);
      setCount(customResults.length);
      setLoading(false);
    }
  }, [customResults]);

  /**
   * Handles the search action by either fetching videos immediately (if on page 1)
   * or resetting to page 1 (which triggers a fetch via useEffect)
   */
  const handleSearch = () => {
    // Set loading state immediately when search is triggered
    setLoading(true);
    
    if (page === 1) {
      fetchExplainers();
    } else {
      setPage(1);
    }
  };

  /**
   * Updates the search query state when the input value changes
   */
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    
    // Clear results and set loading state if text is typed and we're not showing custom results
    if (e.target.value.trim() && !customResults) {
      setLoading(true);
    }
  };

  /**
   * Triggers the search action when the Enter key is pressed
   * @param e Keyboard event from the search input
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /**
   * Checks if the fetch parameters have changed from last request
   */
  const shouldFetch = (
    currentQuery: string,
    currentPage: number,
    currentSortBy: string,
    currentSortOrder: string,
    currentType: string
  ) => {
    const hasChanged =
      currentQuery !== lastFetchParams.current.query ||
      currentPage !== lastFetchParams.current.page ||
      currentSortBy !== lastFetchParams.current.sortBy ||
      currentSortOrder !== lastFetchParams.current.sortOrder ||
      currentType !== lastFetchParams.current.type;

    if (hasChanged) {
      lastFetchParams.current = {
        query: currentQuery,
        page: currentPage,
        sortBy: currentSortBy,
        sortOrder: currentSortOrder,
        type: currentType,
      };
      return true;
    }
    return false;
  };

  /**
   * Fetches last watched up to time from the API based on current explainers
   */
  async function getExplainersWatchTime(explainers:IExplainer[]) {
    if(!explainers) return
    if(explainers.length == 0) return
    // const explainersHistory = await getWatchedUpToExplainerLengths(explainers)
    // console.log("Explainer histroy", explainersHistory)
    // setExplainers(explainersHistory as any)
    
  }

  /**
   * Fetches videos from the API based on current pagination, search, and sorting parameters
   */
  async function fetchExplainers(
    currentQuery = searchQuery,
    currentSortBy = sortBy,
    currentSortOrder = sortOrder,
    currentType = sortType,
    forceFetch = false
  ) {
    // If we have custom results, don't fetch from API
    if (customResults) {
      setExplainers(customResults);
      setTotalPages(customResults.length === 0 ? 0 : 1);
      setCount(customResults.length);
      setLoading(false);
      return;
    }

    // Check if we need to fetch and have a valid apiRoute
    if (
      (!shouldFetch(
        currentQuery,
        page,
        currentSortBy,
        currentSortOrder,
        currentType
      ) &&
      !forceFetch) || 
      !apiRoute
    ) {
      return;
    }

    try {
      setExplainers([]);
      setLoading(true);
      console.log(sortBy);
      
      // Append type as query parameter for search and trending endpoints
      let finalApiRoute = process.env.EXPO_PUBLIC_API_URL + apiRoute;
      if (apiRoute.includes('/search') || apiRoute.includes('/trending')) {
        const url = new URL(apiRoute, window.location.origin);
        if (currentType !== 'all') {
          url.searchParams.set('type', currentType);
        }
        finalApiRoute = url.pathname + url.search;
      }
      console.log(finalApiRoute)
      const response = await axios.post(
        finalApiRoute,
        {
          
          pageNumber: page,
          resultsPerPage,
          searchQuery: currentQuery,
          sortBy: currentSortBy,
          sortOrder: currentSortOrder,
          sortType: currentType,
          ...extraParams,
          locale: "en",
        },
        { withCredentials: true }
      );
      console.log(response.data.explainers)
      setExplainers(prev=>response.data.explainers);
      getExplainersWatchTime(response.data.explainers)
      setPollExplainers?.(response.data.explainers);
      
      // Set totalPages to 0 if there are no explainers
      if (response.data.explainers.length === 0) {
        setTotalPages(0);
      } else {
        setTotalPages(response.data.pages);
      }
      
      setCount(response.data.count);
    } catch (error: any) {
    //   toast.error(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch videos whenever the page number changes
  useEffect(() => {
    console.log("Hello there")
    fetchExplainers(undefined, undefined, undefined, undefined, true);
  }, [page, apiRoute, extraParams]);



return (
  <ScrollView className="flex-col px-2 h-full w-full">
    {(name || !hideCount || !hideSearch || !hideSort) && (
      <View className="flex-col gap-4">
        <View className="flex-row justify-between flex-wrap">
          <View className="flex-row gap-4 items-center">
            {name && <Text className="font-bold text-2xl">{name}</Text>}
            {!hideCount && count != undefined && (
              <Text className="rounded-lg px-3 text-sm bg-gray-200 text-blue-500 border-2">
                {count}
              </Text>
            )}
          </View>
          {(!hideSearch || !hideSort) && (
            <View className="flex-row flex-wrap gap-2 w-full">
              {!hideSort && (
                <View className="flex-row items-center rounded-lg gap-4">
                  <Picker
                    selectedValue={sortType}
                    style={{ height: 40, width: 150 }}
                    onValueChange={(itemValue) => {
                      setSortType(itemValue);
                      fetchExplainers(searchQuery, undefined, undefined, itemValue);
                    }}
                  >
                    <Picker.Item label={"All"} value="all" />
                    <Picker.Item label={"Videos"} value="videos" />
                    <Picker.Item label={"Podcasts"} value="podcasts" />
                  </Picker>
                  {!hideSortBy && (
                    <View className="flex-row items-center rounded-lg">
                      <Picker
                        selectedValue={sortBy}
                        style={{ height: 40, width: 150 }}
                        onValueChange={(itemValue) => {
                          setSortBy(itemValue);
                          fetchExplainers(searchQuery, itemValue);
                        }}
                      >
                        <Picker.Item label={"Views"} value="views" />
                        <Picker.Item label={"Created"} value="created" />
                      </Picker>
                      <TouchableOpacity
                        onPress={() => {
                          const newOrder = sortOrder === "desc" ? "asc" : "desc";
                          setSortOrder(newOrder);
                          fetchExplainers(searchQuery, sortBy, newOrder);
                        }}
                      >
                        {sortOrder === "desc" ? (
                          <ArrowDownWideNarrow size={20} />
                        ) : (
                          <ArrowUpWideNarrow size={20} />
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
              {!hideSearch && (
                <View className="w-70 flex-row items-center rounded-lg px-3 py-2 bg-white border border-gray-300">
                  <TextInput
                    onChangeText={handleSearchInput}
                    onSubmitEditing={handleSearch}
                    value={searchQuery}
                    placeholder={"Search"}
                    className="flex-1 text-sm bg-transparent py-2"
                  />
                  <TouchableOpacity onPress={handleSearch}>
                    <Search size={20} className="p-2 text-gray-400" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    )}
    <View className="flex-row flex-wrap gap-4">
      {!loading && Explainers.length === 0 && (
        <View className="flex-col items-center justify-center flex-1 gap-4 min-h-100">
          <SearchX size={48} className="text-gray-400" />
          <View className="flex-col items-center gap-2">
            <Text className="text-xl font-bold text-gray-700">
              {"Hello"}
            </Text>
            <Text className="text-gray-500 text-center">
              {searchQuery ? "Try adjusting your search query" : "No explainers are available at the moment"}
            </Text>
            {/* {!hideCreateButton && !searchQuery && (
              <SpecialButton title={"Create"} onPress={() => {}} />
            )} */}
          </View>
        </View>
      )}
      <ScrollView>
        <View className="flex flex-col gap-8">
            {Explainers.map((explainer, index) => {
                if(explainer.sectionAudios){
                    return <PodcastThumbnail2
                    key={index}
                     podcast={explainer as any} />
                }else{
                    return <VideoThumbnail
                    key={index}
                     video={explainer as any} />
                }
            })}
        </View>
      </ScrollView>
      {loading &&
        <Loader />
      }
    </View>
    <Pagination
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  </ScrollView>
);
}
