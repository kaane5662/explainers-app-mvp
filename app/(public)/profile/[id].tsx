import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, SafeAreaView, ActivityIndicator, TouchableOpacity,  ScrollView} from 'react-native';
import axios from 'axios';
import { IUser } from '@/interfaces';
import { MapPin } from 'lucide-react-native';
import ExplainerPagination from '@/components/explainers/ExplainerPagination';
import clsx from 'clsx';



export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<IUser | null>(null);
  const [followed,setFollowed] = useState(false)
  const availableOptions: {
    id: string;
    label: string;
    ownerOnly?: boolean;
  }[] = [ 
    {
      id: "explainers",
      label: "Explainers",
    },
    {
      id: "pending_explainers",
      label: "Pending",
      ownerOnly:true
    },
    {
      id: "likes",
      label: "Likes",
    },
    
  ];
  const [currentOption, setOption] = useState("explainers");

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/profile/${id}`);
      console.log(response.data.profile)
      setProfile(response.data.profile);
      setFollowed(response.data.profile.followed)

    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };
  const followUser = async () => {
    // setLoading(true);
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/profile/${id}/follow`);
      setFollowed(!followed)

    } catch (error) {
      console.error('Error fetching user profile:', error.response.data.error);
    } 
  };

  useEffect(() => {
    if (id) {
      fetchUserProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView>
        <Text>User profile not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView>

        <View className="p-8">
          <View className="flex flex-col items-center">
            {profile.imageUrl ? (
              <Image
                className="w-32 h-32 rounded-full"
                source={{ uri: profile.imageUrl }}
                style={{ width: 128, height: 128 }}
              />
            ) : (
              <View className="w-32 h-32 bg-gray-200 rounded-full" />
            )}
            <Text className="text-2xl font-semibold mt-4">{profile.name}</Text>
            <Text className="flex gap-2 text-slate-500 dark:text-slate-400 flex-row items-center items-center">
              <MapPin size={18} />
              {profile.group || "New York"}, {profile.country || "US"}{" "}
            </Text>
            <View className='mt-6 gap-2 flex justify-center items-center flex-col'>
              <Text>{profile.follower_count} Followers</Text>
              <TouchableOpacity className={clsx("p-3 px-8 rounded-full", followed ? "bg-slate-300":"bg-blue")}onPress={()=>followUser()}>
                <Text className={clsx(followed ? "text-black":"text-white")}>{followed ? "Followed":"Follow"}</Text>
              </TouchableOpacity>
            </View>
            <View className="flex gap-0 flex-col">
              

              <View
              className={clsx(
                  "flex w-full flex-row mt-4",
              )}
              >
              {availableOptions
                  .filter((option) => !option.ownerOnly || profile?.profileOwner)
                  .map((option, index) => (
                  <TouchableOpacity
                      key={index}
                      onPress={() => setOption(option.id)}
                      disabled={currentOption === option.id}
                      className={clsx(
                      "p-2 px-6",
                      "text-slate-500 dark:text-slate-400",
                      "flex justify-center",
                      currentOption === option.id &&   "border-b-2 border-blue text-blue",
                      )}
                  >
                      <Text>{option.label}</Text>
                  </TouchableOpacity>
                  ))}
              </View>
              

                {currentOption === "explainers" && (
                    <View>
                        <ExplainerPagination
                        name=""
                        pageResults={20}
                        hideSearch
                            hideCount
                            hideSortBy
                        extraParams={{}}
                        apiRoute={`/profile/${id}/explainers`}
                        />
                    </View>
                )}
                
                {currentOption == "pending_explainers" &&  (
                    <View>
                        <ExplainerPagination
                          name={""}
                          pageResults={20}
                          hideCount
                          hideSearch
                          apiRoute={`/profile/${id}/explainers?pendingOnly=true`}
                          hideSortBy={true}
                        />
                    </View>
                )}
                
                {currentOption == "likes" && (
                    <View>
                        <ExplainerPagination
                          name={""}
                          hideSortBy
                          hideSearch
                          hideCount
                        
                          extraParams={{}}
                          pageResults={20}
                          apiRoute={`/profile/${id}/likes/`}
                        />
                    </View>
                )}
              
            </View>
            
            
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
