import { View, Text } from 'react-native'
import React,{useEffect, useState} from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { SelectUserId } from '../Redux/UserSlice';
import FriendRequest from '../Components/FriendRequest';

const FriendsScreen = () => {
    const userId = useSelector(SelectUserId);
    const [FriendRequests,setFriendRequests]=useState([]);
    
    useEffect(() => {
      fetchFriendRequests();
    }, []);
    
    const fetchFriendRequests =async ()=>{
      try{
        const response= await axios.get(`http://192.168.100.9:8000/friendRequest/${userId}`)
        .then((response)=>{
          if (response.status === 200 ){
            const friendRequestData = response.data.map((f)=>({
              _id : f._id,
              name: f.name ,
              email: f.email,

            }));

            setFriendRequests(friendRequestData);
            // console.log(friendRequestData);
            console.log(FriendRequests);
          }
        })
        .catch((error)=>{
          console.log(error);
        });
      }
      catch(error){
        console.log(error);
      }
    }

  return (
    <View style={{padding:10, marginHorizontal:12}}>
      {FriendRequests.length > 0 && <Text> Your Friend Requests ! </Text>}

      {FriendRequests.map((item) => {
        return (
          <View key={item._id}>
            {/* <Text>Hello</Text> */}
            <FriendRequest 
              key={item._id} 
              item={item} 
              FriendRequests={FriendRequests} 
              setFriendRequests={setFriendRequests} 
            />
          </View>
        );
      })}






    </View>
  )
}

export default FriendsScreen;