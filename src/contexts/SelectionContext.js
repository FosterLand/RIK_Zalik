import React, { createContext, useState } from 'react';

export const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
  const [selected, setSelected] = useState([]);
  const [products, setProducts] = useState([]);
  const [nextId, setNextId] = useState(100);

  const toggle = (product) => {
    setSelected((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= 3) return prev;
      return [...prev, product];
    });
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: nextId,
      rating: product.rating || { rate: 0, count: 0 }
    };
    setProducts((prev) => [...prev, newProduct]);
    setNextId((prev) => prev + 1);
    return newProduct;
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setSelected((prev) => prev.filter((p) => p.id !== productId));
  };

  return (
    <SelectionContext.Provider value={{ selected, setSelected, toggle, products, setProducts, addProduct, deleteProduct }}>
      {children}
    </SelectionContext.Provider>
  );
};
