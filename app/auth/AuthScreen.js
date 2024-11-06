import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Yup from 'yup';
import { useAuthContext } from '../context/AuthContext';
const BASE_URL = 'https://chat-app-backend-tl4j.onrender.com';

const validationSchema = Yup.object().shape({
  name: Yup.string().when('isLogin', {
    is: false,
    then: () => Yup.string().required('Name is required'),
  }),
  phoneNumber: Yup.string().required('Phone number is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const { setAuthUser } = useAuthContext();
  const handleSubmit = async (values) => {
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const requestData = isLogin
        ? {
            phoneNumber: values.phoneNumber,
            password: values.password,
          }
        : {
            name: values.name,
            phoneNumber: values.phoneNumber,
            password: values.password,
          };
console.log(`${BASE_URL}${endpoint}`)
      const response = await axios.post(`${BASE_URL}${endpoint}`, requestData);
      if (isLogin) {
        // If login is successful
        if (response.data.token) {
const token = response.data.token
const userId = response.data.data._id
       
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('userId', userId);
          setAuthUser({ token, userId });
          router.replace('/home/HomeScreen');
        }
      } else {
        // Registration was successful, switch to login mode
        Alert.alert('Success', 'Registration successful. Please log in.');
        setIsLogin(true);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || console.log(error));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>

      <Formik
        initialValues={{ name: '', phoneNumber: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
        validateOnMount={true}>
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <>
            {!isLogin && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                />
                {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </>
            )}

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={values.phoneNumber}
              onChangeText={handleChange('phoneNumber')}
              keyboardType="phone-pad"
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={values.password}
              onChangeText={handleChange('password')}
              secureTextEntry
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  switchText: {
    marginTop: 20,
    color: '#007AFF',
    textAlign: 'center',
  },
});

export default AuthScreen;
