import React from 'react';
import { StyleSheet } from 'react-native';
import { Text,View } from '../Themed';
const EmptyConversation: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Chats are empty</Text>
      <Text style={styles.subText}>Create your own character or explore our characters</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default EmptyConversation;