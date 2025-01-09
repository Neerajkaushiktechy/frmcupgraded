// import * as watch from 'react-native-watch-connectivity';
// import BackgroundTimer from 'react-native-background-timer';

// import LogService from '../services/logService';
// import DutyPeriodService from '../services/dutyPeriodService';
// import {Constants} from '../shared/constants';
// import Moment from 'moment';
// import StorageService from '../services/storageService';
// import {Alert} from 'react-native';

// let watchRegisteredEvent = null;
// const watchNotificationActions = ['1', '2', '3', '4', '5', '6'];
// let refreshIntervalId = null;
// let scheduledRefreshId = null;

// const sendMessageToWatch = message => {
//   watch.sendMessage(
//     {message},

//     error => {
//       if (error) {
//         Alert.alert(`the message "${message}" can't be sent`);
//         LogService.Log(error.message);
//       }
//     },
//   );
// };

// const setExpiredActivityKeysArray = expiredActivityKeys => {
//   const stringifiedArray = JSON.stringify(expiredActivityKeys);
//   StorageService.Set('expiredActivityKeys', stringifiedArray);
// };

// const initializeExpiredActivityKeysArray = expiredActivityKeys => {
//   if (!expiredActivityKeys?.length) {
//     setExpiredActivityKeysArray([]);
//   }
// };

// const setLocalNotificationPendingActionsArray = localNotificationPendingActions => {
//   const localNotificationPendingActionsArray = JSON.stringify(localNotificationPendingActions);
//   Alert.alert(localNotificationPendingActionsArray);
//   StorageService.Set('LocalNotificationPendingActions', localNotificationPendingActionsArray);
// };

// const initializeLocalNotificationPendingActionsArray = (localNotificationPendingActions) => {
//   if (!localNotificationPendingActions?.length) {
//     setLocalNotificationPendingActionsArray([]);
//   }
// }

// const startBackgroundAppRefresh = () => {
//   BackgroundTimer.start();
//   refreshIntervalId = setInterval(() => {
//     sendMessageToWatch('appRefresh');
//   }, 5000);
// };

// const CheckIfTheActivityIsExpired = activityExpirationDateTime => {
//   const currentDateTime = new Date();
//   const convertedEndTime = Moment(activityExpirationDateTime).toDate();
//   return currentDateTime > convertedEndTime;
// };

// const GetAllPeriodsActivities = async () => {
//   const periods = await DutyPeriodService.GetPeriods();
//   console.log(periods);

//   const activities = periods
//     ? periods.map(period => period.Activities).flat(1)
//     : [];
//   return activities;
// };

// const GetExpiredActivityKeys = async () => {
//   const expiredActivityKeys = await StorageService.Get('expiredActivityKeys');
//   return JSON.parse(expiredActivityKeys);
// };

// const GetLocalNotificationPendingActions = async () => {
//   const LocalNotificationPendingActions = await StorageService.Get('LocalNotificationPendingActions');
//   return JSON.parse(LocalNotificationPendingActions);
// };

// const CheckForExpiredActivitiesIfThereIsAny = async () => {
//   const allPeriodsActivities = await GetAllPeriodsActivities();
//   const expiredActivityKeys = await GetExpiredActivityKeys();
//   const unExpiredActivities = allPeriodsActivities.filter(
//     activity =>
//       !expiredActivityKeys.find(
//         expiredActivityKey => activity.Key === expiredActivityKey,
//       ),
//   );
//   unExpiredActivities.map(activity => {
//     const {Key, EndDateTime} = activity;
//     if (CheckIfTheActivityIsExpired(EndDateTime)) {
//       sendMessageToWatch(Key);
//       expiredActivityKeys.push(Key);
//       setExpiredActivityKeysArray(expiredActivityKeys);
//     } else {
//       sendMessageToWatch('No expired Activity!');
//     }
//   });
// };

// const scheduleWatchMessage = (message, i) => {
//   scheduledRefreshId = setInterval(() => {
//     i++;
//     console.log('Message ' + i);
//     sendMessageToWatch("Dummy Testing Message!")
//     //CheckForExpiredActivitiesIfThereIsAny();
//   }, 30000);
// };

// const StartCheckingExpiredActivities = message => {
//   sendMessageToWatch(message); // send Default Message while timer starts!

//   let i = 0;
//   scheduleWatchMessage(message, i);
// };

// const initializeCheckExpiredActivityProcess = async () => {
//   debugger;
//   const localNotificationPendingActions = await GetLocalNotificationPendingActions();
//   const expiredActivityKeys = await GetExpiredActivityKeys();
//   initializeLocalNotificationPendingActionsArray(localNotificationPendingActions);
//   initializeExpiredActivityKeysArray(expiredActivityKeys);

//   StartCheckingExpiredActivities(Constants.watchNotificationTitle);
// };

// const initWatchConnectivityAlongWithEvents = async () => {
//   watchRegisteredEvent = watch.watchEvents.addListener(
//     'message',
//     async (msg, reply) => {

//       if (msg.message != 'appRefresh') {
        
//         const isResponseClicked = watchNotificationActions.find(
//           actionMsg => actionMsg === msg.message,
//         );
      
//         if (isResponseClicked) {
//           Alert.alert("Response recieved!!")
//           //const FatigueResponse = parseInt(msg.message);
//           //const responseTime = new Date();
//           // LogService.LogFatigueResponse(FatigueResponse, responseTime)
//           //   .then(resp => {
//           //     console.log('FatigueResponse - ');
//           //     console.log(resp);
//           //   })
//           //   .catch(err => {
//           //     console.log(err);
//           //     LogService.Log(err.message);
//           //   });
//           const pendingAction = parseInt(msg.message);
//           const responseTime = new Date();
//           const LocalNotificationPendingActions = await GetLocalNotificationPendingActions();
//           // console.log("-----------Local Notifications Pending Actions Array---------");
//           // console.log(LocalNotificationPendingActions);
         
//           LocalNotificationPendingActions.push({pendingAction, responseTime});
//           // console.log("-----------Local Notifications Pending Actions Array Pushed---------");
//           // console.log(LocalNotificationPendingActions);
//           Alert.alert("Local Notifications Pending Actions Array Pushed");
//           Alert.alert(LocalNotificationPendingActions);
//           setLocalNotificationPendingActionsArray(LocalNotificationPendingActions);

//         }
//       }
//     },
//   );

//   initializeCheckExpiredActivityProcess();
// };

// const unsubscribeWatchConnectivityEvents = () => {
//   console.log('unsubscribeWatchConnectivityEvents');
//   console.log(watchRegisteredEvent);
//   //clearInterval(refreshIntervalId);

//   clearInterval(scheduledRefreshId);

//   if (watchRegisteredEvent) {
//     watchRegisteredEvent();
//     watchRegisteredEvent = null;
//   }
// };



// const sendPendingLocalNotificationActionsToServer =  () => {

//   Alert.alert("Sending to server!!!");
//   GetLocalNotificationPendingActions().then(pendingActions => {
    
//     const stringified = JSON.stringify(pendingActions);
//      Alert.alert(stringified);
  
//   pendingActions.map((pendingAction) => {
    
//     LogService.LogFatigueResponse(pendingAction.pendingAction, pendingAction.responseTime)
//               .then(resp => {
//                 console.log('FatigueResponse - ');
//                 console.log(resp);
//                 const stringifiedresp = JSON.stringify(resp);
//                 Alert.alert(stringifiedresp);
//               })
//               .catch(err => {
//                 console.log(err);
//                 LogService.Log(err.message);
//                 const stringifiedErr = JSON.stringify(err);
//                 Alert.alert(stringifiedErr);
//               });
//  })
//  console.log("---------Sending Ends-------");

// }).catch(err => {
//   console.log(err);
//   LogService.Log(err.message);
// });

// }

// export default {
//   initWatchConnectivityAlongWithEvents,
//   unsubscribeWatchConnectivityEvents,
//   startBackgroundAppRefresh,
//   sendPendingLocalNotificationActionsToServer
// };
