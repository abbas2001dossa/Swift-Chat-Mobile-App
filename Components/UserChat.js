import {Image,  View, Text ,Pressable} from 'react-native'
import React,{useState,useEffect} from 'react'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux';
import { SelectUserId } from '../Redux/UserSlice';


const UserChat = ({item}) => {
    
    const navigation = useNavigation();
    const [Messages,setMessages]=useState([]);
    const userId = useSelector(SelectUserId);

    const getLastMessag=()=>{
        const userMessages = Messages.filter((message)=> message.messageType === "text");
        const n = userMessages.length;
        return userMessages[n-1];
    };  

    const LastMesssage = getLastMessag();

    const fetchMessages= async ()=>{
        try{
            const response = await fetch(`http://192.168.100.9:8000/Messages/${userId}/${item._id}`);
            const data = await response.json();
            if (response.ok){
                setMessages(data);
            }else{

            }  
        }
        catch(error){
            console.log(error);
        }
    }

    // use effec tto fetch message
    useEffect(()=>{
        fetchMessages();
    },[]);

    const formatTime = (time) => {
        const date = new Date(time);
        const hour = date.getHours().toString().padStart(2, '0'); // Ensure 2-digit hour
        const minute = date.getMinutes().toString().padStart(2, '0'); // Ensure 2-digit minute
        return `${hour}:${minute}`;
    }


    return (
    <Pressable onPress={()=>navigation.navigate("Messages",{receipntId:item._id})} style={{borderTopWidth:0,borderLeftWidth:0,padding:10,borderRightWidth:0,flexDirection:"row",alignItems:"center" , gap:10 , borderWidth:0.9 , borderColor:"#D0D0D0"}}>
        <Image source={{uri:"https://t4.ftcdn.net/jpg/03/32/59/65/240_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"}} style={{ width:50, height:50, borderRadius:25, resizeMode:"cover" }}></Image>  
        <View style={{flex:1}}>
            <Text style={{fontSize:15, fontWeight:"500" }}>{item?.name}</Text>
            {LastMesssage &&(
                <Text style={{marginTop:3  ,color:"gray",fontWeight:"500" }}> {LastMesssage?.message} </Text>
            )}
        </View>

        <View style={{}}>
            <Text style={{fontSize:11,fontWeight:"400", color:"#585858"}}> 
                {LastMesssage && formatTime(LastMesssage?.timeStamp)}
            </Text>
        </View>
    </Pressable>
  )
}

export default UserChat;