import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import clsx from 'clsx';
import axios from 'axios';
import { ExplainerType } from '@/utils/constant';
import { IExplainer } from '@/interfaces';
import SpecialButton from '../common/SpecialButton';

interface ShareExplainerProps {
  visible: boolean;
  explainer:IExplainer;
  explainerType:ExplainerType;
  onClose: () => void;
}

export default function ShareExplainer({ explainer,visible, onClose }: ShareExplainerProps) {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/reels/${explainer.id}`;
  
  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      style={{
        zIndex:100000
      }}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center">
        <View className=" bg-white absolute drop-shadow-lg bottom-0  gap-1 rounded-2xl p-5">
          <TouchableOpacity className="self-end absolute top-2 right-2" onPress={onClose}>
            <X color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold">Share Explainer:</Text>
          <Text className='text-md text-slate-400'>{explainer.title}</Text>
          <View className='p-2 mt-4 rounded-xl bg-slate-100 border border-slate-200'>
            <Text numberOfLines={1} className='text-slate-400'>{url}</Text>
          </View>
            <SpecialButton
                className="w-full bg-blue mt-4 py-3 mb-6"
                onPress={() => {
                const url = `${process.env.EXPO_PUBLIC_API_URL}/reels/${explainer.id}`;
                navigator.clipboard.writeText(url).then(() => {
                    alert('Link copied to clipboard!');
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
                }}
            >
                <Text className="text-white font-semibold">Copy Link</Text>
            </SpecialButton>
        </View>
      </View>
    </Modal>
  );
}

