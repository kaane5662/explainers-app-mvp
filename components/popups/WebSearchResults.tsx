import { ExplainerType } from "@/utils/constant";
import axios from "axios"
import { Globe, X } from "lucide-react-native";
import { useEffect, useState } from "react"
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as WebBrowser from "expo-web-browser"
import tailwindConfig from "@/tailwind.config";

interface WebSearch {
    title: string;
    url: string;
}

export default function WebSearchResults({id,explainerType, onClose, visible}:{id:string,explainerType:ExplainerType, onClose:CallableFunction, visible:boolean}){
    const [webSearches,setWebSearches] = useState<WebSearch[]>([])
    useEffect(()=>{
        const fetchImageSources = ()=>{
            const route = explainerType == ExplainerType.PODCAST ? "podcasts":"videos"
            axios.get(`${process.env.EXPO_PUBLIC_API_URL}/${route}/${id}/web-searches`)
            .then((response) => {
                console.log(response.data);
                if(response.data.webSearches)
                    setWebSearches(response.data.webSearches)
            })
            .catch((error) => {
                console.error('Error fetching search results:', error);
            });
        }

        fetchImageSources()

    },[id])

    
    return(
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => onClose()}
        
        >
            <View className="flex-1 bg-white">
                <View className="flex flex-row items-center border-b border-slate-200 justify-between p-4 ">
                    
                    <Text className="text-xl font-semibold">Web Search Results</Text>
                    <TouchableOpacity onPress={() => {}}>
                        <X 
                        onPress={()=>onClose()}
                        size={24} color="#666" />
                    </TouchableOpacity>
                </View>
                
                <ScrollView className="flex-1 p-4">
                    {webSearches.length > 0 ? (
                        webSearches.map((search, index) => (
                            <TouchableOpacity 
                                key={index} 
                                className="p-4 border border-gray-200 rounded-lg mb-3 bg-gray-50"
                                onPress={async() => {
                                    // Open URL logic here
                                    await WebBrowser.openBrowserAsync(search.url)
                                }}
                            >   
                                <View className="gap-2 flex flex-row items-center">
                                    <Globe color={tailwindConfig.theme?.extend?.colors.blue}></Globe>
                                    <Text className="text-lg font-medium text-gray-900 mb-2">
                                        {search.title}
                                    </Text>
                                </View>
                                <Text className="text-sm text-slate-500" numberOfLines={1}>
                                    {search.url}
                                </Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-gray-500 text-center">
                                No search results available
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </Modal>
    )
}