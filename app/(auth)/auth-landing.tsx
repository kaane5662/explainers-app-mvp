import SpecialButton from "@/components/common/SpecialButton";
import { Link } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";

export default function AuthLanding(){
    return(
        <SafeAreaView>
            <View className="flex justify-center h-screen p-2">
                <View className="flex flex-col gap-2 items-center py-12">
                    <Text className="text-4xl font-semibold text-center w-[80%]">Welcome to Imagine Explainers</Text>
                </View>
                <View className="flex flex-col gap-2 items-center mt-auto py-40">
                    <Link className="rounded-full text-lg font-semibold p-4 text-white bg-blue w-full text-center" href={"/login"}>
                        Sign In
                    </Link>
                    <Link className="rounded-full text-lg font-semibold p-4 bg-slate-200 border border-slate-300 text-slate-500 w-full text-center" href={"/login"}>
                        Create Account
                    </Link>
                </View>
            </View>
        </SafeAreaView>
    )
}