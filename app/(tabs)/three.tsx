import Characters from "@/components/Explore/Characters";
import { View } from "@/components/Themed";
import { SafeAreaView,ScrollView,StyleSheet } from "react-native";
const TabThreeScreen = () => {
 
    return ( 
        <View style={styles.container}>
          <SafeAreaView>  
            <ScrollView>
              <Characters/>
            </ScrollView>
          </SafeAreaView>
        </View>
     );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});

export default TabThreeScreen;