import tailwindConfig from "@/tailwind.config";
import { explainerTypeOptions, TOPICS, videoStyleOptions } from "@/utils/common";
import { ExplainerType, lengths } from "@/utils/constant";
import axios from "axios";
import clsx from "clsx";
import { Clock } from "lucide-react-native";
import { useEffect, useState } from "react";
import { SafeAreaView, View,Text, TextInput, TouchableOpacity,ScrollView, Switch} from "react-native";
import ColorPicker, { HueSlider, OpacitySlider, Panel1, Panel2, Preview, Swatches } from "reanimated-color-picker";
const tailwindColors = tailwindConfig.theme?.extend?.colors;

const suggestions = TOPICS.sort(() => Math.random() - 0.5).slice(0, 4)
export default function CreateScreen(){
    const [explainerType,setExplainerType] = useState(ExplainerType.VIDEO)
    const [videoStyle,setVideoStyle] = useState(videoStyleOptions[0].example_label)
    const [useImages,setUseImages] = useState(false)
    const [webSearchEnabled,setWebSearchEnabled] = useState(false)
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [description,setDescription] = useState('')
    const [textColor, setTextColor] = useState("#000000");

    async function handleCreate(createParams: any) {
        const {
          type,
          podcastTheme,
          podcastVoice,
          isWebSearch,
          isImageSearch,
          length,
          videoTheme,
          backgroundColor,
          textColor,
          videoRatio,
          podcastVoices,
          numPodcastVoices
        } = createParams;
        console.log("Create params", createParams);
        // if (!isLoggedIn) {
        //   router.push("/auth/signup");
        //   return;
        // }
        
        // Validate that description is not empty
        // if (!description?.trim()) {
        //   toast.error(tran("bm13g2exhst"));
        //   return;
        // }
        
        const route = type == ExplainerType.PODCAST ? "podcasts" : "videos";
        // setLoading(true);
        try {
          const startTime = Date.now();
          // Construct theme with colors for videos
          const videoThemeWithColors = type == ExplainerType.VIDEO 
            ? `${videoTheme}${videoTheme ? ', ' : ''}${backgroundColor ? `Background: ${backgroundColor}, ` : ''}${textColor ? `text: ${textColor}` : ''}`
            : '';
    
          const res = await axios.post(
            `/api/${route}/create`,
            {
              description,
              ...(type == ExplainerType.REEL
                ? {
                    length:.5
                  }
              : {length}),
              // length,
              locale,
              websearchEnabled: isWebSearch,
              imageSearchEnabled: isImageSearch,
              ...(type == ExplainerType.VIDEO ? { 
                theme: videoThemeWithColors,
                videoRatio: videoRatio 
              } : {}),
              ...(type == ExplainerType.PODCAST
                ? {
                    voice: podcastVoice,
                    theme: podcastTheme,
                    generateAudio: true,
                    podcastVoices,
                    numPodcastVoices
                  }
                : {}),
                ...(type == ExplainerType.REEL
                  ? {
                      // isReel:true,
                      theme:videoThemeWithColors,
                      videoRatio:"9:16"
                    }
                  : {}),
            },
            { withCredentials: true }
          );
        //   if(isOnboarding && onVideoCreated){
        //     onVideoCreated({explainerType:type,explainerId:res.data.id});
        //   }else{
        // }
            router.push(`/${route}/${res.data.id}`);
          
        //   mixpanel.track("generate_content_completed", {
        //     content_type: "video",
        //     topic: currentTopicId || "no_topic",
        //     topic_name: currentTopicId
        //       ? TOPICS.find((t) => t.id === currentTopicId)?.name || "No Topic"
        //       : "No Topic",
        //     content_id: res.data.id,
        //     generation_time_ms: Date.now() - startTime,
        //     prompt_length: description?.length || 0,
        //     is_web_search: isWebSearch,
        //   });
        } catch (error: any) {
          console.log(error);
          if (error?.response?.status === 403) {
            console.log("You have run out of credits");
            // if(isOnboarding && onVideoCreated){
            //   onVideoCreated({explainerId:"no_credits", explainerType:null})
            // }else{
            //   setShowPaywall(true);
            // }
          }
        //   toast.error(error?.response?.data?.error || tran("vbm266q7s8"));
        //   mixpanel.track("generate_content_error", {
        //     content_type: "video",
        //     topic: currentTopicId || "no_topic",
        //     topic_name: currentTopicId
        //       ? TOPICS.find((t) => t.id === currentTopicId)?.name || "No Topic"
        //       : "No Topic",
        //     error_message: error?.response?.data?.error || "Error generating video",
        //     prompt_length: description?.length || 0,
        //   });
        } finally {
          // setLengthPopup(false);
          setLoading(false);
        }
      }
    
    // const [suggestions,setSuggestions] = useState()
    useEffect(()=>{

    })
    // const [enablePicker,setEnablePicker]
    return(
        <SafeAreaView>
            <ScrollView>

            <View className="p-4 flex flex-col gap-4 ">
                <View className="flex flex-col gap-0">
                    <Text className="font-semibold text-center text-4xl">Create Explainer</Text>
                    <Text className="text-center text-slate-500">Imagine an Explainer on any topic you want</Text>
                </View>
                <View className="mt-4 gap-1 flex">
                    <Text className="text-slate-500">Description</Text>
                    
                    <TextInput
                    value={description}
                    onChangeText={(t)=>setDescription(t)}
                    multiline={true} 
                    // numberOfLines={4}
                    className="p-2 rounded-xl flex h-[120px] bg-slate-200  flex-col gap-2 " placeholder="Enter a topic"></TextInput>
                    <ScrollView horizontal>
                        <View className="flex flex-row gap-2 mt-2 ">
                            {suggestions.map((topic) => {
                                // ensure topic stays same on re-rendert
                                const [randomSuggestion] = useState(() => {
                                    return topic.suggestion[Math.floor(Math.random() * topic.suggestion.length)];
                                });
                                return (
                                    <TouchableOpacity 
                                    onPress={()=>setDescription(randomSuggestion)}
                                    key={topic.id} className="flex p-2 bg-slate-200  rounded-xl flex-col w-[200px] gap-1">
                                        {/* {topic.icon} */}
                                        <Text className="text-slate-500 font-semibold">{topic.name}</Text>
                                        <Text className="text-sm text-slate-400">{randomSuggestion}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>
                    
                </View>

                <View className="flex flex-col gap-2">
                    <Text className="text-slate-500">Explainer Type</Text>
                    <View className="flex flex-row items-center gap-2">
                        {explainerTypeOptions.map((type)=>(
                            <TouchableOpacity 
                            onPress={()=>setExplainerType(type.value)}
                            className={
                                clsx("p-2 px-4 w-fit rounded-xl flex-row items-center flex gap-2 ", 
                            type.value == explainerType ? "bg-blue":"bg-slate-200 ")}>
                                {type.icon}
                                <Text className="text-sm">{type.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                {/* <View className="flex flex-col gap-2">
                    <Text className="text-slate-500">Explainer Length</Text>
                    <View className="flex items-center gap-4 flex-row">
                        {lengths.map((l)=>(
                            <TouchableOpacity className="p-2 w-fit rounded-xl flex-col flex gap-2 bg-slate-200  border-slate-500 border">
                                <Text>{l.label}</Text>
                                <Clock></Clock>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View> */}
                <View className="flex flex-col gap-2">
                    <Text className="text-slate-400">Video Style</Text>
                    <View className="flex flex-col gap-1">
                        {/* <Text className="text-slate-400 text-sm">Video Style Presets</Text> */}
                        <ScrollView horizontal>
                            <View 
                            className="flex flex-row items-center gap-2">
                                {videoStyleOptions.map((o)=>(
                                    <TouchableOpacity
                                    onPress={()=>setVideoStyle(o.example_label)} 
                                    className={clsx("p-1 rounded-full px-2", videoStyle == o.example_label ? "bg-blue" : "bg-gray-200")}>
                                        <Text className={clsx(videoStyle == o.example_label ? "text-white" : "text-slate-400")}>{o.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                    <TextInput multiline value={videoStyle} 
                    onChangeText={(t)=>setVideoStyle(t)}
                    className="p-3 rounded-xl h-[100px] bg-slate-200 " placeholder="Enter a style"></TextInput>
                </View>
                <View className="flex flex-row gap-2 mt-4">
                    <View className="flex flex-row items-center ">
                        <Switch
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                            value={useImages}
                            onValueChange={setUseImages}
                            trackColor={{ false: "bg-slate-200 ", true: tailwindColors["blue"] }}
                            thumbColor={useImages ? "text-white" : "text-slate-500"}
                        />
                        <Text className="text-slate-500 text-sm">Use Images</Text>
                    </View>
                    <View className="flex flex-row items-center ">
                        <Switch
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                            value={webSearchEnabled}
                            onValueChange={setWebSearchEnabled}
                            trackColor={{ false: "bg-slate-200 ", true: tailwindColors["blue"] }}
                            thumbColor={useImages ? "text-white" : "text-slate-500"}
                        />
                        <Text className="text-slate-500 text-sm">Use Web Search</Text>
                    </View>
                    
                    
                    
                </View>
                {/* <ScrollView className="flex flex-col gap-2">
                    <Text className="text-slate-400">Colors</Text>
                    <View className="flex flex-row gap-2 items-center">
                        <View 

                        className="w-full">
                        <ColorPicker
                        value="#dddddd"
                        onComplete={(c)=>setBackgroundColor(c.hex)}
                        >
                            <Preview />
                            <View>
                                <Panel1 />
                                <HueSlider  />
                            </View>
                        </ColorPicker>
                            
                        </View>
                    </View>
                </ScrollView> */}
                <TouchableOpacity className="bg-blue mb-32 items-center p-4 rounded-full">
                    <Text className="font-semibold text-xl text-white">Create</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}