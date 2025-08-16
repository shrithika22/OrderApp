// screens/SplashScreen.js
import { StyleSheet, Text, View } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>LITTLE LEMON</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4CE14',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
});
