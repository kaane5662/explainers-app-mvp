import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(tabs)" />;  // Replace 'home' with your desired group
}