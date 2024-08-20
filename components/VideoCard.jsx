import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { ResizeMode, Video } from 'expo-av'
import Ionicons from '@expo/vector-icons/Ionicons';


// { title, creator, avatar, thumbnail, video }

const VideoCard = ({ title, username, avatar, thumbnail, video }) => {

const [play, setPlay]=useState(false)
const [bookmark, setBookmark]=useState(false)

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
          <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1} >
              {username}
            </Text>
          </View>
        </View>
        <View className="mr-4 w-5 h-5">
        <TouchableOpacity
          onPress={()=>setBookmark(true)}
          activeOpacity={0.7} >
          <Ionicons name="heart-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    {play?(
    <Video
    source={{ uri: video }}
    className="w-full h-60 rounded-xl mt-3"
    resizeMode={ResizeMode.CONTAIN}
    useNativeControls
    shouldPlay
    onPlaybackStatusUpdate={(status) => {
      if (status.didJustFinish) {
        setPlay(false);
      }
    }} /> ):
    (<TouchableOpacity
    onPress={()=>setPlay(true)}
    activeOpacity={0.7}
    className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
    >
     <Image source={{uri: thumbnail}}
      className="w-full h-full rounded-xl mt-3"
      resizeMode='cover'/>
      <Image source={icons.play}
      className=" w-12 h-12 absolute"
      resizeMode='contain'/>
    </TouchableOpacity>)}
    </View>
  )
}

export default VideoCard