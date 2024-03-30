
import React, { useState } from 'react';
import { View,Text } from '@/components/Themed';
import { Button,StyleSheet, TextInput } from 'react-native';
interface DescriptionProps {
    nextStep: () => void;
    prevStep: () => void;
    description: string;
    setDescription: (text: string) => void;
}

const Description: React.FC<DescriptionProps> = ({nextStep,prevStep,setDescription,description}) => {
    // Implement your component logic here
    
    return ( 
        <View style={styles.container}>
            <View style={{width:'100%'}}>
                <Text>Description</Text>
                <TextInput
                        editable
                        placeholder="How would the character describe themselves?"
                        multiline
                        numberOfLines={6}
                        maxLength={250}
                        onChangeText={text => setDescription(text)}
                        value={description}
                        style={styles.input}
                    />
            </View>
                
                <View style={styles.buttons}>
                    <Button title="Back" onPress={prevStep} />
                    <Button title="Next" onPress={nextStep} disabled={description.length<10}/>
                </View>  
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
       
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
export default Description;