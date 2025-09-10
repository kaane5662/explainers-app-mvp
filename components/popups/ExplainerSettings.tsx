import { IExplainer } from "@/interfaces";
import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import clsx from 'clsx';
import { Download, Eye, EyeClosed, EyeOff, RefreshCcw, Trash, X } from "lucide-react-native";
import { ExplainerType } from "@/utils/constant";
import axios from "axios";
import { router } from "expo-router";
import { useUser } from "@/hooks/useUser";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';


function ConfirmDeleteModal({ visible, onConfirm, onCancel }: { visible: boolean, onConfirm: () => void, onCancel: () => void }){
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View className="flex-1 justify-center items-center  bg-opacity-50">
                <View className="bg-white rounded-lg p-6 w-80">
                    <Text className="text-lg font-bold mb-4">Confirm Delete</Text>
                    <Text className="text-sm text-gray-700 mb-6">
                        Are you sure you want to delete this explainer? This action cannot be undone.
                    </Text>
                    <View className="flex-row justify-end gap-4">
                        <TouchableOpacity onPress={onCancel} className="p-3 bg-gray-200 rounded-full px-6">
                            <Text className="text-gray-800">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onConfirm} className="p-3 bg-red-600 rounded-full px-6">
                            <Text className="text-white">Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}



export default function ExplainerSettings({explainer, onClose, visible, explainerType}:{explainer:IExplainer,visible:boolean,onClose:any, explainerType:ExplainerType}){
    const [explainerPublic,setExplainerPublic] = useState(explainer.public)
    const [confirmDelete,setConfirmDelete] = useState(false)
    const [downloading,setDownloading] = useState(false)
    const {user} = useUser()
    const route = explainerType === ExplainerType.PODCAST ? "podcasts" : "videos";

    const changeExplainerPublic = async () => {
        try {
          const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/${route}/${explainer.id}/publicity`,{withCredentials:true});
          const data = response.data;
          // console.log(data)
          setExplainerPublic(!explainerPublic)
          Alert.alert('Settings changed successfully', data.message);
        } catch (error:any) {
          console.error('Error fetching followers:', error);
          if (axios.isAxiosError(error) && error.response) {
            error.response.statusText
            Alert.alert(error.response.statusText ||'Error', error.response.data.error || 'An error occurred');
        } else {
            Alert.alert('Error', 'An unexpected error occurred');
        }
        //   Alert.alert(error.response.status, error.response.data.error)
        }
      };
    const regenerateExplainer = async () => {
        try {
          const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/${route}/regenerate/${explainer.id}`,{},{withCredentials:true});
          const data = response.data;
          router.replace("(tabs)/")
          Alert.alert('Regeneration started', data.message);
          
          // console.log(data)
        //   setExplainerPublic(!explainerPublic)
        } catch (error) {
            console.error('Error fetching followers:', error);
            if (axios.isAxiosError(error) && error.response) {
                Alert.alert(error.response.statusText ||'Error', error.response.data.error || 'An error occurred');
            } else {
                Alert.alert('Error', 'An unexpected error occurred');
            }
            // Alert.alert(error.response.status, error.response.data.error)
        }
    };


    const deleteExplainer = async () => {
        try {
          const response = await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/${route}/${explainer.id}`,{withCredentials:true});
          const data = response.data;
          
          router.push("(tabs)/")

          // console.log(data)
        //   setExplainerPublic(!explainerPublic)
        } catch (error) {
            console.error('Error fetching followers:', error);
            if (axios.isAxiosError(error) && error.response) {
                Alert.alert(error.response.statusText ||'Error', error.response.data.error || 'An error occurred');
            } else {
                Alert.alert('Error', 'An unexpected error occurred');
            }
        }
    };

    async function onExportVideo() {
    

        // Toggle downloading state
        setDownloading(true);
    
        try {
          // Open download in new window (will be converted to download by Content-Disposition header)
        //   window.open(`/api/${route}/${explainer.id}/export`, "_blank");
          
          
          const url = `${process.env.EXPO_PUBLIC_API_URL}/${route}/${explainer.id}/export`
        //   console.log(user?.plan)
          if(user?.plan != "premium"){
            Alert.alert("Forbidden 403","You must have premium to export explainers");
            setDownloading(false);
            return
          }
          const response = await fetch(url, { method: "HEAD" });
            const contentDisposition = response.headers.get("Content-Disposition");
            
            let filename = "downloaded-file";
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/i);
                if (match) filename = match[1];
            }
            const fileUri = FileSystem.documentDirectory+filename
          const { uri, status } = await FileSystem.downloadAsync(url, fileUri);
          
          console.log("download stuff",status,uri)
          // Reset downloading state after a short delay
        //   Alert.alert('Downloaded explainer', "Downloaded explainer in your documents folder");
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri); // `uri` from downloadAsync
          }
          setTimeout(() => {
            setDownloading(false);
          }, 1000);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                Alert.alert(error.response.statusText ||'Error', error.response.data.error || 'An error occurred');
            } else {
                Alert.alert('Error', 'An unexpected error occurred');
            }
        }
      }

    

    return (
        

            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <View className="flex-1 justify-center  items-center bg-black/30">
                    {confirmDelete &&(
                        <ConfirmDeleteModal visible={confirmDelete} onCancel={()=>setConfirmDelete(false)} onConfirm={()=>deleteExplainer()}></ConfirmDeleteModal>
                    )}
                    <View className="bg-white rounded-2xl items-center absolute bottom-0 w-full p-4">
                        <TouchableOpacity onPress={onClose} className="absolute top-2 right-2">
                            <X/>
                        </TouchableOpacity>
                        <Text className="text-lg font-bold mb-4">Explainer Settings</Text>
                        
                        <View className="flex flex-col mt-4 mb-4 w-full items-center px-6 gap-2">
                            <TouchableOpacity 
                                onPress={() => {
                                    onExportVideo()
                                    // setModalVisible(false);
                                }} 
                                className={clsx(" flex flex-row relative items-center gap-4 px-6 bg-slate-100 rounded-full p-3 w-full ")}
                            >
                                <Download></Download>
                                <Text className="">Download Explainer</Text>
                                {!downloading ?(
                                    <Text className="text-sm text-blue font-semibold ml-auto">Premium</Text>
                                ):(
                                    <ActivityIndicator className="ml-auto"></ActivityIndicator>
                                )}
                            </TouchableOpacity>
                            {explainer.user.id == user?.id&&(
                                <>
                                <TouchableOpacity 
                                    onPress={() => {
                                        changeExplainerPublic()
                                        // setModalVisible(false);
                                    }} 
                                    className={clsx(" flex flex-row items-center gap-4 px-6 bg-slate-100 rounded-full p-3 w-full ")}
                                >
                                    {!explainerPublic ?(
                                        <>
                                        <Eye></Eye>
                                        <Text className="">Set Explainer Public</Text>
                                        </>
                                    ):(
                                        <>
                                        <EyeOff></EyeOff>
                                        <Text className="">Set Explainer Private</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => {
                                        regenerateExplainer()
                                        // setModalVisible(false);
                                    }} 
                                    className={clsx(" flex flex-row items-center gap-4 px-6 bg-slate-100 rounded-full p-3 w-full ")}
                                >
                                    <RefreshCcw color={"black"}></RefreshCcw>
                                    <Text className="">Regenerate Explainer</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => {
                                        setConfirmDelete(true)
                                        // setModalVisible(false);
                                    }} 
                                    className={clsx(" flex flex-row items-center gap-4 px-6 bg-slate-100 rounded-full p-3 w-full ")}
                                >
                                    <Trash color={"red"}></Trash>
                                    <Text className="text-red-500">Delete Explainer</Text>
                                </TouchableOpacity>
                                </>
                            )}

                        </View>
                        
                    </View>
                </View>
            </Modal>
        
    );

    function regenerateVideo(videoId: string) {
        // Logic to regenerate video
        console.log(`Regenerating video with ID: ${videoId}`);
    }

    function deleteVideo(videoId: string) {
        // Logic to delete video
        console.log(`Deleting video with ID: ${videoId}`);
    }

    function setVideoPublic(videoId: string, isPublic: boolean) {
        // Logic to set video public
        console.log(`Setting video with ID: ${videoId} to public: ${isPublic}`);
    }
}