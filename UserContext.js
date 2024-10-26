// UserContext.js
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import * as Q from './SQL/QUERIES';
import { createApolloClient } from './apolloClient';
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useMutation} from '@apollo/client';

const UserContext = createContext();


export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState('');
  const [client, setClient] = useState(createApolloClient(''));
  

  
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const token = await currentUser.getIdToken();
        //console.log("User changed => ",token);
        setAuthToken(token);
      } else {
        setUser(null);
        setAuthToken('');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authToken) {
      const newClient = createApolloClient(authToken);
      //console.log("Apollo client changed")
      setClient(newClient);
    }
  }, [authToken]);

  //const todoQuery = useQuery(Q.GET_TODOS, { client });

  const todoQuery = async () => {
    try {
      const { data } = await client.query({
        query: Q.GET_TODOS,
        fetchPolicy: 'network-only', 
        variables: { uid : user.uid}
      });
      return data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  };

  const profileQuery = async () => {
    try {
      const { data } = await client.query({
        query: Q.GET_PROFILE,
        fetchPolicy: 'network-only', 
        variables: { uid : user.uid}
      });
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // const referralCountQuery = async (ref_code) => {
  //   try {
  //     const { data } = await client.query({
  //       query: Q.GET_NUMBER_OF_REFERRERS,
  //       fetchPolicy: 'network-only', 
  //       variables: { referral_code: ref_code}
  //     });
  //     return data;
  //   } catch (error) {
  //     console.error('Error fetching referral count:', error);
  //     throw error;
  //   }
  // }


  const [insertTodo] = useMutation(Q.INSERT_TODO, { client });
  const [toggleTodo] = useMutation(Q.TOGGLE_TODO, { client });
  const [deleteTodo] = useMutation(Q.DELETE_TODO, { client });
  //const profileData = useQuery(Q.GET_PROFILE, { client });
  const [updateProfile] = useMutation(Q.UPDATE_PROFILE, { client });
  const [addUser] = useMutation(Q.ADD_USER, { client });
  //const referralCount = useQuery(Q.GET_NUMBER_OF_REFERRERS, { client });

  const createUser = async (email,password,name,number,referrer) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      await addUser({
        variables: { uid: user.uid, name, number, referrer ,email},
      });
  }

  const value = useMemo(
    () => {
        return {
            user,
            client,
            logout: async () => {
              await auth.signOut();
              setUser(null);
              setAuthToken('');
            },
            todoQuery,
            insertTodo,
            toggleTodo,
            deleteTodo,
            profileQuery,
            updateProfile,
            addUser,
            //referralCountQuery,
            createUser
          }
    },
    [user, client]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
