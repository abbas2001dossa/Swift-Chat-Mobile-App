import { Pressable,View, Text ,ScrollView} from 'react-native'
import React, { useState,useEffect } from 'react'
import { useSelector } from 'react-redux';
import { SelectUserId } from '../Redux/UserSlice';
import { useNavigation } from '@react-navigation/native';
import UserChat from '../Components/UserChat';

const ChatScreen = () => {

  const [acceptedFriends,setAcceptedFriends]=useState([]);
  const userId = useSelector(SelectUserId);
  const navigation = useNavigation();

  useEffect(()=>{
    const acceptedFriends = async ()=>{
      try{
        const response = await fetch(`http://192.168.100.9:8000/acceptedFriends/${userId}`);
        const data = await response.json();

        if (response.ok){
          setAcceptedFriends(data);
        }
      }
      catch(error){
        console.log("Error Shwoing Accepted Friends -  ",error);

      }
    }

    acceptedFriends();
  },[]);

  console.log(" Friends " , acceptedFriends);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{}}>
      <Pressable style={{}}>
        {acceptedFriends.map((item,index)=>(
            <UserChat key={index} item={item}></UserChat>
        ))}
      </Pressable>
    </ScrollView>
  )
}

export default ChatScreen;