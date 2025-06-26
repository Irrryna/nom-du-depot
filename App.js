import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Button, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    padding: 16,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // Pour Android
    width: '100%',
  },
  taskText: {
    fontSize: 18,
    flex: 1,
    color: '#222',
  },
  icon: {
    fontSize: 22,
    marginLeft: 12,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  button: {
    width: '100%',
  },
});

const App = () => {
  const [listeDesTaches, setListeDesTaches] = useState([
    "Étudier le code",
    "Aller courir",
    "Faire les courses"
  ]);
  const [newTask, setNewTask] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {listeDesTaches.map((tache, index) => (
        <View style={styles.task} key={index}>
          <Text style={styles.taskText}>{tache}</Text>
          <Text style={styles.icon}>✏️</Text>
          <Text style={styles.icon}>🗑️</Text>
        </View>
      ))}

      <TextInput
        value={newTask}
        onChangeText={setNewTask}
        style={styles.input}
        placeholder="Ajoutez une tâche"
      />
      <View style={styles.button}>
        <Button
          title="Ajouter une tâche"
          onPress={() => {
            if (newTask.trim() !== "") {
              setListeDesTaches([...listeDesTaches, newTask]);
              setNewTask("");
            }
          }}
        />
      </View>
    </ScrollView>
  );
};

export default App;
