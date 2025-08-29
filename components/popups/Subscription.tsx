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

const PlanComponent: React.FC<{selected:string, plan: Plan; isAnnual:boolean, plan_key:string }> = ({ plan, isAnnual,selected,plan_key}) => (
    
  <View className={clsx("rounded-xl relative p-4 mb-3 border-2", plan_key == selected ? "border-blue bg-slate-100":"border-slate-200")}>
    {plan_key == selected && (
        <View className='absolute top-2 p-1 bg-blue rounded-full right-2'>
            <Check
            color={"white"}
            size={16}
            ></Check>
        </View>
    )}
    <View className='flex flex-row gap-2 items-center'>
        <Text className="text-lg font-semibold text-slate-900">{plan.name} Plan</Text>
        {isAnnual &&(
            <Text className='p-0.5 text-sm font-semibold rounded-full px-2 bg-blue text-white'>Save ${ (plan.price * 12) - plan.annualPrice }</Text>
        )}
    </View>
    <View className='flex flex-row items-end gap-2 mt-2'>
        <Text className="text-blue font-bold text-4xl">${!isAnnual ?plan.price:Math.round(plan.annualPrice/12)}</Text>
        {isAnnual ?(
            <View className='flex-row gap-2'>
                <Text className='text-slate-500'>/mo</Text>
                <Text className='text-slate-500'>{`($${plan.annualPrice})`}</Text>
            </View>
        ):(

            <Text className="text-slate-600 text-sm font-semibold">per month</Text>
        )}
    </View>
    <View className=' flex flex-col gap-2 mt-4'>
        {plan.features_eng.map((f)=>(
            <View className='flex flex-row items-center gap-2'>
                <Check size={16} color="green"></Check>
                <Text className='text-slate-500 text-sm flex-1'>{f}</Text>
            </View>
        ))}
    </View>
    
  </View>
);

const SubscriptionModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [isAnnual,setIsAnnual] = useState(false)
  const [chosenPlan,setChosenPlan] = useState('free')

  useEffect(() => {
    axios.get(`${process.env.EXPO_PUBLIC_API_URL}/user`, { withCredentials: true })
      .then(response => setUserPlan(response.data.plan))
      .catch(error => console.error('Error fetching user plan:', error));
  }, []);

  const upgrade = () => {
    const isOnboarding = false; // Assuming not onboarding by default

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

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 justify-end  bg-opacity-50">
        
        <View className="bg-white relative rounded-t-2xl  border-slate-200 rounded-xl p-6">
            <TouchableOpacity
            onPress={onClose}
            className="absolute top-2 right-2 rounded-full p-2 shadow"
            >
            <X/>
            </TouchableOpacity>
          <View className='flex items-center'>
            <Text className="text-xl font-bold text-slate-900 mb-4">Choose Your Plan</Text>
            <View className="flex-row items-center justify-between gap-4 mb-4">
                <Text className="text-lg  text-slate-900">Annual Plan</Text>
                <Switch
                value={isAnnual}
                onValueChange={(value) => setIsAnnual(value)}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                // thumbColor={isAnnual ? "#f5dd4b" : "#f4f3f4"}
                />
            </View>
          </View>
          <ScrollView>
            {Object.entries(plans).filter(([key]) => key !== "free" ).map(([key, plan]) => (
                <TouchableOpacity
                onPress={()=>{
                    setChosenPlan(key)
                }}
                >

                    <PlanComponent
                      isAnnual={isAnnual}
                      selected={chosenPlan}
                      plan_key={key}
                      plan={{ name: plan.name, annualPrice:plan.prices.yearly.price, price: plan.prices.monthly.price, stripeId: plan.stripeId, features_eng:plan.features_eng }}
                    />
                </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity disabled={chosenPlan =="free"} onPress={upgrade} className="mb-4 disabled:opacity-50 mt-4 flex flex-row justify-center items-center gap-4 bg-blue rounded-xl p-5">
            <Rocket size={20} color={"white"}></Rocket>
            <Text className=" text-white font-semibold">Upgrade</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={onClose} className="mt-4 bg-slate-200 rounded-lg p-3">
            <Text className="text-center text-slate-700">Close</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  );
};

export default SubscriptionModal;
