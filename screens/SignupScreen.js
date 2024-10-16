
import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import client from '../apolloClient';
const ADD_USER = gql`
  mutation InsertAppUsers($name: String, $number: String, $uid: String, $referrer: String, $email: String) {
    insert_app_users(objects: { name: $name, number: $number, uid: $uid, referrer: $referrer ,email: $email}) {
      affected_rows
    }
  }
`;

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [referrer, setReferrer] = useState(null);
  const [addUser] = useMutation(ADD_USER,{client});

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      await addUser({
        variables: { uid: user.uid, name, number, referrer ,email},
      });
      Alert.alert('Account Created', 'You can now log in!');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
        <Text style={styles.loginText}>Sign Up</Text>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Phone Number" value={number} onChangeText={setNumber} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Referrer (optional)" value={referrer} onChangeText={setReferrer} />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  input: { width: '100%', height: 50, marginBottom: 10, padding: 10, borderColor: '#ccc', borderWidth: 1, borderRadius: 8 },
  button: { width: '100%', height: 50, backgroundColor: '#007bff', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  loginText :{fontWeight:'800',fontSize:40,marginBottom:20}
});
