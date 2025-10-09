import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import axios from 'axios';
import { plans } from '@/utils/constant';
import { Check, Rocket, X } from 'lucide-react-native';
import clsx from 'clsx';
import tailwindConfig from '@/tailwind.config';
import * as WebBrowser from "expo-web-browser";

interface Plan {
  name: string;
  price: number;
  annualPrice:number;
  stripeId: string;
  features_eng:string[];
}

const PlanComponent: React.FC<{plan: Plan; isAnnual:boolean }> = ({ plan, isAnnual}) => (
  <View className="rounded-xl relative p-6 mb-4 border border-slate-200 bg-white ">
    <View className='flex flex-row gap-3 items-center mb-3'>
        <Text className="text-2xl font-bold text-slate-900">{plan.name}</Text>
        {isAnnual &&(
            <View className='px-3 py-1 bg-green-100 rounded-full'>
                <Text className='text-xs font-semibold text-green-700'>Save ${ (plan.price * 12) - plan.annualPrice }</Text>
            </View>
        )}
    </View>
    <View className='flex flex-row items-baseline gap-1 mb-6'>
        <Text className="text-blue font-bold text-5xl">${!isAnnual ?plan.price:Math.round(plan.annualPrice/12)}</Text>
        <Text className="text-slate-500 text-lg">/month</Text>
        {isAnnual && (
            <Text className='text-slate-400 text-sm ml-2'>billed annually (${plan.annualPrice})</Text>
        )}
    </View>
    <View className='flex flex-col gap-3'>
        {plan.features_eng.map((feature, index) => (
            <View key={index} className='flex flex-row items-start gap-3'>
                <View className='mt-0.5'>
                    <Check size={18} color="#10b981" />
                </View>
                <Text className='text-slate-600 text-base flex-1 leading-6'>{feature}</Text>
            </View>
        ))}
    </View>
  </View>
);

const SubscriptionModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [isAnnual,setIsAnnual] = useState(false)
  const [chosenPlan,setChosenPlan] = useState('basic')

  useEffect(() => {
    axios.get(`${process.env.EXPO_PUBLIC_API_URL}/user`, { withCredentials: true })
      .then(response => setUserPlan(response.data.plan))
      .catch(error => console.error('Error fetching user plan:', error));
  }, []);

  const upgrade = () => {
    const isOnboarding = false;

    axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/subscription`,
      { annualPlan:isAnnual, plan: chosenPlan, isOnboarding },
      { withCredentials: true }
    )
    .then(async(res) => {
      console.log("data",res.data)
      await WebBrowser.openBrowserAsync(res.data.sessionUrl)
    })
    .catch(error => console.error('Error upgrading plan:', error));
  };

  const availablePlans = Object.entries(plans).filter(([key]) => key !== "free");

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 justify-end bg-black bg-opacity-50">
        <View className="bg-white relative rounded-t-3xl max-h-[90%]">
            <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 rounded-full p-2 bg-slate-100 z-10"
            >
            <X size={20} color="#64748b"/>
            </TouchableOpacity>
          
          <View className='px-6 pt-8 pb-4'>
            <Text className="text-3xl font-bold text-slate-900 mb-2 text-center">Choose Your Plan</Text>
            <Text className="text-slate-600 text-center mb-6">Unlock premium features and take your experience to the next level</Text>
            
            <View className="flex-row items-center justify-center gap-4 mb-6">
                <Text className={clsx("text-lg font-medium", !isAnnual ? "text-slate-900" : "text-slate-500")}>Monthly</Text>
                <Switch
                value={isAnnual}
                onValueChange={(value) => setIsAnnual(value)}
                trackColor={{ false: "#e2e8f0", true: "#3b82f6" }}
                thumbColor={isAnnual ? "#ffffff" : "#ffffff"}
                />
                <Text className={clsx("text-lg font-medium", isAnnual ? "text-slate-900" : "text-slate-500")}>Annual</Text>
            </View>

            {availablePlans.length > 1 && (
              <View className="flex-row bg-slate-100 rounded-xl p-1 mb-6">
                {availablePlans.map(([key, plan]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setChosenPlan(key)}
                    className={clsx(
                      "flex-1 py-3 px-4 rounded-lg",
                      chosenPlan === key ? "bg-white " : ""
                    )}
                  >
                    <Text className={clsx(
                      "text-center font-semibold",
                      chosenPlan === key ? "text-slate-900" : "text-slate-600"
                    )}>
                      {plan.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View className='px-2'>

            {availablePlans
              .filter(([key]) => key === chosenPlan)
              .map(([key, plan]) => (
                <PlanComponent
                  key={key}
                  isAnnual={isAnnual}
                  plan={{ 
                    name: plan.name, 
                    annualPrice: plan.prices.yearly.price, 
                    price: plan.prices.monthly.price, 
                    stripeId: plan.stripeId, 
                    features_eng: plan.features_eng 
                  }}
                />
              ))}
          </View>
          
          
          <View className="px-6 pb-6 pt-4">
            <TouchableOpacity 
              onPress={upgrade} 
              disabled={chosenPlan==userPlan}
              className="flex flex-row justify-center items-center gap-3 disabled:bg-gray-300 bg-blue rounded-2xl p-5 "
            >
              <Rocket size={22} color={"white"}/>
              {userPlan == chosenPlan ? (
                <Text className="text-white font-bold text-lg">Subscribed</Text>
              ) : userPlan == "free" ? (
                <Text className="text-white font-bold text-lg">Get Started</Text>
              ) : (
                <Text className="text-white font-bold text-lg">Upgrade</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SubscriptionModal;
