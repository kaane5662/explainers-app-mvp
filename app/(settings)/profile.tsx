import { IUser } from '@/interfaces';
import axios from 'axios';
import clsx from 'clsx';
import { router } from 'expo-router';
import { ArrowLeft, Save, User, Mail, AtSign } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileSettingsScreen() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/user`);
      const userData = response.data;
      setUser(userData);
      setFormData({
        name: userData.name || '',
        username: userData.username || '',
        email: userData.email || '',
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.username.trim() || !formData.email.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setSaving(true);
      await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user`, {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
      });
      
      Alert.alert('Success', 'Profile updated successfully');
      // Refresh user data
      await fetchUserData();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = () => {
    return (
      formData.name !== (user?.name || '') ||
      formData.username !== (user?.username || '') ||
      formData.email !== (user?.email || '')
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-slate-600">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-slate-200">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-slate-100 rounded-lg items-center justify-center"
            >
              <ArrowLeft size={20} color="#475569" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-slate-900">Profile Settings</Text>
            <TouchableOpacity
              onPress={handleSave}
              disabled={!hasChanges() || saving}
              className={clsx(
                'px-4 py-2 rounded-lg flex-row items-center gap-2',
                hasChanges() && !saving
                  ? 'bg-blue'
                  : 'bg-slate-300'
              )}
            >
              <Save size={16} color={hasChanges() && !saving ? 'white' : '#94a3b8'} />
              <Text className={clsx(
                'font-semibold',
                hasChanges() && !saving ? 'text-white' : 'text-slate-500'
              )}>
                {saving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Form */}
        <View className="px-6 py-6">
          {/* Profile Picture Section */}
          <View className="bg-white rounded-xl p-6 mb-6 border border-slate-200">
            <View className="items-center">
              {user?.imageUrl ? (
                <Image className='w-24 h-24' src={user.imageUrl}>

                </Image>
              ):(
                <View className="w-24 h-24 bg-blue rounded-full items-center justify-center mb-4">
                  <Text className="text-white text-4xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Text>
                </View>

              )}
              <Text className="text-slate-600 text-center">
                Profile picture coming soon
              </Text>
            </View>
          </View>

          {/* Form Fields */}
          <View className="space-y-4">
            {/* Name Field */}
            <View className="bg-white rounded-xl p-4 border border-slate-200">
              <View className="flex-row items-center gap-2 mb-2">
                <User size={20} color="#475569" />
                <Text className="text-sm font-medium text-slate-700">Full Name</Text>
              </View>
              <TextInput
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
                className="text-lg text-slate-900 py-2"
                autoCapitalize="words"
              />
            </View>

            {/* Username Field */}
            {/* <View className="bg-white rounded-xl p-4 border border-slate-200">
              <View className="flex-row items-center gap-2 mb-2">
                <AtSign size={20} color="#475569" />
                <Text className="text-sm font-medium text-slate-700">Username</Text>
              </View>
              <TextInput
                value={formData.username}
                onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
                placeholder="Enter your username"
                className="text-lg text-slate-900 py-2"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View> */}

            {/* Email Field */}
            <View className="bg-white rounded-xl p-4 border border-slate-200">
              <View className="flex-row items-center gap-2 mb-2">
                <Mail size={20} color="#475569" />
                <Text className="text-sm font-medium text-slate-700">Email Address</Text>
              </View>
              <TextInput
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="Enter your email address"
                className="text-lg text-slate-900 py-2"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Additional Info */}
          {/* <View className="mt-6 bg-white rounded-xl p-4 border border-slate-200">
            <Text className="text-sm text-slate-600 text-center">
              Member since {user?.created ? new Date(user.created).toLocaleDateString() : 'N/A'}
            </Text>
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
