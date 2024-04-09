import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import {addDoc, arrayUnion, collection, doc, setDoc, query, where, onSnapshot, getDoc} from 'firebase/firestore'
import {FIREBASE_AUTH, FIREBASE_DB} from '@/FirebaseConfig' 
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { Platform } from 'react-native';


const Conversation = () => {
  const user = FIREBASE_AUTH.currentUser;
  const params = useLocalSearchParams();
  const [bot, setBot] = useState<any>(null);
  const [messages, setMessages] = useState<IMessage[]>([])
  const docRef = doc(FIREBASE_DB, 'users', user?.uid as string, 'conversations', params.id as string);
  
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
      console.log("No such document!");
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

    return (
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            //@ts-ignore
            _id: user?.uid,
          }}
        />
    )
}
 
export default Conversation;