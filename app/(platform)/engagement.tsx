import EngagementPagination from "@/components/engagement/EngagementPagination";
import ExplainerPagination from "@/components/explainers/ExplainerPagination";
import ProfileFollowers from "@/components/profile/ProfileFollowers";
import { Text,ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Engagement(){
    return(
        <SafeAreaView>
            <ScrollView className="flex flex-col gap-4 p-4">
                <Text className="font-bold text-3xl">Engagement</Text>
                {/* <ProfileFollowers/> */}
                <View className="flex flex-col gap-0 mt-8">
                    <Text className="text-md mb-3 font-semibold">Followers</Text>
                    <View className=" max-h-[200px]">

                        <EngagementPagination
                        engagementType="followers"
                        // hideSort
                        
                        />
                    </View>
                </View>
                <View className="flex flex-col gap-0 mt-8">
                    <Text className="text-md mb-3 font-semibold">Likes</Text>
                    <View className=" max-h-[300px]">

                        <EngagementPagination
                        engagementType="likes"
                        // hideSort
                        
                        />
                    </View>
                </View>
                <View className="flex flex-col gap-0 mt-8">
                    <Text className="text-md mb-3 font-semibold">Comments</Text>
                    <View className=" max-h-[800px]">

                        <EngagementPagination
                        engagementType="comments"
                        // hideSort
                        
                        />
                    </View>
                </View>
                
            </ScrollView>
            
        </SafeAreaView>
    )
}