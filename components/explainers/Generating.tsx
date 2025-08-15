import { IExplainer } from '@/interfaces';
import { ExplainerType } from '@/utils/constant';
import { formatDuration } from '@/utils/time';
import axios from 'axios';
import clsx from 'clsx';
import { router } from 'expo-router';
import { Loader, Sparkles } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, Text, View } from 'react-native';
import PodcastHeader from '../podcasts/PodcastHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const TIMER_DURATION = 7.5 * 60; // 8 minutes
export default function Generating({
  explainerType,
  explainer,
}: {
  explainerType: ExplainerType;
  explainer: IExplainer;
}) {
  const [step, setStep] = useState<string | null>();
  const [time, setTime] = useState(TIMER_DURATION);
  const route = explainer.sectionAudios ? 'podcasts' : 'videos';
console.log("Generating rendered")
  const fetchExplainerProgress = async () => {
    let generatingData = (
      await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/${route}/poll/${explainer.videoId || explainer.id}`)
    ).data;

    if (generatingData?.error) {
      return router.push(`/profile/${explainer.user.id}`);
    }

    // if (generatingData?.success) {
    //   return router.reload()
    // }
    console.log("Generating data", generatingData)
    if (generatingData?.progress) {
      setStep((prevStep) =>
        prevStep !== generatingData.progress ? generatingData.progress : prevStep
      );
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchExplainerProgress();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [explainer.id]);

  // Persist Timer Across Refreshes
  useEffect(() => {
    const updateTimer = async () => {
      const storedStartTime = await AsyncStorage.getItem(`videoTimer_${explainer.videoId || explainer.id}`);
      const currentTime = Math.floor(Date.now() / 1000);

      if (storedStartTime) {
        const elapsedTime = currentTime - parseInt(storedStartTime, 10);
        const remainingTime = Math.max(TIMER_DURATION - elapsedTime, 0);
        setTime(remainingTime);
      } else {
        await AsyncStorage.setItem(
          `videoTimer_${explainer.videoId || explainer.id}`,
          currentTime.toString()
        );
      }
    }
    updateTimer()
  }, [explainer.id]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTime((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  return (
    <SafeAreaView>
        <View className="flex w-full p-8 flex-col gap-2">
        {route == "podcasts" && (
            <PodcastHeader hideControls={true} podcast={explainer}></PodcastHeader>
        )}
        <View
            className={clsx(
            'w-full rounded-xl mt-8',
            'bg-blue/10',
            'border border-gray-200 dark:border-gray-800',
            'flex flex-col justify-center gap-4 self-center',
            'p-8',
            // 'px-4 py-8 sm:px-8 md:px-16 lg:px-32',
            // 'shadow-lg dark:shadow-2xl'
            )}>
            <View className={clsx('mb-4 flex flex-col items-center')}>
            {time > 0 ? (
                <View className={clsx('flex flex-row gap-2')}>
                {Array.from(formatDuration(time)).map((char, index) => (
                    <Text
                    key={index}
                    className={clsx(
                        'rounded-xl text-center text-3xl font-semibold',
                        'text-blue2 dark:text-blue',
                        'w-fit p-1 px-3',
                        'border-2 border-gray-200 dark:border-gray-800',
                        'bg-white dark:bg-dark2',
                        // 'shadow-sm'
                    )}>
                    {char}
                    </Text>
                ))}
                </View>
            ) : (
                <Text
                className={clsx(
                    'rounded-xl text-center text-sm font-semibold',
                    'text-blue2 dark:text-blue',
                    'w-fit p-1 px-4',
                    'border-2 border-gray-200 dark:border-gray-800',
                    'bg-white  dark:bg-dark2',
                    // 'shadow-sm'
                )}>
                {"Wrapping up"}
                </Text>
            )}
            </View>

            {true && (
            <>
                <View className='flex self-center'>
                <Sparkles
                    className={clsx(
                    'bg-white text-blue2 dark:bg-dark2',
                    'self-center rounded-full p-3 shadow-md',
                    'border border-gray-200 dark:border-gray-800'
                    )}
                    
                    size={30}
                />
                </View>
                <View className={clsx('flex w-full flex-col items-center gap-4 text-center')}>
                <Text
                    className={clsx(
                    'text-3xl text-center font-semibold',
                    'text-gray-900 dark:text-white'
                    )}>
                    {"Generating Explainer"}
                </Text>
                <Text className={clsx('text-slate-500 dark:text-slate-400')}>
                    {"Current Step"}
                </Text>
                </View>
                <View
                className={clsx(
                    'mt-4 flex flex-row items-center justify-center gap-4',
                    'text-slate-500 dark:text-slate-400'
                )}>
                <ActivityIndicator size={22} className={clsx('animate-spin text-blue2 dark:text-blue')} />
                <Text>{step}</Text>
                </View>
            </>
            )}
        </View>
        </View>

    </SafeAreaView>
  );
}
