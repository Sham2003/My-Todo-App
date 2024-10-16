import React, { useState ,useEffect} from 'react';
import { 
  View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Animated, 
  Alert
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { gql,useMutation, useQuery } from '@apollo/client';
import client from '../apolloClient'; 
import Icon from 'react-native-vector-icons/MaterialIcons';

const GET_TODOS = gql`
  query GetTodos($uid: String) {
    todos (where :{uid:{_eq :$uid}}){
      completed
      text
      uid
      created_at
      updated_at
      id
    }
  }
`;

const INSERT_TODO = gql`
  mutation InsertTodo($text: String!, $uid: String!) {
    insert_todos_one(object: { text: $text, uid: $uid, completed: false }) {
      id
      text
      completed
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation ToggleTodoStatus($id: uuid!, $completed: Boolean!) {
    update_todos_by_pk(pk_columns: { id: $id }, _set: { completed: $completed }) {
      id
      completed
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: uuid!) {
    delete_todos_by_pk(id: $id) {
      id
    }
  }
`;

export default function TodoScreen({ navigation }) {
  const [text, setText] = useState('');
  const fadeAnim = new Animated.Value(1);
  const [uid,setUid] = useState('');

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigation.replace('Login'))
      .catch((error) => console.error('Logout Failed:', error));
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        //console.log("USER ID:",user.uid);
        setUid(user.uid); 
      } else {
        setUid(''); 
      }
    });
    if (loading){
      console.log("LOADING");
    }
    if (error){
      console.log("ERROR");
    }
    return () => unsubscribe();

  }, []);

  const { data, loading, error, refetch } = useQuery(GET_TODOS, {
    variables: { uid },
    client,
    skip: !uid, 
  });

  const [insertTodo] = useMutation(INSERT_TODO, { client });
  const [toggleTodo] = useMutation(TOGGLE_TODO, { client });
  const [deleteTodo] = useMutation(DELETE_TODO, { client });

  const addTodo = async () => {
    if (text.trim()) {
      await insertTodo({
        variables: { text, uid },
      });
      setText('');
      refetch(); 
    }
  };

  const handleToggleComplete = async (id, completed) => {
    await toggleTodo({
      variables: { id, completed: !completed },
    });
    refetch();
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodo({
      variables: { id },
    });
    refetch();
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Todos</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="account-circle" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Add a new task"
        value={text}
        onChangeText={setText}
      />
      <Button title="Add Todo" onPress={addTodo} />

      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error loading todos.</Text>
      ) : (
        <FlatList
          data={data?.todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Animated.View style={{ opacity: fadeAnim }}>
              <View style={styles.todoItem}>
                <Text style={item.completed ? styles.completedText : styles.todoText}>
                  {item.text}
                </Text>
                <TouchableOpacity onPress={() => handleToggleComplete(item.id, item.completed)}>
                  <Text style={styles.completeButton}>
                    {item.completed ? 'Undo' : 'Complete'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteTodo(item.id)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  todoText: {
    fontSize: 18,
  },
  completedText: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: '#999',
  },
  completeButton: {
    color: 'green',
  },
  deleteButton: {
    color: 'red',
  },
});
