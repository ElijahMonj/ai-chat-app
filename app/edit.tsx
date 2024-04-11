import { View,Text,ButtonThemed } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";
import {useColorScheme} from '@/components/useColorScheme';
import { Platform, StyleSheet,Image, ActivityIndicator, TextInput, ScrollView, Pressable } from 'react-native';
import { Formik } from 'formik';
import { Link,router } from "expo-router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "@/FirebaseConfig";
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const Edit = () => {
    const nav = useNavigation();
    const theme = useColorScheme() ?? 'light';
    const inputTextColor= theme === 'light' ? '#000' : '#fff';
    const params = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [character,setCharacter] = useState<any|null>(null);
    useEffect(() => {
      nav.setOptions({
        headerRight: () => (
          <Pressable onPress={() => {console.log("Delete")}}>
            {({ pressed }) => (
              <MaterialIcons
                name="delete-outline"
                size={25}
                color={Colors[useColorScheme() ?? 'light'].text}
                style={{ marginRight: Platform.OS ==='web' ? 15 : 0, opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        ),
      });
    }, []);
    useEffect(() => {     
        const fetchData = async () => {
          const docSnap = await getDoc(doc(FIREBASE_DB, 'bots',params.id as string));
          if (docSnap.exists()) {
            if(docSnap.data().custom){
                setCharacter(docSnap.data());
            }else{
                router.replace('/characters');
            }
          } else {
            console.log("No such document!");
          }
        };
        fetchData(); 
      }, []);
    return ( 
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          
            {!character ?
            <View style={[styles.containerLoading, styles.horizontal]}>
                <ActivityIndicator size="large" color="#28bc64"/>
            </View>
            :
            <Formik
              initialValues={{ 
                avatar: character.avatar as string,
                name: character.name as string,
                description: character.description as string,
                tone: character.tone as string,
                backstory: character.backstory as string,
               }}
              onSubmit={values => console.log(values)}>
              {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View style={styles.form}>
                  <View style={{flexDirection:"row",width:'100%',gap:20,justifyContent:'space-around',flexGrow:1}}>
                    <Image source={{
                    uri: character.avatar as string,
                    }} style={styles.avatar} />

                    <View style={{width:'50%',alignSelf:'center'}}>
                      <Text>Name</Text>
                      <TextInput
                      style={[styles.input,{color:inputTextColor}]}
                      placeholder="Enter name of your character"
                      placeholderTextColor="#A6A7AF"
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                      />
                    </View>
                  </View>
                  <View style={{width:'100%'}}>
                    <Text>Description</Text>
                    <TextInput
                            editable
                            placeholderTextColor="#A6A7AF"
                            placeholder="How would the character describe themselves?"
                            multiline
                            numberOfLines={4}
                            maxLength={250}
                            onChangeText={handleChange('description')}
                            value={values.description}
                            style={[styles.inputBig,{color:inputTextColor}]}
                        />
                    </View>
                    <View style={{width:'100%'}}>
                    <Text>Backstory</Text>
                    <TextInput
                            editable
                            placeholderTextColor="#A6A7AF"
                            placeholder="What is the character's backstory?"
                            multiline
                            numberOfLines={4}
                            maxLength={250}
                            onChangeText={handleChange('backstory')}
                            value={values.backstory}
                            style={[styles.inputBig,{color:inputTextColor}]}
                        />
                    </View>
                    <View style={{width:'100%'}}>
                    <Text>Tone of Speaking</Text>
                    <TextInput
                            editable
                            placeholderTextColor="#A6A7AF"
                            placeholder="How would the character talk to you?"
                            multiline
                            numberOfLines={4}
                            maxLength={250}
                            onChangeText={handleChange('tone')}
                            value={values.tone}
                            style={[styles.inputBig,{color:inputTextColor}]}
                        />
                    </View>
                    
                    <ButtonThemed onPress={handleSubmit} title="Submit" width="100%"/>

              </View>
            )}
            </Formik>
            }
           
        </View>
        </ScrollView>
    );
}
 
const styles = StyleSheet.create({
    containerLoading:{
        flex: 1,
        justifyContent: 'center',
      },
      horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
      },
      
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      
    },
    form:{
      width: '80%',
      maxWidth: 400,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    avatar:{
      width: 130,
      height: 130,
      borderRadius: 65,
      marginBottom: 10,
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
    inputBig:{
      width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        padding: 10,
        textAlignVertical: 'top'
    }
  });
  
export default Edit;