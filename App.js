import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  Animated, Easing, Alert, TextInput, Modal,
  KeyboardAvoidingView, Platform, ImageBackground
} from 'react-native';
import bg from './assets/bg.jpg';

/* ───  RippleButton ─── */
function RippleButton({ onPress, children, style }) {
  const [ripples, setRipples] = useState([]);

  const handlePress = (e) => {
    const { locationX, locationY } = e.nativeEvent;
    const id   = Date.now();
    const anim = new Animated.Value(0);

    setRipples((prev) => [...prev, { id, x: locationX, y: locationY, anim }]);

    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    });

    onPress?.();
  };

  return (
    <Pressable style={[style, { overflow: 'hidden' }]} onPress={handlePress}>
      {children}
      {ripples.map(({ id, x, y, anim }) => {
        const scale   = anim.interpolate({ inputRange:[0,1], outputRange:[0,4] });
        const opacity = anim.interpolate({ inputRange:[0,1], outputRange:[0.3,0] });
        return (
          <Animated.View
            key={id}
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: y - 10, left: x - 20, width: 30, height: 30,
              borderRadius: 20, backgroundColor: '#fc17cb', 
              transform: [{ scale }], opacity,
            }}
          />
        );
      })}
    </Pressable>
  );
}

/* ─── Données initiales ─── */
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

/* ─── Composant principal ─── */
export default function App() {
  const [listeDesTaches, setListeDesTaches] = useState(sampleGoals);
  const [newTask, setNewTask]           = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [draftText, setDraftText]       = useState('');
  const [draftIndex, setDraftIndex]     = useState(null);
  const inputRef = useRef(null);

  /* Delete */
  const handleDelete = (index) => {
    Alert.alert(
      "Supprimer cette tâche ?",
      "VRAIMENT supprimer cette tâche ?",
      [
        { text: "NON", style: "cancel" },
        { text: "OK", onPress: () => {
            setListeDesTaches(listeDesTaches.filter((_, i) => i !== index));
            if (draftIndex === index) { setModalVisible(false); setDraftText(''); setDraftIndex(null); }
        }},
      ]
    );
  };

  /* Edit */
  const handleEdit = (index) => {
    setDraftText(listeDesTaches[index]);
    setDraftIndex(index);
    setModalVisible(true);
  };
  const saveEdit = () => {
    const txt = draftText.trim();
    if (!txt) return;
    const updated = [...listeDesTaches];
    updated[draftIndex] = txt;
    setListeDesTaches(updated);
    setModalVisible(false);
    setDraftText(''); setDraftIndex(null);
  };

  /* Add */
  const handleValidate = () => {
    const txt = newTask.trim();
    if (!txt) return;
    setListeDesTaches([...listeDesTaches, txt]);
    setNewTask('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  /* Render */
  return (
    <ImageBackground source={bg} style={{ flex: 1 }} resizeMode="cover">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={30}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>

            {/* Liste */}
            <FlatList
              data={listeDesTaches}
              keyExtractor={(_, i) => i.toString()}
              style={{ flex: 1 }}
              renderItem={({ item, index }) => (
                <View style={styles.task}>
                  <Text style={styles.taskText}>{item}</Text>
                  <View style={styles.iconRow}>
                    <Pressable onPress={() => handleEdit(index)} style={({pressed})=>pressed&&styles.pressed}>
                      <Text style={styles.iconEdit}>✏️</Text>
                    </Pressable>
                    <View style={{ width: 24 }} />
                    <Pressable onPress={() => handleDelete(index)} style={({pressed})=>pressed&&styles.pressed}>
                      <Text style={styles.iconDelete}>❌</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            />

            {/* Ajout */}
            <View style={styles.addRow}>
              <TextInput
                ref={inputRef}
                value={newTask}
                onChangeText={setNewTask}
                style={styles.input}
                placeholder="Nouvel objectif…"
                returnKeyType="done"
                onSubmitEditing={handleValidate}
              />

              {/* ← RippleButton ici */}
              <RippleButton style={styles.addButton} onPress={handleValidate}>
                <Text style={styles.addButtonText}>Ajouter</Text>
              </RippleButton>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Modale d’édition */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalWrap}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Modifier l’objectif</Text>
            <TextInput
              autoFocus
              value={draftText}
              onChangeText={setDraftText}
              style={styles.modalInput}
            />
            <View style={styles.modalButtons}>
              <RippleButton style={styles.btnSave} onPress={saveEdit}>
                <Text style={styles.btnText}>Enregistrer</Text>
              </RippleButton>
              <RippleButton style={styles.btnCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Annuler</Text>
              </RippleButton>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

/* ─── Styles ─── */
const styles = StyleSheet.create({
  overlay:{ flex:1, backgroundColor:'rgba(0,0,0,0.3)' },
  container:{ flex:1, padding:16, paddingTop:50, paddingBottom:30 },
  pressed:{ opacity:0.5 },

  task:{
    flexDirection:'row', alignItems:'center',
    backgroundColor:'#fff', borderRadius:10,
    marginBottom:12, padding:14, justifyContent:'space-between', elevation:3,
  },
  taskText:{ fontSize:16, fontWeight:'bold', flex:1, marginRight:10 },
  iconRow:{ flexDirection:'row', alignItems:'center' },
  iconEdit:{ fontSize:26, color:'#f9b234' },
  iconDelete:{ fontSize:26, color:'red', fontWeight:'bold' },

  addRow:{
    flexDirection:'row', alignItems:'center',
    backgroundColor:'#fff', borderRadius:8,
    paddingHorizontal:10, paddingVertical:10, marginTop:10,
  },
  input:{
    flex:1, borderWidth:1, borderColor:'#eee', borderRadius:8,
    paddingHorizontal:10, paddingVertical:8, fontSize:16, marginRight:10, backgroundColor:'#fafafa',
  },
  addButton:{
    backgroundColor:'#17bffc', borderRadius:20,
    paddingVertical:20, paddingHorizontal:32, justifyContent:'center', alignItems:'center',
    overflow:'hidden',   // pour clipper le ripple
  },
  addButtonText:{ color:'#fff', fontSize:16, fontWeight:'bold' },

  /* Modale */
  modalWrap:{ flex:1, backgroundColor:'rgba(0,0,0,0.45)', justifyContent:'center', alignItems:'center' },
  modalBox:{ width:'85%', backgroundColor:'#fff', borderRadius:14, padding:20, elevation:6 },
  modalTitle:{ fontSize:18, fontWeight:'bold', marginBottom:12, textAlign:'center' },
  modalInput:{
    borderWidth:1, borderColor:'#ccc', borderRadius:8,
    paddingHorizontal:10, paddingVertical:8, fontSize:16, marginBottom:18,
  },
  modalButtons:{ flexDirection:'row', justifyContent:'space-between' },
  btnSave:{ backgroundColor:'#0ca678', borderRadius:8, flex:1, marginRight:6, paddingVertical:10, alignItems:'center' },
  btnCancel:{ backgroundColor:'#999', borderRadius:8, flex:1, marginLeft:6, paddingVertical:10, alignItems:'center' },
  btnText:{ color:'#fff', fontWeight:'bold' },
});