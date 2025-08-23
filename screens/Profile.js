import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { MaskedTextInput } from 'react-native-mask-text';
import Checkbox from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUri, setAvatarUri] = useState('');
  const [orderStatus, setOrderStatus] = useState(false);
  const [passwordChange, setPasswordChange] = useState(false);
  const [specialOffers, setSpecialOffers] = useState(false);
  const [newsletter, setNewsletter] = useState(false);


  useEffect(() => {
    const loadData = async () => {
      try {
        const keys = [
          'firstName', 'lastName', 'email', 'phone', 'avatar',
          'orderStatus', 'passwordChange', 'specialOffers', 'newsletter'
        ];
        const entries = await AsyncStorage.multiGet(keys);
        const data = Object.fromEntries(entries);

        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setAvatarUri(data.avatar || '');

        setOrderStatus(JSON.parse(data.orderStatus ?? 'false'));
        setPasswordChange(JSON.parse(data.passwordChange ?? 'false'));
        setSpecialOffers(JSON.parse(data.specialOffers ?? 'false'));
        setNewsletter(JSON.parse(data.newsletter ?? 'false'));
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    loadData();
  }, []);

  const getInitials = () => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setAvatarUri('');
  };

  const saveChanges = async () => {
    await AsyncStorage.multiSet([
      ['firstName', firstName],
      ['lastName', lastName],
      ['email', email],
      ['phone', phone],
      ['avatar', avatarUri],
      ['orderStatus', JSON.stringify(orderStatus)],
      ['passwordChange', JSON.stringify(passwordChange)],
      ['specialOffers', JSON.stringify(specialOffers)],
      ['newsletter', JSON.stringify(newsletter)],
    ]);
    Alert.alert('Saved', 'Your changes have been saved.');
  };

  const logout = async () => {
    await AsyncStorage.clear();
    //navigation.replace('Onboarding');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Onboarding' }],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Personal Information</Text>

      <View style={styles.avatarContainer}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.initials}>{getInitials()}</Text>
          </View>
        )}
        <View style={styles.avatarButtons}>
          <Button title="Change" onPress={pickImage} />
          <Button title="Remove" onPress={removeImage} />
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <MaskedTextInput
        style={styles.input}
        mask="(999) 999-9999"
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="numeric"
      />

      <Text style={styles.subHeader}>Email Notifications</Text>
      <View style={styles.checkboxRow}>
        <Checkbox value={orderStatus} onValueChange={setOrderStatus} />
        <Text style={styles.checkboxLabel}>Order statuses</Text>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox value={passwordChange} onValueChange={setPasswordChange} />
        <Text style={styles.checkboxLabel}>Password changes</Text>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox value={specialOffers} onValueChange={setSpecialOffers} />
        <Text style={styles.checkboxLabel}>Special offers</Text>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox value={newsletter} onValueChange={setNewsletter} />
        <Text style={styles.checkboxLabel}>Newsletter</Text>
      </View>

      <View style={styles.buttonRow}>
        <Button title="Log out" color="#d9534f" onPress={logout} />
        <Button title="Discard changes" color="#f0ad4e" onPress={() => Alert.alert('Discarded')} />
        <Button title="Save changes" color="#5cb85c" onPress={saveChanges} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20 
  },
  header: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  subHeader: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginTop: 20, 
    marginBottom: 10 
  },
  input: {
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 5,
    padding: 10, 
    marginBottom: 10,
  },
  avatarContainer: { 
    alignItems: 'center', 
    marginBottom: 20 
  },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50 
  },
  placeholder: {
    width: 100, 
    height: 100, 
    borderRadius: 50,
    backgroundColor: '#ccc', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  initials: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  avatarButtons: { 
    flexDirection: 'row', 
    gap: 10, 
    marginTop: 10 
  },
  checkboxRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  checkboxLabel: { 
    marginLeft: 10 
  },
  buttonRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 30, gap: 10,
  },
});

