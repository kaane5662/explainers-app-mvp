import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { AlertCircle, Mail, CheckCircle } from "lucide-react-native";
import clsx from "clsx";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState<string>(""); // State for email input
  const [success, setSuccess] = useState<boolean>(false); // State to track if email was sent successfully
  const [error, setError] = useState<string | null>(null); // State for error messages

  // Function to handle sending the reset password email
  const sendReset = () => {
    setError(null); // Clear any previous errors

    // Client-side validation
    if (!email || email.trim() === "") {
      setError("Please enter a valid email address.");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setSuccess(true); // Set success state to true
    }, 1000);
  };

  return (
    <View className="flex-1 items-center justify-center">
      {!success ? (
        // Display the form if email hasn't been sent successfully
        <View className="flex flex-col gap-5 items-center p-8 w-11/12 max-w-md">
          <Mail size={50} className="shadow-md p-2 rounded-xl text-blue-500" />
          <View className="flex flex-col gap-1 justify-center items-center text-center">
            <Text className="text-4xl text-center font-semibold">Forgot Password</Text>
            <Text className="text-slate-500 text-center">Enter your email to reset your password</Text>
          </View>
          <View className="flex flex-col gap-4 w-full">
            <View className="flex flex-col gap-1">
              <Text className="text-sm">Email Address</Text>
              <TextInput
                onChangeText={setEmail}
                className="p-3 rounded-lg border-slate-200 bg-white border-2 w-full"
                placeholder="Enter your email"
              />
              {error && (
                // Display error message if there's an error
                <View className="flex gap-2 items-center mt-2">
                  <AlertCircle size={20} className="text-red-700" />
                  <Text className="text-sm">{error}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={sendReset}
              className="rounded-full bg-blue p-3 w-full bg-gradient-to-br from-blue-500 to-blue-700 text-white"
            >
              <Text className="text-center font-semibold text-white">Send Reset Link</Text>
            </TouchableOpacity>
            <Text className="text-base font-semibold text-center mt-4">
              <Text
                onPress={() => router.push("/login")}
                className="text-blue"
              >
                Login
              </Text>
              {"  "}or{"  "}
              <Text
                onPress={() => router.push("/signup")}
                className="text-blue"
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </View>
      ) : (
        // Display success message if email was sent successfully
        <View className="flex flex-col gap-5 items-center p-8 w-11/12 max-w-md">
          <CheckCircle size={50} className="shadow-md p-2 rounded-xl text-blue-500" />
          <View className="flex flex-col gap-1 justify-center items-center text-center">
            <Text className="text-4xl font-semibold">Check Your Email</Text>
            <Text className="text-slate-500 text-center">
              We have sent a password reset link to your email.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="rounded-full flex justify-center bg-blue p-3 w-full bg-gradient-to-br from-blue-500 to-blue-700 text-white"
          >
            <Text className="text-center text-white">Go to Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
