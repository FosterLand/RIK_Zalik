import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SelectionContext } from '../contexts/SelectionContext';
import CompareTable from '../components/CompareTable';

export default function CompareScreen({ navigation }) {
  const { selected } = useContext(SelectionContext);

  if (!selected || selected.length === 0) {
    return (
      <View style={styles.empty}>
        <Text>Немає обраних товарів. Поверніться до каталогу.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Catalog')} style={styles.backBtn}>
          <Text style={styles.backText}>До каталогу</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.header}>Порівняння товарів</Text>
      <CompareTable products={selected} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', flex: 1 },
  header: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backBtn: { marginTop: 12, padding: 10, backgroundColor: '#1976D2', borderRadius: 8 },
  backText: { color: '#fff' },
});
