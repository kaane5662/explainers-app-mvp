import tailwindConfig from "@/tailwind.config";
import { explainerTypeOptions, TOPICS, videoStyleOptions, voiceOptions, voiceThemeOptions } from "@/utils/common";
import { ExplainerType, lengths } from "@/utils/constant";
import axios from "axios";
import clsx from "clsx";
import { router } from "expo-router";
import { ChevronDown, ChevronUp, Clock, Sparkle, Sparkles } from "lucide-react-native";
import { useEffect, useState } from "react";
import { SafeAreaView, View,Text, TextInput, TouchableOpacity,ScrollView, Switch, ActivityIndicator} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import ColorPicker, { HueSlider, OpacitySlider, Panel1, Panel2, Preview, Swatches } from "reanimated-color-picker";
const tailwindColors = tailwindConfig.theme?.extend?.colors;

const suggestions = TOPICS.sort(() => Math.random() - 0.5).slice(0, 4)
export default function CreateScreen(){
    const [type,setType] = useState(ExplainerType.REEL)
    const [videoTheme,setVideoTheme] = useState(videoStyleOptions[0].example_label)
    // const [videoTheme,setVideoTheme] = useState(videoStyleOptions[0].example_label)
    const [useImages,setUseImages] = useState(false)
    const [webSearchEnabled,setWebSearchEnabled] = useState(false)
    
    const [length,setLength] = useState(lengths[0].length)
    const [description,setDescription] = useState('')


    // video/reel specifc states
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [textColor, setTextColor] = useState("#000000");
    const [videoRatio, setVideoRatio] = useState("9:16");
    

    // Podcast specific states
    const [podcastTheme, setPodcastTheme] = useState(
        ""
    );
    const [podcastThemePreset,setPodcastThemePreset] = useState('')
    const [podcastVoice, setPodcastVoice] = useState(voiceOptions[0].value);
    const [numPodcastVoices,setNumPodcastVoices] = useState(1)
    const [podcastVoices,setPodcastVoices] = useState<string[]>([voiceOptions[0].value])
    const [customPodcastTheme, setCustomPodcastTheme] = useState(false);
    const [isVoiceDropdownOpen,setIsVoiceDropdownOpen] = useState<boolean[]>([false])
    const [loading,setLoading] = useState(false)
    async function handleCreate() {
        
        // console.log("Create params", createParams);
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
        setLoading(true);
        try {
          const startTime = Date.now();
          // Construct theme with colors for videos
          const videoThemeWithColors = type == ExplainerType.VIDEO 
            ? `${videoTheme}${videoTheme ? ', ' : ''}${backgroundColor ? `Background: ${backgroundColor}, ` : ''}${textColor ? `text: ${textColor}` : ''}`
            : '';
    
          const res = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URL}/${route}/create`,
            {
              description,
              ...(type == ExplainerType.REEL
                ? {
                    length:.5
                  }
              : {length}),
              // length,
              locale:"en",
              websearchEnabled: webSearchEnabled,
              imageSearchEnabled: useImages,
            //   ...(type == ExplainerType.VIDEO ? { 
            //     theme: videoThemeWithColors,
            //     videoRatio: videoRatio 
            //   } : {}),
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
        //     is_web_search: webSearchEnabled,
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
                    <Text className="text-slate-400">Explainer Type</Text>
                    <View className="flex flex-row items-center gap-2">
                        {explainerTypeOptions.map((t)=>(
                            <TouchableOpacity 
                            onPress={()=>setType(t.value)}
                            className={
                                clsx("p-2 px-4 w-fit rounded-xl flex-row items-center flex gap-2 ", 
                            t.value == type ? "bg-blue":"bg-slate-200 ")}>
                                {t.icon}
                                <Text className="text-sm">{t.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View className="flex flex-col gap-2">
                    <Text className="text-slate-400">Explainer Length</Text>
                    <View className="flex items-center gap-4 flex-row">
                        {lengths.map((l)=>(
                            <TouchableOpacity 
                            onPress={()=>setLength(l.length)}
                            className={clsx("p-2 w-fit rounded-xl flex-row flex gap-2", l.length == length ? "bg-blue" : "bg-slate-200")}>
                                <Text>{l.label}</Text>
                                <Clock size={15}></Clock>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                {type == ExplainerType.REEL &&(
                    <View className="flex flex-col gap-2">
                        <Text className="text-slate-400">Reel Style</Text>
                        <View className="flex flex-col gap-1">
                            {/* <Text className="text-slate-400 text-sm">Video Style Presets</Text> */}
                            <ScrollView horizontal>
                                <View 
                                className="flex flex-row items-center gap-2">
                                    {videoStyleOptions.map((o)=>(
                                        <TouchableOpacity
                                        onPress={()=>setVideoTheme(o.example_label)} 
                                        className={clsx("p-1 rounded-full px-2", videoTheme == o.example_label ? "bg-blue" : "bg-gray-200")}>
                                            <Text className={clsx(videoTheme == o.example_label ? "text-white" : "text-slate-400")}>{o.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                        <TextInput multiline value={videoTheme} 
                        onChangeText={(t)=>setVideoTheme(t)}
                        className="p-3 rounded-xl h-[100px] bg-slate-200 " placeholder="Enter a style"></TextInput>
                    </View>

                )}
                {type == ExplainerType.PODCAST &&(
                <View className="flex flex-col gap-2">
                    <View className="flex flex-col gap-2">
                        <Text className="text-slate-400">Podcast Style</Text>
                        <View className="flex flex-col gap-1">
                            {/* <Text className="text-slate-400 text-sm">Video Style Presets</Text> */}
                            <ScrollView horizontal>
                                <View 
                                className="flex flex-row items-center gap-2">
                                    {voiceThemeOptions.map((o)=>(
                                        <TouchableOpacity
                                        onPress={()=>setVideoTheme(o.example_label)} 
                                        className={clsx("p-1 rounded-full px-2", videoTheme == o.example_label ? "bg-blue" : "bg-gray-200")}>
                                            <Text className={clsx(videoTheme == o.example_label ? "text-white" : "text-slate-400")}>{o.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                        <TextInput multiline value={videoTheme} 
                        onChangeText={(t)=>setVideoTheme(t)}
                        className="p-3 rounded-xl h-[100px] bg-slate-200 " placeholder="Enter a style"></TextInput>

                    </View>
                    <View className="flex flex-col gap-2">
                        <Text className="text-slate-400">Podcast Speakers</Text>
                        <View className="flex flex-row gap-4">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => {
                                        setNumPodcastVoices(i+1)
                                        setIsVoiceDropdownOpen(Array<boolean>(i + 1).fill(false))
                                        setPodcastVoices((prevVoices) => {
                                            const newVoices = [...prevVoices];
                                            for (let j = prevVoices.length; j < i + 1; j++) {
                                            newVoices.push(voiceOptions[0].value);
                                            }
                                            return newVoices.slice(0, i + 1);
                                        });
                                    }}
                                    className={clsx("p-2 w-[100px] rounded-xl px-2 ", numPodcastVoices == i+1 ?"bg-blue":"bg-slate-200")}
                                >
                                    <Text className={clsx("text-center", numPodcastVoices == i+1 ?"text-white":"text-slate-500")}>{i + 1}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text className="text-slate-400 ">Podcast Voices</Text>
                        <View className="flex gap-2 flex-row">
                            {Array.from({ length: numPodcastVoices }).map((_, i) => (
                                <SelectDropdown
                                data={voiceOptions}
                                onSelect={(selectedItem, index) => {
                                    setPodcastVoices(prev => prev.map((v, index) => index === i ? selectedItem.value : v));
                                    console.log(podcastVoices)
                                console.log(selectedItem, index);
                                }}
                                renderButton={(selectedItem, isOpened) => {
                                return (
                                    <View className="bg-slate-200 flex flex-row items-center p-2 rounded-xl">
                                    {/* {selectedItem && (
                                        <Icon name={selectedItem.icon} />
                                    )} */}
                                    <Text className="text-slate-400 mr-8" >
                                        {(selectedItem && selectedItem.label) || 'Select a voice'}
                                    </Text>
                                    
                                    {isOpened ? <ChevronUp size={13}/> : <ChevronDown  size={13}/>}
                                    </View>
                                );
                                }}
                                renderItem={(item, index, isSelected) => {
                                return (
                                    <View className={clsx("p-2", isSelected && "bg-blue")} >
                                    <Text className={clsx("text-slate-500", isSelected && "text-white")}>{item.label}</Text>
                                    </View>
                                );
                                }}
                                showsVerticalScrollIndicator={false}
                                
                                dropdownStyle={{ borderRadius: 12 }}
                            />
                            ))}
                        </View>
                    </View>

                </View>

                )}
                {/* switches */}
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
                <TouchableOpacity 
                onPress={handleCreate}
                className={clsx("mb-32 gap-4 flex flex-row justify-center items-center p-4 rounded-full", {
                    "bg-blue": !loading,
                    "bg-blue/30": loading
                })}
                disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <>
                            <Sparkles color={"white"} />
                            <Text className="font-semibold text-xl text-white">Create</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}