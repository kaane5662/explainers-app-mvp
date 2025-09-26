import { ExplainerType } from "@/utils/constant";
import axios from "axios";
import { Loader, X } from "lucide-react-native";

import { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View,ScrollView, ActivityIndicator } from "react-native";
// import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";
import { WebView } from 'react-native-webview';


type StudyFetchComponentType = "practice-quiz" | "flashcards";

export default function StudyFetchEmbed({
  id,
  explainerType,
  componentType,
  loadingHeader,
  loadingDescription,
  title,
  onClose
}: {
  id: string;
  explainerType: ExplainerType;
  componentType: StudyFetchComponentType;
  loadingHeader:string;
  loadingDescription:string;
  title:string;
  onClose:CallableFunction
}) {
//   const tran = useTranslations();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [embedUrl, setEmbedUrl] = useState();
  const fetchFlashcardsEmbeddingUrl = () => {
    setLoading(true);
    axios
      .post(
        `${process.env.EXPO_PUBLIC_API_URL}/explainers/${id}/${componentType}`,
        { explainerType: explainerType },
        { withCredentials: true }
      )
      .then((res) => {
        setEmbedUrl(res.data.embedUrl);
      })
      .catch((err) => {
        setError(err.response.data.error);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchFlashcardsEmbeddingUrl();
  }, [componentType, id]);

//   if (loading)
//     return (
//       <div className="flex flex-col items-center justify-center gap-4">
//         <Loader className="animate-spin text-blue" size={48} />
//         <div className="flex flex-col items-center gap-2">
//           <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
//             {loadingHeader}
//           </h3>
//           <p className="text-slate-500 dark:text-slate-400 text-center">
//             {loadingDescription}
//           </p>
//         </div>
//       </div>
//     );

//   if (error || !embedUrl) return <p className="text-sm text-red2">{error}</p>;

  return (
    <Modal
      visible={true}
      style={{height:"100%"}}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => onClose()}
    >
      <View className="flex-1 bg-white">
        <View className="flex flex-row items-center border-b border-slate-200 justify-between p-4">
          <Text className="text-xl font-semibold">{title}</Text>
          <TouchableOpacity onPress={() => onClose()}>
            <X size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View className="flex-1">
          {loading ? (
            <View className="flex-1 items-center justify-center gap-4">
              <ActivityIndicator></ActivityIndicator>
              <Text className="text-lg font-medium text-slate-700">
                {loadingHeader}
              </Text>
              <Text className="text-slate-500 text-center px-4">
                {loadingDescription}
              </Text>
            </View>
          ) : error || !embedUrl ? (
            <View className="flex-1 items-center justify-center p-4">
              <Text className="text-red-500 text-center">{error}</Text>
            </View>
          ) : (
            <ScrollView>

                <View className="flex h-[700px] w-full">
                {/* Embed content would go here */}
                

                    <WebView source={{uri:embedUrl}}>

                    </WebView>
                
                {/* <Text>{embedUrl}</Text> */}
                
                </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
