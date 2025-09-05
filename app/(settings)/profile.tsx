import { IUser } from '@/interfaces';
import axios from 'axios';
import clsx from 'clsx';
import { router } from 'expo-router';
import { ArrowLeft, Save, User, Mail, AtSign, Edit, SaveIcon, DeleteIcon, TrashIcon, Trash2Icon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { generateRandomString } from '@/utils/common';



export default function ProfileSettingsScreen() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUri,setImageUri] = useState<string|null>(null);
  const [imageType,setImageType] = useState<string|null>(null)
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


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      
    });

    console.log(result.assets);

    if(result.canceled) return
    let image = result.assets[0]
    if(!image.mimeType || !image.uri) return
    setImageType(image.mimeType)
    setImageUri(image.uri)
    // console.log(image)


  };

  const uploadImage = async () => {
    
    if(!imageUri) return
    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/user/uploadimage?filetype=${imageType}`,
        {},
        { withCredentials: true }
      );
      if (!res.data.url) throw new Error("Failed to get presigned url");

      const { url, fields } = res.data;
      const formData = new FormData();
      console.log("here image stuff",imageUri,imageType)
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      
      if(!user)return
      formData.append("file", {
        uri: imageUri, // e.g. "file:///.../image.jpg"
        name: `profile-${user.id}-${generateRandomString(8)}`,
        type: imageType || "image/jpeg",
      } as any);

      await fetch(url, {
        method: "POST",
        body: formData,
        // mode: "no-cors",
      });
      setImageUri(null)
      setUser({...user,imageUrl:imageUri})
      Alert.alert(
        "Image Saved",
        "Your image has been successfully saved.",
      );

      // setSrc(undefined);
      // location.reload();
      // toast.success(tran("58kxu1bp56"));
    } catch (error: any) {
      // toast.error(error.message || tran("uzrlaqokq8"));
      console.error(error)
    } finally {
      // setUploading(false);
    }
  };

  const deletePrompt = () => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this image?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteImage(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  }
  const deleteImage = () => {
    axios
    .delete(`${process.env.EXPO_PUBLIC_API_URL}/user/uploadimage`, { withCredentials: true }).then(()=>{
      setUser({...user,imageUrl:undefined} as any)
    })
      
      
      
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
          <View className="bg-white items-center h-fit rounded-xl p-6 mb-6 border border-slate-200">
            
            <View 
            
            className=" relative w-24 h-24 ">
              <TouchableOpacity 
              onPress={pickImage}
              className='  z-[1000000000] w-full h-full bg-black/30 rounded-full absolute'>
                <View className=' absolute top-4 right-2'>
                  <Edit size={22} color={"white"}/>
                </View>

                
              </TouchableOpacity>
              {imageUri||user?.imageUrl  ? (
                <Image className='w-full h-full rounded-full' src={imageUri || user?.imageUrl}>

                </Image>
              ):(
                <View className="w-full h-full bg-blue rounded-full  items-center justify-center mb-4">
                  <Text className="text-white text-4xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Text>
                </View>

              )}
              
            </View>
            {imageUri ?(
              <TouchableOpacity 
              onPress={uploadImage}
              className="bg-blue p-3 w-fit px-6 w-fit flex-row gap-2 items-center  mt-4 rounded-xl text-center">
                <SaveIcon size={16} color={"white"}></SaveIcon>
                <Text className='text-white'>
                Save Photo
                </Text>
              </TouchableOpacity>

            ):(
              <TouchableOpacity 
              onPress={deletePrompt}
              className="bg-slate-100 p-3 w-fit px-6 w-fit flex-row gap-2 items-center  mt-4 rounded-xl text-center">
                <Trash2Icon size={16} style={{ color: 'red' } as any}></Trash2Icon>
                <Text style={{ color: 'red' }}>
                Delete Photo
                </Text>
              </TouchableOpacity>
            )}
            
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
