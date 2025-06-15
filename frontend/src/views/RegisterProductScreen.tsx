import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

type Product = {
  id: string;
  name: string;
  type: string;
  quantity: string;
  status: 'Ótimo' | 'Regular' | 'Ruim';
  validade: string;
  estoqueMax: string;
  estoqueMin: string;
};

export default function ProductScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState<Omit<Product, 'id'>>({
    name: '',
    type: '',
    quantity: '',
    status: 'Ótimo',
    validade: '',
    estoqueMax: '',
    estoqueMin: '',
  });

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      ...form,
    };

    setProducts([...products, newProduct]);
    setForm({
      name: '',
      type: '',
      quantity: '',
      status: 'Ótimo',
      validade: '',
      estoqueMax: '',
      estoqueMin: '',
    });
    setShowForm(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setShowForm(!showForm)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Cadastrar Nova Flor</Text>
      </TouchableOpacity>

      {showForm && (
        <View style={styles.form}>
          <TextInput
            placeholder="Nome"
            style={styles.input}
            value={form.name}
            onChangeText={text => setForm({ ...form, name: text })}
          />
          <TextInput
            placeholder="Tipo"
            style={styles.input}
            value={form.type}
            onChangeText={text => setForm({ ...form, type: text })}
          />
          <TextInput
            placeholder="Quantidade"
            style={styles.input}
            keyboardType="numeric"
            value={form.quantity}
            onChangeText={text => setForm({ ...form, quantity: text })}
          />
          <TextInput
            placeholder="Data de Validade"
            style={styles.input}
            value={form.validade}
            onChangeText={text => setForm({ ...form, validade: text })}
          />

          <Text style={styles.label}>Estado:</Text>
          <Picker
            selectedValue={form.status}
            onValueChange={value =>
              setForm({ ...form, status: value as Product['status'] })
            }
            style={styles.picker}
          >
            <Picker.Item label="Ótimo" value="Ótimo" />
            <Picker.Item label="Regular" value="Regular" />
            <Picker.Item label="Ruim" value="Ruim" />
          </Picker>

          <TextInput
            placeholder="Estoque Máx"
            style={styles.input}
            keyboardType="numeric"
            value={form.estoqueMax}
            onChangeText={text => setForm({ ...form, estoqueMax: text })}
          />
          <TextInput
            placeholder="Estoque Mín"
            style={styles.input}
            keyboardType="numeric"
            value={form.estoqueMin}
            onChangeText={text => setForm({ ...form, estoqueMin: text })}
          />

          <Button
            title="Salvar Produto"
            onPress={handleAddProduct}
            color="#008000"
          />
        </View>
      )}

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.productBox}>
            <Text style={styles.productText}>
              🌸 <Text style={styles.labelBold}>Nome:</Text> {item.name}
            </Text>
            <Text style={styles.productText}>
              <Text style={styles.labelBold}>Tipo:</Text> {item.type}
            </Text>
            <Text style={styles.productText}>
              <Text style={styles.labelBold}>Qtd:</Text> {item.quantity}
            </Text>
            <Text style={styles.productText}>
              <Text style={styles.labelBold}>Validade:</Text> {item.validade}
            </Text>
            <Text style={styles.productText}>
              <Text style={styles.labelBold}>Estado:</Text> {item.status}
            </Text>
            <Text style={styles.productText}>
              <Text style={styles.labelBold}>Estoque Máx:</Text>{' '}
              {item.estoqueMax}
            </Text>
            <Text style={styles.productText}>
              <Text style={styles.labelBold}>Estoque Mín:</Text>{' '}
              {item.estoqueMin}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDD0', padding: 20 },
  button: {
    backgroundColor: '#BA55D3',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#F5F5DC',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  form: {
    backgroundColor: '#F5F5DC',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    color: '#000',
  },
  label: { color: '#000', fontWeight: 'bold', marginBottom: 5 },
  picker: { backgroundColor: '#fff', marginBottom: 10, borderRadius: 5 },
  productBox: {
    backgroundColor: '#E2725B',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  productText: { color: '#FFFDD0', marginBottom: 3 },
  labelBold: { fontWeight: 'bold', color: '#F5F5DC' },
});
