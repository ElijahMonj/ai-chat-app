import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, StyleSheet, Dimensions,SafeAreaView,ScrollView, ActivityIndicator, Pressable, Platform } from 'react-native';
import {View, Text} from '@/components/Themed'
import { Link } from 'expo-router';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
const { width } = Dimensions.get('window');
const cardWidth = Platform.OS!="web" ? (width - 20) / 2 - 10: (width - 20) / 4 - 10; // Assuming horizontal padding of 10

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
    <Link href={{ pathname: "/CharacterProfile", params: character }} asChild>
    <Pressable onPress={onPress} style={styles.card} >
      <Image source={{ uri: character.avatar }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{character.name}</Text>
        <Text style={styles.description}>{character.description}</Text>
      </View>
    </Pressable>
    </Link>
  );
};

const Characters: React.FC = () => {
  const [characters,setCharacters] = useState<any[] | null>(null);
  const user = FIREBASE_AUTH.currentUser;
  
  useEffect(() => {
    if(!user) return;
    const conversationRef=collection(FIREBASE_DB, 'bots');
    const subscriber = onSnapshot(conversationRef, {
      next: (snapShot) => {
        const cIds: any[] = [];
        snapShot.docs.forEach((doc)=>{
          //check if custom true'
          if(!doc.data().custom){
            cIds.push({
              id:doc.id,
              ...doc.data()
            })
          }
        });
        setCharacters(cIds);
      }
    });
  },[])

  return (
    
    <View style={styles.container}>
         <>
        {!characters ? 
        
        <View style={[styles.containerLoading, styles.horizontal]}>
    
          <ActivityIndicator size="large" color="#28bc64"/>
          
        </View>
        :
          <>
          {characters.map(character => (
            <Card key={character.id} character={character} onPress={() => {}} />
          ))}      
          </>
        }
        </>     
        
    </View>
  );
};
//Platform.OS!="web" ? (width - 20) / 2 - 10: 200
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
    flexGrow: 0,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  card: {
    width: cardWidth,
    height: "auto",
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

export default Characters;
