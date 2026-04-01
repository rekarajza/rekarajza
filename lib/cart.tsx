'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  count: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType>({
  items: [], addItem: () => {}, removeItem: () => {}, clearCart: () => {},
  count: 0, isOpen: false, openCart: () => {}, closeCart: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('rekarajza_cart');
    if (stored) setItems(JSON.parse(stored));
  }, []);

  const save = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('rekarajza_cart', JSON.stringify(newItems));
  };

  const addItem = (item: CartItem) => {
    if (items.find(i => i.id === item.id)) {
      setIsOpen(true);
      return;
    }
    save([...items, item]);
    setIsOpen(true);
  };

  const removeItem = (id: string) => save(items.filter(i => i.id !== id));
  const clearCart = () => save([]);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, clearCart,
      count: items.length, isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
