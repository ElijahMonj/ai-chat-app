
import React, { useState } from 'react';
import { View, Text } from '@/components/Themed';
import { FIREBASE_AUTH,FIREBASE_DB } from '@/FirebaseConfig';
import { Button, TextInput } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';


const AuthScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            
        } catch (error) {
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
            console.error(error);
        }
        setLoading(false);
    }


    return ( 
        <View>
            <Text>Login</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                />
            <TextInput
                placeholder="Password"
                value={password}
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
                />
                {loading ? <Text>Loading...</Text> : 
                <>
                <Button title="Login" onPress={signIn}/>
                <Button title="Create Account" onPress={signUp}/>
                </>
                }
        </View>
     );
}
 
export default AuthScreen;