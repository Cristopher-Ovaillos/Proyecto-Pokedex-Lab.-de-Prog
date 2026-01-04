import React from 'react';

import { View, Text } from 'react-native';
const styles = require('../../../constants/styles');

export const PokedexScreen = () => (
  <View className={styles.pokedex.container}>
    <Text className={styles.pokedex.title}>Pantalla de Pokedex</Text>
  </View>
);
