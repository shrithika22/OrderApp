import { useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Onboarding = ({onComplete}) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const isFirstNameValid = /^[A-Za-z]+$/.test(firstName);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isFirstNameValid && isEmailValid;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>LITTLE LEMON</Text>
        <Image
          source={require('../assets/little-lemon-logo.png')} // Adjust path as needed
          style={styles.logo}
        />
      </View>

      {/* Subheading */}
      <Text style={styles.subheading}>Let us get to know you</Text>

      {/* Text Inputs */}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Button */}
      <View style={styles.buttonContainer}>
        {/* <Button title="Next" 
          onPress={async () => {
              await AsyncStorage.multiSet([
                ['onboardingComplete', 'true'],
                ['firstName', firstName],
                ['email', email],
              ]);
              console.log('Saved:', firstName, email);
              onComplete(); // triggers navigation to Profile
            }} 
          disabled={!isFormValid} 
        /> */}
        <Button
          title="Next"
          onPress={async () => {
            try {
              await AsyncStorage.multiSet([
                ['onboardingComplete', 'true'],
                ['firstName', firstName],
                ['email', email],
              ]);
              onComplete(); // Navigate to Profile
            } catch (error) {
              console.error('Error saving data:', error); // ✅ Catch and log the error
              // Optionally show an alert or toast
            }
          }}
          disabled={!isFormValid}
        />
      </View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logo: {
    width: 40,
    height: 40,
  },
  subheading: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
