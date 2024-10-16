import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Share, StyleSheet, Alert, ScrollView,TouchableOpacity } from 'react-native';
import { useQuery, useMutation, gql } from '@apollo/client';
import { auth } from '../firebaseConfig';
import client from '../apolloClient'; 
import { Ionicons, MaterialCommunityIcons ,MaterialIcons} from '@expo/vector-icons';
import { signOut } from '@react-native-firebase/auth';
const GET_PROFILE = gql`
    query GetUserProfile($uid: String!) {
        app_users(where : {uid : {_eq : $uid}}){
            uid
            name
            number
            email
            referral_code
        }
    }
`;

const UPDATE_PROFILE = gql`
    mutation UpdateUserProfile($uid: String!, $name: String, $number: String) {
        update_app_users(
        where : {uid : {_eq : $uid}}
        _set: { name: $name, number: $number })
        {
            affected_rows
        }
    }
`;

const GET_NUMBER_OF_REFERRERS = gql`
  query GetNumberOfReferrers($referral_code: String!) {
    app_users_aggregate(where: { referrer: { _eq: $referral_code } }) {
      aggregate {
        count
      }
    }
  }
`;

const handleApollo = (error) =>{
  console.log("ERROR AP:",error);
};
const ProfileScreen = ({ navigation }) => {
  const [user,setUser] = useState(auth);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [memail, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [logout,setLogout] = useState(false);

  const handleLogout = async () => {
    setLogout(true);
  };

  

  const { data, loading, error ,refetch} = useQuery(GET_PROFILE, {
    variables: { uid: user.uid },
    client,
    skip: !user,
    onError: handleApollo
  });

  const { data: referrerData, refetch: refetchReferrers } = useQuery(
    GET_NUMBER_OF_REFERRERS,
    {
      variables: { referral_code: referralCode },
      client,
      skip: !user,
      onError: handleApollo
    }
  );

  const [updateProfile] = useMutation(UPDATE_PROFILE,{client});

  useEffect(() => {
    const logoutUser = async () => {
        if (logout) {
            Alert.alert("Logout", "You have logged out successfully");
            
            navigation.replace('Main');
        }
    };

    logoutUser();
  }, [logout]);

  useEffect(() => {
    if(!loading && !error){
      if(data.app_users && data.app_users.length > 0){
          const {name,number,email,referral_code} = data.app_users[0];
          setName(name);
          setNumber(number);
          setReferralCode(referral_code);
          setEmail(email);
          refetch();
      }
   }
  },[data,loading,error]);

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setUser(user); 
        } else {
          setUser(null); 
          console.log('Null user');
          navigation.replace('Login');
        }
      });
    
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (referrerData) {
      setReferralCount(referrerData.app_users_aggregate.aggregate.count);
      refetchReferrers();
    }
  }, [referrerData]);

  const handleSave = async () => {
    try {
      if(user){
        const d  = await updateProfile({ variables: { uid: user.uid, name:name, number: number } });
        Alert.alert('Success', 'Profile updated successfully!');
      }else{
        Alert.alert('Error', 'Failed to update profile.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const handleShareReferral = async() => {
    try {
      const result = await Share.share({
        message: `Join this awesome app using my referral code: ${referralCode}`,
      });
  
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          Alert.alert('Shared Successfully!');
        }
      } else if (result.action === Share.dismissedAction) {
        Alert.alert('Sharing dismissed.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share referral code.');
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MaterialIcons
          name="logout"
          size={24}
          color="black"
          style={{ marginRight: 16 }}
          onPress={handleLogout}
        />
      ),
    });
  }, [navigation]);

  if (!user) {
    // If user is null, show loading or fallback UI
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Profile</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
          <MaterialIcons name="logout" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <Ionicons name="person-circle-outline" size={70} color="#007bff" style={styles.icon} />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput 
          style={styles.input} 
          value={name} 
          onChangeText={setName} 
          placeholder="Enter your name" 
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Number</Text>
        <TextInput 
          style={styles.input} 
          value={number} 
          onChangeText={setNumber} 
          keyboardType="numeric" 
          placeholder="Enter your number" 
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          value={memail} 
          editable={false} 
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Referral Code</Text>
        <TextInput 
          style={styles.input} 
          value={referralCode} 
          editable={false} 
        />
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={handleShareReferral}>
        <MaterialCommunityIcons name="share-variant" size={24} color="#fff" />
        <Text style={styles.shareButtonText}>Share Referral Code</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Number of Referrals: {referralCount}</Text>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Todo')}>
        <Text style={styles.backButtonText}>Back to Todos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginTop: 30
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 16,
    width:'100%'
  },
  logoutIcon: {
    position:'absolute',
    right:'1%',
    top:'1'
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 7,
    color: '#333',
    paddingLeft:10
  },
  icon: {
    marginBottom: 0,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    marginTop: 12
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    marginTop: 15,
  },
  backButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default ProfileScreen;
