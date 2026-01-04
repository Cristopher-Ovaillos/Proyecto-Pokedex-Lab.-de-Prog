import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Button } from 'react-native';

// Pantalla 1
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Pantalla Principal</Text>
      <Button title="Ir a Detalles" onPress={() => navigation.navigate('Details')} />
    </View>
  );
}

// Pantalla 2
function DetailsScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Detalles</Text>
    </View>
  );
}

// Pantalla 3
function ProfileScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Perfil</Text>
    </View>
  );
}

// Pantalla 4
function SettingsScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Configuración</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

export default function Index() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            // Ajuste específico para Android Expo Go
            paddingBottom: 10,
            height: 65,
          }
        }}
      >
        <Tab.Screen name="Inicio" component={HomeStack} />
        <Tab.Screen name="Perfil" component={ProfileScreen} />
        <Tab.Screen name="Config" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}