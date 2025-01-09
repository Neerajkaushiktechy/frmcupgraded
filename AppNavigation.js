import * as React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation,  createStaticNavigation} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from './views/login';
import ProfileScreen from './views/profile';
import AllperiodsScreen from './views/allPeriods';

/** Old Pattern===================== */
// const LeftDrawerScreen = createDrawerNavigator({
//     initialRouteName: 'Profile',
//     screens: {
//         Profile: ProfileScreen,
//         Allperiods: AllperiodsScreen,
//     },
//     drawerPosition: 'left',
//   });
// const LeftDrawerScreen = createStaticNavigation(LeftDrawer);

// const PrimaryNav = createNativeStackNavigator({
//     initialRouteName: 'Login',
//     options: {
//         headerShown: false,
//     },
//     screens: {
//       Login: {
//         screen:LoginScreen,
//         options: {
//             headerShown: false,
//         },
//     },
//     //   Profile: {
//     //     screen:ProfileScreen,
//     //     options: {
//     //         headerShown: false,
//     //     },
//     //   },
//       LeftDrawer: {
//         screen: LeftDrawerScreen,
//         options: {
//             headerShown: false,
//         },
//       },
//     },
// });
/** End Old Pattern */

const LeftDrawer = createDrawerNavigator();
const LeftDrawerScreen = () => {
    return (
      <LeftDrawer.Navigator screenOptions={{ drawerPosition: 'left', headerShown: false }}>
        <LeftDrawer.Screen name="Profile" component={ProfileScreen} />
        <LeftDrawer.Screen name="Allperiods" component={AllperiodsScreen} />
      </LeftDrawer.Navigator>
    );
};


const Stack = createNativeStackNavigator();
const PrimaryNav = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Login'>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                // options={{ headerShown: false }}
            />
            <Stack.Screen name="LeftDrawer" component={LeftDrawerScreen} />
        </Stack.Navigator>
    )
}



export default PrimaryNav;

