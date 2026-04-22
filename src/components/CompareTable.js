import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const get = (obj, path) => path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);

// Функция для преобразования значения спецификации в число для сравнения
const parseSpecValue = (value, specKey) => {
  if (!value || value === '—') return 0;
  
  if (specKey === 'capacity') {
    // Конвертуємо "1TB", "500GB", "2TB" в байти
    const num = parseFloat(value);
    if (value.includes('TB')) return num * 1000; // 1TB = 1000 условных единиц
    if (value.includes('GB')) return num;
    return num;
  }
  
  // Для скорости, RPM, буфера - извлекаем число
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

export default function CompareTable({ products }) {
  const numericKeys = [
    { key: 'price', label: 'Ціна', better: 'lower' },
    { key: 'rating.rate', label: 'Рейтинг', better: 'higher' },
    { key: 'rating.count', label: 'Відгуків', better: 'higher' },
  ];

  // Ключи спецификаций для подсвечивания
  const specKeys = [
    { key: 'capacity', label: 'Ємність', better: 'higher' },
    { key: 'speed_read', label: 'Швид. читання', better: 'higher' },
    { key: 'speed_write', label: 'Швид. запису', better: 'higher' },
    { key: 'speed_rpm', label: 'Обертання', better: 'higher' },
    { key: 'buffer', label: 'Буфер', better: 'higher' },
  ];

  const best = useMemo(() => {
    const res = {};
    numericKeys.forEach((k) => {
      const vals = products.map((p) => Number(get(p, k.key) ?? 0));
      res[k.key] = k.better === 'lower' ? Math.min(...vals) : Math.max(...vals);
    });
    
    // Добавляємо лучші значення для спецификацій
    specKeys.forEach((k) => {
      const vals = products.map((p) => parseSpecValue(get(p, `specs.${k.key}`), k.key));
      res[`specs.${k.key}`] = k.better === 'lower' ? Math.min(...vals.filter(v => v > 0)) : Math.max(...vals);
    });
    
    return res;
  }, [products]);

  const isBestSpec = (productId, specKey) => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.specs) return false;
    const value = parseSpecValue(get(product, `specs.${specKey}`), specKey);
    return value > 0 && value === best[`specs.${specKey}`];
  };

  return (
    <View>
      <View style={styles.topRow}>
        <View style={[styles.cell, styles.attrCell]}><Text style={{fontWeight:'700'}}>Атрибут</Text></View>
        {products.map((p) => (
          <View key={p.id} style={[styles.cell, styles.productCell]}>
            <Image source={{ uri: p.image }} style={styles.thumb} resizeMode="contain" />
            <Text numberOfLines={2} style={styles.title}>{p.title}</Text>
          </View>
        ))}
      </View>

      {numericKeys.map((k) => (
        <View key={k.key} style={styles.row}>
          <View style={[styles.cell, styles.attrCell]}><Text>{k.label}</Text></View>
          {products.map((p) => {
            const val = get(p, k.key);
            const isBest = Number(val) === Number(best[k.key]);
            return (
              <View key={p.id} style={[styles.cell, styles.productCell, isBest ? styles.bestCell : null]}>
                <Text style={isBest ? styles.bestText : null}>
                  {k.key === 'price' ? `${val} $` : val}
                </Text>
              </View>
            );
          })}
        </View>
      ))}

      <View style={styles.row}>
        <View style={[styles.cell, styles.attrCell]}><Text>Категорія</Text></View>
        {products.map((p) => (
          <View key={p.id} style={[styles.cell, styles.productCell]}>
            <Text>{p.category}</Text>
          </View>
        ))}
      </View>

      <View style={styles.row}>
        <View style={[styles.cell, styles.attrCell]}><Text>Опис</Text></View>
        {products.map((p) => (
          <View key={p.id} style={[styles.cell, styles.productCell]}>
            <Text numberOfLines={3}>{p.description}</Text>
          </View>
        ))}
      </View>

      {/* Показуємо характеристики для накопичувачів */}
      {products.some(p => p.specs) && (
        <>
          {products.some(p => p.specs?.capacity) && (
            <View style={styles.row}>
              <View style={[styles.cell, styles.attrCell]}><Text>Ємність</Text></View>
              {products.map((p) => {
                const isBest = isBestSpec(p.id, 'capacity');
                return (
                  <View key={p.id} style={[styles.cell, styles.productCell, isBest ? styles.bestCell : null]}>
                    <Text style={isBest ? styles.bestText : null}>{p.specs?.capacity || '—'}</Text>
                  </View>
                );
              })}
            </View>
          )}

          {products.some(p => p.specs?.type) && (
            <View style={styles.row}>
              <View style={[styles.cell, styles.attrCell]}><Text>Тип</Text></View>
              {products.map((p) => (
                <View key={p.id} style={[styles.cell, styles.productCell]}>
                  <Text>{p.specs?.type || '—'}</Text>
                </View>
              ))}
            </View>
          )}

          {products.some(p => p.specs?.speed_read) && (
            <View style={styles.row}>
              <View style={[styles.cell, styles.attrCell]}><Text>Швид. читання</Text></View>
              {products.map((p) => {
                const isBest = isBestSpec(p.id, 'speed_read');
                return (
                  <View key={p.id} style={[styles.cell, styles.productCell, isBest ? styles.bestCell : null]}>
                    <Text style={isBest ? styles.bestText : null}>{p.specs?.speed_read || '—'}</Text>
                  </View>
                );
              })}
            </View>
          )}

          {products.some(p => p.specs?.speed_write) && (
            <View style={styles.row}>
              <View style={[styles.cell, styles.attrCell]}><Text>Швид. запису</Text></View>
              {products.map((p) => {
                const isBest = isBestSpec(p.id, 'speed_write');
                return (
                  <View key={p.id} style={[styles.cell, styles.productCell, isBest ? styles.bestCell : null]}>
                    <Text style={isBest ? styles.bestText : null}>{p.specs?.speed_write || '—'}</Text>
                  </View>
                );
              })}
            </View>
          )}

          {products.some(p => p.specs?.speed_rpm) && (
            <View style={styles.row}>
              <View style={[styles.cell, styles.attrCell]}><Text>Обертання</Text></View>
              {products.map((p) => {
                const isBest = isBestSpec(p.id, 'speed_rpm');
                return (
                  <View key={p.id} style={[styles.cell, styles.productCell, isBest ? styles.bestCell : null]}>
                    <Text style={isBest ? styles.bestText : null}>{p.specs?.speed_rpm || '—'}</Text>
                  </View>
                );
              })}
            </View>
          )}

          {products.some(p => p.specs?.buffer) && (
            <View style={styles.row}>
              <View style={[styles.cell, styles.attrCell]}><Text>Буфер</Text></View>
              {products.map((p) => {
                const isBest = isBestSpec(p.id, 'buffer');
                return (
                  <View key={p.id} style={[styles.cell, styles.productCell, isBest ? styles.bestCell : null]}>
                    <Text style={isBest ? styles.bestText : null}>{p.specs?.buffer || '—'}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', marginBottom: 8 },
  row: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#eee', paddingVertical: 12 },
  cell: { flex: 1, paddingHorizontal: 8 },
  attrCell: { flex: 0.8 },
  productCell: { flex: 1 },
  thumb: { width: 60, height: 60, marginBottom: 6 },
  title: { fontSize: 12, fontWeight: '600' },
  bestCell: { backgroundColor: '#E8F5E9', borderRadius: 6 },
  bestText: { color: '#1B5E20', fontWeight: '700' }
});
