import { Link } from "expo-router";
import { View,Text } from "../Themed";
import { StyleSheet,Image, TouchableOpacity, Pressable } from "react-native";
import { addDoc, collection, doc, setDoc,arrayUnion, getDoc, onSnapshot  } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { useEffect, useLayoutEffect, useState } from "react";
interface ConversationBoxProps {
    conversation: {
      id: string;
      name: string;
      description:string
      avatar: string;
    };
}

const ConversationBox =({conversation}:ConversationBoxProps) => {
    const user = FIREBASE_AUTH.currentUser;
    const docRef = doc(FIREBASE_DB, 'users', user?.uid as string, 'conversations', conversation.id as string);
    
    const [lastMessage,setLastMessage] = useState<string | null>(null);
    useLayoutEffect(() => {
    
      const subscriber = onSnapshot(docRef, {
        next: (snapShot) => {
          if(snapShot.exists()){
          let messages = snapShot.data().messages;
          messages.reverse();
            if(messages.length>0){
              setLastMessage(messages[0].text);
            }
          }
        }
      });

    }, []);
    return ( 
      <Link href={{ pathname: "/conversation/[id]", params:{id:conversation.id} }} asChild>
        <Pressable style={styles.container} onPress={()=>{
        }}>
            <Image source={{ uri:conversation.avatar }} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{conversation.name}</Text>
                <Text numberOfLines={1}>{!lastMessage ? 
                <Text style={{fontWeight:'100'}}>Start a conversation with {conversation.name}</Text>
                : lastMessage}</Text>
            </View>
        </Pressable>
      </Link>
     );
}
const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      paddingVertical: 10,
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    textContainer: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
    },


  });
  
 
export default ConversationBox;