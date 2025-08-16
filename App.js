// App.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import SplashScreen from './screens/SplashScreen';

const Stack = createNativeStackNavigator();

function OnboardingWrapper({ navigation }) {
  return (
    <Onboarding
      onComplete={async () => {
        await AsyncStorage.setItem('onboardingComplete', 'true');
        navigation.replace('Profile');
      }}
    />
  );
}

export default function App() {
  const [state, setState] = useState({
    isLoading: true,
    isOnboardingCompleted: false,
  });

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('onboardingComplete');
        setState({
          isLoading: false,
          isOnboardingCompleted: value === 'true',
        });
      } catch (e) {
        console.error('Failed to load onboarding status', e);
      }
    };

    checkOnboardingStatus();
  }, []);

  if (state.isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {/* <Stack.Navigator>
        {state.isOnboardingCompleted ? (
          <Stack.Screen name="Profile" component={Profile} />
        ) : (
          <Stack.Screen name="Onboarding">
            {(props) => (
              <Onboarding
                {...props}
                onComplete={async () => {
                  await AsyncStorage.setItem('onboardingComplete', 'true');
                  setState({ isLoading: false, isOnboardingCompleted: true });
                }}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator> */}
        <Stack.Navigator initialRouteName={state.isOnboardingCompleted ? 'Profile' : 'Onboarding'}>
          <Stack.Screen name="Onboarding" component={OnboardingWrapper} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}
