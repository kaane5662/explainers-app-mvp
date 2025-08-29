import ExplainerPagination from "@/components/explainers/ExplainerPagination";
import ProfileFollowers from "@/components/profile/ProfileFollowers";
import { Text,ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Followers(){
    return(
        <SafeAreaView>
            <ScrollView className="flex flex-col gap-4 p-4">

                <ProfileFollowers/>
                <View className="flex flex-col gap-0 mt-8">
                    <Text className="text-2xl font-semibold">Recent Explainers</Text>
                    <ExplainerPagination
                    pageResults={20}
                    name={''}
                    apiRoute={ "/explainers/following"}
                    // sortExplainer='all'
                    hideSearch
                    hideSortBy
                    hideCount
                    // hideSort
                    
                    />
                </View>
            </ScrollView>
            
        </SafeAreaView>
    )
}