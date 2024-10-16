
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../firebaseConfig';


WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:'532472796202-75vmbup0110oj60bff5vatroq13rqjd3.apps.googleusercontent.com',
    webClientId:'532472796202-mi0j8i8k2o4jnld9fdm5hlpd7atuess7.apps.googleusercontent.com'
  });
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => navigation.replace('Todo'))
        .catch(error => Alert.alert('Google Login Failed', error.message));
    }
    if (response?.type === 'error'){
        console.log(response?.error);
    }
  }, [response]);

  const handleEmailLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigation.replace('Todo'))
      .catch(error => Alert.alert('Login Failed', error.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleEmailLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#DB4437' }]} onPress={() => promptAsync()} disabled={!request}>
        <Text style={styles.buttonText}>Login with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  input: { width: '100%', height: 50, marginBottom: 10, padding: 10, borderColor: '#ccc', borderWidth: 1, borderRadius: 8 },
  button: { width: '100%', height: 50, backgroundColor: '#007bff', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginBottom: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  loginText :{fontWeight:'800',fontSize:40,marginBottom:20}
});
