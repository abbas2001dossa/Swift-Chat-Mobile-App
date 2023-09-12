import {Image,Pressable,TextInput, ScrollView,KeyboardAvoidingView,View, Text } from 'react-native'
import React,{useEffect,useState,useLayoutEffect} from 'react'
import {Entypo} from '@expo/vector-icons';
import {Feather} from "@expo/vector-icons";
import EmojiSelector from 'react-native-emoji-selector';
import { useSelector } from 'react-redux';
import { SelectUserId } from '../Redux/UserSlice';
import { useNavigation, useRoute } from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';

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
                <View style={{flexDirection:"row" , alignItems:"center"}}>
                    <Image  source={{uri:"https://t4.ftcdn.net/jpg/03/32/59/65/240_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"}} style={{ width:50, height:50, borderRadius:25, resizeMode:"cover" }}></Image>  
                    <Text style={{marginLeft:5, fontSize:15, fontWeight:"bold"}}>{ReceipntData?.name}</Text>
                </View>
                
            </View>
        ),


      });
    }, [ReceipntData]);

    const formatTime=(time)=>{
        const options={hour:"numeric" , minutes:"numeric"};
        return new Date(time).toLocaleString("en-US",options);
    }

    // console.log(ReceipntData);
    // console.log("Name ",ReceipntData._j?.name);
    console.log("Messages " , Messages);
    
  return (
    <KeyboardAvoidingView style={{flex:1,backgroundColor:"#F0F0F0"}}>
      <ScrollView>
        {/* All the chat messages go here  */}
        {Messages.map((item,index)=>{
            if (item.messageType === 'text'){
                return (
                    <Pressable
                        key={index}
                        style={[
                            item?.senderId?._id === userId ? 
                            {alignSelf:"flex-end" ,margin:10, backgroundColor:"#DCF8C6",padding:8,maxWidth:"60%",borderRadius:7}:
                            {alignSelf:"flex-start" , backgroundColor:"white" , padding:8 , margin:10 , borderRadius:7 , maxWidth:"60%"} 
                        ]}
                    >
                        <Text style={{fontSize:13, textAlign:"left" }}>{item?.message}</Text>
                        <Text style={{textAlign:"right",fontSize:9,color:"gray",marginTop:5,}}>{formatTime(item.timeStamp)}</Text>
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
            <Entypo name="camera" size={24} color={"gray"}></Entypo>
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