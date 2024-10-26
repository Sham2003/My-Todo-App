import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, 
  Animated 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from '../UserContext';



export default function TodoScreen({ navigation }) {
  const [task, setText] = useState('');
  const fadeAnim = new Animated.Value(1);
  const [todos, setTodos] = useState([]);

  const { 
    todoQuery, insertTodo, toggleTodo, deleteTodo,user 
  } = useUser();


  const fetchTodos = async () => {
    try {
      const data = await todoQuery();
      setTodos(data.todos);
      console.log("Fetched todos");
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (task.trim()) {
      try {
        
        await insertTodo({ variables: { task:task, uid: user.uid } });
        fetchTodos();
      } catch (error) {

        console.error('Error adding todo:', error);
      }
    }
    setText('');
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      await toggleTodo({variables:{id, completed: !completed}}); 
      await fetchTodos();
    } catch (error) {
      console.error('Error toggling todo status:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo({variables:{id}});
      await fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
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
        value={task}
        onChangeText={(text) => setText(text)}
      />
      <Button title="Add Todo" onPress={addTodo} />

      
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.todoItem}>
              <Text style={item.completed ? styles.completedText : styles.todoText}>
                {item.task}
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
