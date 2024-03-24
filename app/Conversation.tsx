import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import {addDoc, arrayUnion, collection, doc, setDoc, query, where, onSnapshot, getDoc} from 'firebase/firestore'
import {FIREBASE_AUTH, FIREBASE_DB} from '@/FirebaseConfig' 
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

const Conversation = () => {
  const params = useLocalSearchParams();
  const user = FIREBASE_AUTH.currentUser;
  
  const [messages, setMessages] = useState<IMessage[]>([])
  const docRef = doc(FIREBASE_DB, 'users', user?.uid as string, 'conversations', params.id as string);

  useEffect(() => {
    
    setDoc(doc(FIREBASE_DB, "users", user?.uid as string,"conversations",params.id as string), 
          { 
            messages: arrayUnion(
              ...[]
            ),
          },{ merge: true }
      );
    const fetchData = async () => {
    const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let msgs = docSnap.data().messages.sort((a: { createdAt: number; }, b: { createdAt: number; }) => a.createdAt - b.createdAt);
          msgs.reverse();
         setMessages(msgs as IMessage[]);
       } else {
         console.log("No such document!");
       }
       };
     fetchData();
  }, []); 

  useEffect(() => {
    if(messages.length>0 && messages[0].user._id===user?.uid){
      messageBot();
    }
  }, [messages]);

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
    async function messageBot(){
      let token = await user?.getIdToken().then((token) => {return token});
      
      let history = messages.map((message) => [message.user._id === user?.uid ? 'user' : 'assistant', message.text]);
      
      const getReply = await axios.post(`http://192.168.254.141:3000/chat`, {
        history,
        params
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

    return (
      <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        //@ts-ignore
        _id: user?.uid,
      }}
      />
    );
};



export default Conversation;