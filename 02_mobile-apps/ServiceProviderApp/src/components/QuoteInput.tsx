// ServiceProviderApp/src/components/QuoteInput.tsx

import React from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { DollarSign, Clock, Truck } from 'lucide-react-native';

interface QuoteInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: 'clock' | 'dollar' | 'truck';
  keyboardType?: KeyboardTypeOptions;
  unit: string; // e.g., 'hrs', '₹', 'km'
}

const getIcon = (name: QuoteInputProps['icon'], color: string) => {
    switch(name) {
        case 'clock': return <Clock size={20} color={color} />;
        case 'dollar': return <DollarSign size={20} color={color} />;
        case 'truck': return <Truck size={20} color={color} />;
        default: return null;
    }
};

const QuoteInput: React.FC<QuoteInputProps> = ({ 
    label, 
    value, 
    onChangeText, 
    icon, 
    keyboardType = 'numeric',
    unit 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.inputWrapper}>
        {getIcon(icon, '#6C757D')}
        
        <TextInput
          style={styles.input}
          keyboardType={keyboardType}
          placeholder="0"
          placeholderTextColor="#ADB5BD"
          value={value}
          onChangeText={onChangeText}
        />
        
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#343A40',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 18,
    fontWeight: '700',
    color: '#007bff',
    marginLeft: 10,
    textAlign: 'right',
  },
  unit: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C757D',
    marginLeft: 10,
  }
});

export default QuoteInput;