import { Formik } from 'formik';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Yup from 'yup';
import { LoginValues, RegisterValues } from '../interfaces/types';
import { useAuthContext } from '../context/AuthContext';
import { useLogin } from '../hooks/useLoginHook';
import { useRegister } from '../hooks/useRegisterHook';

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


const AuthScreen = ({}) => {
  const [isLogin, setIsLogin] = useState(true);
  const { setAuthUser } = useAuthContext();
  const { login } = useLogin();
  const { register } = useRegister();

  const handleSubmit = async (values: LoginValues | RegisterValues) => {
    try {
      if (isLogin) {
        await login(values.phoneNumber, values.password);
      } else {
        const success = await register(values.name, values.phoneNumber, values.password);
        if (success) {
          setIsLogin(true);
        }
      }
    } catch (error) {
      // Errors are handled within the hooks
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

            <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
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
