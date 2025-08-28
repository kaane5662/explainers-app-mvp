import { IExplainer } from "@/interfaces";
import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import clsx from 'clsx';
import { Eye, RefreshCcw, Trash, X } from "lucide-react-native";


export default function ExplainerSettings({explainer, onClose, visible}:{explainer:IExplainer,visible:boolean,onClose:any}){


    return (
        

            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <View className="flex-1 justify-center  items-center bg-black/30">
                    <View className="bg-white rounded-2xl items-center absolute bottom-0 w-full p-4">
                        <TouchableOpacity onPress={onClose} className="absolute top-2 right-2">
                            <X/>
                        </TouchableOpacity>
                        <Text className="text-lg font-bold mb-4">Explainer Settings</Text>
                        
                        <View className="flex flex-col mt-4 mb-4 w-full items-center px-6 gap-2">
                            <TouchableOpacity 
                                onPress={() => {
                                    deleteVideo(explainer.id);
                                    // setModalVisible(false);
                                }} 
                                className={clsx(" flex flex-row items-center gap-4 px-6 bg-slate-100 rounded-full p-3 w-full ")}
                            >
                                <Eye></Eye>
                                <Text className="">Set Explainer Public</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => {
                                    deleteVideo(explainer.id);
                                    // setModalVisible(false);
                                }} 
                                className={clsx(" flex flex-row items-center gap-4 px-6 bg-slate-100 rounded-full p-3 w-full ")}
                            >
                                <RefreshCcw color={"black"}></RefreshCcw>
                                <Text className="">Regenerate Explainer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => {
                                    deleteVideo(explainer.id);
                                    // setModalVisible(false);
                                }} 
                                className={clsx(" flex flex-row items-center gap-4 px-6 bg-slate-100 rounded-full p-3 w-full ")}
                            >
                                <Trash color={"red"}></Trash>
                                <Text className="text-red-500">Delete Explainer</Text>
                            </TouchableOpacity>

                        </View>
                        
                        {/* <TouchableOpacity 
                            onPress={() => setModalVisible(false)} 
                            className={clsx(" bg-gray-500 mt-4")}
                        >
                            <Text className="">Close</Text>
                        </TouchableOpacity> */}
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