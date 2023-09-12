import {Image,  View, Text ,Pressable} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const UserChat = ({item}) => {
    
    const navigation = useNavigation();


    return (
    <Pressable onPress={()=>navigation.navigate("Messages",{receipntId:item._id})} style={{borderTopWidth:0,borderLeftWidth:0,padding:10,borderRightWidth:0,flexDirection:"row",alignItems:"center" , gap:10 , borderWidth:0.9 , borderColor:"#D0D0D0"}}>
        <Image source={{uri:"https://t4.ftcdn.net/jpg/03/32/59/65/240_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"}} style={{ width:50, height:50, borderRadius:25, resizeMode:"cover" }}></Image>  
        <View style={{flex:1}}>
            <Text style={{fontSize:15, fontWeight:"500" }}>{item?.name}</Text>
            <Text style={{marginTop:3  ,color:"gray",fontWeight:"500" }}> Last Seen Message Comes Here </Text>
        </View>

        <View style={{}}>
            <Text style={{fontSize:11,fontWeight:"400", color:"#585858"}}> 3:00 pm </Text>
        </View>
    </Pressable>
  )
}

export default UserChat;