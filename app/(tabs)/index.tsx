import { Text, View } from '@/components/Themed';
import {
    StyleSheet,
    SafeAreaView,
    ScrollView,
    StatusBar,
    FlatList,
    ActivityIndicator,
  } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme'
import ConversationBox from '@/components/Chats/ConversationBox';
import EmptyConversation from '@/components/Chats/EmptyConversation';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';


  
  const DATA: any[] = [
  {
      id: '1sadfarq234',
      name: 'Doctor Niggar',
      description:'Your Virtual Dcotor',
      avatar: 'https://reactnative.dev/img/tiny_logo.png',
      botType:'custom',
      prompt:'context'
  },
  ];


const TabOneScreen = () => {
  const [conversationIds,setConversationIds] = useState<any[] | null>(null);
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    if(!user) return;
    const conversationRef=collection(FIREBASE_DB, 'users',user?.uid as string, 'conversations');
    const subscriber = onSnapshot(conversationRef, {
      next: (snapShot) => {
        const cIds: any[] = [];
        snapShot.docs.forEach((doc)=>{
          cIds.push({
            id:doc.id,
          })
          
        });
        setConversationIds(cIds);
       
      }
    });
  },[])


    return ( 
      <>
        {!conversationIds ? 
        
        <View style={[styles.container, styles.horizontal]}>
    
          <ActivityIndicator size="large" />
          
        </View>
        :
          <>
          {conversationIds.length==0 ?
            <EmptyConversation/>
            :
            <View style={styles.container}>
                <SafeAreaView>  
                    <ScrollView>
                    <View style={styles.chatContainer}>
                    { DATA.map((item)=> <ConversationBox conversation={item} key={item.id}/>) } 
                    </View>      
                  </ScrollView>
                </SafeAreaView>
            </View>
          }
          </>
        }
      </>
     );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    chatContainer:{
      flex: 1,
      padding: 10,
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
  });
export default TabOneScreen;
