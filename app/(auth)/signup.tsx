"use client";
import { useEffect, useState } from "react";
// import { AnimatePresence, motion } from "moti";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { AlertTriangle, Loader, Check, Eye, EyeOff, ArrowRight, CircleArrowLeftIcon, Sparkles } from "lucide-react-native";
import { useRouter } from "expo-router";
import clsx from "clsx";
// import { useTranslations } from "next-intl";
// import { useMixpanel } from "@components/[locale]/common/MixPanelProvider";
import SpecialButton from "@/components/common/SpecialButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

function tran(inputString: string): string {
    return inputString;
  }

function ValidationItem({ isValid, text }: { isValid: boolean; text: string }) {
  return (
    <View
    //   from={{ opacity: 0 }}
    //   animate={{ opacity: 1 }}
      className={clsx(
        "flex-row items-center gap-2",
        isValid ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-500"
      )}
    >
      <Check
        size={16}
        className={clsx(isValid ? "text-green" : "text-gray-400 dark:text-gray-500")}
      />
      <Text className="text-sm">{text}</Text>
    </View>
  );
}

function PasswordInput({
  label,
  value,
  show,
  onToggle,
  onChange,
  showInfo,
  validation,
  placeholder,
  isConfirm = false,
  passwordsMatch = true,
}: {
  label: string;
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
  showInfo?: boolean;
  validation: {
    hasEightChar: boolean;
    hasOneUpperChar: boolean;
    hasSpecialChar: boolean;
  };
  placeholder: string;
  isConfirm?: boolean;
  passwordsMatch?: boolean;
}) {
  
  return (
    <View className="flex-col gap-1">
      <View className="flex-row items-center gap-2">
        <Text className="text-sm">{label}</Text>
      </View>
      <View className="relative">
        <TextInput
          secureTextEntry={!show}
          value={value}
          onChangeText={onChange}
          className={clsx(
            "w-full p-2 px-2 pr-10 rounded-lg",
            "border-2 border-slate-200 dark:border-slate-600",
            "bg-white dark:bg-dark2",
            "text-black dark:text-white",
            // "focus:outline-none focus:ring-2 focus:ring-blue/20",
            // "transition duration-200",
            {
              "border-red-500": isConfirm && !passwordsMatch && value,
            }
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

      {isConfirm && !passwordsMatch && value && (
        <Text
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-red-500 text-sm"
        >
          {tran("szd7xbljnr")}
        </Text>
      )}

      {showInfo && value && (
        // <AnimatePresence>
          <View
            // from={{ opacity: 0, height: 0 }}
            // animate={{ opacity: 1, height: "auto" }}
            // exit={{ opacity: 0, height: 0 }}
            className={clsx(
              "flex-col gap-1 mt-1 py-1",
              "text-xs border-l-2 pl-2",
              "border-gray-200 dark:border-gray-700"
            )}
          >
            <ValidationItem
              isValid={validation.hasEightChar}
              text={tran("vhgnfqz2ais")}
            />
            <ValidationItem
              isValid={validation.hasOneUpperChar}
              text={tran("1ackjf8dvxj")}
            />
            <ValidationItem
              isValid={validation.hasSpecialChar}
              text={tran("wex570jear")}
            />
          </View>
        // </AnimatePresence>
      )}
    </View>
  );
}

export default function SignupPage() {
//   const tran = useTranslations();
//   const { mixpanel } = useMixpanel();
  const router = useRouter();
  const [formState, setFormState] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    referralCode: AsyncStorage.getItem("referral_code") || undefined,
    error: "",
    agree: true,
    validEmail: true,
    loading: false,
    hasEightChar: false,
    hasOneUpperChar: false,
    hasSpecialChar: false,
    passwordsMatch: false,
    showPassword: false,
    showConfirmPassword: false,
    turnstileToken: null as string | null,
    showTurnstile: false,
  });

  const [slideIndex, setSlideIndex] = useState(0);

  function validatePassword() {
    setFormState((prev) => ({
      ...prev,
      hasEightChar: prev.password.length >= 8,
      hasSpecialChar:
        /[0-9]/.test(prev.password) || /[!@#$%^&*(),.?":{}|<>]/.test(prev.password),
      hasOneUpperChar: /[A-Z]/.test(prev.password),
      passwordsMatch:
        prev.password === prev.confirmPassword && prev.password !== "",
    }));
  }

  useEffect(() => {
    validatePassword();
  }, [formState.password, formState.confirmPassword]);

  function validateEmail() {
    setFormState((prev) => ({
      ...prev,
      validEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(prev.email),
    }));
  }

  function handleInitialClick() {
    setFormState((prev) => ({ ...prev, error: "" }));

    if (!formState.name) {
      setFormState((prev) => ({
        ...prev,
        error: tran("uqpdatwx8pf"),
        showTurnstile: false,
      }));
      return;
    }

    if (!formState.email) {
      setFormState((prev) => ({
        ...prev,
        error: tran("4i8gxwfkn2i"),
        showTurnstile: false,
      }));
      return;
    }

    if (!formState.validEmail && formState.email) {
      setFormState((prev) => ({
        ...prev,
        error: tran("471epfoh69e"),
        showTurnstile: false,
      }));
      return;
    }

    if (!formState.password) {
      setFormState((prev) => ({
        ...prev,
        error: tran("si3e8saqb2e"),
        showTurnstile: false,
      }));
      return;
    }

    if (!formState.confirmPassword) {
      setFormState((prev) => ({
        ...prev,
        error: tran("jx09nehuly"),
        showTurnstile: false,
      }));
      return;
    }

    if (!formState.agree) {
      setFormState((prev) => ({
        ...prev,
        error: tran("e0jdb1jvkvc"),
        showTurnstile: false,
      }));
      return;
    }

    if (!formState.hasEightChar || !formState.hasOneUpperChar || !formState.hasSpecialChar) {
      setFormState((prev) => ({
        ...prev,
        error: tran("vkh05giwbl"),
        showTurnstile: false,
      }));
      return;
    }

    if (!formState.passwordsMatch) {
      setFormState((prev) => ({
        ...prev,
        error: tran("szd7xbljnr"),
        showTurnstile: false,
      }));
      return;
    }

    if (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") {
      signUp("dev-bypass-token");
      return;
    }

    setFormState((prev) => ({ ...prev, showTurnstile: true, error: "" }));

    // mixpanel.track("signup_verification_step", {
    //   has_email: !!formState.email,
    //   has_name: !!formState.name,
    //   email_domain: formState.email ? formState.email.split("@")[1] : undefined,
    // });
  }

  const handleTurnstileSuccess = (token: string) => {
    setFormState((prev) => ({ ...prev, turnstileToken: token }));
    setTimeout(() => {
      signUp(token);
    }, 500);
  };

  async function signUp(tokenOverride?: string) {
    setFormState((prev) => ({ ...prev, loading: true }));
    const { email, name, password } = formState;
    const turnstileToken = tokenOverride || formState.turnstileToken;

    if (!turnstileToken) {
      setFormState((prev) => ({
        ...prev,
        loading: false,
        error: tran("4gc125ppnvl"),
        errorOn: "turnstile",
      }));
      return;
    }

    // mixpanel.track("signup_attempt", {
    //   has_email: !!email,
    //   has_name: !!name,
    //   password_valid:
    //     formState.hasEightChar &&
    //     formState.hasOneUpperChar &&
    //     formState.hasSpecialChar &&
    //     formState.passwordsMatch,
    //   email_domain: email ? email.split("@")[1] : undefined,
    //   location: "signup_page",
    // });

    try {
      console.log("[REFERRAL-DEBUG] Signup attempt with referral code:", formState.referralCode);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          turnstileToken,
          referralCode: formState.referralCode || undefined,
        }),
      });

      const data = await res.json();
      console.log("[REFERRAL-DEBUG] Signup response:", { success: res.ok, hasData: !!data });

      if (res.ok) {
        // mixpanel.track("signup_success_client", {
        //   signup_method: "email",
        //   email_domain: email.split("@")[1],
        //   name_length: name.length,
        // });
        AsyncStorage.removeItem("referral_code");

        router.push("/");
      } else if (data.error) {
        // mixpanel.track("signup_error_client", {
        //   error: data.error,
        //   error_on: data.errorOn,
        //   email_domain: email ? email.split("@")[1] : undefined,
        // });

        setFormState((prev) => ({ ...prev, error: data.error, errorOn: data.errorOn }));
      }
    } catch (error) {
    //   mixpanel.track("signup_error_client", {
    //     error: error instanceof Error ? error.message : "Unknown error",
    //     email_domain: email ? email.split("@")[1] : undefined,
    //   });

      setFormState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error",
        errorOn: "Unknown error",
      }));
    } finally {
      setFormState((prev) => ({ ...prev, loading: false }));
    }
  }

  const handleGoogleSignUp = () => {
    // mixpanel.track("signup_attempt", {
    //   signup_method: "google",
    //   location: "signup_page",
    // });
  };

  return (
    <View
      
      className={clsx(
        "flex-row w-full h-full justify-center items-center",
        "p-2 md:p-4 py-2 md:py-2 gap-32",
        "max-md:gap-8 max-md:flex-col"
      )}
    >
      <View
        className={clsx(
          "flex-col gap-4 items-center",
          "w-full max-w-[500px]",
          "p-0 md:p-4"
        )}
      >
        <Sparkles
          size={40}
          className="text-blue2 dark:text-white2 dark:bg-blue rounded-xl shadow-md p-2"
        />

        <View className="flex-col gap-2 items-center justify-center text-center">
          <Text className="text-5xl font-semibold">
            {"Sign Up"}
          </Text>
          <Text className="text-slate-500 dark:text-slate-400">
            {"Sign up and start creating videos for free"}
          </Text>
        </View>

        {slideIndex == 0 && (
          <View className="flex-col items-center w-full gap-4">
            <View className="flex-col gap-1 w-full mt-8">
              <Text className="text-sm">{"Email"}</Text>
              <TextInput
                defaultValue={formState.email}
                onFocus={() => setFormState((prev) => ({ ...prev, validEmail: true }))}
                onBlur={validateEmail}
                onChangeText={(text) => {
                  setFormState((prev) => ({ ...prev, email: text }));
                  validateEmail();
                }}
                className={clsx(
                  "p-3 px-3 rounded-lg border-2 border-slate-200 dark:border-slate-600",
                  "bg-white dark:bg-dark2",
                  "text-black dark:text-white",
                //   "focus:outline-none focus:ring-2 focus:ring-blue/20",
                //   "transition duration-200",
                  { "text-red-500 border-red-500": !formState.validEmail }
                )}
                placeholder={"Enter your email..."}
              />
              {!formState.validEmail && (
                <Text
                //   from={{ opacity: 0 }}
                //   animate={{ opacity: 1 }}
                //   exit={{ opacity: 0 }}
                  className="text-red-500 text-sm"
                >
                  {"Invalid email address"}
                </Text>
              )}
            </View>
            <View className="flex-col w-full gap-1">
              <SpecialButton
                onPress={() => setSlideIndex(1)}
                disabled={!formState.validEmail || formState.email.length < 1}
                className="w-full bg-blue"
                title={<Text className="text-white font-semibold">Continue</Text>}
                iconRight={<ArrowRight color={"white"} />}
              />
              <SpecialButton
                onPress={handleGoogleSignUp}
                // variant="gray"
                className="w-full bg-gray-300"
                title={<Text className="font-semibold">Sign in with Google</Text>}
                iconLeft={<CircleArrowLeftIcon />}
              />
              <View className="text-center self-center flex flex-row gap-2 item text-sm mt-2 font-medium">
                <Text>{"Have an Account"}{" "}</Text>
                
                <TouchableOpacity
                  onPress={() => {
                    // mixpanel.track("login_link_click", {
                    //   from_location: "signup_page",
                    // });
                    router.push("/login");
                  }}
                >
                  <Text className="underline text-blue hover:text-blue2 dark:text-blue dark:hover:text-blue">
                    {"Sign in"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="text-sm flex items-center text-center">
              
              <Text> {tran("By logging in you accept the TOS and")}{" "}</Text>
              <TouchableOpacity
                onPress={() =>
                  window.open("/legal/privacy", "privacyPopup", "popup=yes,width=800,height=800")
                }
              >
                <Text className="text-blue hover:underline underline cursor-pointer">
                  {"Privacy Policy"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {slideIndex == 1 && (
          <View className="flex-col gap-3 w-full max-md:text-sm">
            <View className="flex-col gap-1">
              <Text className="text-sm">{"Full Name"}</Text>
              <TextInput
                defaultValue={formState.name}
                onChangeText={(text) =>
                  setFormState((prev) => ({ ...prev, name: text }))
                }
                className={clsx(
                  "p-2 px-2 rounded-lg border-2 border-slate-200 dark:border-slate-600",
                  "bg-white dark:bg-dark2",
                  "text-black dark:text-white",
                //   "focus:outline-none focus:ring-2 focus:ring-blue/20",
                //   "transition duration-200"
                )}
                placeholder={"Enter your name..."}
              />
            </View>

            <PasswordInput
              label={"Password"}
              value={formState.password}
              show={formState.showPassword}
              onToggle={() =>
                setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }))
              }
              onChange={(value) =>
                setFormState((prev) => ({ ...prev, password: value }))
              }
              placeholder={"Enter your password..."}
              showInfo={true}
              validation={{
                hasEightChar: formState.hasEightChar,
                hasOneUpperChar: formState.hasOneUpperChar,
                hasSpecialChar: formState.hasSpecialChar,
              }}
            />

            <PasswordInput
              label={"Confirm password"}
              value={formState.confirmPassword}
              show={formState.showConfirmPassword}
              onToggle={() =>
                setFormState((prev) => ({
                  ...prev,
                  showConfirmPassword: !prev.showConfirmPassword,
                }))
              }
              onChange={(value) =>
                setFormState((prev) => ({ ...prev, confirmPassword: value }))
              }
              placeholder={"Enter your password again..."}
              validation={{
                hasEightChar: formState.hasEightChar,
                hasOneUpperChar: formState.hasOneUpperChar,
                hasSpecialChar: formState.hasSpecialChar,
              }}
              isConfirm={true}
              passwordsMatch={formState.passwordsMatch}
            />
            <View className="text-sm flex flex-row items-center">
              <Text className="text-slate-500 dark:text-slate-400">
                {"Signing up as "}{" "}
              </Text>
              <Text className="font-semibold ">{formState.email}</Text>
              <TouchableOpacity
                onPress={() => {
                  setSlideIndex(0);
                  setFormState((prev) => ({ ...prev, error: "" }));
                }}
              >
                <Text className="text-blue cursor-pointer ml-2 underline">
                  {"Change"}
                </Text>
              </TouchableOpacity>
            </View>

            {formState.error && (
              <View
                
                className="flex-row gap-2 items-center"
              >
                <AlertTriangle size={20} className="text-red-500" />
                <Text className="text-sm text-red-500">{formState.error}</Text>
              </View>
            )}

            {!formState.showTurnstile ? (
              <SpecialButton
                onPress={handleInitialClick}
                className="mt-4 bg-blue"
                title={<Text className=" text-white font-bold">Sign Up</Text>}
              />
            ) : (
              <View className={clsx("flex-col items-center justify-center mt-4 mb-4")}>
                {/* <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                  onSuccess={handleTurnstileSuccess}
                  options={{
                    theme: "light",
                  }}
                /> */}

                {formState.loading && (
                  <View className={clsx("flex-row items-center justify-center mt-4")}>
                    <ActivityIndicator className="animate-spin mr-2" size={16} />
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      {"Signing up"}
                    </Text>
                  </View>
                )}

                {formState.error && !formState.loading && (
                  <SpecialButton
                    onPress={() => {
                      setFormState((prev) => ({ ...prev, error: "", errorOn: "" }));
                      if (formState.turnstileToken) {
                        signUp(formState.turnstileToken);
                      }
                    }}
                    className="mt-4 w-full"
                    title={tran("jophkqg2wkk")}
                  />
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
