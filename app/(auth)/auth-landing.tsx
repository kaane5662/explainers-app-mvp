import SpecialButton from '@/components/common/SpecialButton';
import { Link } from 'expo-router';
import { SafeAreaView, Text, View } from 'react-native';

export default function AuthLanding() {
  console.log('AuthLanding component rendered');
  return (
    <SafeAreaView>
      <View className="flex h-screen justify-center p-2">
        <View className="flex flex-col items-center gap-2 py-12">
          <Text className="w-[80%] text-center text-4xl font-semibold">
            Welcome to Imagine Explainers
          </Text>
        </View>
        <View className="mt-auto flex flex-col items-center gap-2 py-40">
          <Link
            className="w-full rounded-full bg-blue p-4 text-center text-lg font-semibold text-white"
            href={'/login'}>
            Sign In
          </Link>
          <Link
            className="w-full rounded-full border border-slate-300 bg-slate-200 p-4 text-center text-lg font-semibold text-slate-500"
            href={'/signup'}>
            Create Account
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
