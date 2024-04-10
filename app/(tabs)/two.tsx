import { ActivityIndicator, Dimensions, StyleSheet,Pressable,Image,SafeAreaView,ScrollView, Button, Platform, Alert } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { ButtonThemed, Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { Link } from 'expo-router';
const { width } = Dimensions.get('window');
const cardWidth = Platform.OS!="web" ? (width - 20) / 2 - 10: (width - 20) / 4 - 10; 

interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  custom:Boolean;
  prompt:string;
  longDescription:string;
}

interface CardProps {
  character: Character;
  onPress: () => void;
}

const Card: React.FC<CardProps> = ({ character, onPress }) => {
  
  return (
    //@ts-ignore
    <Link href={{ pathname: "/conversation/[id]", params:{id:character.id} }} asChild>
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: character.avatar }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{character.name}</Text>
      </View>
      
    </Pressable>
    </Link>
  );
};

export default function TabTwoScreen() {
  const [customCharacters, setCustomCharacters] = useState<any[] | null>(null);
  const user = FIREBASE_AUTH.currentUser;
  
  useEffect(() => {
    if(!user) return;
    const conversationRef=collection(FIREBASE_DB, 'bots');
    const subscriber = onSnapshot(conversationRef, {
      next: (snapShot) => {
        const cIds: any[] = [];
        snapShot.docs.forEach((doc)=>{
          //check if custom true'
          if(doc.data().custom){
            if(doc.data().owner === user.uid){
              cIds.push({
                id:doc.id,
                ...doc.data()
              })
            }
          }
        });
        setCustomCharacters(cIds);
      }
    });
    
  },[])
  return (
    <View style={{flex:1}}>
          <SafeAreaView>  
            <ScrollView>
              <View style={styles.container}>
                <>
                {!customCharacters ? 
          
                <View style={[styles.containerLoading, styles.horizontal]}>
            
                  <ActivityIndicator size="large" color="#28bc64" />
                  
                </View>
                :
                <>
                    {customCharacters.length > 0 ? 
                    <>
                    {customCharacters.map(character => (
                      <Card key={character.id} character={character} onPress={() => console.log(character)} />
                    ))}   
                    </>  
                    : 
                    <View style={{
                      justifyContent:'center',
                      alignItems:'center',
                      flex:1,
                      marginVertical:'50%'
                      }}>   
                      <Text style={{marginBottom:20}}>You have no custom characters, create one!</Text>
                      <Link href={'/create'} asChild>
                        <ButtonThemed title="Create Character"/>
                      </Link>      
                    </View>
                    } 
                </>
                }
              </>     
            </View>
            </ScrollView>
          </SafeAreaView>
        </View>
  );
}

const styles = StyleSheet.create({
  containerLoading:{
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "flex-start",
    gap: 10,
    paddingHorizontal: 10,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    
    padding: 10,
  },
  card: {
    width: cardWidth,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 5,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
  },
  image: {
    width: '100%',
    height: cardWidth,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  details: {
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 10,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginTop: 5,
  },
});
