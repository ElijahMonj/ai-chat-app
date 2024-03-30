import {View, Text} from '@/components/Themed'
import { StyleSheet } from 'react-native';
import Picture from '@/components/Forms/Picture'
import Description from '@/components/Forms/Description';
import Name from '@/components/Forms/Name';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as Progress from 'react-native-progress';
import { useState } from 'react';
import Backstory from '@/components/Forms/Backstory';
import Tone from '@/components/Forms/Tone';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import axios from 'axios';
import { addDoc, collection } from 'firebase/firestore';

const Create = () => {
    const user = FIREBASE_AUTH.currentUser;
    const [step,setStep] = useState(0);
    const [name,setName] = useState('');
    const [description,setDescription] = useState('');
    const [backstory,setBackstory] = useState('');
    const [tone,setTone] = useState('');
    const [picture,setPicture] = useState<null | string>(null);
    function nextStep(){
        setStep(step+1);
    }
    function prevStep(){
        setStep(step-1);
    }
    async function submit(){
        
        const botAvatar = await uploadImage(picture as string);
        let token = await user?.getIdToken().then((token) => {return token});
        const getPrompt = await axios.post(`https://ai-chat-api-vercel.vercel.app/prompt`, {
          name,
          description,
          backstory,
          tone
        }
        ,{
          headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
          }
        });
        const prompt = await getPrompt.data.prompt;
        console.log(prompt);
        const customBot = await addDoc(collection(FIREBASE_DB, 'bots'),{
          avatar: botAvatar,
          custom: true,
          description: '',
          longDescription: '',
          name: name,
          owner: user?.uid,
          prompt: prompt,
        })
    }
    const uploadImage = async (picture:string) => {
        try {
          const uploadUrl = await uploadImageAsync(picture);
          return uploadUrl;
        } catch (e) {
          console.log(e);
          alert("Upload failed, sorry :(");
        }
    }
    async function uploadImageAsync(uri:string) {
        const blob:any = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", uri, true);
          xhr.send(null);
        });
        const fileRef = ref(getStorage(), uuidv4());
        const result = await uploadBytes(fileRef, blob);
        blob.close();
        return await getDownloadURL(fileRef);
    }

    let progress;
    if(step === 0) progress = 0.2;
    else if(step === 1) progress = 0.4;
    else if(step === 2) progress = 0.6;
    else if(step === 3) progress = 0.8;
    else if(step === 4) progress = 1;
    return ( 
        <View style={styles.container}>
            <Text style={styles.title}>Create a Character</Text>
            <View style={styles.forms}>
                {step === 0 && <Name nextStep={nextStep} name={name} setName={setName}/>}
                {step === 1 && <Description prevStep={prevStep} nextStep={nextStep} description={description} setDescription={setDescription}/>}
                {step === 2 && <Backstory prevStep={prevStep} nextStep={nextStep} backstory={backstory} setBackstory={setBackstory}/>}
                {step === 3 && <Tone prevStep={prevStep} nextStep={nextStep} tone={tone} setTone={setTone}/>}
                {step === 4 && <Picture prevStep={prevStep} submit={submit} picture={picture} setPicture={setPicture}/>}
            </View>
            <Progress.Bar progress={progress} width={200} style={styles.progress} />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title:{
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20
    },
    progress:{
        marginVertical: 20
    },
    forms:{
        width: '60%',
        height: '80%'
    }
  });

export default Create;