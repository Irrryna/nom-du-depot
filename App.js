import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  Pressable, Alert, TextInput, Button,
  KeyboardAvoidingView, Platform
} from 'react-native';

const sampleGoals = [
  "Faire les courses",
  "Aller à la salle de sport 3 fois par semaine",
  "Monter à plus de 5000m d'altitude",
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
  const [editIndex, setEditIndex] = useState(null);   // <- index en cours d’édition
  const inputRef = useRef(null);                      // <- pour focus()

  /* ─────────────  SUPPRESSION  ───────────── */
  const handleDelete = (index) => {
    Alert.alert(
      "Supprimer cette tâche ?",
      "Êtes-vous sûr de vouloir supprimer cette tâche ?",
      [
        { text: "Non", style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            setListeDesTaches(listeDesTaches.filter((_, i) => i !== index));
            // si on supprimait la tâche en cours d’édition
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
    setNewTask(listeDesTaches[index]); // pré-remplit le champ
    setEditIndex(index);
    // petit délai pour laisser le clavier apparaître puis focus
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  /* ─────────────  AJOUT / MODIFICATION  ───────────── */
  const handleValidate = () => {
    const txt = newTask.trim();
    if (txt === '') return;

    if (editIndex !== null) {
      // --- on MODIFIE la tâche ---
      const updated = [...listeDesTaches];
      updated[editIndex] = txt;
      setListeDesTaches(updated);
      setEditIndex(null);
    } else {
      // --- on AJOUTE une nouvelle tâche ---
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
