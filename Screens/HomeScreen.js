import { View, Text } from 'react-native';
import React,{useEffect,useContext,useLayoutEffect,useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import {  useDispatch, useSelector } from 'react-redux';
import {setUserId} from '../Redux/UserSlice';
import axios from 'axios';
import User from '../Components/User';


const HomeScreen = () => {

  const navigation = useNavigation();
  const [users,setUsers]=useState([]);
  const dispatch = useDispatch();

  // use effect handling all the users 
  useEffect(() => {
    
    const fetchUsers = async ()=>{
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId; 
      console.log(" This is User ID :- " , userId);

      // set UserId in Redux - Since Context is giving issues 
      dispatch(setUserId(userId));

      axios.get(`http://192.168.100.9:8000/users/${userId}`)
      .then((response)=>{
        // console.log(" Users are beingset in the USER Array ");
        setUsers(response.data);
        console.log(users);
      })
      .catch((error)=>{
        console.log("Error retieiving the users ", error);
      });



    };

    fetchUsers();

  }, []);
  

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle:"",
      headerLeft:()=>(
        <Text style={{fontSize:16, fontWeight:"bold"}}> Swift Chat</Text>
      ),
      headerRight:()=>(
        
        <View style={{flexDirection:"row" , alignItems:"center" , gap:8}}>
          <Ionicons onPress={()=>navigation.navigate('Chats')} name="chatbox-ellipses-outline" size={24}  color={"black"}></Ionicons>
          <MaterialIcons onPress={()=>navigation.navigate('Friends')} name='people-outline' size={24} color={"black"}></MaterialIcons>
        </View>
      )
    })
  }, []); 

  return (
    <View>
      <View style={{padding:10 , }}>
        {users.map((item,index)=>(
          <User key={index} item={item}></User>
        ))}
      </View>
      
    </View>
  )
}

export default HomeScreen