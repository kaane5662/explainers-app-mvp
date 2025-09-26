import { ExplainerType } from "@/utils/constant";
import axios from "axios"
import { X } from "lucide-react-native";
import { useEffect, useState } from "react"
import { FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as WebBrowser from "expo-web-browser"
import { Image } from "expo-image";

interface ImageSource {
    title: string;  // Search query/title used to find image
    imageDescription: string;
    width: number;
    height: number;
    sourceUrl: string;
    path: string;   // Path in the sandbox
}

export default function ImageSourceResults({id,explainerType, onClose, visible}:{id:string,explainerType:ExplainerType, onClose:CallableFunction, visible:boolean}){
    const [imageSources,setImageSources] = useState<ImageSource[]>([])
    useEffect(()=>{
        const fetchImageSources = ()=>{
            const route = explainerType == ExplainerType.PODCAST ? "podcasts":"videos"
            axios.get(`${process.env.EXPO_PUBLIC_API_URL}/${route}/${id}/image-sources`)
            .then((response) => {
                console.log(response.data);
                if(response.data.imageSources)
                    setImageSources(response.data.imageSources)
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
                    
                    <Text className="text-xl font-semibold">Image Sources</Text>
                    <TouchableOpacity onPress={() => {}}>
                        <X 
                        onPress={()=>onClose()}
                        size={24} color="#666" />
                    </TouchableOpacity>
                </View>
                <ScrollView>

                    <View className="flex gap-4 flex-wrap flex-row p-4">
                        {imageSources.length > 0 ? (
                            <FlatList
                                data={imageSources}
                                numColumns={2}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item: imageSource, index }) => (
                                    <TouchableOpacity 
                                        key={index} 
                                        className="p-2 border border-gray-200 rounded-lg mb-3 bg-gray-50 flex-1 mx-1"
                                        style={{ maxWidth: '50%' }}
                                        onPress={async() => {
                                            // Open URL logic here
                                            await WebBrowser.openBrowserAsync(imageSource.sourceUrl)
                                        }}
                                    >
                                        <Image 
                                            style={{width:"100%", height: 100, marginBottom:10, borderRadius:12}}
                                            source={{uri: imageSource.sourceUrl}}
                                            resizeMode="cover"
                                        />
                                        <Text className="text-sm font-semibold mb-2" numberOfLines={2}>
                                            {imageSource.title}
                                        </Text>
                                        <Text className="text-xs text-slate-500" numberOfLines={3}>
                                            {imageSource.imageDescription}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                columnWrapperStyle={{ justifyContent: 'space-between' }}
                            />
                        ) : (
                            <View className="flex-1 items-center justify-center">
                                <Text className="text-gray-500 text-center">
                                    No search results available
                                </Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )
}