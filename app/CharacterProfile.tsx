import { StatusBar } from 'expo-status-bar';
import { Button, Platform, StyleSheet,Image } from 'react-native';
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import { Text, View } from '@/components/Themed';
import { Link } from "expo-router";

export default function CharacterProfile() {
  const params = useLocalSearchParams();
  return (
    <View style={styles.container}>
       <Image source={{
          uri: params.avatar as string,
        }} style={styles.avatar} />
      <Text style={styles.title}>{params.name}</Text>
      <Text style={styles.description}>{params.description}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.data}>

        <Text style={styles.longDescription}>{params.longDescription}</Text>
        <Link href={{ pathname: "/conversation/[id]", params:{id:params.id as string} }} asChild>
          <Button title="Chat now"/>
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
