import tailwindConfig from '@/tailwind.config';
import {
  explainerTypeOptions,
  TOPICS,
  videoStyleOptions,
  voiceOptions,
  voiceThemeOptions,
} from '@/utils/common';
import { ExplainerType, lengths } from '@/utils/constant';
import axios from 'axios';
import cx from 'clsx';
import { router } from 'expo-router';
import { ChevronDown, ChevronUp, Clock, Sparkles } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
const tailwindColors = tailwindConfig.theme?.extend?.colors;
const primaryBlue = (tailwindColors as any)?.blue || '#6387FF';

const suggestions = TOPICS.sort(() => Math.random() - 0.5).slice(0, 4);
const suggestionId = (topicId: string, random: string) => `${topicId}-${random.slice(0, 8)}`;
export default function CreateScreen() {
  const [type, setType] = useState(ExplainerType.REEL);
  const [videoTheme, setVideoTheme] = useState(videoStyleOptions[0].example_label);
  // const [videoTheme,setVideoTheme] = useState(videoStyleOptions[0].example_label)
  const [useImages, setUseImages] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);

  const [length, setLength] = useState(lengths[0].length);
  const [description, setDescription] = useState('');

  // video/reel specifc states
  const [backgroundColor] = useState('#ffffff');
  const [textColor] = useState('#000000');

  // Podcast specific states
  // const [podcastThemePreset] = useState('');
  const [numPodcastVoices, setNumPodcastVoices] = useState(1);
  const [podcastVoices, setPodcastVoices] = useState<string[]>([voiceOptions[0].value]);
  // const [customPodcastTheme] = useState(false);
  const [, setIsVoiceDropdownOpen] = useState<boolean[]>([false]);
  const [loading, setLoading] = useState(false);
  const suggestionCards = useMemo(
    () =>
      suggestions.map((topic) => ({
        topic,
        random: topic.suggestion[Math.floor(Math.random() * topic.suggestion.length)],
      })),
    []
  );
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

    const route = type === ExplainerType.PODCAST ? 'podcasts' : 'videos';
    setLoading(true);
    try {
      // Construct theme with colors for videos
      const videoThemeWithColors =
        type === ExplainerType.VIDEO
          ? `${videoTheme}${videoTheme ? ', ' : ''}${backgroundColor ? `Background: ${backgroundColor}, ` : ''}${textColor ? `text: ${textColor}` : ''}`
          : '';

      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/${route}/create`,
        {
          description,
          ...(type === ExplainerType.REEL
            ? {
                length: 0.5,
              }
            : { length }),
          // length,
          locale: 'en',
          websearchEnabled: webSearchEnabled,
          imageSearchEnabled: useImages,
          //   ...(type == ExplainerType.VIDEO ? {
          //     theme: videoThemeWithColors,
          //     videoRatio: videoRatio
          //   } : {}),
          ...(type === ExplainerType.PODCAST
            ? {
                voice: podcastVoices[0] || voiceOptions[0].value,
                theme: videoTheme,
                generateAudio: true,
                podcastVoices,
                numPodcastVoices,
              }
            : {}),
          ...(type === ExplainerType.REEL
            ? {
                // isReel:true,
                theme: videoThemeWithColors,
                videoRatio: '9:16',
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
        console.log('You have run out of credits');
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

  // const [enablePicker,setEnablePicker]
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex flex-col gap-4 p-4 ">
          <View className="flex flex-col items-center gap-1">
            <Text className="text-3xl font-bold text-slate-800">Create Event</Text>
            <Text className="text-center text-slate-500">Imagine an explainer on any topic</Text>
          </View>

          <View className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <Text className="mb-2 text-slate-500">Event Name</Text>
            <TextInput
              value={description}
              onChangeText={(t) => setDescription(t)}
              multiline={true}
              className="h-[120px] rounded-xl bg-slate-100 p-3 text-slate-800"
              placeholder="Enter a topic"
            />
            <ScrollView horizontal className="mt-2">
              <View className="flex flex-row gap-2">
                {suggestionCards.map(({ topic, random }) => (
                  <TouchableOpacity
                    onPress={() => setDescription(random)}
                    key={suggestionId(topic.id, random)}
                    className="flex w-[220px] flex-col gap-1 rounded-xl bg-slate-100 p-3">
                    <Text className="font-semibold text-slate-700">{topic.name}</Text>
                    <Text className="text-sm text-slate-500">{random}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <Text className="mb-2 text-slate-500">Explainer Type</Text>
            <View className="flex flex-row items-center gap-2">
              {explainerTypeOptions.map((t) => (
                <TouchableOpacity
                  key={String(t.value)}
                  onPress={() => setType(t.value)}
                  className={cx(
                    'flex-row items-center gap-2 rounded-xl border px-4 py-2',
                    t.value === type
                      ? 'border-blue bg-blue text-white'
                      : 'border-slate-200 bg-slate-100'
                  )}>
                  {t.icon}
                  <Text
                    className={cx('text-sm', t.value === type ? 'text-white' : 'text-slate-700')}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <Text className="mb-2 text-slate-500">Length</Text>
            <View className="flex flex-row flex-wrap items-center gap-3">
              {lengths.map((l) => (
                <TouchableOpacity
                  key={l.plan}
                  onPress={() => setLength(l.length)}
                  className={cx(
                    'flex-row items-center gap-2 rounded-xl border px-3 py-2',
                    l.length === length ? 'border-blue bg-blue' : 'border-slate-200 bg-slate-100'
                  )}>
                  <Text className={cx(l.length === length ? 'text-white' : 'text-slate-700')}>
                    {l.label}
                  </Text>
                  <Clock size={15} color={l.length === length ? 'white' : '#64748b'}></Clock>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {type === ExplainerType.REEL && (
            <View className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <Text className="mb-2 text-slate-500">Reel Style</Text>
              <ScrollView horizontal>
                <View className="flex flex-row items-center gap-2">
                  {videoStyleOptions.map((o) => (
                    <TouchableOpacity
                      key={o.value}
                      onPress={() => setVideoTheme(o.example_label)}
                      className={cx(
                        'rounded-full border px-3 py-1',
                        videoTheme === o.example_label
                          ? 'border-blue bg-blue'
                          : 'border-slate-200 bg-slate-100'
                      )}>
                      <Text
                        className={cx(
                          videoTheme === o.example_label ? 'text-white' : 'text-slate-700'
                        )}>
                        {o.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <TextInput
                multiline
                value={videoTheme}
                onChangeText={(t) => setVideoTheme(t)}
                className="mt-3 h-[100px] rounded-xl bg-slate-100 p-3 text-slate-800"
                placeholder="Enter a style"
              />
            </View>
          )}

          {type === ExplainerType.PODCAST && (
            <View className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <Text className="mb-2 text-slate-500">Podcast Style</Text>
              <ScrollView horizontal>
                <View className="flex flex-row items-center gap-2">
                  {voiceThemeOptions.map((o) => (
                    <TouchableOpacity
                      key={o.value}
                      onPress={() => setVideoTheme(o.example_label)}
                      className={cx(
                        'rounded-full border px-3 py-1',
                        videoTheme === o.example_label
                          ? 'border-blue bg-blue'
                          : 'border-slate-200 bg-slate-100'
                      )}>
                      <Text
                        className={cx(
                          videoTheme === o.example_label ? 'text-white' : 'text-slate-700'
                        )}>
                        {o.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <TextInput
                multiline
                value={videoTheme}
                onChangeText={(t) => setVideoTheme(t)}
                className="mt-3 h-[100px] rounded-xl bg-slate-100 p-3 text-slate-800"
                placeholder="Enter a style"
              />

              <View className="mt-4">
                <Text className="mb-2 text-slate-500">Podcast Speakers</Text>
                <View className="flex flex-row gap-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        setNumPodcastVoices(i + 1);
                        setIsVoiceDropdownOpen(Array<boolean>(i + 1).fill(false));
                        setPodcastVoices((prevVoices) => {
                          const newVoices = [...prevVoices];
                          for (let j = prevVoices.length; j < i + 1; j++) {
                            newVoices.push(voiceOptions[0].value);
                          }
                          return newVoices.slice(0, i + 1);
                        });
                      }}
                      className={cx(
                        'w-[90px] items-center rounded-xl border px-2 py-2',
                        numPodcastVoices === i + 1
                          ? 'border-blue bg-blue'
                          : 'border-slate-200 bg-slate-100'
                      )}>
                      <Text
                        className={cx(
                          'text-center',
                          numPodcastVoices === i + 1 ? 'text-white' : 'text-slate-700'
                        )}>
                        {i + 1}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text className="mt-3 text-slate-500">Podcast Voices</Text>
                <View className="mt-2 flex flex-row gap-2">
                  {Array.from({ length: numPodcastVoices }).map((_, i) => (
                    <SelectDropdown
                      key={`voice-${i}`}
                      data={voiceOptions}
                      onSelect={(selectedItem, index) => {
                        setPodcastVoices((prev) =>
                          prev.map((v, index2) => (index2 === i ? selectedItem.value : v))
                        );
                      }}
                      renderButton={(selectedItem, isOpened) => {
                        return (
                          <View className="flex flex-row items-center rounded-xl border border-slate-200 bg-slate-100 p-2">
                            <Text className="mr-8 text-slate-600">
                              {(selectedItem && selectedItem.label) || 'Select a voice'}
                            </Text>
                            {isOpened ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </View>
                        );
                      }}
                      renderItem={(item, index, isSelected) => {
                        return (
                          <View className={cx('p-2', isSelected && 'bg-blue')}>
                            <Text className={cx('text-slate-700', isSelected && 'text-white')}>
                              {item.label}
                            </Text>
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

          <View className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <View className="flex flex-row gap-4">
              <View className="flex flex-row items-center gap-2">
                <Switch
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  value={useImages}
                  onValueChange={setUseImages}
                  trackColor={{ false: '#e2e8f0', true: primaryBlue }}
                  thumbColor={useImages ? '#ffffff' : '#64748b'}
                />
                <Text className="text-sm text-slate-600">Use Images</Text>
              </View>
              <View className="flex flex-row items-center gap-2">
                <Switch
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  value={webSearchEnabled}
                  onValueChange={setWebSearchEnabled}
                  trackColor={{ false: '#e2e8f0', true: primaryBlue }}
                  thumbColor={webSearchEnabled ? '#ffffff' : '#64748b'}
                />
                <Text className="text-sm text-slate-600">Use Web Search</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleCreate}
            className={cx(
              'mb-32 flex flex-row items-center justify-center gap-3 rounded-full p-4',
              {
                'bg-blue': !loading,
                'bg-blue/30': loading,
              }
            )}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Sparkles color={'white'} />
                <Text className="text-lg font-semibold text-white">Create</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
