
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Image } from 'react-native';
export default function MainScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My To-Do App</Text>
      <Image style={styles.image} source={require('../assets/todo.png')} />
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  image: { width: 100, height: 100, marginBottom: 20 },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
