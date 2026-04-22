import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CatalogScreen from './src/screens/CatalogScreen';
import CompareScreen from './src/screens/CompareScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import { SelectionProvider } from './src/contexts/SelectionContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SelectionProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Catalog">
            <Stack.Screen name="Catalog" component={CatalogScreen} options={{ title: 'Каталог товарів' }} />
            <Stack.Screen name="Compare" component={CompareScreen} options={{ title: 'Порівняння' }} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Додати новий товар' }} />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaProvider>
    </SelectionProvider>
  );
}
