import React, { useState } from 'react';
import { View,Text } from '@/components/Themed';
import { Button,StyleSheet,Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface PictureProps {
    prevStep: () => void;
    submit: () => void;
    picture: string | null;
    setPicture: (text: string) => void;
}

const Picture: React.FC<PictureProps> = ({prevStep,submit,picture,setPicture}) => {
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,  
          aspect: [1, 1],      
          quality: 1,
        });
    
        if (!result.canceled) {
            setPicture(result.assets[0].uri);
        }
      };
    return (
        <View style={styles.container}>
            <Text>Choose a picture for your character</Text>
            <View>
            <TouchableOpacity onPress={pickImage}>
                <Image
                style={styles.logo}
                source={{
                uri: !picture ? 'https://firebasestorage.googleapis.com/v0/b/test-auth-417304.appspot.com/o/upload.png?alt=media&token=9ca8e0c1-86ea-43aa-ae59-cb4948228757' : picture,
                }}/>
            </TouchableOpacity>
            
            </View>
                <View style={styles.buttons}>
                    <Button title="Back" onPress={prevStep} />
                    <Button title="Next" disabled={!picture} onPress={submit}/>
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
    logo: {
        width: 250,
        height: 250,
        alignSelf: 'center',
        marginVertical: 60,
      },
  });
export default Picture;