import { IUser } from '@/interfaces';
import tailwindConfig from '@/tailwind.config';
import { onboardingOptionsById } from '@/utils/common';
import { ExplainerType } from '@/utils/constant';
import axios from 'axios';
import clsx from 'clsx';
import { router, usePathname } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, Text, TouchableOpacity, View, ScrollView } from 'react-native';


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
  // const pathname = usePathname()
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
  // console.log(pathname)

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

  const initResponses = async () => {
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
    console.log("Initial responses",initialResponses)
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
    initResponses();
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
      return  (responses[question.id] as string)?.length > 0;
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
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      {/* Progress Bar */}
      <View className="px-6 pt-4 pb-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Step {questionIndex + 1} of {questions.length}
          </Text>
          <Text className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {Math.round(((questionIndex + 1) / questions.length) * 100)}%
          </Text>
        </View>
        <View className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <Animated.View
            className="h-full bg-gradient-to-r bg-blue rounded-full"
            style={{
              width: `${((questionIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </View>
      </View>

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
        <View key={questionIndex} className={clsx('w-full', 'flex-1', 'px-6')}>
          <View className="flex-1">
            <Text className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight">
              {question.question}
            </Text>
            <Text className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Choose the option that best describes you
            </Text>

            {/* Single Selection */}
            {question.type == 'single' && (
              <View className="flex flex-col gap-3">
                {question.options.map((o, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      if (!question?.id) return;
                      setResponses((prev) => ({
                        ...prev,
                        [question.id]: o.value,
                      }));
                    }}
                    className={clsx(
                      'flex flex-row items-center gap-4 rounded-2xl border-2 p-5 transition-all duration-200',
                      o.value == responses[question.id]
                        ? 'border-blue2 bg-blue dark:bg-blue-950/30 '
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                    )}>
                    <View
                      className={clsx(
                        'h-6 w-6 rounded-full border-2 flex items-center justify-center',
                        o.value == responses[question.id]
                          ? 'border-blue2 bg-blue0'
                          : 'border-slate-300 dark:border-slate-600'
                      )}>
                      {o.value == responses[question.id] && (
                        <View className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </View>
                    <Text className={clsx(
                      'flex-1 text-lg font-medium',
                      o.value == responses[question.id]
                        ? 'text-white dark:text-blue-300'
                        : 'text-slate-900 dark:text-slate-100'
                    )}>
                      {o.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Multi Selection */}
            <ScrollView>

              {question.type == 'multi' && (
                <View className="flex flex-row flex-wrap gap-3">
                  {question.options.map((o, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        if (!question?.id) return;
                        setResponses((prev) => {
                          console.log("here is previous",prev)
                          const prevArr = prev[question.id] as string[];
                          if (prevArr.includes(o.value)) {
                            const temp = prevArr.filter((v) => v !== o.value);
                            return {
                              ...prev,
                              [question.id]: temp,
                            };
                          } else {
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
                        'flex flex-row items-center gap-3 rounded-full border-2 px-4 py-3 transition-all duration-200',
                        Array.isArray(responses[question?.id || '']) &&
                          (responses[question?.id || ''] as string[]).includes(o.value)
                          ? 'border-blue2 bg-blue '
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                      )}>
                      <Text
                        className={clsx(
                          'text-base font-medium',
                          Array.isArray(responses[question?.id || '']) &&
                            (responses[question?.id || ''] as string[]).includes(o.value)
                            ? 'text-white dark:text-blue-300'
                            : 'text-slate-900 dark:text-slate-100'
                        )}>
                        {o.label}
                      </Text>
                      {Array.isArray(responses[question?.id || '']) &&
                        (responses[question?.id || ''] as string[]).includes(o.value) && (
                          <Check color="white" size={18} />
                        )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Animated.View>

      {/* Navigation Buttons */}
      <View className="px-6 pb-6 pt-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
        <View className="flex-col gap-3">
          <TouchableOpacity
            className={clsx(
              'w-full rounded-xl p-4 transition-all duration-200',
              !isAnswered || saving || disabled
                ? 'bg-slate-300 dark:bg-slate-700'
                : 'bg-gradient-to-r bg-blue hover:bg-blue/40'
            )}
            onPress={() => handleNext()}
            disabled={!isAnswered || saving || disabled}>
            <Text className={clsx(
              'text-center text-lg font-semibold',
              !isAnswered || saving || disabled
                ? 'text-slate-500 dark:text-slate-400'
                : 'text-white'
            )}>
              {saving ? 'Saving...' : questionIndex == questions.length - 1 ? 'Finish Setup' : 'Continue'}
            </Text>
          </TouchableOpacity>
          
          {questionIndex > 0 && (
            <TouchableOpacity
              className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 p-4 transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              onPress={handleBack}>
              <Text className="text-center text-lg font-medium text-slate-700 dark:text-slate-300">
                Back
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
