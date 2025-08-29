import { useState } from 'react';
import axios from 'axios';
import { router } from 'expo-router';
import { ExplainerType } from '@/utils/constant';
import { voiceOptions } from '@/utils/common';

interface CreateExplainerParams {
  type: ExplainerType;
  videoTheme: string;
  length: number;
  description: string;
  webSearchEnabled: boolean;
  useImages: boolean;
  podcastVoices: string[];
  numPodcastVoices: number;
}

export function useCreateExplainer() {
  const [loading, setLoading] = useState(false);

  async function createExplainer(params: CreateExplainerParams) {
    const {
      type,
      videoTheme,
      length,
      description,
      webSearchEnabled,
      useImages,
      podcastVoices,
      numPodcastVoices,
    } = params;

    const route = type === ExplainerType.PODCAST ? 'podcasts' : 'videos';
    setLoading(true);
    try {
      const backgroundColor = '#ffffff';
      const textColor = '#000000';

      const videoThemeWithColors =
        type === ExplainerType.VIDEO
          ? `${videoTheme}${videoTheme ? ', ' : ''}${
              backgroundColor ? `Background: ${backgroundColor}, ` : ''
            }${textColor ? `text: ${textColor}` : ''}`
          : '';

      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/${route}/create`,
        {
          description,
          ...(type === ExplainerType.REEL ? { length: 0.5 } : { length }),
          locale: 'en',
          websearchEnabled: webSearchEnabled,
          imageSearchEnabled: useImages,
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
                theme: videoThemeWithColors,
                videoRatio: '9:16',
              }
            : {}),
        },
        { withCredentials: true }
      );
      router.push(`/${route}/${res.data.id}`);
    } catch (error: any) {
      console.log(error);
      if (error?.response?.status === 403) {
        console.log('You have run out of credits');
      }
    } finally {
      setLoading(false);
    }
  }

  return { createExplainer, loading };
}
