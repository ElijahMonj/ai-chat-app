import { StatusBar } from 'expo-status-bar';
import { Button, Platform, StyleSheet,Image } from 'react-native';
import { useRouter, useLocalSearchParams, router } from "expo-router";
import { ButtonThemed, Text, View } from '@/components/Themed';
import { Link } from "expo-router";
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '@/FirebaseConfig';

export default function CharacterProfile() {
  const params = useLocalSearchParams();
  const [character,setCharacter] = useState<any|null>(null);
  const nav = useNavigation();
  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(doc(FIREBASE_DB, 'bots',params.id as string));
      if (docSnap.exists()) {
        if(docSnap.data().custom){
          router.replace('/explore');
        }else{
            setCharacter(docSnap.data());
            nav.setOptions({
              title: docSnap.data().name,
            });
        }
      } else {
        console.log("No such document!");
      }
    };
    fetchData(); 
  }, []);
  return (
    <View style={styles.container}>
       <Image source={{
          uri: character?.avatar as string,
        }} style={styles.avatar} />
      <Text style={styles.title}>{character?.name}</Text>
      <Text style={styles.description}>{character?.description}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.data}>

        <Text style={styles.longDescription}>{character?.longDescription}</Text>
        <Link replace href={{ pathname: "/conversation", params:{id:params.id as string}}} asChild>
          <ButtonThemed title="Chat now"/>
        </Link>
      </View>
      
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  longDescription: {
    fontSize: 16,
    textAlign: 'center',
  },
  avatar:{
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  data:{
    width: '75%',
    alignItems: 'center',
    gap: 15,
  }
});
