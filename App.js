import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  Pressable, Alert, TextInput, Button,
  KeyboardAvoidingView, Platform
} from 'react-native';

const sampleGoals = [
  "Faire les courses",
  "Aller à la salle de sport 3 fois par semaine",
  "Acheter mon premier appartement",
  "Perdre 5 kgs",
  "Gagner en productivité",
  "Apprendre un nouveau langage",
  "Faire une mission en freelance",
  "Organiser un meetup autour de la tech",
  "Faire un triathlon",
];

export default function App() {
  const [listeDesTaches, setListeDesTaches] = useState(sampleGoals);
  const [newTask, setNewTask] = useState('');
  const [editIndex, setEditIndex] = useState(null);   // <- index mode édition
  const inputRef = useRef(null);                      // <- focus input

  /* ─────────────  DELETE  ───────────── */
  const handleDelete = (index) => {
    Alert.alert(
      "Supprimer cette tâche ?",
      "Vraiment supprimer cette tâche ?",
      [
        { text: "NO", style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            setListeDesTaches(listeDesTaches.filter((_, i) => i !== index));
            // suppression pendant l'édition
            if (editIndex === index) {
              setEditIndex(null);
              setNewTask('');
            }
          },
        },
      ]
    );
  };

  /* ─────────────  MISE EN ÉDITION  ───────────── */
  const handleEdit = (index) => {
    setNewTask(listeDesTaches[index]); // <- chargement de tâche à modifier
    setEditIndex(index);
    //  timeout pour champs de saisi puis focus
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  /* ─────────────  AJOUT / MODIF  ───────────── */
  const handleValidate = () => {
    const txt = newTask.trim();
    if (txt === '') return;

    if (editIndex !== null) {
      // ---  MODIF ---
      const updated = [...listeDesTaches];
      updated[editIndex] = txt;
      setListeDesTaches(updated);
      setEditIndex(null);
    } else {
      // --- ADD NEW TASK ---
      setListeDesTaches([...listeDesTaches, txt]);
    }
    setNewTask('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={30}
    >
      <View style={styles.container}>

        {/* ─────────  LISTE  ───────── */}
        <FlatList
          data={listeDesTaches}
          keyExtractor={(_, index) => index.toString()}
          style={{ flex: 1 }}
          renderItem={({ item, index }) => (
            <View style={styles.task}>
              <Text style={styles.taskText}>{item}</Text>

              <View style={styles.iconRow}>
                {/* EDIT */}
                <Pressable
                  onPress={() => handleEdit(index)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                >
                  <Text style={styles.iconEdit}>✏️</Text>
                </Pressable>

                <View style={{ width: 24 }} />

                {/* DELETE */}
                <Pressable
                  onPress={() => handleDelete(index)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                >
                  <Text style={styles.iconDelete}>❌</Text>
                </Pressable>
              </View>
            </View>
          )}
        />

        {/* ─────────  BARRE D’AJOUT / MODIF  ───────── */}
        <View style={styles.addRow}>
          <TextInput
            ref={inputRef}
            value={newTask}
            onChangeText={setNewTask}
            style={styles.input}
            placeholder="Ajoutez ou modifiez une tâche"
            returnKeyType="done"
            onSubmitEditing={handleValidate}
          />
          <Button
            title={editIndex !== null ? "Modifier" : "Ajouter"}
            onPress={handleValidate}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ─────────────────────  STYLES  ───────────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16, paddingTop: 50, paddingBottom: 30,
  },
  task: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 10,
    marginBottom: 12, padding: 14,
    justifyContent: 'space-between',
    elevation: 2, shadowColor: '#000',
    shadowOpacity: 0.08, shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  taskText: { fontSize: 16, fontWeight: 'bold', flex: 1, flexWrap: 'wrap', marginRight: 10 },
  iconRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  iconEdit: { fontSize: 26, color: '#f9b234' },
  iconDelete: { fontSize: 26, color: 'red', fontWeight: 'bold' },

  addRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 10,
    marginTop: 10, marginBottom: 18,
  },
  input: {
    flex: 1,
    borderWidth: 1, borderColor: "#eee", borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 8,
    fontSize: 16, marginRight: 10, backgroundColor: "#fafafa",
  },
});
