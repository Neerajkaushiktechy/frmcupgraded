import React from 'react';
import ApiService from './apiService'
import UserService from './userService'
import { getDeviceName } from 'react-native-device-info';

const LogService = {
    Log: async function(message) {
        const {Id, DefaultInstance} = await UserService.GetLoggedInUser();

        const log = {
            User: Id,
            Data: message,
            LogDate: new Date(),
            DeviceType: await getDeviceName(),
            InstanceId: DefaultInstance.Id
        }

        ApiService.Post('api/Survey/Log', log);
    },

    LogFatigueResponse: async function(FatigueResponse, ResponseTime) {
        const {Id, DefaultInstance} = await UserService.GetLoggedInUser();


        const log = {
            FatigueResponseLogId: null,
            UserId: Id,
            ResponseTime,
            FatigueResponse,
            InstanceId: DefaultInstance.Id
        }
        
        return ApiService.Post('api/Survey/LogUserFatigueResponse', log)
    }
};

export default LogService;