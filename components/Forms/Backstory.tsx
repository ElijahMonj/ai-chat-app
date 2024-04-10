
import React, { useState } from 'react';
import { View,Text, ButtonThemed } from '@/components/Themed';
import { Button,StyleSheet, TextInput } from 'react-native';
interface BackstoryProps {
    nextStep: () => void;
    prevStep: () => void;
    backstory: string;
    setBackstory: (text: string) => void;
}

const Backstory: React.FC<BackstoryProps> = ({nextStep,prevStep,backstory,setBackstory}) => {
    // Implement your component logic here
    
    return (
        <View style={styles.container}>
            <View style={{width:'100%'}}>
                <Text>Backstory</Text>
                <TextInput
                        placeholder="What is the character's backstory?"
                        editable
                        placeholderTextColor="#A6A7AF"
                        multiline
                        numberOfLines={6}
                        maxLength={250}
                        onChangeText={text => setBackstory(text)}
                        value={backstory}
                        style={styles.input}
                    />
            </View>
                
                <View style={styles.buttons}>
                    <ButtonThemed title="Back" onPress={prevStep} />
                    <ButtonThemed title="Next" onPress={nextStep} disabled={backstory.length<10}/>
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
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        padding: 10,
        textAlignVertical: 'top'
      },
});
export default Backstory;