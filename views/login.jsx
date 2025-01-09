import React from 'react';
import { ActivityIndicator, Alert, Image, Text, StyleSheet, View, Keyboard, InputAccessoryView, Dimensions, Button, Platform  } from 'react-native';
import { colors, styles } from '../styles/styles.js';
import {
    createStaticNavigation,
    useNavigation,
  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          username: '',
          password: '',
          isShowPasswordField: false,
          isInputAccessoryView: true,
          changePassword: false,
          newPassword:'',
          confirmPassword:'',
          userId:'',
          isKeyboardOpen: false,	
          keyBoardHeight: 0
        };
    
        // this.login = this.login.bind(this);
    
      }

      render() {
        const { navigation } = this.props;

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Login Screen</Text>
                {/* <Button onPress={() => navigation.navigate('Details')}>
                Go to Details
                </Button> */}
                <Button
                    onPress={() => navigation.navigate('LeftDrawer', {screen:'Allperiods'})}
                    title="Learn More"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
            </View>
        )
      }
}

// Wrap and export
export default function (props) {
    const navigation = useNavigation();
  
    return <Login {...props} navigation={navigation} />;
  }