import SubscriptionModal from '@/components/popups/Subscription';
import { IUser } from '@/interfaces';
import { plans } from '@/utils/constant';
import axios from 'axios';
import clsx from 'clsx';
import { router } from 'expo-router';
import { ArrowLeft, Crown, Check, X, CreditCard, Calendar, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubscriptionScreen() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionPopup,setSubscriptionPopup] = useState(false)

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

  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade Plan',
      'This will redirect you to our payment page. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => {
          // Handle upgrade logic here
          Alert.alert('Info', 'Payment integration coming soon!');
        }},
      ]
    );
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        { text: 'Cancel Subscription', style: 'destructive', onPress: () => {
          Alert.alert('Info', 'Subscription cancellation coming soon!');
        }},
      ]
    );
  };

  const getPlanDetails = (plan: string) => {
    switch (plan) {
      case 'pro':
        return {
          name: 'Pro Plan',
          price: '$9.99/month',
          features: [
            'Unlimited explainer videos',
            'Advanced AI features',
            'Priority support',
            'Custom branding',
            'Analytics dashboard'
          ],
          color: 'bg-purple-500',
          icon: Crown
        };
      case 'premium':
        return {
          name: 'Premium Plan',
          price: '$19.99/month',
          features: [
            'Everything in Pro',
            'Team collaboration',
            'API access',
            'White-label solutions',
            'Dedicated account manager'
          ],
          color: 'bg-yellow-500',
          icon: Crown
        };
      default:
        return {
          name: 'Free Plan',
          price: 'Free',
          features: [
            '5 explainer videos per month',
            'Basic AI features',
            'Community support',
            'Standard templates'
          ],
          color: 'bg-slate-500',
          icon: Crown
        };
    }
  };

  const planDetails = getPlanDetails(user?.plan || 'free');

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-slate-600">Loading subscription...</Text>
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
            <Text className="text-xl font-bold text-slate-900">Subscription</Text>
            <View className="w-20" />
          </View>
        </View>
        {subscriptionPopup && (
          <SubscriptionModal onClose={()=>setSubscriptionPopup(false)} visible={subscriptionPopup}/>
        )}

        {/* Current Plan Status */}
        <View className="px-6 py-6">
          <View className="bg-white rounded-xl p-6 mb-6 border border-slate-200">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-2xl font-bold text-slate-900">Current Plan</Text>
              <View className={clsx('px-3 py-1 rounded-full', planDetails.color)}>
                <Text className="text-white text-sm font-semibold">{plans[user?.plan as keyof typeof plans].name}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center gap-4  mb-4">
              <View className="w-12 h-12 bg-slate-100 rounded-lg items-center justify-center">
                <planDetails.icon size={24} color="#475569" />
              </View>
              <View className="flex-1">
                <Text className="text-3xl font-bold text-slate-900">{planDetails.price}</Text>
                <Text className="text-slate-600">
                  {user?.annualPlan ? 'Billed annually' : 'Billed monthly'}
                </Text>
              </View>
            </View>

            {/* {user?.plan !== 'free' && (
              <View className="bg-slate-50 rounded-lg p-4 mb-4">
                <View className="flex-row items-center gap-3">
                  <Calendar size={16} color="#475569" />
                  <Text className="text-slate-700">
                    Next billing date: {user?.lastLogin ? 
                      new Date(new Date(user.lastLogin).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() : 
                      'N/A'
                    }
                  </Text>
                </View>
              </View>
            )} */}

            {/* Plan Features */}
            <View className="space-y-2">
              <Text className="text-sm font-medium text-slate-700 mb-2">Plan Features:</Text>
              {plans[user?.plan as keyof typeof plans] && plans[user?.plan as keyof typeof plans].features_eng.map((feature, index) => (
                <View key={index} className="flex-row items-center gap-3">
                  <Check size={16} color="#10b981" />
                  <Text className="text-slate-600 flex-1">{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Usage Stats */}
          <View className="bg-white rounded-xl p-6 mb-6 border border-slate-200">
            <Text className="text-lg font-semibold text-slate-900 mb-4">Usage Statistics</Text>
            <View className="space-y-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Users size={20} color="#475569" />
                  <Text className="text-slate-700">Followers</Text>
                </View>
                <Text className="text-lg font-semibold text-slate-900">{user?.follower_count || 0}</Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <CreditCard size={20} color="#475569" />
                  <Text className="text-slate-700">Credits Remaining</Text>
                </View>
                <Text className="text-lg font-semibold text-slate-900">{user?.credits || 0}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-4">
            {user?.plan === 'free' ? (
              <TouchableOpacity
                onPress={()=>setSubscriptionPopup(true)}
                className="bg-blue rounded-xl p-4 items-center"
              >
                <Text className="text-white text-lg font-semibold">Upgrade to Pro</Text>
                <Text className="text-slate-100 text-sm mt-1">Get unlimited access to all features</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  onPress={()=>setSubscriptionPopup(true)}
                  className="bg-blue rounded-xl p-4 items-center"
                >
                  <Text className="text-white text-lg font-semibold">Change Plan</Text>
                  <Text className=" text-sm text-slate-100 mt-1">Upgrade or downgrade your subscription</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleCancelSubscription}
                  className="bg-red-50 rounded-xl p-4 items-center border border-red-200"
                >
                  <Text className="text-red-700 text-lg font-semibold">Cancel Subscription</Text>
                  <Text className="text-red-600 text-sm mt-1">Cancel at any time</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Additional Info */}
          <View className="mt-6 bg-white rounded-xl p-4 border border-slate-200">
            <Text className="text-sm text-slate-600 text-center">
              Need help? Contact our support team for assistance with your subscription.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
