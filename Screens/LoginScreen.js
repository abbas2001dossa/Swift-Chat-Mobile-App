import {Alert,Pressable,TextInput,KeyboardAvoidingView, View, Text } from 'react-native'
import React,{useEffect , useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = () => {
  const [email,setEmail]=useState('');
  const [password , setPassword] = useState('');
  const navigation = useNavigation();
  
  // useEffect(() => {
  //   const checkLoginStatus = async ()=>{
  //     try {
  //       const token = await AsyncStorage.getItem("authToken");
  //       console.log(token);
  //       if (token){
  //         navigation.navigate('Home');
  //       }else{
  //         // else it would render login page only 
  //       }
  //     }
  //     catch(error){
  //       console.log("error", error);
  //     }
  //   }

  //   checkLoginStatus();
  // }, []);
  



  const Login=()=>{
    console.log(email + "    " + password);
    const data ={
      email: email ,
      password : password,
    };
    console.log(data);
    if (!password) {
      Alert.alert("Login Failed", "Please enter a password"); // Add a check for password existence
      return;
    }

    axios.post('http://192.168.100.9:8000/login',data)
    .then((response)=>{
      // console.log("This is Response from server side ",response);
      
      //  we will store this data inside the async storage with the help of a key 
      const token = response.data.token ; 
      AsyncStorage.setItem("authToken",token);

      console.log(response.data.message);
      Alert.alert("Login Successful", "You have been logged in successfully");
      navigation.navigate('Home');  
    })
    .catch((error)=>{
      Alert.alert("Login Failed" , "Invalid Credentials ");
      console.log("Error in login " , error);

    });


  }

  const handleEmailChange = (text) => {
    // Remove leading and trailing spaces using trim()
    const cleanedEmail = text.trim();
    setEmail(cleanedEmail);
  };

  return (
    <View style={{flex:1, backgroundColor:"white", padding:10, alignItems:"center"}}>
      <KeyboardAvoidingView>
        
        <View style={{ marginTop:100 , justifyContent:"center", alignItems:"center"}}>
          <Text style={{color:"#4A55A2",fontSize:17,fontWeight:"600"}}> Sign In</Text>
          <Text style={{fontSize:17,fontWeight:"600", marginTop:15}} > Sign In To Your Account </Text>
        </View>

        <View style={{ marginTop:50 , }}>
          <View>
            <Text style={{fontWeight:"600" , fontSize:18 , color:"black" }}> Email </Text>
            <TextInput placeholder='  enter your email'  placeholderTextColor={"gray"} 
              style={{borderBottomColor:"gray" , borderBottomWidth:1 , fontSize: email ? 18 : 18 , marginVertical:10 , width:300}}
              value={email}
              onChangeText={(text)=> handleEmailChange(text)}
              
            ></TextInput>         
          </View>
          
          <View style={{marginTop:15}}>
            <Text style={{fontWeight:"600" , fontSize:18 , color:"black" }}> Password </Text>
            <TextInput placeholder='  password'  placeholderTextColor={"gray"} 
              style={{borderBottomColor:"gray" , borderBottomWidth:1 , fontSize: password ? 18 : 18 , marginVertical:10 , width:300}}
              value={password}
              onChangeText={(text)=> setPassword(text)}
              secureTextEntry={true}
            ></TextInput>         
          </View>

          <Pressable onPress={Login} style={{width:200,borderRadius:6, backgroundColor:"#4A55A2" , padding:15, marginTop:50, marginLeft:"auto", marginRight:"auto"}}>
            <Text style={{color:"white", fontSize:16, fontWeight:"bold", textAlign:"center"}}> Login </Text>
          </Pressable>
          <Pressable onPress={()=> navigation.navigate('Register')} style={{marginTop:15}}>
            <Text style={{textAlign:"center" , color:"gray", fontSize:16}}> Dont have an Account ? Sign Up </Text>
          </Pressable>
        </View>

      </KeyboardAvoidingView>
      
    </View>
  )
}

export default LoginScreen