import { Text, View } from '@/components/Themed';
import {
    StyleSheet,
    SafeAreaView,
    ScrollView,
    StatusBar,
    FlatList,
    ActivityIndicator,
    Platform,
  } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme'
import ConversationBox from '@/components/Chats/ConversationBox';
import EmptyConversation from '@/components/Chats/EmptyConversation';
import { FIREBASE_AUTH, FIREBASE_DB,FIREBASE_AUTH_WEB } from '@/FirebaseConfig';
import { useEffect, useLayoutEffect, useState } from 'react';
import { collection, onSnapshot,doc } from 'firebase/firestore';


const TabOneScreen = () => {
  const [conversationData,setConversationData] = useState<any[] | null>(null);

  const user = FIREBASE_AUTH.currentUser
  useLayoutEffect(() => {
    if(!user) return;
    const conversationRef=collection(FIREBASE_DB, 'users',user?.uid as string, 'conversations');
   
    const subscriber = onSnapshot(conversationRef, {
      next: (snapShot) => { 
        const cIds: any[] = [];
        snapShot.docs.forEach((doc)=>{
          if(doc.data().messages.length==0){
            cIds.push({id:doc.id})
          }else{
            cIds.push({
              id:doc.id,
              lastMessageText:doc.data().messages[doc.data().messages.length-1].text,
              lastMessageTime:doc.data().messages[doc.data().messages.length-1].createdAt
            })
          }    
        });
        setConversationData(cIds);
        
      }
    });
    //get conversation ids
    
  },[])

  
    return ( 
      <>
        {!conversationData ? 
        
        <View style={[styles.container, styles.horizontal]}>
    
          <ActivityIndicator size="large" color="#28bc64"/>
          
        </View>
        :
          <>
          {conversationData.length==0 ?
            <EmptyConversation/>
            :
            <View style={styles.container}>
                <SafeAreaView>  
                    <ScrollView>
                    <View style={{flex: 1,
                      padding: 10,}}>
                      
                      {
                      [...conversationData].sort((a, b) => b.lastMessageTime - a.lastMessageTime).map((item)=> <ConversationBox conversation={item} key={item.id}/>) 
                      }  
                    
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
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
  });
export default TabOneScreen;
