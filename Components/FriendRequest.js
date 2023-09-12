import {Image, Pressable,View, Text } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import { SelectUserId } from '../Redux/UserSlice';
import { useNavigation } from '@react-navigation/native';


const FriendRequest = ({item,FriendRequests,setFriendRequests}) => {
  // console.log(FriendRequests);
  const userId = useSelector(SelectUserId);
  const navigation =useNavigation();

  const accept = async (friendRequestId)=>{
    // console.log("User Id " , userId);
    // console.log(" This is the ID : " ,  friendRequestId);
    try{
      
      const response = await fetch ("http://192.168.100.9:8000/friendRequest/accept" , {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          senderId:friendRequestId,
          receipntId:userId,
        })
      });

      if (response.ok){
        setFriendRequests(FriendRequests.filter((request)=> request._id !== friendRequestId));
        navigation.navigate('Chats');
      }

    }
    catch(error){
      console.log(error);
      console.log(" ERROR in accepting the friend Request.");
    }
  }

  return (
    <Pressable style={{flexDirection:"row" , alignItems:"center" , justifyContent:"space-between" , marginVertical:10}}>
        <Image source={{uri:"https://t4.ftcdn.net/jpg/03/32/59/65/240_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"}} style={{ width:50, height:50, borderRadius:25, resizeMode:"cover" }}></Image>  
        <View style={{flexDirection:"column"}}>
          <Text style={{fontSize:15 , fontWeight:"bold", marginLeft:10 , }}>{item?.name}</Text>
          <Text style={{fontSize:15 , fontWeight:"bold", marginLeft:10 , }}>Sent you a friend request ! </Text>
        </View>
        <Pressable onPress={()=>accept(item._id)}  style={{backgroundColor:"#0066b2",padding:10,borderRadius:6}}>
            <Text style={{textAlign:"center", color:"white"}}>Accept</Text>
        </Pressable>
    </Pressable>
  )
}

export default FriendRequest;