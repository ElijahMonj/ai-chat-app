
import React, { useState } from 'react';
import { View, Text, ButtonThemed, } from '@/components/Themed';
import {useColorScheme} from '@/components/useColorScheme';
import { FIREBASE_AUTH,FIREBASE_DB,FIREBASE_AUTH_WEB } from '@/FirebaseConfig';
import { Button, Platform, TextInput,StyleSheet,Alert,Image, Pressable, Animated } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';


const AuthScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogin,setIsLogin] = useState(true);
    
    const auth = FIREBASE_AUTH;
    const theme = useColorScheme() ?? 'light';
    const inputTextColor= theme === 'light' ? '#000' : '#fff';
    
    const signIn = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            
        } catch (error) {
            const errorCode = (error as any).code as string;
            if(errorCode=="auth/invalid-email"){
                Alert.alert("Invalid Email","Please enter a valid email address");
            }
            else if(errorCode=="auth/user-not-found"){
                Alert.alert("User not found","There is no user record corresponding to this identifier. The user may have been deleted");
            }
            else if(errorCode=="auth/wrong-password"){
                Alert.alert("Wrong Password","The password is invalid or the user does not have a password");
            }
            else if(errorCode=="auth/too-many-requests"){
                Alert.alert("Too many requests","We have blocked all requests from this device due to unusual activity. Try again later");
            }
            
        }
        setLoading(false);
    }
    const signUp = async () => {
        setLoading(true);
        if(name.length<1){
            Alert.alert("Name Required","Please enter your name");
            setLoading(false);
            return;
        }
        if(password!=confirmPassword){
            Alert.alert("Passwords do not match","Please make sure the passwords match");
            setLoading(false);
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            const userRef = doc(FIREBASE_DB, 'users', auth?.currentUser?.uid as string);
            await setDoc(userRef, {
                email: auth?.currentUser?.email,
                name: name,
            });
        } catch (error) {
            const errorCode = (error as any).code as string;
            if(errorCode=="auth/invalid-email"){
                Alert.alert("Invalid Email","Please enter a valid email address");
            }else if(errorCode=="auth/weak-password"){
                Alert.alert("Weak Password","The password must be 6 characters long or more");
            }else if(errorCode=="auth/email-already-in-use"){
                Alert.alert("Email already in use","The email address is already in use by another account");
            }else if(errorCode=="auth/operation-not-allowed"){
                Alert.alert("Operation not allowed","Password sign-in is disabled for this project");
            }
            
        }
        setLoading(false);
    }


    return ( 
        <View style={styles.container}>
           <View style={styles.authCard}>
           <Image source={require('@/assets/images/logo.png')}
                style={{width:"100%",height:100}}/>
           {isLogin ? 
                <>
                    <Text style={styles.title}>Sign-in</Text>
                        <TextInput
                            style={[styles.input,{color:inputTextColor}]}
                            placeholder="Email"
                            value={email}
                            placeholderTextColor="#A6A7AF"
                            onChangeText={(text) => setEmail(text)}
                        />
                        <TextInput
                            style={[styles.input,{color:inputTextColor}]}
                            placeholder="Password"
                            placeholderTextColor="#A6A7AF"
                            value={password}
                            secureTextEntry={true}
                            onChangeText={(text) => setPassword(text)}
                        />
                        {loading ? <ButtonThemed title="SIGN IN" disabled={true} width='100%'/> : <ButtonThemed width='100%' title="SIGN IN" onPress={signIn}/>}
                    <Text>Don't have an account? <Text onPress={()=>setIsLogin(false)}style={styles.textToggle}>Sign-up</Text></Text>
                </>
                :
                <>
                    <Text style={styles.title}>Sign-up</Text>
                        <TextInput
                            style={[styles.input,{color:inputTextColor}]}
                            placeholder="Email"
                            placeholderTextColor="#A6A7AF"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                        <TextInput
                            style={[styles.input,{color:inputTextColor}]}
                            placeholder="Name"
                            placeholderTextColor="#A6A7AF"
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                        <TextInput
                            style={[styles.input,{color:inputTextColor}]}
                            placeholder="Password"
                            placeholderTextColor="#A6A7AF"
                            value={password}
                            secureTextEntry={true}
                            onChangeText={(text) => setPassword(text)}
                        />
                        <TextInput
                            style={[styles.input,{color:inputTextColor}]}
                            placeholder="Confirm Password"
                            placeholderTextColor="#A6A7AF"
                            value={confirmPassword}
                            secureTextEntry={true}
                            onChangeText={(text) => setConfirmPassword(text)}
                        />
                        {loading ? <ButtonThemed title="CREATE ACCOUNT" disabled={true} width='100%'/> : <ButtonThemed width='100%' title="CREATE ACCOUNT" onPress={signUp}/>}
                        <Text>Already have an account? <Text onPress={()=>setIsLogin(true)} style={styles.textToggle}>Sign-in</Text></Text>
                </>
            }
           </View>
        </View>
     );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    authCard:{
        width: Platform.OS==="web" ? "auto" : "80%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        alignItems: 'center',
        elevation: 12,
        gap:10,
        padding: 40,
        borderRadius: 10,
    },
    title: {
      fontSize: 24,
      marginBottom: 15,
      
    },
    input: {
      width: '100%',
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 10,
      paddingLeft: 10,
      
    },
    textToggle:{
        color:'green'
    },
    button: {
        padding: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 6
      },
      buttonText: {
        color: 'white',
        fontSize: 15
      },

  });
  
export default AuthScreen;