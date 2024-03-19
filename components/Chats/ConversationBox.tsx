import { Link } from "expo-router";
import { View,Text } from "../Themed";
import { StyleSheet,Image, TouchableOpacity } from "react-native";
import { addDoc, collection, doc, setDoc,arrayUnion  } from "firebase/firestore";
import { FIREBASE_DB } from "@/FirebaseConfig";
interface ConversationBoxProps {
    conversation: {
      id: string;
      name: string;
      description:string
      avatar: string;
    };
}
  
const ConversationBox =({conversation}:ConversationBoxProps) => {
    return ( 
      <Link href={{ pathname: "/Conversation", params: conversation }} asChild>
        <TouchableOpacity style={styles.container} activeOpacity={0.6} onPress={()=>{
        }}>
            <Image source={{ uri:conversation.avatar }} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{conversation.name}</Text>
                <Text>{conversation.description}</Text>
            </View>
        </TouchableOpacity>
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