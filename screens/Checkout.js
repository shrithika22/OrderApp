// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';

// const Checkout = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { order } = route.params;

//   const [success, setSuccess] = useState(false);

//   const deliveryFee = 2.0;
//   const serviceFee = 1.0;
//   const itemTotal = (order.price + order.toppings.length * 1.0) * order.quantity;
//   const subtotal = itemTotal;
//   const total = (subtotal + deliveryFee + serviceFee).toFixed(2);

//   const handleCheckout = () => {
//     setSuccess(true);
//   };

//   if (success) {
//     return (
//       <View style={styles.successContainer}>
//         <Text style={styles.successTitle}>Success!</Text>
//         <Text style={styles.successMessage}>Your order will be with you shortly.</Text>
//         <Text style={styles.thankYou}>Thank you for your business.</Text>
//         <TouchableOpacity
//           style={styles.trackButton}
//           onPress={() => navigation.navigate('Home')}
//         >
//           <Text style={styles.trackButtonText}>Track Order</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.delivery}>🚚 Delivery time: 20 minutes <Text style={styles.change}>Change</Text></Text>
//       <Text style={styles.cutlery}>🍴 Help reduce plastic waste by only asking for cutlery if needed.</Text>

//       <Text style={styles.sectionTitle}>Order Summary</Text>
//       <View style={styles.orderRow}>
//         <Text>1 x {order.name}</Text>
//         <Text>${itemTotal.toFixed(2)}</Text>
//       </View>

//       <Text style={styles.sectionTitle}>Charges</Text>
//       <View style={styles.orderRow}>
//         <Text>Subtotal</Text>
//         <Text>${subtotal.toFixed(2)}</Text>
//       </View>
//       <View style={styles.orderRow}>
//         <Text>Delivery Fee</Text>
//         <Text>${deliveryFee.toFixed(2)}</Text>
//       </View>
//       <View style={styles.orderRow}>
//         <Text>Service Fee</Text>
//         <Text>${serviceFee.toFixed(2)}</Text>
//       </View>
//       <View style={styles.orderRow}>
//         <Text style={styles.totalLabel}>Total</Text>
//         <Text style={styles.totalLabel}>${total}</Text>
//       </View>

//       <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
//         <Text style={styles.checkoutButtonText}>Checkout</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// export default Checkout;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', padding: 16 },
//   delivery: { fontSize: 14, marginBottom: 8 },
//   change: { color: '#007AFF', textDecorationLine: 'underline' },
//   cutlery: { fontSize: 12, color: '#555', marginBottom: 16 },
//   sectionTitle: { fontSize: 16, fontWeight: '600', marginVertical: 8 },
//   orderRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 6,
//     borderBottomWidth: 0.5,
//     borderColor: '#ccc',
//   },
//   totalLabel: { fontWeight: 'bold', fontSize: 16 },
//   checkoutButton: {
//     backgroundColor: '#F4CE14',
//     padding: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   checkoutButtonText: { fontSize: 16, fontWeight: 'bold' },
//   successContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   successTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
//   successMessage: { fontSize: 16, marginBottom: 6 },
//   thankYou: { fontSize: 14, color: '#555', marginBottom: 20 },
//   trackButton: {
//     backgroundColor: '#F4CE14',
//   }
// });





import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('little_lemon');

const IMAGE_BASE =
  'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/';

const Checkout = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cart: incomingCart = [], newItem } = route.params || {};

  const [cart, setCart] = useState(incomingCart);
  const [menu, setMenu] = useState([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (newItem) {
      setCart((prev) => [...prev, newItem]);
    }
  }, [newItem]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM menu', [], (_, { rows }) => {
        setMenu(rows._array);
      });
    });
  }, []);

  const deliveryFee = 2.0;
  const serviceFee = 1.0;

  const subtotal = cart.reduce((sum, item) => {
    const toppingCost = item.toppings.length * 1.0;
    return sum + (item.price + toppingCost) * item.quantity;
  }, 0);

  const total = (subtotal + deliveryFee + serviceFee).toFixed(2);

  const handleCheckout = () => {
    setSuccess(true);
  };

  const handleAddMore = (item) => {
    navigation.navigate('Item', { item, cart });
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successTitle}>Success!</Text>
        <Text style={styles.successMessage}>Your order will be with you shortly.</Text>
        <Text style={styles.thankYou}>Thank you for your business.</Text>
        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.trackButtonText}>Track Order</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.delivery}>🚚 Delivery time: 20 minutes <Text style={styles.change}>Change</Text></Text>
      <Text style={styles.cutlery}>🍴 Help reduce plastic waste by only asking for cutlery if needed.</Text>

      <Text style={styles.sectionTitle}>Order Summary</Text>
      {cart.map((item, index) => (
        <View key={index} style={styles.orderRow}>
          <Text>{item.quantity} x {item.name}</Text>
          <Text>
            ${((item.price + item.toppings.length * 1.0) * item.quantity).toFixed(2)}
          </Text>
        </View>
      ))}

      {/* <Text style={styles.sectionTitle}>Add More to Your Order</Text>
      {menu.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => handleAddMore(item)} style={styles.menuItem}>
          <Image source={{ uri: `${item.image}?raw=true` }} style={styles.menuImage} />
          <View style={styles.menuText}>
            <Text style={styles.menuName}>{item.name}</Text>
            <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
          </View>
        </TouchableOpacity>
      ))} */}

      <Text style={styles.sectionTitle}>Add More to Your Order</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
        {menu.map((menuItem, index) => (
          <TouchableOpacity key={index} onPress={() => navigation.navigate('Item', { item: menuItem, cart })}>
            <View style={styles.menuCard}>
              <Image source={{ uri: `${IMAGE_BASE}${menuItem.image}?raw=true` }} style={styles.menuImage} />
              <Text style={styles.menuName}>{menuItem.name}</Text>
              <Text style={styles.menuPrice}>₹{menuItem.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Charges</Text>
      <View style={styles.orderRow}>
        <Text>Subtotal</Text>
        <Text>${subtotal.toFixed(2)}</Text>
      </View>
      <View style={styles.orderRow}>
        <Text>Delivery Fee</Text>
        <Text>${deliveryFee.toFixed(2)}</Text>
      </View>
      <View style={styles.orderRow}>
        <Text>Service Fee</Text>
        <Text>${serviceFee.toFixed(2)}</Text>
      </View>
      <View style={styles.orderRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalLabel}>${total}</Text>
      </View>

      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Checkout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  delivery: { fontSize: 14, marginBottom: 8 },
  change: { color: '#007AFF', textDecorationLine: 'underline' },
  cutlery: { fontSize: 12, color: '#555', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginVertical: 8 },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  totalLabel: { fontWeight: 'bold', fontSize: 16 },
  checkoutButton: {
    backgroundColor: '#F4CE14',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonText: { fontSize: 16, fontWeight: 'bold' },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  successMessage: { fontSize: 16, marginBottom: 6 },
  thankYou: { fontSize: 14, color: '#555', marginBottom: 20 },
  trackButton: {
    backgroundColor: '#F4CE14',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  trackButtonText: { fontSize: 16, fontWeight: 'bold' },
  // menuItem: {
  //   flexDirection: 'row',
  //   marginVertical: 8,
  //   backgroundColor: '#f9f9f9',
  //   borderRadius: 8,
  //   overflow: 'hidden',
  // },
  // menuImage: {
  //   width: 80,
  //   height: 80,
  // },
  // menuText: {
  //   flex: 1,
  //   padding: 10,
  //   justifyContent: 'center',
  // },
  // menuName: {
  //   fontSize: 14,
  //   fontWeight: '600',
  // },
  // menuPrice: {
  //   fontSize: 14,
  //   color: '#333',
  // },

  scrollContainer: {
    marginVertical: 10,
    paddingLeft: 10,
  },

  menuCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  menuImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
  },

  menuName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
  },

  menuPrice: {
    fontSize: 12,
    color: '#888',
  },

});