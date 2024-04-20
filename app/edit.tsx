import { View,Text,ButtonThemed } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";
import {useColorScheme} from '@/components/useColorScheme';
import { Platform, StyleSheet,Image, ActivityIndicator, TextInput, ScrollView, Pressable, ImageBackground, Modal, Alert } from 'react-native';
import { Formik } from 'formik';
import { Link,router } from "expo-router";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import ModalAlert from "@/components/ModalAlert";
const Edit = () => {
    const collectionRef=collection(FIREBASE_DB, 'bots');
    const user = FIREBASE_AUTH.currentUser;
    const nav = useNavigation();
    const theme = useColorScheme() ?? 'light';
    const inputTextColor= theme === 'light' ? '#000' : '#fff';
    const params = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [displayImage, setDisplayImage] = useState<string | null>(null);
    const [character,setCharacter] = useState<any|null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
      nav.setOptions({
        headerRight: () => (
          <Pressable onPress={() => {setModalVisible(true);}}>
            {({ pressed }) => (
              <MaterialCommunityIcons
                name="delete-outline"
                size={25}
                color={Colors[useColorScheme() ?? 'light'].text}
                style={{ marginRight: Platform.OS ==='web' ? 15 : 0, opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        ),
      });
    }, []);
    useEffect(() => {

      const subscriber = onSnapshot(collectionRef, {
        next: (snapShot) => { 
          snapShot.docs.forEach((doc)=>{
            if(doc.id==params.id){
              if(doc.data().custom && doc.data().owner==user?.uid){
                setCharacter({
                  id: doc.id,
                  ...doc.data()
                }); 
                setDisplayImage(doc.data().avatar);
              }else{
                router.replace('/characters');
              }
            }  
          });
        }
      });
     return () => subscriber();
      }, []);
    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,  
        aspect: [1, 1],      
        quality: 1,
      });
  
      if (!result.canceled) {
          setDisplayImage(result.assets[0].uri);
      }
    };
  

    async function submit(values:any){
      if((values.avatar === displayImage) && (values.name === character.name) && (values.description === character.description) && (values.tone === character.tone) && (values.backstory === character.backstory)){
        console.log('no changes')
      }else if((values.avatar !== displayImage) && (values.name === character.name) && (values.description === character.description) && (values.tone === character.tone) && (values.backstory === character.backstory)){
        setIsLoading(true);
        const botAvatar = await uploadImage(displayImage as string);
        const desertRef = ref(getStorage(), character.avatar);
        const botDoc = doc(FIREBASE_DB, `bots/${params.id as string}`);
        updateDoc(botDoc, {avatar: botAvatar});
        deleteObject(desertRef).then(() => {
          console.log('deleted old avatar')
        }).catch((error) => {
          console.log(error)
        });
        
      }else{
        
        setIsLoading(true);
        let avatar = values.avatar;
        if(avatar !== displayImage){
          console.log('uploading new avatar')
          const botAvatar = await uploadImage(displayImage as string);
          avatar = botAvatar;
          const desertRef = ref(getStorage(), character.avatar);
            deleteObject(desertRef).then(() => {
              console.log('deleted old avatar')
            }).catch((error) => {
              console.log(error)
            });
        } 
        const token = await user?.getIdToken().then((token) => {return token});
        const getPrompt = await axios.post(`https://ai-chat-api-vercel.vercel.app/prompt`, {
            name:values.name,
            description:values.description,
            backstory:values.backstory,
            tone:values.tone
          }
          ,{
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
            }
          });
          const prompt = await getPrompt.data.prompt;
          setDoc(doc(FIREBASE_DB, "bots", params.id as string),{
            avatar: avatar,
            custom: true,
            description: values.description,
            tone:values.tone,
            backstory:values.backstory,
            name: values.name,
            owner: user?.uid,
            prompt: prompt,
          })
      }
      const customBotDoc = await getDoc(doc(collectionRef, params.id as string));
          const customBotData = {
            id: customBotDoc.id,
            ...customBotDoc.data()
          }
         
          setCharacter(customBotData);
          setIsLoading(false);
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
  async function deleteBot(){
    const botRef = doc(FIREBASE_DB, `bots/${params.id}`);
    const conversationRef = doc(FIREBASE_DB, `users/${user?.uid}/conversations/${params.id}`);
    deleteDoc(botRef);
    deleteDoc(conversationRef);
    const desertRef = ref(getStorage(), character.avatar);
    deleteObject(desertRef).then(() => {
      console.log('deleted avatar')
    }).catch((error) => {
      console.log(error)
    });

    setModalVisible(false)
    router.replace('/characters');
  }
    return ( 
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <ModalAlert 
          modalVisible={modalVisible} 
          setModalVisible={setModalVisible} 
          onPress={deleteBot}
          title="Delete Character"
          message="Are you sure you want to delete this character?"
          />
            {!character ?
            <View style={[styles.containerLoading, styles.horizontal]}>
                <ActivityIndicator size="large" color="#28bc64"/>
            </View>
            :
            <Formik
              initialValues={{ 
                avatar: character.avatar as string,
                name: character.name as string,
                description: character.description as string,
                tone: character.tone as string,
                backstory: character.backstory as string,
               }}
              onSubmit={values => submit(values)}>
              {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View style={styles.form}>
                  <View style={{flexDirection:"row",width:'100%',gap:20,justifyContent:'space-around',flexGrow:1}}>
                    <Pressable onPress={pickImage}>
                      <ImageBackground source={{uri: displayImage as string}} resizeMode="cover" style={styles.avatar} imageStyle={{ borderRadius: 65}}>             
                          <Text style={
                            {
                              color: 'lightgray',
                              fontSize: 20,
                              lineHeight: 84,
                              textAlign: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#000000c0',
                              
                            }
                          }>
                            <MaterialCommunityIcons
                            name="image-edit"
                            size={30}
                            color='lightgray'
                            style={{}}
                          />                            
                          </Text>
                      </ImageBackground>
                    </Pressable>
                    <View style={{width:'50%',alignSelf:'center'}}>
                      <Text>Name</Text>
                      <TextInput
                      style={[styles.input,{color:inputTextColor}]}
                      placeholder="Enter name of your character"
                      placeholderTextColor="#A6A7AF"
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                      />
                    </View>
                  </View>
                  <View style={{width:'100%'}}>
                    <Text>Description</Text>
                    <TextInput
                            editable
                            placeholderTextColor="#A6A7AF"
                            placeholder="How would the character describe themselves?"
                            multiline
                            numberOfLines={4}
                            maxLength={250}
                            onChangeText={handleChange('description')}
                            value={values.description}
                            style={[styles.inputBig,{color:inputTextColor}]}
                        />
                    </View>
                    <View style={{width:'100%'}}>
                    <Text>Backstory</Text>
                    <TextInput
                            editable
                            placeholderTextColor="#A6A7AF"
                            placeholder="What is the character's backstory?"
                            multiline
                            numberOfLines={4}
                            maxLength={250}
                            onChangeText={handleChange('backstory')}
                            value={values.backstory}
                            style={[styles.inputBig,{color:inputTextColor}]}
                        />
                    </View>
                    <View style={{width:'100%'}}>
                    <Text>Tone of Speaking</Text>
                    <TextInput
                            editable
                            placeholderTextColor="#A6A7AF"
                            placeholder="How would the character talk to you?"
                            multiline
                            numberOfLines={4}
                            maxLength={250}
                            onChangeText={handleChange('tone')}
                            value={values.tone}
                            style={[styles.inputBig,{color:inputTextColor}]}
                        />
                    </View>
                    
                    <ButtonThemed onPress={handleSubmit} title="Save Changes" width="100%" disabled={isLoading}/>

              </View>
            )}
            </Formik>
            }
           
        </View>
        </ScrollView>
    );
}
 
const styles = StyleSheet.create({
    containerLoading:{
        flex: 1,
        justifyContent: 'center',
      },
      horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
      },
      
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      
    },
    form:{
      width: '80%',
      maxWidth: 400,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    avatar:{
      width: 130,
      height: 130,
      borderRadius: 65,
      marginBottom: 10,
      justifyContent: 'center',
      overflow: 'hidden',
    },
    input: {
      width: '100%',
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    inputBig:{
      width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        padding: 10,
        textAlignVertical: 'top'
    },

    

  });
  
export default Edit;