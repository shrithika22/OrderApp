import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('little_lemon');
const MENU_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const IMAGE_BASE =
  'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/';

const categories = ['Starters', 'Mains', 'Desserts', 'Drinks', 'Specials'];

const Home = () => {
  const navigation = useNavigation();
  const [menu, setMenu] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const loadAllMenu = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM menu', [], (_, { rows }) =>
        setMenu(rows._array)
      );
    });
  };

    const handleClearFilters = () => {
    setSelectedCategories([]);
    db.transaction((tx) => {
        tx.executeSql(
        'SELECT * FROM menu',
        [],
        (_, { rows }) => {
            setMenu(rows._array);
        },
        (_, error) => {
            console.error('Error clearing filters:', error);
            return false;
        }
        );
    });
    };


  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, price REAL, image TEXT, category TEXT);'
      );
    });

    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM menu', [], (_, { rows }) => {
        if (rows.length > 0) {
          setMenu(rows._array);
        } else {
          fetch(MENU_URL)
            .then((res) => res.json())
            .then((json) => {
              const items = json.menu;
              setMenu(items);
              db.transaction((tx) => {
                items.forEach((item) => {
                  tx.executeSql(
                    'INSERT INTO menu (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)',
                    [item.name, item.description, item.price, item.image, item.category]
                  );
                });
              });
            });
        }
      });
    });
  }, []);

  // Filter by category
    useEffect(() => {
    const timeout = setTimeout(() => {
        const hasSearch = searchQuery.trim().length > 0;
        const hasCategory = selectedCategories.length > 0;

        let queryStr = 'SELECT * FROM menu WHERE 1=1';
        const params = [];

        if (hasSearch) {
        queryStr += ' AND LOWER(name) LIKE ?';
        params.push(`%${searchQuery.toLowerCase()}%`);
        }

        if (hasCategory) {
        const placeholders = selectedCategories.map(() => '?').join(', ');
        queryStr += ` AND LOWER(category) IN (${placeholders})`;
        params.push(...selectedCategories.map((cat) => cat.toLowerCase()));
        }

        // console.log('SQL Query:', queryStr);
        // console.log('Params:', params);

        db.transaction((tx) => {
        tx.executeSql(queryStr, params, (_, { rows }) => setMenu(rows._array));
        });
    }, 300);

    return () => clearTimeout(timeout);
    }, [searchQuery, selectedCategories]);




  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Item', { item })}>
      <View style={styles.menuItem}>
        <Image
          source={{ uri: `${IMAGE_BASE}${item.image}?raw=true` }}
          style={styles.menuImage}
        />
        <View style={styles.menuText}>
          <Text style={styles.menuName}>{item.name}</Text>
          <Text style={styles.menuDescription}>{item.description}</Text>
          <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/little-lemon-logo.png')}
          style={styles.logo}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('../assets/avatar.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Little Lemon</Text>
        <Text style={styles.bannerSubtitle}>Chicago</Text>
        <Text style={styles.bannerDescription}>
          We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
        </Text>
        <Image
          source={require('../assets/header.png')}
          style={styles.bannerImage}
        />
        <TextInput
          style={styles.searchBar}
          placeholder="Search menu..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category List */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <TouchableOpacity
              key={category}
              onPress={() => toggleCategory(category)}
              style={[
                styles.categoryItem,
                isSelected && styles.categoryItemSelected,
              ]}
            >
              <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Clear Filters Button — only visible when filters are active */}
        {selectedCategories.length > 0 && (
            <TouchableOpacity onPress={handleClearFilters} style={styles.categoryItem}>
            <Text style={styles.categoryText}>Clear Filters</Text>
            </TouchableOpacity>
        )}
      </ScrollView>

      {/* Menu List */}
      <FlatList
        data={menu}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.menuList}
      />
      {menu.length === 0 && (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
            No items match your selection.
        </Text>
       )}
    </View>
  );
};

export default Home;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  logo: {
    width: 100,
    height: 35,
    resizeMode: 'contain',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 16,
  },
  banner: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    backgroundColor: '#495E57',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4CE14',
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginVertical: 2,
  },
  bannerDescription: {
    fontSize: 14,
    marginVertical: 4,
    color: '#ffffffff',
  },
  bannerImage: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
  },
  searchBar: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
  },
  categoryScroll: {
    marginVertical: 10,
    paddingHorizontal: 16,
    minHeight: 40,
    maxHeight: 40,
  },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 8,
  },
  categoryItemSelected: {
    backgroundColor: '#495E57',
  },
  categoryText: {
    color: '#333',
    fontWeight: '500',
    fontSize: '16'
  },
  categoryTextSelected: {
    color: '#fff',
  },
  menuList: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    overflow: 'hidden',
  },
  menuImage: {
    width: 100,
    height: 100,
  },
  menuText: {
    flex: 1,
    padding: 10,
  },
  menuName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuDescription: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  menuPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
