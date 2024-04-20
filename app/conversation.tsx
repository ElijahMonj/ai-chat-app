import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { GiftedChat, IMessage,InputToolbar, Actions, SystemMessage, Send } from 'react-native-gifted-chat'
import {addDoc, arrayUnion, collection, doc, setDoc, query, where, onSnapshot, getDoc, deleteDoc} from 'firebase/firestore'
import {FIREBASE_AUTH, FIREBASE_DB} from '@/FirebaseConfig' 
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import {useColorScheme} from '@/components/useColorScheme';
import { Platform, View,Image, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/Themed';
import { useNavigation } from '@react-navigation/native'
import ModalAlert from '@/components/ModalAlert';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
const Conversation = () => {
  const nav = useNavigation();
  const user = FIREBASE_AUTH.currentUser;
  const params = useLocalSearchParams();
  const [bot, setBot] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<IMessage[]>([])

  const theme = useColorScheme() ?? 'light';
  const [modalVisible, setModalVisible] = useState(false);

  const messageStateRef = React.useRef(messages);
  const setMessageState = (data: IMessage[]) => {
    messageStateRef.current = data;
    setMessages(data);
  };

  const botStateRef = React.useRef(bot);
  const setBotState = (data: any) => {
    botStateRef.current = data;
    setBot(data);
  };

  useEffect(() => {
 
  if (Platform.OS === 'web') {
    const gcLoadingContaineEl = document.querySelectorAll('[data-testid="GC_LOADING_CONTAINER"]')[0] as HTMLElement
    if (gcLoadingContaineEl) {
      gcLoadingContaineEl.style.display = 'none'
      setTimeout(() => {
        gcLoadingContaineEl.style.display = 'flex'
      }, 500)
    }
  }
  var unsub: () => void;
  const conversationRef=collection(FIREBASE_DB, 'users', user?.uid as string,'conversations'); 
  const unsubscriber = onSnapshot(collection(FIREBASE_DB, 'bots'), {
    next: (snapShot) => { 
      snapShot.docs.forEach((botDoc)=>{ 
        if(botDoc.id==params.id){
          console.log("Bot found!")
          setBotState({
            id: botDoc.id,
            ...botDoc.data()    
          });
          
          nav.setOptions({
            title:botDoc.data().name,
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
          const subscriber = onSnapshot(conversationRef, {
           
            next: (snapShot) => { 
              snapShot.docs.forEach((doc)=>{ 
                if(doc.id==params.id){
                  let msgs = doc.data().messages.sort((a: { createdAt: number; }, b: { createdAt: number; }) => a.createdAt - b.createdAt);
                  msgs.reverse();
                    //get messate data
                  const updatedMessages = msgs.map((msg:any) => {
              
                    if (msg.user._id !== user?.uid as string) {
                      return {
                        _id: msg._id,
                        createdAt: msg.createdAt,
                        text: msg.text,
                        user: { 
                          _id: msg._id, name: botDoc.data()?.name, avatar: botDoc.data()?.avatar 
                        },
                      };
                    } else {
                      return msg; 
                    }
                  });
                  //put avatar and name to bot messages
                  console.log(updatedMessages[0].text)
                  setMessageState(updatedMessages);
                  
                }  
              });
              setIsLoading(false);
            }
          });
          unsub = () => {
            console.log('unsubscribing from conversation');
            subscriber();
          };
        }
      });
    }
  });
  
  return () => {
    unsub();
    console.log('unsubscribing from bot');
    unsubscriber();
  }

  }, [])

  const onSend = useCallback(async(m: IMessage[] = []) => {
    const msg  = {
      _id: m[0]._id,
      createdAt: Date.now(),
      text: m[0].text,
      user: {
        _id: user?.uid as string,
        name: user?.email as string,
        avatar: '' 
      }
    }
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, [msg]),
    ) 
    let token = await user?.getIdToken().then((token) => {return token}); 
    let prevMessages = [msg,...messageStateRef.current];
    let history = prevMessages.map((message) => [message.user._id === user?.uid ? 'user' : 'assistant', message.text]);
    
    const getReply = await axios.post(`https://ai-chat-api-vercel.vercel.app/chat`, {
      history,
      params:botStateRef.current
    }
    ,{
      headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
      }
    });
    const botReply = await getReply.data.response;
    
    const botReplyObj = {
      _id: botReply._id,
      createdAt: botReply.createdAt,
      text: botReply.text,
      user:{
        _id: botReply.user._id,
      }
    }
    
    setDoc(doc(FIREBASE_DB, "users", user?.uid as string,"conversations",params.id as string), 
    { 
      messages: arrayUnion(
        ...[
          msg, 
          botReplyObj
        ]
      ),
    },{ merge: true }
    );
  }, [])

  const customtInputToolbar = (props:any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: theme === 'dark' ? '#000' : '#fff',
          borderTopColor: "#E8E8E8",
          
          marginTop: 4,
         
        }}
      />
    );
  };
  const CustomChatEmpty = () => {

    const fixInverted = Platform.OS === 'web' ?  [{ scaleY: -1 }] : [{scaleY: -1}, {scaleX: -1}];
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', transform:fixInverted }}>
        {isLoading ? <Text style={{fontSize:20,fontWeight:'200'}}>Loading messages...</Text> : 
        <Text style={{fontSize:20,fontWeight:'200'}}>Start a conversation
        {bot ? ` with ${bot.name}` : ''}
        </Text>}
        
      </View>
    );
  };
  async function deleteBot(){
    const conversationRef = doc(FIREBASE_DB, `users/${user?.uid}/conversations/${params.id}`);
    deleteDoc(conversationRef);
    setModalVisible(false)
    router.replace('/');
  }
    return (
      <>
      <ModalAlert 
      modalVisible={modalVisible} 
      setModalVisible={setModalVisible} 
      onPress={deleteBot}
      title="Conversation?"
      message="Are you sure you want to delete this conversation?"
      />
          <GiftedChat
          renderUsernameOnMessage={true}
          renderChatEmpty={() => <CustomChatEmpty />}
            messages={messages}
            textInputStyle = {{color: theme === 'dark' ? '#fff' : '#000'}}
            onSend={messages => onSend(messages)}
            user={{
              //@ts-ignore
              _id: user?.uid,
            }}
            wrapperStyle={{
              right: {
                backgroundColor: "#28bc64"
              },
              left:{
                backgroundColor: "#ebf7f0",
              }
            }}
            renderInputToolbar={props => customtInputToolbar(props)}
            renderSend={(props) => (
            <Send
              {...props}
              containerStyle={{
                
                width: 60,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name="send" size={25} color="#28bc64" />
            </Send> )}
        />
      </>
        
    )
}
 
export default Conversation;