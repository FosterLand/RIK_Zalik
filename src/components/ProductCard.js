import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SelectionContext } from '../contexts/SelectionContext';

export default function ProductCard({ product }) {
  const { selected, toggle, deleteProduct } = useContext(SelectionContext);
  const isSelected = selected.some((p) => p.id === product.id);
  const isUserAdded = product.id >= 100;

  const handleDelete = () => {
    Alert.alert(
      'Видалити товар?',
      `Ви впевнені, що хочете видалити "${product.title}"?`,
      [
        { text: 'Скасувати', onPress: () => {}, style: 'cancel' },
        { text: 'Видалити', onPress: () => deleteProduct(product.id), style: 'destructive' }
      ]
    );
  };

  return (
    <View style={[styles.card, isSelected ? styles.selected : null]}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
        <Text style={styles.price}>{product.price} $</Text>
        {product.rating && <Text style={styles.rating}>Рейтинг: {product.rating.rate} ({product.rating.count})</Text>}
        {product.description && <Text style={styles.description} numberOfLines={2}>{product.description}</Text>}
        {product.specs && (
          <View style={styles.specs}>
            {product.specs.capacity && <Text style={styles.specsText}> {product.specs.capacity}</Text>}
            {product.specs.speed_read && <Text style={styles.specsText}>⬆ Читання: {product.specs.speed_read}</Text>}
            {product.specs.speed_write && <Text style={styles.specsText}>⬇ Запис: {product.specs.speed_write}</Text>}
            {product.specs.speed_rpm && <Text style={styles.specsText}> {product.specs.speed_rpm}</Text>}
            {product.specs.buffer && <Text style={styles.specsText}> Буфер: {product.specs.buffer}</Text>}
            {product.specs.type && <Text style={styles.specsText}> {product.specs.type}</Text>}
          </View>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.selectBtn, isSelected ? styles.selectedBtn : null]} onPress={() => toggle(product)}>
          <Text style={[styles.selectText, isSelected ? styles.selectTextSelected : null]}>{isSelected ? 'Видалити' : 'Додати'}</Text>
        </TouchableOpacity>
        {isUserAdded && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteText}></Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 12, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, alignItems: 'center' },
  selected: { borderColor: '#1976D2', borderWidth: 2 },
  image: { width: 80, height: 80, marginRight: 12 },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600' },
  description: { marginTop: 2, color: '#888', fontSize: 11 },
  price: { marginTop: 6, color: '#1976D2', fontWeight: '700' },
  rating: { marginTop: 4, color: '#666', fontSize: 12 },
  specs: { marginTop: 4, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#eee' },
  specsText: { color: '#555', fontSize: 10, marginTop: 2 },
  actions: { gap: 6 },
  selectBtn: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#eee', borderRadius: 6 },
  selectedBtn: { backgroundColor: '#1976D2' },
  selectText: { color: '#000', fontSize: 12 },
  selectTextSelected: { color: '#fff' },
  deleteBtn: { padding: 6, backgroundColor: '#ffebee', borderRadius: 6 },
  deleteText: { fontSize: 14 }
});
