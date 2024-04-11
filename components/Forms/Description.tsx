
import React, { useState } from 'react';
import { View,Text, ButtonThemed } from '@/components/Themed';
import { Button,StyleSheet, TextInput } from 'react-native';
import {useColorScheme} from '@/components/useColorScheme';
interface DescriptionProps {
    nextStep: () => void;
    prevStep: () => void;
    description: string;
    setDescription: (text: string) => void;
}

const Description: React.FC<DescriptionProps> = ({nextStep,prevStep,setDescription,description}) => {
    // Implement your component logic here
    const theme = useColorScheme() ?? 'light';
    const inputTextColor= theme === 'light' ? '#000' : '#fff';
    return ( 
        <View style={styles.container}>
            <View style={{width:'100%'}}>
                <Text>Description</Text>
                <TextInput
                        editable
                        placeholderTextColor="#A6A7AF"
                        placeholder="How would the character describe themselves?"
                        multiline
                        numberOfLines={6}
                        maxLength={250}
                        onChangeText={text => setDescription(text)}
                        value={description}
                        style={[styles.input,{color:inputTextColor}]}
                    />
            </View>
                
                <View style={styles.buttons}>
                    <ButtonThemed title="Back" onPress={prevStep} />
                    <ButtonThemed title="Next" onPress={nextStep} disabled={description.length<10}/>
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