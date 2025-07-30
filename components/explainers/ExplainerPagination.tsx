"use client";

import SkeletonVideoThumbnail from "../videos/SkeletionVideoThumbnail";
import Pagination from "../ui/Pagination";
import VideoThumbnail from "@components/[locale]/videos/VideoThumbnail";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, JSX, useRef } from "react";

import { toast } from "react-toastify";

import { cn } from "../../../utils/css";
import Button from "@components/[locale]/common/Button";
import { PodcastThumbnail } from "../podcasts/PodcastThumbnail";
import { getWatchedUpToExplainerLengths } from "@utils/api/explainers";
import { IExplainerPodcast, IExplainerVideo } from "@/interfaces";
import React from 'react';
import { View, Text, Picker, TextInput, Button, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Search, SearchX } from 'lucide-react-native';

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
  customResults?: IExplainer[];
}) {
  const tran = useTranslations();
  const locale = useLocale();
  const resultsPerPage = pageResults || 3;
  const [page, setPage] = useState(pageNumber);
  const [Explainers, setExplainers] = useState<IExplainer[]>(customResults || []);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [count, setCount] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(!!customResults ? false : true);
  const [sortBy, setSortBy] = useState("views");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortType, setSortType] = useState("all");

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
    const explainersHistory = await getWatchedUpToExplainerLengths(explainers)
    console.log("Explainer histroy", explainersHistory)
    setExplainers(explainersHistory as any)
    
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
      let finalApiRoute = apiRoute;
      if (apiRoute.includes('/search') || apiRoute.includes('/trending')) {
        const url = new URL(apiRoute, window.location.origin);
        if (currentType !== 'all') {
          url.searchParams.set('type', currentType);
        }
        finalApiRoute = url.pathname + url.search;
      }
      
      const response = await axios.post(
        finalApiRoute,
        {
          ...extraParams,
          pageNumber: page,
          resultsPerPage,
          searchQuery: currentQuery,
          sortBy: currentSortBy,
          sortOrder: currentSortOrder,
          sortType: currentType,
          locale: locale,
        },
        { withCredentials: true }
      );
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
      toast.error(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch videos whenever the page number changes
  useEffect(() => {
    fetchExplainers(undefined, undefined, undefined, undefined, true);
  }, [page, apiRoute, extraParams]);



return (
  <ScrollView style={{ flex: 1, paddingHorizontal: 8, width: '100%' }}>
    {(name || !hideCount || !hideSearch || !hideSort) && (
      <View style={{ flexDirection: 'column', gap: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
            {name && <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{name}</Text>}
            {!hideCount && count != undefined && (
              <Text style={{ borderRadius: 12, paddingHorizontal: 12, fontSize: 14, backgroundColor: '#E2E8F0', color: '#3B82F6', borderWidth: 2 }}>
                {count}
              </Text>
            )}
          </View>
          {(!hideSearch || !hideSort) && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, width: '100%' }}>
              {!hideSort && (
                <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12, gap: 16 }}>
                  <Picker
                    selectedValue={sortType}
                    style={{ height: 40, width: 150 }}
                    onValueChange={(itemValue) => {
                      setSortType(itemValue);
                      fetchExplainers(searchQuery, undefined, undefined, itemValue);
                    }}
                  >
                    <Picker.Item label={tran("lbnr0k4f5y")} value="all" />
                    <Picker.Item label={tran("nglcs37abqm")} value="videos" />
                    <Picker.Item label={tran("oj42ykrvs9")} value="podcasts" />
                  </Picker>
                  {!hideSortBy && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12 }}>
                      <Picker
                        selectedValue={sortBy}
                        style={{ height: 40, width: 150 }}
                        onValueChange={(itemValue) => {
                          setSortBy(itemValue);
                          fetchExplainers(searchQuery, itemValue);
                        }}
                      >
                        <Picker.Item label={tran("9vbir7hm0y5")} value="views" />
                        <Picker.Item label={tran("6rpzd2fpjnj")} value="created" />
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
                <View style={{ width: 280, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB' }}>
                  <TextInput
                    onChangeText={handleSearchInput}
                    onSubmitEditing={handleSearch}
                    value={searchQuery}
                    placeholder={tran("uayocwmq8i")}
                    style={{ flex: 1, fontSize: 14, backgroundColor: 'transparent', paddingVertical: 8 }}
                  />
                  <TouchableOpacity onPress={handleSearch}>
                    <Search size={20}  style={{ padding: 8, color: '#9CA3AF' }} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    )}
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
      {!loading && Explainers.length === 0 && (
        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 16, minHeight: 400 }}>
          <SearchX size={48} style={{ color: '#9CA3AF' }} />
          <View style={{ flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#374151' }}>
              {tran("y5fexthdi2")}
            </Text>
            <Text style={{ color: '#6B7280', textAlign: 'center' }}>
              {searchQuery ? "Try adjusting your search query" : "No explainers are available at the moment"}
            </Text>
            {!hideCreateButton && !searchQuery && (
              <Button title={tran("8agffguos92")} onPress={() => {}} />
            )}
          </View>
        </View>
      )}
      {Explainers.map((explainer, index) => {
        if (explainer?.videoUrl || (explainer?.generating && !explainer?.sectionAudios))
          return (
            <VideoThumbnail
              errored={explainer.errored}
              generating={explainer.generating}
              key={index}
              video={explainer as IExplainerVideo}
            />
          );
        if (explainer?.sectionAudios)
          return <PodcastThumbnail key={index} podcast={explainer as any} />;
      })}
      {loading &&
        Array.from({ length: resultsPerPage }).map((_, index) => {
          return (
            <SkeletonVideoThumbnail key={index}></SkeletonVideoThumbnail>
          );
        })}
    </View>
    <Pagination
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  </ScrollView>
);
}
