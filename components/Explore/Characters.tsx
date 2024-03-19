import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, StyleSheet, Dimensions,SafeAreaView,ScrollView, ActivityIndicator } from 'react-native';
import {View, Text} from '@/components/Themed'
import { Link } from 'expo-router';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
const { width } = Dimensions.get('window');
const cardWidth = (width - 20) / 2 - 10; // Assuming horizontal padding of 10

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
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.6}>
      <Image source={{ uri: character.avatar }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{character.name}</Text>
        <Text style={styles.description}>{character.description}</Text>
      </View>
    </TouchableOpacity>
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
          cIds.push({
            id:doc.id,
            ...doc.data()
          })
          
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
    
          <ActivityIndicator size="large" />
          
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

const styles = StyleSheet.create({
  containerLoading:{
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  details: {
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 10,
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
