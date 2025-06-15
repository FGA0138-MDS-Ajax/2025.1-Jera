import React from 'react';
import { SafeAreaView } from 'react-native';
import ProductScreen from './src/views/RegisterProductScreen';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ProductScreen />
    </SafeAreaView>
  );
};

export default App;
