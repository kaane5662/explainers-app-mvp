import { IUser } from '@/interfaces';
import tailwindConfig from '@/tailwind.config';
import { onboardingOptionsById } from '@/utils/common';
import { ExplainerType } from '@/utils/constant';
import axios from 'axios';
import clsx from 'clsx';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

type QuestionType = 'single' | 'multi' | 'custom' | 'info';

interface Question {
  label: string;
  id: string;
  question: string;
  type: QuestionType;
  options: { label: string; value: string }[];
  maxSelections?: number;
  extra?: string;
  imageUrl?: string;
}

export default function Onboarding() {
  const questions: Question[] = [
    // {
    //   label: "",
    //   id: "welcomeExplainers",
    //   type: "info",
    //   options: [],
    // },
    // {
    //   label: "",
    //   id: "explainerFeatures",
    //   type: "info",
    //   options:[]
    // },
    // {
    //   label: "5jk9nok7p9d",
    //   id: "locale",
    //   type: "single",
    //   extra:"flex",
    //   options: Object.entries(locales).map(([value, label]) => ({
    //     value,
    //     label
    //   })),
    //   imageUrl: "/onboarding-locale.png"
    // },
    // {
    //   label: "",
    //   id: "createExplainer",
    //   type: "info",
    //   options: [],
    // },
    {
      label: 'xbmq4g88r3j',
      id: 'primaryGoal',
      type: 'single',
      options: onboardingOptionsById.goals.map((t) => ({
        ...t,
        label: t.description,
      })),
      imageUrl: '/onboarding-goal.png',
      question: 'What is your primary goal?',
    },
    {
      label: 'pelzoy21n6g',
      id: 'currentRole',
      type: 'single',
      options: onboardingOptionsById.currentRole.map((t) => ({
        ...t,
        label: t.description,
      })),
      imageUrl: '/onboarding-subjects.png',
      question: 'What is your current role?',
    },

    {
      label: '82lpab15sg3',
      id: 'contentStyle',
      type: 'single',
      options: onboardingOptionsById.explainerTheme.map((t) => ({
        ...t,
        label: t.description,
      })),
      imageUrl: '/onboarding-subjects.png',
      question: 'What is your preferred content style?',
    },
    {
      label: 'v6llnhgp1hj',
      id: 'topSubjects',
      type: 'multi',
      options: onboardingOptionsById.subjects.map((t) => ({
        ...t,
        label: t.label,
      })),
      maxSelections: 3,
      imageUrl: '/onboarding-subjects.png',
      question: 'What subjects are you most interested in?',
    },
    // {
    //   label: "",
    //   id: "referUser",
    //   type: "info",
    //   options: [],
    //   question: "Would you like to refer a user?"
    // },
    // {
    //   label: "",
    //   id: "subscriptionOffer",
    //   type: "info",
    //   options: [],
    //   question: "Are you interested in a subscription offer?"
    // },
  ];

  const [questionIndex, setQuestionIndex] = useState(0);
  //   const currentPath = usePathname();
  const [disabled, setDisabled] = useState(false);
  const [navigationDisabled, setNavigationDisabled] = useState(false);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [onboardingExplainer, setOnboardingExplainer] = useState<Record<string, string | null>>({
    explainerType: null,
    explainerId: null,
  });
  const [direction, setDirection] = useState(0);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<IUser>();
  const [countryNotSupported, setCountryNotSupported] = useState(false);
  //   const locale = useLocale()

  // Set up initial responses based on question type

  const initRespones = async () => {
    const { data: user } = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/user`);
    console.log('The user gang', user);
    setUser(user);
    // setQuestionIndex(user.currentQuestionIndex || 0);
    const initialResponses: Record<string, string | string[]> = {
      primaryGoal: user.primaryGoalId || '',
      currentRole: user.currentRoleId || '',
      contentStyle: user.contentStyleId || '',
      topSubjects: user.topSubjectIds || [],
      locale: user.locale || '',
    };
    setResponses(initialResponses);
    setOnboardingExplainer({
      explainerId: user.onboardingExplainerId,
      explainerType: user.onboardingExplainerType,
    });
    if (user.country != 'US') setCountryNotSupported(true);
  };

  const sendBoarding = async (responses: Record<string, any>) => {
    try {
      console.log(responses, 'yp is this saving');
      setSaving(true);
      await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/user/onboarding`,
        { ...responses },
        { withCredentials: true }
      );
      // location.replace("/");
    } catch (error: any) {
      //   toast.error(error?.response?.data?.error);
    } finally {
      setSaving(false);
    }
  };

  // Animation variants for sliding left/right
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      position: 'static' as const,
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'static' as const,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      position: 'static' as const,
    }),
  };

  const handleNext = async (isSkip = false) => {
    if (!question) return;
    // console.log("yooo")
    // setDirection(1);
    console.log("Hi there")
    // if (question.type !== 'info' && !isSkip) {
    //   if (question.id == 'locale' && countryNotSupported) {
    //     await sendBoarding({
    //       [question.id]: responses[question.id],
    //       currentQuestionIndex: questionIndex + 2,
    //     });
    //   } else {
    //     console.log("Hi there 2")
    //     await sendBoarding({
    //       [question.id]: responses[question.id],
    //       currentQuestionIndex: questionIndex + 1,
    //     });
    //   }
    // }
    // await sendBoarding({
    //     [question.id]: responses[question.id],
    //     currentQuestionIndex: questionIndex + 1,
    //   });

    if(questionIndex == questions.length-1){
        sendBoarding({
            [question.id]: responses[question.id],
            currentQuestionIndex: questionIndex,
            completedOnboarding: true
        });

        return router.push("/")
    }else{
        sendBoarding({
            [question.id]: responses[question.id],
            currentQuestionIndex: questionIndex + 1,
        }); 
    }
    

    // if(question.id == "locale"){
    //   setNavigationDisabled(true)
    // }
    // If this is the subscription offer step, mark onboarding as completed
    if (question.id === 'subscriptionOffer') {
      await sendBoarding({ completedOnboarding: true });
      let route = null;
      if (onboardingExplainer.explainerType == ExplainerType.PODCAST) route = 'podcasts';
      if (onboardingExplainer.explainerType == ExplainerType.VIDEO) route = 'videos';
      if (route) return location.replace(`/${route}/${onboardingExplainer.explainerId}`);
      return location.replace('/');
    }

    // if (question.id == 'locale') {
    //   const newPath = `/${responses.locale}${currentPath}`;
    //   if (newPath != `/${locale}${currentPath}`) {
    //     // console.log("Changing the route")
    //     await sendBoarding({
    //       [question.id]: responses[question.id],
    //     });
    //     return router.push(newPath);
    //   }

    //   if (countryNotSupported) return setQuestionIndex((prev) => prev + 2);
    // }

    // if(questionIndex==questions.length-1){
    //   return location.replace("/")
    // }
    setQuestionIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    if (question.id == 'primaryGoal' && countryNotSupported) {
      setQuestionIndex((prev) => prev - 2);
    } else {
      setQuestionIndex((prev) => prev - 1);
    }
  };

  const onOnboardingVideoCreated = async ({
    explainerType,
    explainerId,
  }: {
    explainerType: ExplainerType;
    explainerId: string;
  }) => {
    setOnboardingExplainer({ explainerId, explainerType });
    await sendBoarding({
      onboardingExplainerId: explainerId,
      ...(explainerType ? { onboardingExplainerType: explainerType } : {}),
      currentQuestionIndex: questionIndex + 1,
    });
    setDisabled(false);
    handleNext();
    setNavigationDisabled(false);
  };

  useEffect(() => {
    initRespones();
  }, []);

  useEffect(() => {
    console.log(onboardingExplainer);
    if (
      question.id == 'createExplainer' &&
      !onboardingExplainer?.explainerId &&
      !countryNotSupported
    ) {
      setNavigationDisabled(true);
    } else {
      setNavigationDisabled(false);
    }
    if (question.id == 'subscriptionOffer' && user?.plan != 'free') {
      handleNext();
    }
  }, [questionIndex, user]);

  const question = questions[questionIndex];

  // Helper for validation
  const isAnswered = (() => {
    if (!question) return false;
    if (question.type === 'single') {
      return (responses[question.id] as string)?.length > 0;
    }
    if (question.type === 'multi') {
      return (responses[question.id] as string[]).length > 0;
    }
    if (question.type === 'info') {
      return true;
    }
    return false;
  })();
//   const [questionIndex, setCurrentIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

//   const handleNextSlide = () => {
//     if (questionIndex < questions.length - 1) {
//       Animated.timing(translateX, {
//         toValue: -(questionIndex + 1) * 100, // Assuming each slide is 100% width
//         duration: 300,
//         useNativeDriver: true,
//       }).start(() => setCurrentIndex(questionIndex + 1));
//     }
//   };

//   const handlePrevSlide = () => {
//     if (questionIndex > 0) {
//       Animated.timing(translateX, {
//         toValue: -(questionIndex - 1) * 100,
//         duration: 300,
//         useNativeDriver: true,
//       }).start(() => setCurrentIndex(questionIndex - 1));
//     }
//   };

  return (
    <SafeAreaView className="flex-1">
      <Animated.View
        style={{
          flexDirection: 'row',
          transform: [
            {
              translateX: translateX.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '-100%'],
              }),
            },
          ],
        }}
        className="flex-1">
        <View key={questionIndex} className={clsx('w-full', 'flex-1', 'p-4')}>
          <Text className="mb-8 text-2xl font-bold">{question.question}</Text>
          {/* Render question options or content here */}
          {question.type == 'single' && (
            <View className="flex flex-col gap-4">
              {question.options.map((o, i) => (
                <TouchableOpacity
                  onPress={() => {
                    if (!question?.id) return;

                    setResponses((prev) => ({
                      ...prev,
                      [question.id]: o.value,
                    }));
                  }}
                  disabled={o.value == responses[question.id]}
                  className={clsx(
                    'flex flex-row items-center gap-4 rounded-xl border-2 border-slate-300 bg-slate-200 p-4 disabled:border-blue'
                  )}>
                  <View
                    className={clsx('h-6 w-6 rounded-full border', {
                      'border-blue bg-blue': o.value == responses[question.id],
                      'border-slate-300': o.value != responses[question.id],
                    })}></View>
                  <Text className="flex-1 text-xl font-semibold">{o.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {question.type == 'multi' && (
            <View className="flex flex-row flex-wrap gap-2">
              {question.options.map((o, i) => (
                <TouchableOpacity
                  onPress={() => {
                    if (!question?.id) return;
                    setResponses((prev) => {
                      const prevArr = prev[question.id] as string[];
                      if (prevArr.includes(o.value)) {
                        // Unselect
                        const temp = prevArr.filter((v) => v !== o.value);

                        return {
                          ...prev,
                          [question.id]: temp,
                        };
                      } else {
                        // Select, with limit if specified
                        if (question.maxSelections && prevArr.length >= question.maxSelections)
                          return prev;
                        const temp = [...prevArr, o.value];

                        return {
                          ...prev,
                          [question.id]: temp,
                        };
                      }
                    });
                  }}
                  className={clsx(
                    'flex flex-row items-center  gap-4 rounded-xl border-2 bg-slate-200 p-3 ',
                    Array.isArray(responses[question?.id || '']) &&
                      (responses[question?.id || ''] as string[]).includes(o.value)
                      ? 'border-blue'
                      : 'border-slate-300'
                  )}>
                  <Text
                    className={clsx(
                      'text-md font-semibold group-disabled:text-blue',
                      Array.isArray(responses[question?.id || '']) &&
                        (responses[question?.id || ''] as string[]).includes(o.value) &&
                        'text-blue'
                    )}>
                    {o.label}
                  </Text>
                  {Array.isArray(responses[question?.id || '']) &&
                    (responses[question?.id || ''] as string[]).includes(o.value) && (
                      <Check color={tailwindConfig.theme?.extend?.colors.blue} size={20}></Check>
                    )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </Animated.View>
      <View className="flex-col items-center justify-between gap-4 p-4">
        <TouchableOpacity
          className="w-full rounded-xl bg-blue p-4 disabled:opacity-50"
          onPress={handleNext}
          disabled={!isAnswered || saving || disabled}>
          <Text className={clsx('text-center text-lg font-semibold text-white')}>
            {questionIndex == questions.length - 1 ? 'Finish' : 'Continue'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full  rounded-xl bg-slate-300 p-4 disabled:opacity-40"
          onPress={handleBack}
          disabled={questionIndex === 0}>
          <Text className={clsx('text-center text-lg font-semibold text-slate-500')}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
