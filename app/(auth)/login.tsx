import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Eye, EyeOff, AlertTriangle, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
// import { useTranslations } from "next-intl";
// import { useMixpanel } from "@components/[locale]/common/MixPanelProvider";
import clsx from 'clsx';
import { useGoogleOAuth } from '@/hooks/useGoogleOAuth';
import { useUser } from '@/hooks/useUser';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * A password input field with show/hide toggle
 */
function PasswordInput({
  label,
  value,
  show,
  onToggle,
  onChange,
  placeholder,
}: {
  label: string;
  value: string | null;
  show: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <View className="flex-col gap-1">
      <Text className="text-sm">{label}</Text>
      <View className="relative">
        <TextInput
          secureTextEntry={!show}
          value={value || ''}
          onChangeText={onChange}
          className={clsx(
            'w-full rounded-2xl border-2 border-slate-200 p-4 pr-10',
            '',
            'bg-white dark:bg-dark2',
            'text-black dark:text-white'
            // "focus:outline-none focus:ring-2 focus:ring-blue/20",
            // "transition duration-200"
          )}
          placeholder={placeholder}
        />
        <TouchableOpacity
          onPress={onToggle}
          className={clsx(
            'absolute right-3 top-1/2 -translate-y-1/2',
            'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
            'transition duration-200'
          )}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Login() {
  //   const tran = useTranslations();
  //   const { mixpanel } = useMixpanel();
  console.log('Login component rendered');
  const router = useRouter();
  const { signInWithGoogle } = useGoogleOAuth();
  const { refetch } = useUser();

  // State management for form fields and UI states
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showTurnstile, setShowTurnstile] = useState<boolean>(false);

  /**
   * Called when Turnstile verification is successful
   * Automatically proceeds with login
   */
  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
    // Automatically sign in after successful verification
    setTimeout(() => {
      signIn(token);
    }, 500); // Small delay to give visual feedback that verification completed
  };

  /**
   * Handles the initial login button click
   * Validates input and shows Turnstile verification
   */
  function handleInitialClick() {
    // Clear previous errors
    setError(null);

    // Validate email and password are provided
    if (!email) {
      setError('No email ');
      return;
    }

    if (!password) {
      setError('no password');
      return;
    }

    // Skip turnstile in development mode
    if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
      signIn('dev-bypass-token');
      return;
    }

    // Show turnstile widget
    setShowTurnstile(true);

    // Track verification step
    // mixpanel.track("login_verification_step", {
    //   has_email: !!email,
    //   email_domain: email ? email.split('@')[1] : undefined,
    //   location: 'login_page',
    // });
  }

  /**
   * Handles the login form submission
   * Sends POST request to login endpoint with user credentials
   * Redirects to myvideos page on success, shows error on failure
   */
  async function signIn(tokenOverride?: string) {
    try {
      setLoading(true);
      setError(null);
      console.log('hello click event?');
      const token = tokenOverride || turnstileToken;

      // Verify Turnstile token exists
      if (!token) {
        setError('No token');
        setLoading(false);
        return;
      }

      // Track login attempt
      //   mixpanel.track("login_attempt", {
      //     has_email: !!email,
      //     email_domain: email ? email.split('@')[1] : undefined,
      //     location: 'login_page',
      //   });

      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          turnstileToken: token,
        }),
      });

      const data = await res.json();
      console.log('Login response status:', res.status);
      console.log('Login response data:', data);

      if (res.ok) {
        // Check if backend returned a JWT token
        if (data.token) {
          console.log('Storing JWT token from login response');
          await AsyncStorage.setItem('jwt_token', data.token);
        } else {
          console.log('No JWT token in login response - this might be the issue');
        }

        // Track successful client-side login
        // mixpanel.track("login_success_client", {
        //   login_method: "email",
        //   email_domain: email ? email.split('@')[1] : undefined,
        // });

        // Refetch user data to update the user state
        await refetch();
        router.push('/');
      } else if (data.error) {
        // Track login error
        // mixpanel.track("login_error_client", {
        //   error: data.error,
        //   error_on: data.errorOn,
        //   email_domain: email ? email.split('@')[1] : undefined,
        // });

        setError(data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      // Track Google sign-in attempt
      // mixpanel.track("login_attempt", {
      //   login_method: "google",
      //   location: 'login_page',
      // });

      const result = await signInWithGoogle();

      if (result.type === 'success') {
        // Exchange Google token for session
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/auth/google`,
          {
            idToken: result.idToken,
            accessToken: result.accessToken,
          },
          { withCredentials: true }
        );

        if (response.status === 200) {
          // Store JWT token if provided
          if (response.data.token) {
            await AsyncStorage.setItem('jwt_token', response.data.token);
          }
          // Refresh user data and navigate
          await refetch();
          router.push('/');
        } else {
          setError('Authentication failed');
        }
      } else if (result.type === 'cancel') {
        // User cancelled, no error needed
      } else {
        setError(result.error || 'Google sign-in failed');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setError(error?.response?.data?.error || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      className={clsx(
        'w-full flex-row items-center justify-center py-20',
        'gap-32 p-4',
        'max-md:flex-col'
      )}>
      <View className={clsx('flex-col gap-4 ', 'w-full p-0 md:p-4 ')}>
        <View className=" h-12 w-12 items-center justify-center rounded-2xl bg-blue">
          <Sparkles size={24} color={'white'} />
        </View>
        <View className="flex flex-col gap-2">
          <Text className="text-4xl font-semibold">Welcome Back</Text>
          <Text className="text-xl text-slate-500  ">Ready to create your next explainer?</Text>
        </View>

        <View className="w-full flex-col gap-4 max-md:text-sm">
          <View className="flex-col gap-1">
            <Text className="text-sm">{'Email'}</Text>
            <TextInput
              onChangeText={(t) => setEmail(t)}
              className={clsx(
                'rounded-2xl border-2 border-slate-200 p-4 ',
                'bg-white dark:bg-dark2',
                'text-black dark:text-white'
                // "focus:outline-none focus:ring-2 focus:ring-blue/20",
                // "transition duration-200"
              )}
              placeholder={'Enter your email'}
            />
          </View>

          <PasswordInput
            label={'Password'}
            value={password}
            show={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
            onChange={setPassword}
            placeholder={'Enter your password'}
          />

          {error && (
            <View className="flex-row items-center gap-2">
              <AlertTriangle size={20} className="text-red-700" />
              <Text className="text-sm text-red-700">{error}</Text>
            </View>
          )}

          <View className="mb-2 flex-row items-center justify-end">
            <TouchableOpacity
              onPress={() => {
                // mixpanel.track("forgot_password_click", {
                //   location: "login_page",
                //   has_entered_email: !!email,
                // });
                router.push('/forgotpassword');
              }}>
              <Text className="text-sm text-blue underline">{'Forgot Password'}</Text>
            </TouchableOpacity>
          </View>

          {!showTurnstile ? (
            <TouchableOpacity
              className=" w-full rounded-full bg-blue p-4"
              onPress={handleInitialClick}>
              <Text className="text-center font-semibold text-white">{'Sign in'}</Text>
            </TouchableOpacity>
          ) : (
            <View className="mb-4 flex-col items-center justify-center">
              {/* <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                onSuccess={handleTurnstileSuccess}
                options={{
                  theme: 'light',
                }}
              /> */}

              {loading && (
                <View className="mt-2 flex-row items-center justify-center">
                  <ActivityIndicator size="small" color="#0000ff" />
                  <Text className="text-sm text-gray-600 dark:text-gray-400">Logging in...</Text>
                </View>
              )}

              {error && !loading && (
                <TouchableOpacity
                  onPress={() => {
                    setError(null);
                    if (turnstileToken) {
                      signIn(turnstileToken);
                    }
                  }}
                  className="mt-4 w-full rounded-full bg-blue p-4">
                  <Text className="text-blue">{'Loading'}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <TouchableOpacity
            className=" w-full rounded-full bg-slate-200  p-4"
            onPress={handleGoogleSignIn}>
            <Text className=" text-center ">{'Sign in with Google'}</Text>
          </TouchableOpacity>

          <View className=" mt-2 flex flex-row items-center self-center font-medium">
            <Text>{"Don't have a account"} </Text>
            <TouchableOpacity
              onPress={() => {
                // mixpanel.track("signup_link_click", {
                //   from_location: "login_page",
                // });
                router.push('/signup');
              }}>
              <Text className="text-blue underline">{'Sign up'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
