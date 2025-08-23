import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const toppingsList = ['Feta', 'Parmesan', 'Dressing'];
const toppingPrice = 1.0;

const IMAGE_BASE =
  'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/';

const Item = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item, cart = [] } = route.params;

  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState([]);

  const toggleTopping = (topping) => {
    setSelectedToppings((prev) =>
      prev.includes(topping)
        ? prev.filter((t) => t !== topping)
        : [...prev, topping]
    );
  };

  const totalPrice = ((item.price + selectedToppings.length * toppingPrice) * quantity).toFixed(2);

  const handleAddToCart = () => {
    const newItem = {
      name: item.name,
      price: item.price,
      quantity,
      toppings: selectedToppings,
      image: item.image,
    };
    navigation.navigate('Checkout', { newItem, cart });
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: `${IMAGE_BASE}${item.image}?raw=true` }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.delivery}>🚚 Delivery time: 20 minutes <Text style={styles.change}>Change</Text></Text>

        <Text style={styles.sectionTitle}>Add</Text>
        {toppingsList.map((topping) => (
          <TouchableOpacity
            key={topping}
            style={styles.toppingRow}
            onPress={() => toggleTopping(topping)}
          >
            <Text style={styles.toppingText}>{topping}</Text>
            <Text style={styles.toppingPrice}>${toppingPrice.toFixed(2)}</Text>
            <Text style={styles.checkbox}>{selectedToppings.includes(topping) ? '✅' : '⬜️'}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.quantityRow}>
          <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
            <Text style={styles.quantityButton}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
            <Text style={styles.quantityButton}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>Add ${totalPrice}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Item;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 220 },
  content: { padding: 16 },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  description: { fontSize: 14, color: '#555', marginBottom: 12 },
  delivery: { fontSize: 14, marginBottom: 12 },
  change: { color: '#007AFF', textDecorationLine: 'underline' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginVertical: 8 },
  toppingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  toppingText: { fontSize: 14 },
  toppingPrice: { fontSize: 14 },
  checkbox: { fontSize: 18 },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  quantityButton: {
    fontSize: 24,
    paddingHorizontal: 20,
    color: '#007AFF',
  },
  quantityText: { fontSize: 18, marginHorizontal: 12 },
  addButton: {
    backgroundColor: '#F4CE14',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: { fontSize: 16, fontWeight: 'bold' },
});
