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
      lastMessageText: string;
      lastMessageTime: number;
    };
}

const ConversationBox =({conversation}:ConversationBoxProps) => {
    const [botData,setBotData] = useState<any>(null);
    useEffect(() => {     
      const fetchData = async () => {
        const docSnap = await getDoc(doc(FIREBASE_DB, 'bots',conversation.id as string));
        if (docSnap.exists()) {
          setBotData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      };
      fetchData(); 
    }, []);
    return ( 
      <Link href={{ pathname: "/conversation/[id]", params:{id:conversation.id} }} asChild>
        <Pressable style={styles.container} onPress={()=>{
        }}>
            <Image source={{ uri: botData ? botData.avatar:'https://firebasestorage.googleapis.com/v0/b/test-auth-417304.appspot.com/o/assets%2Fplaceholder.png?alt=media&token=cf3dfee7-4046-412b-9d64-eb1db80b3e44' }} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{botData ? botData.name : '...' }</Text>
                <Text numberOfLines={1}>{!conversation.lastMessageText ? 
                <Text style={{fontWeight:'600'}}>Start a conversation {botData ? `with ${botData.name}` : '...' } </Text>
                : conversation.lastMessageText}</Text>
            </View>
        </Pressable>
      </Link>
     );
}
const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 0.5,
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