import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, IMessage,InputToolbar, Actions, SystemMessage, Send } from 'react-native-gifted-chat'
import {addDoc, arrayUnion, collection, doc, setDoc, query, where, onSnapshot, getDoc} from 'firebase/firestore'
import {FIREBASE_AUTH, FIREBASE_DB} from '@/FirebaseConfig' 
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import {useColorScheme} from '@/components/useColorScheme';
import { Platform, View,Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/Themed';
const Conversation = () => {
  const user = FIREBASE_AUTH.currentUser;
  const params = useLocalSearchParams();
  const [bot, setBot] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<IMessage[]>([])
  const docRef = doc(FIREBASE_DB, 'users', user?.uid as string, 'conversations', params.id as string);
  const theme = useColorScheme() ?? 'light';
  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(doc(FIREBASE_DB, 'bots',params.id as string));
      
      if (docSnap.exists()) {
       
        setBot({
          id: docSnap.id,
          ...docSnap.data()
        
        });
      } else {
        console.log("No such document!");
      }
     
    };
    fetchData();  
  }, [])
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

  const fetchData = async () => {
    const docSnap = await getDoc(docRef);
    let msgs;
    if (docSnap.exists()) {
      msgs = docSnap.data().messages.sort((a: { createdAt: number; }, b: { createdAt: number; }) => a.createdAt - b.createdAt);
      msgs.reverse();
    } else {
      console.log("New conversation, creating document...");
        setDoc(doc(FIREBASE_DB, "users", user?.uid as string,"conversations",params.id as string), 
          { 
            messages: arrayUnion(
              ...[]
            ),
          },{ merge: true }
        );
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          msgs = docSnap.data().messages.sort((a: { createdAt: number; }, b: { createdAt: number; }) => a.createdAt - b.createdAt);
          msgs.reverse();
        }
    }
    
    setMessages(msgs);
    setIsLoading(false);
  };
  fetchData();
  }, [])
  useEffect(() => {
    if(messages.length>0 && messages[0].user._id===user?.uid){
      messageBot();
    }
  }, [messages]);
  async function messageBot(){
    
    let token = await user?.getIdToken().then((token) => {return token});
    
    let history = messages.map((message) => [message.user._id === user?.uid ? 'user' : 'assistant', message.text]);
    
    const getReply = await axios.post(`https://ai-chat-api-vercel.vercel.app/chat`, {
      history,
      params:bot
    }
    ,{
      headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
      }
    });
    
    const botReply = await getReply.data.response;
    
    setDoc(doc(FIREBASE_DB, "users", user?.uid as string,"conversations",params.id as string), 
    { 
      messages: arrayUnion(
        ...[ 
        botReply
        ]
      ),
    },{ merge: true }
    );
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, [botReply as IMessage]),
    )
  }
  const onSend = useCallback((m: IMessage[] = []) => {
      
    const msg : IMessage = {
      _id: m[0]._id,
      createdAt: Date.now(),
      text: m[0].text,
      user: {
        _id: user?.uid as string,
        name: user?.email as string,
        avatar: '' 
      }
    }

    setDoc(doc(FIREBASE_DB, "users", user?.uid as string,"conversations",params.id as string), 
        { 
          messages: arrayUnion(
            ...[   // <=== Note the spread operator
            msg
            ]
          ),
        },{ merge: true }
    );

    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, [msg]),
    )      
 
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

    return (
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
    )
}
 
export default Conversation;