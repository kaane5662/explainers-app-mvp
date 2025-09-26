import { IExplainer } from "@/interfaces";
import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import clsx from 'clsx';
import { Download, Eye, EyeClosed, EyeOff, RefreshCcw, Trash, X } from "lucide-react-native";
import { ExplainerType, iconActions } from "@/utils/constant";
import axios from "axios";








export default function VideoResources({explainer, onClose, visible, explainerType}:{explainer:IExplainer,visible:boolean,onClose:any, explainerType:ExplainerType}){

    const [visiblePopup,setVisiblePopup] = useState<string|null>()
    

    
    

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
                        <Text className="text-lg font-bold mb-4">Explainer Resources</Text>
                        
                        <View className="flex flex-col mt-4 mb-4 w-full items-center px-6 gap-2">
                            {/* <TouchableOpacity 
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
                            )} */}
                            {iconActions.map((icon)=>(
                                <>
                                    {visiblePopup == icon.value &&(
                                        icon.popup(explainer.id,ExplainerType.VIDEO,()=>setVisiblePopup(null))
                                    )}
                                    <TouchableOpacity
                                        onPress={() => setVisiblePopup(icon.value)}
                                        key={icon.color}
                                        style={{ backgroundColor: icon.color }}
                                        className="flex flex-row items-center justify-center w-full gap-4 p-5 bg-slate-100 rounded-full border-slate-400"
                                    >
                                        {icon.icon}
                                        <Text className="font-semibold">{icon.label}</Text>
                                    </TouchableOpacity>
                                </>
                            ))}

                        </View>
                        
                    </View>
                </View>
            </Modal>
        
    );

    
}