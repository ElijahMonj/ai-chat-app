import React from 'react';
import { View,Text, ButtonThemed } from '@/components/Themed';
import { Button, TextInput,StyleSheet, Pressable, Animated } from 'react-native';
import { Link } from 'expo-router';
interface NameProps {
    nextStep: () => void;
    name: string;
    setName: (text: string) => void;
}

const Name: React.FC<NameProps> = ({nextStep,name,setName}) => {
    // Implement your component logic here

    return (
        
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Character's name"
                    value={name}
                    placeholderTextColor="#A6A7AF"
                    onChangeText={(text) => setName(text)}
                />
                <View style={styles.buttons}>
                    <Link href="/two" asChild>
                        <ButtonThemed title="Back" />
                    </Link>
                      
                    <ButtonThemed title="Next" onPress={nextStep}  disabled={name===''}/>
                </View>
                
            </View>
        
    );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      
    },
    buttons:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 20
  },
    input: {
      width: '100%',
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 20,
      paddingHorizontal: 10,
    },
  });
export default Name;