import {
  explainerTypeOptions,
  TOPICS,
  videoStyleOptions,
  voiceOptions,
  voiceThemeOptions,
} from '@/utils/common';
import { ExplainerType, lengths } from '@/utils/constant';
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
  ImageBackground,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { BlurView } from 'expo-blur';
import Animated from 'react-native-reanimated';
import {
  glassCardStyle,
  glassInputStyle,
  glassButtonStyle,
  numberBadgeStyle,
} from '../../styles/createStyles';
import GlassCard from '../../components/common/GlassCard';
import { useCreateExplainer } from '../../hooks/useCreateExplainer';

const suggestions = TOPICS.sort(() => Math.random() - 0.5).slice(0, 4);
const suggestionId = (topicId: string, random: string) => `${topicId}-${random.slice(0, 8)}`;

export default function CreateScreen() {
  const [type, setType] = useState(ExplainerType.REEL);
  const [videoTheme, setVideoTheme] = useState(videoStyleOptions[0].example_label);
  const [useImages, setUseImages] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [length, setLength] = useState(lengths[0].length);
  const [description, setDescription] = useState('');
  const [numPodcastVoices, setNumPodcastVoices] = useState(1);
  const [podcastVoices, setPodcastVoices] = useState<string[]>([voiceOptions[0].value]);
  const [, setIsVoiceDropdownOpen] = useState<boolean[]>([false]);

  const { createExplainer, loading } = useCreateExplainer();

  const suggestionCards = useMemo(
    () =>
      suggestions.map((topic) => ({
        topic,
        random: topic.suggestion[Math.floor(Math.random() * topic.suggestion.length)],
      })),
    []
  );

  function handleCreate() {
    createExplainer({
      type,
      videoTheme,
      length,
      description,
      webSearchEnabled,
      useImages,
      podcastVoices,
      numPodcastVoices,
    });
  }

  return (
    <ImageBackground
      source={require('../../assets/images/create-bg.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover">
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1 px-6 py-4"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <GlassCard intensity={35} borderRadius={24} style={{ marginBottom: 24 }}>
            <View className="items-center">
              <Animated.View
                style={[
                  {
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: 'rgba(99, 135, 255, 0.15)',
                    borderWidth: 2,
                    borderColor: 'rgba(99, 135, 255, 0.3)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                    shadowColor: '#6387FF',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                  },
                ]}>
                <Sparkles size={28} color="#6387FF" />
              </Animated.View>
              <Text
                className="mb-2 text-center text-3xl font-bold text-slate-800"
                style={{
                  textShadowColor: 'rgba(255,255,255,0.8)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 3,
                }}>
                Create an Explainer
              </Text>
              <Text className="text-center text-lg text-slate-600">
                Imagine an explainer on any topic
              </Text>
            </View>
          </GlassCard>

          {/* Topic Input Section */}
          <GlassCard intensity={32}>
            <View className="mb-4 flex-row items-center">
              <Animated.View style={[numberBadgeStyle]}>
                <Text className="font-bold text-blue">1</Text>
              </Animated.View>
              <Text className="text-xl font-semibold text-slate-800">Choose your topic</Text>
            </View>

            <BlurView intensity={15} tint="light" style={{ borderRadius: 16, marginBottom: 16 }}>
              <View style={{ ...glassInputStyle, borderRadius: 16, overflow: 'hidden' }}>
                <TextInput
                  value={description}
                  onChangeText={(t) => setDescription(t)}
                  multiline={true}
                  style={{
                    height: 120,
                    padding: 16,
                    color: '#1e293b',
                    fontSize: 16,
                    textAlignVertical: 'top',
                  }}
                  placeholder="Enter a topic you'd like explained..."
                  placeholderTextColor="rgba(71, 85, 105, 0.6)"
                />
              </View>
            </BlurView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {suggestionCards.map(({ topic, random }) => (
                  <TouchableOpacity
                    key={suggestionId(topic.id, random)}
                    onPress={() => setDescription(random)}
                    style={{ width: 200, borderRadius: 12, overflow: 'hidden' }}>
                    <BlurView intensity={20} tint="light" style={{ borderRadius: 12 }}>
                      <View
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                          borderWidth: 1,
                          borderColor: 'rgba(255, 255, 255, 0.7)',
                          padding: 16,
                          borderRadius: 12,
                          overflow: 'hidden',
                        }}>
                        <Text className="mb-2 text-base font-bold text-slate-800">
                          {topic.name}
                        </Text>
                        <Text className="text-sm leading-5 text-slate-600">{random}</Text>
                      </View>
                    </BlurView>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </GlassCard>

          {/* Explainer Type Section */}
          <BlurView intensity={25} tint="light" style={{ borderRadius: 20, marginBottom: 20 }}>
            <View style={{ ...glassCardStyle, padding: 20, borderRadius: 20, overflow: 'hidden' }}>
              <View className="mb-4 flex-row items-center">
                <View style={numberBadgeStyle}>
                  <Text className="font-bold text-blue">2</Text>
                </View>
                <Text className="text-xl font-semibold text-slate-800">Explainer Type</Text>
              </View>

              <View className="flex-row gap-3">
                {explainerTypeOptions.map((t) => (
                  <TouchableOpacity
                    key={String(t.value)}
                    onPress={() => setType(t.value)}
                    className="flex-1"
                    style={{ borderRadius: 16, overflow: 'hidden' }}>
                    <BlurView
                      intensity={t.value === type ? 30 : 15}
                      tint="light"
                      style={{ borderRadius: 16 }}>
                      <View
                        style={{
                          ...glassButtonStyle(t.value === type),
                          padding: 16,
                          alignItems: 'center',
                          gap: 8,
                          borderRadius: 16,
                          overflow: 'hidden',
                        }}>
                        {t.icon}
                        <Text
                          className={`text-center font-semibold ${t.value === type ? 'text-blue' : 'text-slate-700'}`}>
                          {t.label}
                        </Text>
                      </View>
                    </BlurView>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </BlurView>

          {/* Length Section */}
          <BlurView intensity={25} tint="light" style={{ borderRadius: 20, marginBottom: 20 }}>
            <View style={{ ...glassCardStyle, padding: 20, borderRadius: 20, overflow: 'hidden' }}>
              <View className="mb-4 flex-row items-center">
                <View style={numberBadgeStyle}>
                  <Text className="font-bold text-blue">3</Text>
                </View>
                <Text className="text-xl font-semibold text-slate-800">Length</Text>
              </View>

              <View className="flex-row flex-wrap gap-3">
                {lengths.map((l) => (
                  <TouchableOpacity
                    key={l.plan}
                    onPress={() => setLength(l.length)}
                    className="min-w-[100px] flex-1"
                    style={{ borderRadius: 12, overflow: 'hidden' }}>
                    <BlurView
                      intensity={l.length === length ? 30 : 15}
                      tint="light"
                      style={{ borderRadius: 12 }}>
                      <View
                        style={{
                          ...glassButtonStyle(l.length === length),
                          padding: 12,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          borderRadius: 12,
                          overflow: 'hidden',
                        }}>
                        <Clock size={16} color={l.length === length ? '#6387FF' : '#64748b'} />
                        <Text
                          className={`text-center font-medium ${l.length === length ? 'text-blue' : 'text-slate-700'}`}>
                          {l.label}
                        </Text>
                      </View>
                    </BlurView>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </BlurView>

          {/* Reel Style Section */}
          {type === ExplainerType.REEL && (
            <BlurView intensity={25} tint="light" style={{ borderRadius: 20, marginBottom: 20 }}>
              <View
                style={{ ...glassCardStyle, padding: 20, borderRadius: 20, overflow: 'hidden' }}>
                <View className="mb-4 flex-row items-center">
                  <View style={numberBadgeStyle}>
                    <Text className="font-bold text-blue">4</Text>
                  </View>
                  <Text className="text-xl font-semibold text-slate-800">Reel Style</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                  <View className="flex-row gap-2">
                    {videoStyleOptions.map((o) => (
                      <TouchableOpacity
                        key={o.value}
                        onPress={() => setVideoTheme(o.example_label)}
                        style={{ borderRadius: 20, overflow: 'hidden' }}>
                        <BlurView
                          intensity={videoTheme === o.example_label ? 25 : 15}
                          tint="light"
                          style={{ borderRadius: 20 }}>
                          <View
                            style={{
                              ...glassButtonStyle(videoTheme === o.example_label),
                              paddingHorizontal: 16,
                              paddingVertical: 8,
                              borderRadius: 20,
                              overflow: 'hidden',
                            }}>
                            <Text
                              className={`font-medium ${videoTheme === o.example_label ? 'text-blue' : 'text-slate-700'}`}>
                              {o.name}
                            </Text>
                          </View>
                        </BlurView>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                <BlurView intensity={15} tint="light" style={{ borderRadius: 16 }}>
                  <View style={{ ...glassInputStyle, borderRadius: 16, overflow: 'hidden' }}>
                    <TextInput
                      multiline
                      value={videoTheme}
                      onChangeText={(t) => setVideoTheme(t)}
                      style={{
                        height: 100,
                        padding: 16,
                        color: '#1e293b',
                        fontSize: 16,
                        textAlignVertical: 'top',
                      }}
                      placeholder="Enter a custom style..."
                      placeholderTextColor="rgba(71, 85, 105, 0.6)"
                    />
                  </View>
                </BlurView>
              </View>
            </BlurView>
          )}

          {/* Podcast Style Section */}
          {type === ExplainerType.PODCAST && (
            <BlurView intensity={25} tint="light" style={{ borderRadius: 20, marginBottom: 20 }}>
              <View
                style={{ ...glassCardStyle, padding: 20, borderRadius: 20, overflow: 'hidden' }}>
                <View className="mb-4 flex-row items-center">
                  <View style={numberBadgeStyle}>
                    <Text className="font-bold text-blue">4</Text>
                  </View>
                  <Text className="text-xl font-semibold text-slate-800">Podcast Style</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                  <View className="flex-row gap-2">
                    {voiceThemeOptions.map((o) => (
                      <TouchableOpacity
                        key={o.value}
                        onPress={() => setVideoTheme(o.example_label)}
                        style={{ borderRadius: 20, overflow: 'hidden' }}>
                        <BlurView
                          intensity={videoTheme === o.example_label ? 25 : 15}
                          tint="light"
                          style={{ borderRadius: 20 }}>
                          <View
                            style={{
                              ...glassButtonStyle(videoTheme === o.example_label),
                              paddingHorizontal: 16,
                              paddingVertical: 8,
                              borderRadius: 20,
                              overflow: 'hidden',
                            }}>
                            <Text
                              className={`font-medium ${videoTheme === o.example_label ? 'text-blue' : 'text-slate-700'}`}>
                              {o.name}
                            </Text>
                          </View>
                        </BlurView>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                <BlurView
                  intensity={15}
                  tint="light"
                  style={{ borderRadius: 16, marginBottom: 16 }}>
                  <View style={glassInputStyle}>
                    <TextInput
                      multiline
                      value={videoTheme}
                      onChangeText={(t) => setVideoTheme(t)}
                      style={{
                        height: 100,
                        padding: 16,
                        color: '#1e293b',
                        fontSize: 16,
                        textAlignVertical: 'top',
                      }}
                      placeholder="Enter a custom style..."
                      placeholderTextColor="rgba(71, 85, 105, 0.6)"
                    />
                  </View>
                </BlurView>

                <Text className="mb-3 text-lg font-semibold text-slate-800">Podcast Speakers</Text>
                <View className="mb-4 flex-row gap-3">
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
                      style={{ width: 90, borderRadius: 12, overflow: 'hidden' }}>
                      <BlurView
                        intensity={numPodcastVoices === i + 1 ? 25 : 15}
                        tint="light"
                        style={{ borderRadius: 12 }}>
                        <View
                          style={{
                            ...glassButtonStyle(numPodcastVoices === i + 1),
                            padding: 12,
                            alignItems: 'center',
                            borderRadius: 12,
                            overflow: 'hidden',
                          }}>
                          <Text
                            className={`text-center font-semibold ${numPodcastVoices === i + 1 ? 'text-blue' : 'text-slate-700'}`}>
                            {i + 1}
                          </Text>
                        </View>
                      </BlurView>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text className="mb-3 text-lg font-semibold text-slate-800">Podcast Voices</Text>
                <View className="flex-row gap-2">
                  {Array.from({ length: numPodcastVoices }).map((_, i) => (
                    <SelectDropdown
                      key={`voice-${i}`}
                      data={voiceOptions}
                      onSelect={(selectedItem, index) => {
                        setPodcastVoices((prev) =>
                          prev.map((v, index2) => (index2 === i ? selectedItem.value : v))
                        );
                      }}
                      renderButton={(selectedItem, isOpened) => (
                        <BlurView intensity={15} tint="light" style={{ borderRadius: 12 }}>
                          <View
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.4)',
                              borderWidth: 1,
                              borderColor: 'rgba(255, 255, 255, 0.6)',
                              padding: 12,
                              flexDirection: 'row',
                              alignItems: 'center',
                              minWidth: 140,
                              borderRadius: 12,
                              overflow: 'hidden',
                            }}>
                            <Text className="mr-2 flex-1 text-slate-700">
                              {(selectedItem && selectedItem.label) || 'Select voice'}
                            </Text>
                            {isOpened ? (
                              <ChevronUp size={16} color="#64748b" />
                            ) : (
                              <ChevronDown size={16} color="#64748b" />
                            )}
                          </View>
                        </BlurView>
                      )}
                      renderItem={(item, index, isSelected) => (
                        <View
                          style={{
                            padding: 12,
                            backgroundColor: isSelected ? 'rgba(99, 135, 255, 0.1)' : 'transparent',
                          }}>
                          <Text style={{ color: isSelected ? '#4f46e5' : '#64748b' }}>
                            {item.label}
                          </Text>
                        </View>
                      )}
                      showsVerticalScrollIndicator={false}
                      dropdownStyle={{
                        borderRadius: 12,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                      }}
                    />
                  ))}
                </View>
              </View>
            </BlurView>
          )}

          {/* Options Section */}
          <BlurView intensity={25} tint="light" style={{ borderRadius: 20, marginBottom: 20 }}>
            <View style={{ ...glassCardStyle, padding: 20, borderRadius: 20, overflow: 'hidden' }}>
              <Text className="mb-4 text-lg font-semibold text-slate-800">Advanced Options</Text>
              <View className="flex-row gap-6">
                <View className="flex-row items-center gap-3">
                  <Switch
                    style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                    value={useImages}
                    onValueChange={setUseImages}
                    trackColor={{
                      false: 'rgba(203,213,225,0.5)',
                      true: 'rgba(99, 135, 255, 0.3)',
                    }}
                    thumbColor={useImages ? '#6387FF' : 'rgba(148,163,184,0.8)'}
                  />
                  <Text className="font-medium text-slate-700">Use Images</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <Switch
                    style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                    value={webSearchEnabled}
                    onValueChange={setWebSearchEnabled}
                    trackColor={{
                      false: 'rgba(203,213,225,0.5)',
                      true: 'rgba(99, 135, 255, 0.3)',
                    }}
                    thumbColor={webSearchEnabled ? '#6387FF' : 'rgba(148,163,184,0.8)'}
                  />
                  <Text className="font-medium text-slate-700">Web Search</Text>
                </View>
              </View>
            </View>
          </BlurView>

          {/* Create Button */}
          <TouchableOpacity
            onPress={handleCreate}
            disabled={loading}
            className="mb-8"
            style={{ borderRadius: 25, overflow: 'hidden' }}>
            <BlurView intensity={30} tint="light" style={{ borderRadius: 25 }}>
              <View
                style={{
                  backgroundColor: loading ? 'rgba(99, 135, 255, 0.4)' : 'rgba(99, 135, 255, 0.8)',
                  borderWidth: 1,
                  borderColor: 'rgba(99, 135, 255, 0.9)',
                  padding: 18,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  shadowColor: '#6387FF',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  borderRadius: 25,
                  overflow: 'hidden',
                }}>
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Sparkles size={24} color="white" />
                )}
                <Text className="text-xl font-bold text-white">
                  {loading ? 'Creating...' : 'Create Explainer'}
                </Text>
              </View>
            </BlurView>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
