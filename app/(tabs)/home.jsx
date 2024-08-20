import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import VideoCard from '../../components/VideoCard'

import {getAllPosts, getLatestPosts} from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();

  const {data: posts, refetch} = useAppwrite(getAllPosts);
  const {data: latestposts} = useAppwrite(getLatestPosts);

  console.log("Posts", posts)
  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = async()=>{
    setRefreshing(true)
    await refetch();
    // re call videos -> if any new video
    setRefreshing(false)
  }

  console.log(posts)
  console.log(posts.item)
  return (
    <SafeAreaView className="bg-primary h-full ">
      
    <FlatList
      data={posts}
      keyExtractor={(item)=>item.$id}
      renderItem={({item})=>(
          <VideoCard 
          title={item.title}
          thumbnail={item.thumbnail}
          video={item.video}
          username={item.creator.username}
          avatar={item.creator.avatar}
          />
      )}
      ListHeaderComponent={()=>(
        <View className="my-6 px-4 space-y-6">
          <View className="justify-between items-start flex-row mb-6">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">Welcome Back</Text>
              <Text className="text-2xl font-psemibold text-white">{user?.user}</Text>
            </View>

            <View>
              <Image source={images.logoSmall}
              className="w-9 h-10"
              resizeMode='contain'/>
            </View>
          </View>
          <SearchInput/>

          <View className="w-full flex-1 pt-5 pb-8">
            <Text className="text-gray-100 text-lg font-pregular mb-3">Latest Videos</Text>
            <Trending posts={latestposts ?? []}></Trending>

          </View>
        </View>


      )}
      ListEmptyComponent={()=>(
        <EmptyState
        title="No Videos Found"  
        subtitle="Be the first one to upload a video"/>
      )}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
      }
      />
      
      
    </SafeAreaView>
  )
}

export default Home