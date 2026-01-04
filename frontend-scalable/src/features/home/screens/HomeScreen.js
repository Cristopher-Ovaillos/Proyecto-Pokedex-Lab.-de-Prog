import { View, Text, TouchableOpacity } from 'react-native';
import { ENV } from '../../../config';
const styles = require('../../../constants/styles');

export const HomeScreen = () => (
  <View className={styles.home.container}>
    <Text className={styles.home.title}>HomeScreen</Text>
    <Text className={styles.home.subtitle}>Hola Mundo</Text>
    <Text className={styles.home.subtitle}>Proyecto: frontend-scalable</Text>
    <View className={styles.home.configBox}>
      <Text className={styles.home.configLabel}>DEV CONFIG:</Text>
      <Text className={styles.home.configValue}>{ENV.API_URL}</Text>
    </View>
    <TouchableOpacity className={styles.home.button}>
      <Text className={styles.home.buttonText}>Comenzar</Text>
    </TouchableOpacity>
  </View>
);
