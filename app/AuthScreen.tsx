
import React, { useState } from 'react';
import { View, Text } from '@/components/Themed';
import { FIREBASE_AUTH,FIREBASE_DB,FIREBASE_AUTH_WEB } from '@/FirebaseConfig';
import { Button, Platform, TextInput,StyleSheet,Alert } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';


const AuthScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogin,setIsLogin] = useState(true);
    const auth = FIREBASE_AUTH;

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
            console.error(error);
        }
        setLoading(false);
    }
    const signUp = async () => {
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);

            const userRef = doc(FIREBASE_DB, 'users', auth?.currentUser?.uid as string);
            await setDoc(userRef, {email: auth?.currentUser?.email});
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
            console.error(error);
        }
        setLoading(false);
    }


    return ( 
        <View style={styles.container}>
           
            {isLogin ? 
                <>
                     <Text style={styles.title}>Login</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            secureTextEntry={true}
                            onChangeText={(text) => setPassword(text)}
                        />
                        {loading ? (
                            <Text>Loading...</Text>
                        ) : (
                            <>
                            <Button title="Login" onPress={signIn} />
                            <Text>Don't have an account? <Text onPress={()=>setIsLogin(false)}>Sign-up</Text></Text>
                            </>
                        )}
                </>
                :
                <>
                    <Text style={styles.title}>Sign-up</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            secureTextEntry={true}
                            onChangeText={(text) => setPassword(text)}
                        />
                        {loading ? (
                            <Text>Loading...</Text>
                        ) : (
                            <>
                            
                            <Button title="Create Account" onPress={signUp} />
                            <Text>Already have an account? <Text onPress={()=>setIsLogin(true)}>Sign-in</Text></Text>
                            </>
                        )}
                </>
            }
        </View>
     );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: 'bold',
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
  });
  
export default AuthScreen;