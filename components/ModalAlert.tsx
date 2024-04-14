import { Platform, StyleSheet,Image, ActivityIndicator, TextInput, ScrollView, Pressable, ImageBackground, Modal, Alert } from 'react-native';
import { Text, View, ButtonThemed } from './Themed';

interface ModalAlertProps {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  onPress: () => void;
  title: string;
  message: string;
}
const ModalAlert: React.FC<ModalAlertProps> = ({modalVisible,setModalVisible,onPress,title,message}) => {
    return ( 
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{fontSize:20,fontWeight:'bold'}}>{title}</Text>
            <Text style={{fontSize:17,marginVertical:10,textAlign:'center'}}>{message}</Text>
            <View style={{flexDirection:'row',width:'60%',justifyContent:'space-between'}}>
              <ButtonThemed title='DELETE' color='#D22B2B' onPress={onPress}/>
              <ButtonThemed title='CANCEL' onPress={() => setModalVisible(!modalVisible)}/>
            </View>    
          </View>
        </View>
      </Modal>
     );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    modalView: {
        
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
 });
export default ModalAlert;