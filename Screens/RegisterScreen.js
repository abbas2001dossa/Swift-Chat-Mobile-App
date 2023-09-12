import {Alert,TextInput, View, Text ,Pressable,KeyboardAvoidingView} from 'react-native'
import React,{useState} from 'react'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const RegisterScreen = () => {
  const navigation=useNavigation(); 
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('');
  const [Repassword,setRepassword]=useState('');

  const handleRegister=()=>{
    
    if(password === Repassword){

      const data = {
        name : name ,
        email : email , 
        password : password
      };

      axios.post('http://192.168.100.9:8000/register',data)
      .then ((response)=>{
        console.log(response);
        Alert.alert("Registration Successful", "You have been registered successfully");
        setEmail('');
        setName('');
        setPassword('');
        setRepassword('');
        navigation.navigate('Login');
      })
      .catch((error)=>{
        Alert.alert("Registration Failed" , "An error ocurred while registering ");
        console.log("Error in registration " , error);
      });

    }else{
      Alert.alert("Invalid Credentials" , " Passwords didnt match  ");
    }

  }
  return (
    <View style={{flex:1, backgroundColor:"white", padding:10, alignItems:"center"}}>
      
      <KeyboardAvoidingView>
        
        <View style={{ marginTop:100 , justifyContent:"center", alignItems:"center"}}>
          <Text style={{color:"#4A55A2",fontSize:17,fontWeight:"600"}}> Register</Text>
          <Text style={{fontSize:17,fontWeight:"600", marginTop:15}} > Regsiter To Your Account </Text>
        </View>

        <View style={{ marginTop:50 , }}>
          
          <View>
            <Text style={{fontWeight:"600" , fontSize:18 , color:"black" }}> Name </Text>
            <TextInput placeholder='  enter your name'  placeholderTextColor={"gray"} 
              style={{borderBottomColor:"gray" , borderBottomWidth:1 , fontSize: email ? 18 : 18 , marginVertical:10 , width:300}}
              value={name}
              onChangeText={(text)=> setName(text)}
              
            ></TextInput>         
          </View>
          <View>
            <Text style={{fontWeight:"600" , fontSize:18 , color:"black" }}> Email </Text>
            <TextInput placeholder='  enter your email'  placeholderTextColor={"gray"} 
              style={{borderBottomColor:"gray" , borderBottomWidth:1 , fontSize: email ? 18 : 18 , marginVertical:10 , width:300}}
              value={email}
              onChangeText={(text)=> setEmail(text)}
              
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

          <View>
            <Text style={{fontWeight:"600" , fontSize:18 , color:"black" }}> Confirm Password </Text>
            <TextInput placeholder='  enter your password again'  placeholderTextColor={"gray"} 
              style={{borderBottomColor:"gray" , borderBottomWidth:1 , fontSize: email ? 18 : 18 , marginVertical:10 , width:300}}
              value={Repassword}
              onChangeText={(text)=> setRepassword(text)}
              secureTextEntry={true}
            ></TextInput>         
          </View>

          <Pressable onPress={handleRegister} style={{width:200,borderRadius:6, backgroundColor:"#4A55A2" , padding:15, marginTop:50, marginLeft:"auto", marginRight:"auto"}}>
            <Text style={{color:"white", fontSize:16, fontWeight:"bold", textAlign:"center"}}> Register </Text>
          </Pressable>
          <Pressable onPress={()=> navigation.goBack()} style={{marginTop:15}}>
            <Text style={{textAlign:"center" , color:"gray", fontSize:16}}> Already have an Account ? Sign In </Text>
          </Pressable>
        </View>

      </KeyboardAvoidingView>
      
    </View>
  )
}

export default RegisterScreen