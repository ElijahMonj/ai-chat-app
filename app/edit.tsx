import { View,Text,ButtonThemed } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";

const Edit = () => {
    const params = useLocalSearchParams();
    return ( 
        <View>
            <Text>Edit {params.id}</Text>
        </View>
    );
}
 
export default Edit;