import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Eye, EyeOff, AlertTriangle, Circle, Sparkle, Sparkles } from "lucide-react-native";
import { useRouter } from "expo-router";
// import { useTranslations } from "next-intl";
// import { useMixpanel } from "@components/[locale]/common/MixPanelProvider";
import clsx from "clsx";
import tailwindConfig from "@/tailwind.config";

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
          value={value || ""}
          onChangeText={onChange}
          className={clsx(
            "w-full p-2 pr-10 rounded-lg",
            "border-2 border-slate-200 dark:border-slate-600",
            "bg-white dark:bg-dark2",
            "text-black dark:text-white",
            // "focus:outline-none focus:ring-2 focus:ring-blue/20",
            // "transition duration-200"
          )}
          placeholder={placeholder}
        />
        <TouchableOpacity
          onPress={onToggle}
          className={clsx(
            "absolute right-3 top-1/2 -translate-y-1/2",
            "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
            "transition duration-200"
          )}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Login() {
//   const tran = useTranslations();
//   const { mixpanel } = useMixpanel();
  const router = useRouter();

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
      setError("No email ");
      return;
    }

    if (!password) {
      setError("no password");
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

      const token = tokenOverride || turnstileToken;

      // Verify Turnstile token exists
      if (!token) {
        setError("No token");
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          turnstileToken: token
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Track successful client-side login
        // mixpanel.track("login_success_client", {
        //   login_method: "email",
        //   email_domain: email ? email.split('@')[1] : undefined,
        // });

        router.push("/");
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

  const handleGoogleSignIn = () => {
    // Track Google sign-in attempt
    // mixpanel.track("login_attempt", {
    //   login_method: "google",
    //   location: 'login_page',
    // });
  };

  return (
    <View
      className={clsx(
        "flex-row w-full py-10 justify-center items-center",
        "p-4 gap-32",
        "max-md:flex-col"
      )}
    >
      <View className={clsx(
        "flex-col gap-4 items-center",
        "p-0 md:p-4 w-full max-w-[500px]",
      )}>
        <Sparkles
          size={40}
          color={tailwindConfig.theme?.extend?.colors.blue}
          className="text-blue2 dark:text-blue rounded-xl shadow-md p-2"
        />
        <View className="flex flex-col items-center gap-2">
            <Text className="text-4xl font-semibold">
            {"Log in"}
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 ">
            {"Welcome back, please enter details"}
            </Text>

        </View>

        <View className="flex-col gap-4 w-full max-md:text-sm">
          <View className="flex-col gap-1">
            <Text className="text-sm">{"Email"}</Text>
            <TextInput
              onChangeText={(t)=>setEmail(t)}
              className={clsx(
                "p-2 rounded-lg border-2 border-slate-200 dark:border-slate-600",
                "bg-white dark:bg-dark2",
                "text-black dark:text-white",
                // "focus:outline-none focus:ring-2 focus:ring-blue/20",
                // "transition duration-200"
              )}
              placeholder={"Enter your email"}
            />
          </View>

          <PasswordInput
            label={"Enter your password"}
            value={password}
            show={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
            onChange={setPassword}
            placeholder={"Password"}
          />

          {error && (
            <View className="flex-row gap-2 items-center">
              <AlertTriangle size={20} className="text-red-700" />
              <Text className="text-sm text-red-700">{error}</Text>
            </View>
          )}

          <View className="flex-row justify-end items-center mb-2">
            <TouchableOpacity
              onPress={() => {
                // mixpanel.track("forgot_password_click", {
                //   location: "login_page",
                //   has_entered_email: !!email,
                // });
                router.push("/forgotpassword");
              }}
            >
              <Text className="text-sm text-blue underline">
                {"Forgot Password"}
              </Text>
            </TouchableOpacity>
          </View>

          {!showTurnstile ? (
            <TouchableOpacity className=" rounded-full bg-blue w-full p-4" onPress={handleInitialClick}>
              <Text className="text-white text-center font-semibold">{"Sign in"}</Text>
            </TouchableOpacity>
          ) : (
            <View className="flex-col items-center justify-center mb-4">
              {/* <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                onSuccess={handleTurnstileSuccess}
                options={{
                  theme: 'light',
                }}
              /> */}

              {loading && (
                <View className="flex-row items-center justify-center mt-2">
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
                  className="mt-4 w-full bg-blue p-4 rounded-full"
                >
                  <Text className="text-blue">{"Loading"}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <TouchableOpacity className=" w-full border-slate-300 rounded-full border-2 p-4" onPress={handleGoogleSignIn}>
            <Text className=" text-center font-semibold ">{"Sign in with Google"}</Text>
          </TouchableOpacity>

          <View className=" mt-2 self-center flex flex-row items-center font-medium">
            <Text>

            {"Don't have a account"}{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                // mixpanel.track("signup_link_click", {
                //   from_location: "login_page",
                // });
                router.push("/auth/signup");
              }}
            >
            <Text className="underline text-blue">{"Sign up"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
