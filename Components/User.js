import {Image, View,Pressable, Text } from 'react-native'
import React, { useState } from 'react'
// import download from '../assets/icon.png';
import { useSelector } from 'react-redux';
import { SelectUserId } from '../Redux/UserSlice';

const User = ({item}) => {

  const userId = useSelector(SelectUserId);
  const [RequestSent,setRequestSent]=useState(false);

  const SendFriendRequest = async (currentUserId , selectedUserId)=>{
    
    try{
      const response = await fetch("http://192.168.100.9:8000/friendRequest" , {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({currentUserId, selectedUserId})
      });

      if(response.ok){
        setRequestSent(true);
      }
    }
    catch(error){
      console.log(error);
    }

  };

  return (
    <Pressable style={{flexDirection:"row", alignItems:"center" , marginVertical:10 }}>
      <View>
        <Image source={{uri:"https://t4.ftcdn.net/jpg/03/32/59/65/240_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"}} style={{ width:50, height:50, borderRadius:25, resizeMode:"cover" }}></Image>  
      </View>

      <View style={{marginLeft:12 ,flex:1}}>
        <Text style={{fontWeight:"bold"}}>{item.name}</Text>
        <Text style={{ marginTop:4, color:"gray"  }}>{item.email} </Text>
      </View>

      <Pressable onPress={()=>SendFriendRequest(userId, item._id)}    style={{backgroundColor:"#567189" , padding:10 , borderRadius:8 , width:105}}>
        <Text style={{textAlign:"center" , color:"white" , fontSize:13}}> Add Friend </Text>
      </Pressable>

    </Pressable>
    
  )
}

export default User