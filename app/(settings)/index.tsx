import { IUser } from '@/interfaces';
import { plans } from '@/utils/constant';
import axios from 'axios';
import clsx from 'clsx';
import { router } from 'expo-router';
import { ChevronRight, User, Lock, CreditCard, LogOut, Settings as SettingsIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/user`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          // Handle logout logic here
          router.replace('/(auth)/login');
        }},
      ]
    );
  };

  const settingsOptions = [
    {
      id: 'profile',
      title: 'Profile Settings',
      subtitle: 'Edit your profile information',
      icon: User,
      onPress: () => router.push('/(settings)/profile'),
    },
    {
      id: 'password',
      title: 'Change Password',
      subtitle: 'Update your password',
      icon: Lock,
      onPress: () => router.push('/(settings)/password'),
    },
    {
      id: 'subscription',
      title: 'Subscription',
      subtitle: `Current plan: ${user?.plan || 'Free'}`,
      icon: CreditCard,
      onPress: () => router.push('/(settings)/subscription'),
    },
  ];

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-slate-600">Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-8 border-b border-slate-200">
          <View className="flex-row items-center gap-4">
            <View className="w-16 h-16 bg-blue rounded-full items-center justify-center">
              <Text className="text-white text-2xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-slate-900">{user?.name || 'User'}</Text>
              <Text className="text-slate-600">{user?.email}</Text>
              {user?.plan &&(

                <Text className="text-sm text-slate-500 mt-1">
                    {plans[user.plan as keyof typeof plans].name } Plan
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Settings Options */}
        <View className="px-6 py-6">
          <Text className="text-lg font-semibold text-slate-900 mb-4">Account Settings</Text>
          
          {settingsOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={option.onPress}
              className="bg-white rounded-xl p-4 mb-3 border border-slate-200"
            >
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 bg-slate-100 rounded-lg items-center justify-center">
                  <option.icon size={20} color="#475569" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-slate-900">{option.title}</Text>
                  <Text className="text-slate-600">{option.subtitle}</Text>
                </View>
                <ChevronRight style={{marginLeft:"auto"}} size={20} color="#94a3b8" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View className="px-6 py-6">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-50 rounded-xl p-4 border border-red-200"
          >
            <View className="flex-row items-center space-x-4">
              <View className="w-10 h-10 bg-red-100 rounded-lg items-center justify-center">
                <LogOut size={20} color="#dc2626" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-red-700">Logout</Text>
                <Text className="text-red-600">Sign out of your account</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
