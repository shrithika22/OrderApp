// import { useState } from 'react';
// import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const Onboarding = ({onComplete}) => {
//   const [firstName, setFirstName] = useState('');
//   const [email, setEmail] = useState('');

//   const isFirstNameValid = /^[A-Za-z]+$/.test(firstName);
//   const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   const isFormValid = isFirstNameValid && isEmailValid;

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerText}>LITTLE LEMON</Text>
//         <Image
//           source={require('../assets/little-lemon-logo.png')} 
//           style={styles.logo}
//         />
//       </View>

//       {/* Subheading */}
//       <Text style={styles.subheading}>Let us get to know you</Text>

//       {/* Text Inputs */}
//       <TextInput
//         style={styles.input}
//         placeholder="First Name"
//         value={firstName}
//         onChangeText={setFirstName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       {/* Button */}
//       <View style={styles.buttonContainer}>
//         <Button
//           title="Next"
//           onPress={async () => {
//             try {
//               await AsyncStorage.multiSet([
//                 ['onboardingComplete', 'true'],
//                 ['firstName', firstName],
//                 ['email', email],
//               ]);
//               onComplete(); // Navigate to Profile
//             } catch (error) {
//               console.error('Error saving data:', error); // ✅ Catch and log the error
//             }
//           }}
//           disabled={!isFormValid}
//         />
//       </View>
//     </View>
//   );
// };

// export default Onboarding;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   logo: {
//     width: 40,
//     height: 40,
//   },
//   subheading: {
//     fontSize: 18,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 6,
//     padding: 10,
//     marginBottom: 15,
//   },
//   buttonContainer: {
//     marginTop: 20,
//   },
// });



import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Onboarding = ({ onComplete }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const isFirstNameValid = /^[A-Za-z]+$/.test(firstName);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isFirstNameValid && isEmailValid;

  const handleNext = async () => {
    try {
      await AsyncStorage.multiSet([
        ['onboardingComplete', 'true'],
        ['firstName', firstName],
        ['email', email],
      ]);
      onComplete();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        {/* Logo and Title */}
        <View style={styles.header}>
          <Image
            source={require('../assets/little-lemon-logo.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome to Little Lemon</Text>
          <Text style={styles.subtitle}>Let us get to know you</Text>
        </View>

        {/* Inputs */}
        <TextInput
          style={[styles.input, !isFirstNameValid && firstName ? styles.inputError : null]}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={[styles.input, !isEmailValid && email ? styles.inputError : null]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Button */}
        <TouchableOpacity
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Onboarding;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#495E57',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  button: {
    backgroundColor: '#F4CE14',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ddd',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
