import React from 'react';
import ApiService from './apiService'
import UserService from './userService'
import { getDeviceName } from 'react-native-device-info';
import LogService from '../services/logService';

const TokenRegisterationService = {
    SaveDeviceToken: async function(deviceRegisterationToken) {
        const {Id, DefaultInstance} = await UserService.GetLoggedInUser();

        const devicePayload = {
            DeviceToken: deviceRegisterationToken.token,
            InstanceId: DefaultInstance.Id
        }
        LogService.Log('device payload '+ JSON.stringify(devicePayload));
        
      return ApiService.Post('api/Survey/Register', devicePayload);
    }
};

export default TokenRegisterationService;