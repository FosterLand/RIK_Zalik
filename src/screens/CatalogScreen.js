import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import ProductCard from '../components/ProductCard';
import { SelectionContext } from '../contexts/SelectionContext';
import products from '../data/products';

export default function CatalogScreen({ navigation }) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selected, products: userProducts } = useContext(SelectionContext);

  useEffect(() => {
    setAllProducts(products);
    setLoading(false);
  }, []);

  const displayProducts = [...allProducts, ...userProducts];

  const onCompare = () => { navigation.navigate('Compare'); };
  const onAddProduct = () => { navigation.navigate('AddProduct'); };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <>
          <FlatList
            data={displayProducts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ProductCard product={item} />}
            contentContainerStyle={{ padding: 16 }}
          />
          <View style={styles.footer}>
            <TouchableOpacity style={styles.addButton} onPress={onAddProduct}>
              <Text style={styles.addButtonText}>+ Додати товар</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.compareButton, selected.length < 2 ? styles.disabled : null]}
              disabled={selected.length < 2}
              onPress={onCompare}
            >
              <Text style={styles.compareText}>Порівняти ({selected.length})</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  footer: { padding: 16, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff', gap: 10 },
  addButton: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: '600' },
  compareButton: { backgroundColor: '#1976D2', padding: 14, borderRadius: 8, alignItems: 'center' },
  compareText: { color: '#fff', fontWeight: '600' },
  disabled: { backgroundColor: '#9E9E9E' },
});
