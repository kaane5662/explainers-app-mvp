import { IUser } from '@/interfaces';
import axios from 'axios';
import clsx from 'clsx';
import { router } from 'expo-router';
import { ArrowLeft, Save, Lock, Eye, EyeOff } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChangePasswordScreen() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

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

  const handleSave = async () => {
    // Validation
    if (!formData.currentPassword.trim()) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    if (!formData.newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (formData.newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters long');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return;
    }

    try {
      setSaving(true);
      await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user/password`, {
        oldPassword: formData.currentPassword,
        password: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      
      Alert.alert('Success', 'Password updated successfully', [
        {
          text: 'OK',
          onPress: () => {
            // Clear form and go back
            setFormData({
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            });
            router.back();
          }
        }
      ]);
    } catch (error: any) {
      console.error('Error updating password:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const hasValidForm = () => {
    return (
      formData.currentPassword.trim() &&
      formData.newPassword.trim() &&
      formData.confirmPassword.trim() &&
      formData.newPassword === formData.confirmPassword &&
      formData.newPassword.length >= 8 &&
      formData.currentPassword !== formData.newPassword
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-slate-600">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-slate-200">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-slate-100 rounded-lg items-center justify-center"
            >
              <ArrowLeft size={20} color="#475569" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-slate-900">Change Password</Text>
            
          </View>
        </View>

        {/* Password Form */}
        <View className="px-6 py-6">
          {/* Info Card */}
          <View className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
            <Text className="text-blue-800 text-sm text-center">
              Make sure your new password is strong and different from your current password
            </Text>
          </View>

          {/* Form Fields */}
          <View className="space-y-4">
            {/* Current Password Field */}
            <View className="bg-white rounded-xl p-4 border border-slate-200">
              <View className="flex-row items-center gap-3 mb-2">
                <Lock size={20} color="#475569" />
                <Text className="text-sm font-medium text-slate-700">Current Password</Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <TextInput
                  value={formData.currentPassword}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, currentPassword: text }))}
                  placeholder="Enter your current password"
                  className="flex-1 text-lg text-slate-900 py-2"
                  secureTextEntry={!showPasswords.current}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => togglePasswordVisibility('current')}
                  className="p-2"
                >
                  {showPasswords.current ? (
                    <EyeOff size={20} color="#475569" />
                  ) : (
                    <Eye size={20} color="#475569" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password Field */}
            <View className="bg-white rounded-xl p-4 border border-slate-200">
              <View className="flex-row items-center gap-3 mb-2">
                <Lock size={20} color="#475569" />
                <Text className="text-sm font-medium text-slate-700">New Password</Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <TextInput
                  value={formData.newPassword}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, newPassword: text }))}
                  placeholder="Enter your new password"
                  className="flex-1 text-lg text-slate-900 py-2"
                  secureTextEntry={!showPasswords.new}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => togglePasswordVisibility('new')}
                  className="p-2"
                >
                  {showPasswords.new ? (
                    <EyeOff size={20} color="#475569" />
                  ) : (
                    <Eye size={20} color="#475569" />
                  )}
                </TouchableOpacity>
              </View>
              <Text className="text-xs text-slate-500 mt-1">
                Must be at least 8 characters long
              </Text>
            </View>

            {/* Confirm New Password Field */}
            <View className="bg-white rounded-xl p-4 border border-slate-200">
              <View className="flex-row items-center gap-3 mb-2">
                <Lock size={20} color="#475569" />
                <Text className="text-sm font-medium text-slate-700">Confirm New Password</Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <TextInput
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                  placeholder="Confirm your new password"
                  className="flex-1 text-lg text-slate-900 py-2"
                  secureTextEntry={!showPasswords.confirm}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => togglePasswordVisibility('confirm')}
                  className="p-2"
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={20} color="#475569" />
                  ) : (
                    <Eye size={20} color="#475569" />
                  )}
                </TouchableOpacity>
              </View>
              {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <Text className="text-xs text-red-500 mt-1">
                  Passwords do not match
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
              onPress={handleSave}
              disabled={!hasValidForm() || saving}
              className={clsx(
                'p-4 rounded-lg mt-4 flex-row justify-center items-center gap-3',
                hasValidForm() && !saving
                  ? 'bg-blue'
                  : 'bg-slate-300'
              )}
            >
              <Save size={16} color={hasValidForm() && !saving ? 'white' : '#94a3b8'} />
              <Text className={clsx(
                'font-semibold',
                hasValidForm() && !saving ? 'text-white' : 'text-slate-500'
              )}>
                {saving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>

          {/* Password Requirements */}
          <View className="mt-6 bg-white rounded-xl p-4 border border-slate-200">
            <Text className="text-sm font-medium text-slate-700 mb-2">Password Requirements:</Text>
            <View className="space-y-1">
              <Text className="text-xs text-slate-600">• At least 8 characters long</Text>
              <Text className="text-xs text-slate-600">• Different from current password</Text>
              <Text className="text-xs text-slate-600">• Consider using uppercase, lowercase, numbers, and symbols</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
