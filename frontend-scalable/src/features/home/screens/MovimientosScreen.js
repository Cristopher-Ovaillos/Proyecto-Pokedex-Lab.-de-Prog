import React from 'react';

import { View, Text } from 'react-native';
const styles = require('../../../constants/styles');

export const MovimientosScreen = () => (
  <View className={styles.movimientos.container}>
    <Text className={styles.movimientos.title}>Pantalla de Movimientos</Text>
  </View>
);
