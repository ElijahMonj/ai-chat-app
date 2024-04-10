import Characters from "@/components/Explore/Characters";
import { View } from "@/components/Themed";
import { SafeAreaView,ScrollView,StyleSheet } from "react-native";
const TabThreeScreen = () => {
 
    return ( 
        <View style={styles.container}>
           
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <Characters/>
            </ScrollView>
          
        </View>
     );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TabThreeScreen;