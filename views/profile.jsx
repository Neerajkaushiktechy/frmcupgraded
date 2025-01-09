import React from 'react';
import { ActivityIndicator, Alert, Image, Text, StyleSheet, View, Keyboard, InputAccessoryView, Dimensions, Button, Platform  } from 'react-native';
import { colors, styles } from '../styles/styles.js';
import {
    createStaticNavigation,
    useNavigation,
  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


class Profile extends React.Component {

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
                <Text>Profile Screen</Text>
                <Button title="Open Drawer" onPress={() => navigation.openDrawer()} />
                <Button
                    onPress={() => navigation.navigate('Login')}
                    title="Go to login from profile"
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
  
    return <Profile {...props} navigation={navigation} />;
  }