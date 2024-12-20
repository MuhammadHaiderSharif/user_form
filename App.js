import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Button,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const storeUserData = async (userList) => {
    try {
      await AsyncStorage.setItem('users', JSON.stringify(userList));
    } catch (error) {
      console.log('Error saving users:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.log('Error loading users:', error);
    }
  };

  const addNewUser = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const newUser = { id: Date.now(), name, email };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    storeUserData(updatedUsers); 

    setName('');
    setEmail('');
    Alert.alert('Success', 'User added successfully');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Form</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Button title="Submit" onPress={addNewUser}  style={styles.button}/>

      <FlatList
        data={users || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userText}>
              Name: {item.name}, Email: {item.email}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No users found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  emptyText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center', 
    marginTop: 20, 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: 14,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  userItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userText: {
    fontSize: 16,
    color: '#333',
  },
});

export default App;
