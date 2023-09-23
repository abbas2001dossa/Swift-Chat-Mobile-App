import {Image,Pressable,TextInput, ScrollView,KeyboardAvoidingView,View, Text } from 'react-native'
import React,{useEffect,useState,useLayoutEffect} from 'react'
import {Entypo} from '@expo/vector-icons';
import {Feather} from "@expo/vector-icons";
import EmojiSelector from 'react-native-emoji-selector';
import { useSelector } from 'react-redux';
import { SelectUserId } from '../Redux/UserSlice';
import { useNavigation, useRoute } from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from '@expo/vector-icons';
import {Asset} from 'expo-asset';
import {MaterialIcons} from '@expo/vector-icons';

const ChatMessageScreen = () => {

    const [Messages,setMessages]=useState([]);
    const [ShowEmoji,setShowEmoji]=useState(false);
    const [Message,setMessage]=useState("");
    const userId = useSelector(SelectUserId);
    const route = useRoute();
    const {receipntId}= route.params;
    const [SelectedeImage,setSelectedeImage]=useState("");
    const navigation=useNavigation();
    const [ReceipntData,setReceipntData]=useState();
    const [Receipntname,setReceipntname]=useState("");
    const [SelectedMessages,setSelectedMessages]=useState([]);

    const handleEmoji=()=>{
        setShowEmoji(!ShowEmoji);
    }
    const handleSend = async (messageType,imageUri)=>{
        try{
            const formData = new FormData();
            formData.append("senderId" , userId);
            formData.append("receipntId" , receipntId);
            
            if(messageType === "image"){
                formData.append("messageType", "image");
                formData.append("imageFile",{
                    uri:imageUri,
                    name:"image.jpg",
                    type:"image/jpeg"
                });
            }
            else{
                formData.append("messageType", "text");
                formData.append("messageText" , Message);
            }

            const response = await fetch("http://192.168.100.9:8000/Messages",{
                method:"POST",
                body:formData,

            });

            if (response.ok){
                setMessage("");
                setSelectedeImage("");

                fetchMessages();
            }

        }
        catch(error){
            console.log(error);

        }
    }


    const fetchMessages= async ()=>{
        try{
            const response = await fetch(`http://192.168.100.9:8000/Messages/${userId}/${receipntId}`);
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


    useEffect(() => {
        
        const fetchReceipntData =async ()=>{
            // receipnt id is ok 
            try{
                const response = await fetch(`http://192.168.100.9:8000/user/${receipntId}`);
                const data= await response.json();
                setReceipntData(data);
            }
            catch(error){
                console.log("Error reteiveing details ",error);
            }
        }

        fetchReceipntData();


    }, []);
    


    // to handle the header of the chat
    useEffect(() => {
      navigation.setOptions({
        headerTitle:"",
        headerLeft:()=>(
            <View style={{flexDirection:"row" , alignItems:"center" ,gap:10}}>
                <Ionicons style={{}} onPress={()=> navigation.goBack()}  name='arrow-back' size={24} color={"black"}></Ionicons>
                
                {SelectedMessages.length >0 ? (
                    <View>
                        <Text style={{  fontSize:16, fontWeight:"500"}}> {SelectedMessages.length}</Text>
                    </View>
                ):(
                    <View style={{flexDirection:"row" , alignItems:"center"}}>
                        <Image  source={{uri:"https://t4.ftcdn.net/jpg/03/32/59/65/240_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"}} style={{ width:50, height:50, borderRadius:25, resizeMode:"cover" }}></Image>  
                        <Text style={{marginLeft:5, fontSize:15, fontWeight:"bold"}}>{ReceipntData?.name}</Text>
                    </View>
                )}
                
                
                
            </View>
        ),
        headerRight:()=> SelectedMessages.length > 0 ? (
            <View style={{flexDirection:"row" , alignItems:"center" , gap:10}}>
                <Ionicons name='md-arrow-redo-sharp' size={24} color={"black"}></Ionicons>
                <Ionicons name='md-arrow-undo' size={24} color={"black"}></Ionicons>
                <FontAwesome name='star' size={24} color={"black"}></FontAwesome>
                <MaterialIcons onPress={()=> deleteMessages()} name='delete' size={24} color="black"></MaterialIcons>
            </View>
        ): null ,


      });
    }, [ReceipntData,SelectedMessages]);

    const deleteMessages= async ()=>{
        try{
            const response = await fetch("http://192.168.100.9:8000/deleteMessages",{
                method:"POST",
                headers:{
                    "Content-type":"application/json"
                },
                body:JSON.stringify({messages:SelectedMessages}),
            });

            if (response.ok){
                setSelectedMessages((prevMessages)=> prevMessages.filter((id)=> !SelectedMessages.includes(id)));
                fetchMessages();
            }else{
                console.log("Error Deleting Messages", response.status);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    const formatTime=(time)=>{
        const options={hour:"numeric" , minutes:"numeric"};
        return new Date(time).toLocaleString("en-US",options);
    }

    // funciton used when camera is opened 
    const openImage= async ()=>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        // console.log(result);
        if (!result.canceled){
            handleSend("image",result.uri);
        }
    }


    // console.log(ReceipntData);
    // console.log("Name ",ReceipntData._j?.name);
    console.log("Messages " , Messages);
    
    const handleLongPress=(message)=>{
        // check if the message is already selected 
        const isSelected = SelectedMessages.includes(message._id);
        if (isSelected){
            setSelectedMessages((previousMessages)=> previousMessages.filter((id)=> id !== message._id));
        }
        else{
            setSelectedMessages((previousMessages) => [
                ...previousMessages,
                message._id, // Add the message ID to the array
            ]);
        }
        console.log("selected Messages : " + SelectedMessages);

    }

  return (
    <KeyboardAvoidingView style={{flex:1,backgroundColor:"#F0F0F0"}}>
      <ScrollView>
        {/* All the chat messages go here  */}
        {Messages.map((item,index)=>{
            if (item.messageType === 'text'){
                const isSelected = SelectedMessages.includes(item._id);
                return (
                    <Pressable
                        onLongPress={()=>handleLongPress(item)}
                        key={index}
                        style={[
                            item?.senderId?._id === userId ? 
                            {alignSelf:"flex-end" ,margin:10, backgroundColor:"#DCF8C6",padding:8,maxWidth:"60%",borderRadius:7}:
                            {alignSelf:"flex-start" , backgroundColor:"white" , padding:8 , margin:10 , borderRadius:7 , maxWidth:"60%"}, 

                            isSelected && { width:"100%" ,backgroundColor:"#F0FFFF" }

                        ]}
                    >
                        <Text style={{fontSize:13, textAlign: isSelected ? "right" : "left" }}>{item?.message}</Text>
                        <Text style={{textAlign:"right",fontSize:9,color:"gray",marginTop:5,}}>{formatTime(item.timeStamp)}</Text>
                    </Pressable>
                )
            }

            if (item.messageType === 'image'){
                const baseUrl = "../Api/uploads/";
                const imageUrl = item.imageUrl;
                const filename = imageUrl.split('\\').pop();
                const stringWithoutWhitespace = filename.replace(/ /g, "");
                const concatString = baseUrl + stringWithoutWhitespace;
                console.log("THis is the concatenated string :-" + concatString +'-');

                const ur ="1694618328226-195-image.jpg";
                // Define an empty objecta
                const images = '../Api/uploads/1695454443387-67-image.jpg';
 
                const isSelected = SelectedMessages.includes(item._id);
                

                return (
                    <Pressable
                        onLongPress={()=>handleLongPress(item)}
                        key={index}
                        style={[
                            item?.senderId?._id === userId ? 
                            {alignSelf:"flex-end" ,margin:10, backgroundColor:"#DCF8C6",padding:8,maxWidth:"60%",borderRadius:7}:
                            {alignSelf:"flex-start" , backgroundColor:"white" , padding:8 , margin:10 , borderRadius:7 , maxWidth:"60%"} ,
                            isSelected && { width:"100%" ,backgroundColor:"#F0FFFF" }
                        ]}
                    >
                        <Image source={require(`${images}`)} style={{width:200,height:200,borderRadius:7}}></Image>    
                        <Text style={{textAlign:"right", fontSize:9 , color:"gray",position:"absolute",right:9,marginTop:5,bottom:7}}>{formatTime(item?.timeStamp)}</Text>
                    </Pressable>
                )

            }
        })}
      </ScrollView>

      <View style={{marginBottom: ShowEmoji ? 0 :15 ,flexDirection:"row", alignItems:"center", paddingHorizontal:10,paddingVertical:10,borderTopWidth:1, borderTopColor:"#dddddd"}}>
        
        <Entypo onPress={handleEmoji} style={{marginRight:5}} name="emoji-happy" size={24} color={"black"}></Entypo>
        
        <TextInput
            value={Message}
            onChangeText={(text)=>setMessage(text)}
            placeholder="Type Your Message ..."
            style={{flex:1 , height:40, borderWidth:1 , borderColor:"#dddddd" , borderRadius:20, paddingHorizontal:10}}
        >
        </TextInput>

        <View style={{flexDirection:"row", alignItems:"center",gap:7,marginHorizontal:8}}>
            <FontAwesome onPress={openImage} name="photo" size={24} color={"gray"}></FontAwesome>
            <Feather name="mic" size={24} color="black" ></Feather>
        </View>
        
        {/* send button  */}
        <Pressable onPress={()=> handleSend("text")} style={{backgroundColor:"#007bff" , paddingVertical:8, paddingHorizontal:12,borderRadius:20 }}>
            <Text style={{color:"white" , fontWeight:"bold"}}>Send</Text>
        </Pressable>

      </View>

      {ShowEmoji && (
        <EmojiSelector 
            style={{height:250}}
            onEmojiSelected={(emoji)=>{
                setMessage((message)=> message + emoji);
            }}
        ></EmojiSelector>
      )}

    </KeyboardAvoidingView>
  )
}

export default ChatMessageScreen;