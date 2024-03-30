
import React, { useState } from 'react';
import { View,Text } from '@/components/Themed';
import { Button,StyleSheet, TextInput } from 'react-native';
interface ToneProps {
    nextStep: () => void;
    prevStep: () => void;
    tone: string;
    setTone: (text: string) => void;
}

const Tone: React.FC<ToneProps> = ({nextStep,prevStep,tone,setTone}) => {
    // Implement your component logic here
    
    return (
        <View style={styles.container}>
            <View style={{width:'100%'}}>
                <Text>Tone of speaking</Text>
                <TextInput
                        placeholder="How would the character talk to you?"
                        editable
                        multiline
                        numberOfLines={6}
                        maxLength={250}
                        onChangeText={text => setTone(text)}
                        value={tone}
                        style={styles.input}
                    />
            </View>
                <View style={styles.buttons}>
                    <Button title="Back" onPress={prevStep} />
                    <Button title="Next" onPress={nextStep} disabled={tone.length<10}/>
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
export default Tone;