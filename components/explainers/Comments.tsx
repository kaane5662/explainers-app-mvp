import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, FlatList } from 'react-native';
import clsx from 'clsx';
import axios from 'axios';
import { IExplainer, IExplainerPodcast, IUser } from '@/interfaces';
import { Image } from 'expo-image';

interface Comment {
  id: string;
  user: IUser;
  text: string;
}

const CommentsPopup = ({ visible, onClose,explainer }: { visible: boolean; onClose: () => void,explainer:IExplainer }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { id: Date.now().toString(), user: 'User', text: newComment }]);
      setNewComment('');
    }
  };

  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/podcasts/${explainer.id}/comments`);
        console.log(response.data)
        setComments(response.data.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, []);
  

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className={clsx('flex-1 justify-end bg-black bg-opacity-50')}>
        <View className={clsx('bg-white p-4  rounded-t-2xl')}>
          <Text className={clsx('text-lg font-bold mb-2')}>Comments {comments.length}</Text>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className={clsx('mb-2')}>
                <View className='flex flex-row gap-2 items-center'>
                    <Image className=' rounded-full h-4 w-4' source={item.user?.imageUrl || ''}></Image>
                    <Text className={clsx('font-semibold')}>{item.user.name}</Text>
                </View>
                <Text>{item.text}</Text>
              </View>
            )}
          />
          <View className={clsx('flex-row items-center mt-4')}>
            <TextInput
              className={clsx('flex-1 border border-gray-300 rounded p-2')}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity onPress={handleAddComment} className={clsx('ml-2')}>
              <Text className={clsx('text-blue-500')}>Post</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onClose} className={clsx('mt-4')}>
            <Text className={clsx('text-red-500')}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CommentsPopup;
