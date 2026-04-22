import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SelectionContext } from '../contexts/SelectionContext';

export default function AddProductScreen({ navigation }) {
  const { addProduct } = useContext(SelectionContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAdd = () => {
    if (!title.trim()) {
      Alert.alert('Помилка', 'Введіть назву товару');
      return;
    }
    if (!price.trim() || isNaN(Number(price))) {
      Alert.alert('Помилка', 'Введіть коректну ціну');
      return;
    }

    const newProduct = {
      title: title.trim(),
      description: description.trim() || 'Без опису',
      price: Number(price),
      category: category.trim() || 'інше',
      image: imageUri || 'https://via.placeholder.com/100?text=Немає+зображення',
      rating: {
        rate: rating ? Number(rating) : 0,
        count: 0
      }
    };

    addProduct(newProduct);
    Alert.alert('Успіх', 'Товар додано до списку');
    
    setTitle('');
    setDescription('');
    setPrice('');
    setCategory('');
    setRating('');
    setImageUri(null);
    
    navigation.navigate('Catalog');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.label}>Зображення товару</Text>
      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePlaceholder}>📷 Виберіть зображення</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Назва товару *</Text>
      <TextInput
        style={styles.input}
        placeholder="Наприклад: Ноутбук"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Ціна ($) *</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Категорія</Text>
      <TextInput
        style={styles.input}
        placeholder="Наприклад: Електроніка"
        value={category}
        onChangeText={setCategory}
      />

      <Text style={styles.label}>Рейтинг (0-5)</Text>
      <TextInput
        style={styles.input}
        placeholder="Наприклад: 4.5"
        value={rating}
        onChangeText={setRating}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Опис</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Введіть опис товару"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => navigation.navigate('Catalog')}>
          <Text style={styles.cancelText}>Скасувати</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.submitBtn]} onPress={handleAdd}>
          <Text style={styles.submitText}>Додати товар</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', flex: 1 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 6, color: '#333' },
  imageBox: { borderWidth: 2, borderStyle: 'dashed', borderColor: '#1976D2', borderRadius: 8, padding: 20, alignItems: 'center', marginBottom: 16, backgroundColor: '#f5f5f5' },
  imagePreview: { width: 120, height: 120, borderRadius: 8 },
  imagePlaceholder: { fontSize: 14, color: '#1976D2' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 10, fontSize: 14, marginBottom: 8 },
  textArea: { textAlignVertical: 'top', minHeight: 80 },
  buttonRow: { flexDirection: 'row', marginTop: 20, gap: 10 },
  btn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#eee' },
  submitBtn: { backgroundColor: '#1976D2' },
  cancelText: { color: '#333', fontWeight: '600' },
  submitText: { color: '#fff', fontWeight: '600' }
});
