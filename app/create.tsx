import {View, Text, ButtonThemed} from '@/components/Themed'
import { ActivityIndicator, Button, StyleSheet, Image } from 'react-native';
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
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { Link } from 'expo-router';


const Create = () => {
    const user = FIREBASE_AUTH.currentUser;
    const [step,setStep] = useState<number>(0);
    const [name,setName] = useState('');
    const [description,setDescription] = useState('');
    const [backstory,setBackstory] = useState('');
    const [tone,setTone] = useState('');
    const [picture,setPicture] = useState<null | string>(null);
    const [creating,setCreating] = useState(false);
    const [customBot,setCustomBot] = useState<any>(null);
    function nextStep(){
        setStep(step+1);
    }
    function prevStep(){
        setStep(step-1);
    }
    async function submit(){
        setCreating(true);
        nextStep();
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
        
        const customBot = await addDoc(collection(FIREBASE_DB, 'bots'),{
          avatar: botAvatar,
          custom: true,
          description: description,
          tone:tone,
          backstory:backstory,
          name: name,
          owner: user?.uid,
          prompt: prompt,
        })
        const customBotDoc = await getDoc(doc(collection(FIREBASE_DB, 'bots'), customBot.id));
        const customBotData = {
          id: customBot.id,
          ...customBotDoc.data()
        }
        setCustomBot(customBotData);
        setCreating(false);
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
        const blob = await new Promise<Blob>((resolve, reject) => {
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
        await uploadBytes(fileRef, blob);
        
        return await getDownloadURL(fileRef);
    }

    let progress;
    if(step === 0) progress = 0.1;
    else if(step === 1) progress = 0.3;
    else if(step === 2) progress = 0.5;
    else if(step === 3) progress = 0.7;
    else if(step === 4) progress = 0.9;
    else if (step === 5) progress = 1;
    return ( 
        <View style={styles.container}>
            <Text style={styles.title}>Create a Character</Text>
            <View style={styles.forms}>
                {step === 0 && <Name nextStep={nextStep} name={name} setName={setName}/>}
                {step === 1 && <Description prevStep={prevStep} nextStep={nextStep} description={description} setDescription={setDescription}/>}
                {step === 2 && <Backstory prevStep={prevStep} nextStep={nextStep} backstory={backstory} setBackstory={setBackstory}/>}
                {step === 3 && <Tone prevStep={prevStep} nextStep={nextStep} tone={tone} setTone={setTone}/>}
                {step === 4 && <Picture prevStep={prevStep} submit={submit} nextStep={nextStep} picture={picture} setPicture={setPicture}/>}
                {step === 5 && 
                <View style={styles.container}>
                      {creating ? 
                      <View style={styles.containerLoading}>
                          <ActivityIndicator size="large" color="#28bc64"/> 
                          <Text style={{fontWeight:'100'}}>Creating character...</Text>
                      </View> 
                      : 
                      <View style={styles.containerLoading}>
                          <Image source={{ uri: picture ? picture : 'https://reactnative.dev/img/tiny_logo.png' }}
                          style={styles.logo} />
                          <Link replace href={{ pathname: "/conversation", params:{id:customBot.id}}} asChild>
                            <ButtonThemed title="Done" disabled={!customBot}/>
                          </Link>
                      </View>
                      }                       
                </View>
                }
            </View>
            <Progress.Bar progress={progress} width={200} style={styles.progress} color="#28bc64"/>
        </View>
    );
}
const styles = StyleSheet.create({
  containerLoading:{
    flex: 1,
    justifyContent: 'center',
    gap: 20
  },
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
    },
    logo: {
      width: 150,
      height: 150,
      borderRadius: 150,
    },
  });

export default Create;