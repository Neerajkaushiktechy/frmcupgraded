import React from 'react';
import { Alert } from "react-native"
import ApiService from './apiService'
import StorageService from './storageService';
import Enumerable from 'linq'
import UtilityService from '../services/utilityService'
import UserService from './userService'
import AirportRepository from '../data/airportsRepository'
import DateService from './dateService';

const DutyPeriodService = {
    async AddPeriod(period) {

        // add to sync storage
        const dutyPeriods = await this.GetPeriods();
        const { Id } = await UserService.GetLoggedInUser() || {};
        period.UserId = Id;

        if (!dutyPeriods.length) {
            StorageService.Set("DutyPeriods", JSON.stringify([period]));
        }
        else {
            dutyPeriods.push(period);
            StorageService.Set("DutyPeriods", JSON.stringify(dutyPeriods));
        }
    },

    async UpdatePeriod(period) {
        // replace in sync storage
        var dutyPeriods = await this.GetPeriods();

        var existingPeriod = Enumerable.from(dutyPeriods).first(x => x.Key == period.Key);

        dutyPeriods.splice(dutyPeriods.indexOf(existingPeriod), 1);
        dutyPeriods.push(period);

        console.log(JSON.stringify(dutyPeriods));
        StorageService.Set("DutyPeriods", JSON.stringify(dutyPeriods));
    },

    async CompletePeriods(periods) {
        for (i = 0; i < periods.length; i++) {
            periods[i].Status = "complete";
            await this.UpdatePeriod(periods[i]);
        }
    },

    async DeletePeriod(period) {
        var dutyPeriods = await this.GetPeriods();

        var existingPeriod = Enumerable.from(dutyPeriods).first(x => x.Key == period.Key);

        dutyPeriods.splice(dutyPeriods.indexOf(existingPeriod), 1);
        StorageService.Set("DutyPeriods", JSON.stringify(dutyPeriods));
    },

    async DeleteAllDutyPeriod() {
        const { Id } = await UserService.GetLoggedInUser();
        let dutyPeriods = await this.GetPeriods();
        dutyPeriods = dutyPeriods.filter(x => x.UserId !== Id);
        StorageService.Set("DutyPeriods", JSON.stringify(dutyPeriods));
    },

    async GetUserSpecificPeriods() {
        var dutyPeriods = await this.GetPeriods();
        var { Id } = await UserService.GetLoggedInUser() || {};
        dutyPeriods = dutyPeriods.filter(dutyPeriod => dutyPeriod.UserId === Id);

        return dutyPeriods;
    },

    async GetPeriods() {
        var dutyPeriods = await StorageService.Get("DutyPeriods");
        var parsedDutyPeriods = JSON.parse(dutyPeriods) || [];

        return parsedDutyPeriods;
    },

    async GetSelectedPeriod(selectedPeriodKey) {
        var dutyPeriods = await this.GetUserSpecificPeriods();
        selectedDutyPeriod = dutyPeriods.find(x => x.MainSleep.Key === selectedPeriodKey);

        return selectedDutyPeriod;
    },

    async GetIncompletePeriods() {
        var dutyPeriods = await this.GetUserSpecificPeriods();
        var incompletePeriods = Enumerable.from(dutyPeriods).where(x => x.Status == "incomplete").toArray();
        return incompletePeriods;
    },

    async GetPendingPeriods() {
        var dutyPeriods = await this.GetUserSpecificPeriods();

        if (dutyPeriods.length) {
                var pendingPeriods = Enumerable.from(dutyPeriods).where(x => x.Status == "pending").toArray();
                return pendingPeriods;
        }
        return dutyPeriods;
    },

    async GetCompletePeriods() {
        var dutyPeriods = await this.GetUserSpecificPeriods();
        var completePeriods = Enumerable.from(dutyPeriods).where(x => x.Status == "complete").toArray();
        return JSON.parse(completePeriods);
    },

    async AppendData(data) {
        const { Id } = await UserService.GetLoggedInUser() || {};
        var convertedPeriods = this.ConvertServerActivitiesToPeriods(data, Id);
        var existingPeriods = await this.GetPeriods();
        var concatPeriods = convertedPeriods.concat(existingPeriods);
        StorageService.Set("DutyPeriods", JSON.stringify(concatPeriods));
    },

    async OverwriteData(data) {
        var convertedPeriods = await this.ParseServerPeriods(data);
        StorageService.Set("DutyPeriods", JSON.stringify(convertedPeriods));
    },

    async BackupPeriods() {
        var dutyPeriods = await this.GetPeriods();
        StorageService.Set("BackupDutyPeriods", dutyPeriods);
    },

    async RestorePeriods() {
        var backupDutyPeriods = await StorageService.Get("BackupDutyPeriods");
        StorageService.Set("DutyPeriods", backupDutyPeriods);
    },

    async SyncDutyStart(dutyStart) {
        const { Id, DefaultInstance } = await UserService.GetLoggedInUser();

        // var dutyStart = {
        //     ActivityType : 'test',
        //     Key :'cc83744a-7141-4fdc-afaf-d17771c7f4b0',
        //     PeriodKey :'cc83744a-7141-4fdc-afaf-d17771c7f4b0'
        // };

        ApiService.Post('api/Survey/UpsertSyncDutyStart', { syncDutyStart: dutyStart, instanceId: DefaultInstance.Id })
            .then(x => {


            });
    },

    async SyncDutyEnd(dutyEnd) {
        const { Id, DefaultInstance } = await UserService.GetLoggedInUser();

        ApiService.Post('api/Survey/UpsertSyncDutyEnd', { syncDutyEnd: dutyEnd, instanceId: DefaultInstance.Id });
    },

    async SyncMainSleep(mainSleep) {
        const { Id, DefaultInstance } = await UserService.GetLoggedInUser();

        ApiService.Post('api/Survey/UpsertSyncMainSleep', { syncMainSleep: mainSleep, instanceId: DefaultInstance.Id });
    },

    async SyncActivity(activity) {
        const { Id, DefaultInstance } = await UserService.GetLoggedInUser();

        ApiService.Post('api/Survey/UpsertSyncActivity', { syncActivity: activity, instanceId: DefaultInstance.Id });
    },

    async SyncPeriod(period) {
        const { Id, DefaultInstance } = await UserService.GetLoggedInUser();
        period.UserId = Id;
        ApiService.Post('api/Survey/UpsertSyncPeriod', { syncPeriod: period, instanceId: DefaultInstance.Id });
    },

    async ParseServerPeriods(serverPeriods) {
        var periods = [];

        var loggedInUser = await UserService.GetLoggedInUser();
        var profile = await UserService.GetUserProfile();

        var parsedProfile = JSON.parse(profile);
        var airportCodeFormatId = parsedProfile.AirportCodeFormatId;

        for (i = 0; i < serverPeriods.length; i++) {
            var serverPeriod = serverPeriods[i];


            var serverDutyStart = serverPeriod.SyncDutyStart;
            var serverDutyEnd = serverPeriod.SyncDutyEnd;
            var serverActivities = serverPeriod.SyncActivities;
            var serverMainSleep = serverPeriod.SyncMainSleep;



            var period = {
                Key: serverPeriod.Key,
                Status: "incomplete",
                BaseOffset: serverPeriod.BaseOffset * 60,
                UserId: loggedInUser.Id
            };

            // dates comes from server as UTC. we persist the string without Z suffix.
            // We carry airports and offsets so we can convert times
            // when we send them back to server we need to adjust the dates so that the server will work out UTC

var serverMainSleepStart = serverMainSleep.SleepStart +'.000Z';
var serverMainSleepEnd = serverMainSleep.SleepEnd + '.000Z';
var convertedMainSleepStart = await DateService.ConvertTimesByAirport(DateService.ParseUTCDateString(serverMainSleepStart), 2, 1, serverMainSleep.AirportId, parsedProfile.HomeAirport.Id);
var convertedMainSleepEnd = await DateService.ConvertTimesByAirport(DateService.ParseUTCDateString(serverMainSleepEnd), 2, 1, serverMainSleep.AirportId, parsedProfile.HomeAirport.Id);

            // quick fix to move sleep start back by one day if bed time is greater than wake time (i.e. goes to bed before midnight)

            if (convertedMainSleepStart > convertedMainSleepEnd)
            {          
                  
                convertedMainSleepStart.setDate(convertedMainSleepStart.getDate() - 1);
            }

            var mainSleep = {
                Key: serverMainSleep.Key,
                AirportId: serverMainSleep.AirportId,
                //AirportOffset:serverMainSleep.AirportOffset*60,
                SleepStart: convertedMainSleepStart.toISOString(), //DateService.AddMinutes(new Date(serverMainSleep.SleepStart), serverMainSleep.AirportOffset*60),
                SleepEnd: convertedMainSleepEnd.toISOString(), //DateService.AddMinutes(new Date(serverMainSleep.SleepEnd), serverMainSleep.AirportOffset*60),
                TimeReference: 'UTC', // serverMainSleep.TimeReference, // changed to local
                ReasonForWaking: "",
                SleepLocation: "",
                FatigueRating: 0,
                SleepQuality: 0,
                OnStandBy: null,
                SleptLongEnough: null,

                IsImport: true,
                HasBeenOpened: false,
                HasBeenSaved:false,
                IsComplete: false

            }

            var dutyStart = {
                Key: serverDutyStart.Key,
                ActivityType: 'Start of duty',
                StartDateTime: serverDutyStart.StartDateTime +'.000Z', //DateService.AddMinutes(new Date(serverDutyStart.StartDateTime), serverDutyStart.DepartureAirportOffset*60),                
                TimeReference: 'UTC', // serverDutyStart.TimeReference,
                DepartureAirportId: serverDutyStart.DepartureAirportId, // need to get the airport by id
                //DepartureAirportOffset: serverDutyStart.DepartureAirportOffset*60,
                FatigueRating: null,
                HasRecovered: null,

                IsImport: true,
                HasBeenOpened: false,
                IsComplete: false
            }

            // console.log(dutyStart);

            var dutyEnd = {
                Key: serverDutyEnd.Key,
                ActivityType: 'End of duty',
                EndDateTime: serverDutyEnd.EndDateTime +'.000Z', //DateService.AddMinutes(new Date(serverDutyEnd.EndDateTime), serverDutyEnd.ArrivalAirportOffset*60),                
                TimeReference: 'UTC', //serverDutyEnd.TimeReference,
                ArrivalAirportId: serverDutyEnd.ArrivalAirportId,
                //ArrivalAirportOffset: serverDutyEnd.ArrivalAirportOffset*60,
                FatigueRating: null,
                SectorsFlown: null,
                SupplyIssues: null,
                InstabilityIssues: null,
                AnythingElse: null,
                HassleFactors: [],
                IsImport: true,
                HasBeenOpened: false,
                IsComplete: false
            }


            if (mainSleep.AirportId != null) {

                await AirportRepository.SearchById(mainSleep.AirportId, results => {

                    if (results.length > 0) {

                        var result = results[0];
                        mainSleep.Airport = { Id: result.Id, Value: result.Name, Code: airportCodeFormatId == 2 ? result.ICAOCode : result.IATACode };
                        mainSleep.FullAirport = result;

                    }

                });

            }


            if (dutyStart.DepartureAirportId != null) {
                await AirportRepository.SearchById(dutyStart.DepartureAirportId, results => {
                    if (results.length > 0) {

                        var result = results[0];
                        dutyStart.DepartureAirport = { Id: result.Id, Value: result.Name, Code: airportCodeFormatId == 2 ? result.ICAOCode : result.IATACode };
                        dutyStart.FullDepartureAirport = result;
                    }
                });
            }

            if (dutyEnd.ArrivalAirportId != null) {
                await AirportRepository.SearchById(dutyEnd.ArrivalAirportId, (results) => {
                    if (results.length > 0) {
                        var result = results[0];
                        dutyEnd.ArrivalAirport = { Id: result.Id, Value: result.Name, Code: airportCodeFormatId == 2 ? result.ICAOCode : result.IATACode };
                        dutyEnd.FullArrivalAirport = result;
                    }
                });
            }



            period.MainSleep = mainSleep;
            period.DutyStart = dutyStart;
            period.DutyEnd = dutyEnd;
            period.Activities = [];
            console.log(serverActivities.length);

            for (const serverActivity of serverActivities)
            //serverActivities.forEach(async serverActivity => 
            {

                var activity = {
                    Key: serverActivity.Key,
                    ActivityType: serverActivity.ActivityType,
                    DepartureAirportId: serverActivity.DepartureAirportId,
                    //DepartureAirportOffset: serverActivity.DepartureAirportOffset * 60,
                    //DepartureAirport: this.state.selectedDepartureAirport,
                    ArrivalAirportId: serverActivity.ArrivalAirportId,
                    //ArrivalAirportOffset: serverActivity.ArrivalAirportOffset * 60,
                    //ArrivalAirport: this.state.selectedArrivalAirport,
                    StartDateTime: serverActivity.StartDateTime +'.000Z', //DateService.AddMinutes(new Date(serverActivity.StartDateTime), serverActivity.DepartureAirportOffset*60),
                    EndDateTime: serverActivity.EndDateTime+'.000Z', //DateService.AddMinutes(new Date(serverActivity.EndDateTime), serverActivity.ArrivalAirportOffset*60),
                    //StartDateTimeUtc: new Date(serverActivity.StartDateTime),
                    //EndDateTimeUtc: new Date(serverActivity.EndDateTime),
                    TimeReference: 'UTC', //serverActivity.TimeReference,
                    NumberOfPilots: "0",//serverActivity.NumberOfPilots,
                    JobRole: "",
                    
                    FatigueRating: null,
                    Workload: null,
                    

                    HassleFactors: [],

                    SleepLocation: "",
                    Details: null,

                    ReasonForWaking: "",
                    ModeOfTransport: "",
                    Location: "",
                    SleepQuality: null,
                    FatigueRating: null,
                    Workload: 50,
                    SleptLongEnough: null,

                    IsImport: true,
                    HasBeenOpened: false,
                    IsComplete: false
                }

                console.log('dep code');
                console.log(activity.DepartureAirportId);
                if (activity.DepartureAirportId != null) {
                    await AirportRepository.SearchById(activity.DepartureAirportId, (results) => {



                        if (results.length > 0) {
                            var result = results[0];
                            console.log('dep');
                            console.log(result);
                            activity.DepartureAirport = { Id: result.Id, Value: result.Name, Code: airportCodeFormatId == 2 ? result.ICAOCode : result.IATACode };
                            activity.FullDepartureAirport = result;
                        }
                    });
                }

                if (activity.ArrivalAirportId != null) {
                    await AirportRepository.SearchById(activity.ArrivalAirportId, (results) => {
                        if (results.length > 0) {
                            var result = results[0];
                            activity.ArrivalAirport = { Id: result.Id, Value: result.Name, Code: airportCodeFormatId == 2 ? result.ICAOCode : result.IATACode };
                            activity.FullArrivalAirport = result;
                        }
                    });
                }
                console.log(activity);
                
                period.Activities.push(activity);
            };

            periods.push(period);

        }

        return periods;
        
    },

    ConvertServerActivitiesToPeriods(activities, userId) {
        var periods = [];
        var currentPeriod = { Status: 'incomplete', Activities: [], Key: UtilityService.GenerateUuidv4(), UserId: userId };

        var orderedActivities = Enumerable.from(activities).orderBy(x => x.StartDateTime != null ? x.StartDateTime : x.EndDateTime).toArray();

        orderedActivities.forEach(x => {
            var activity = x.Activity;
            var startDateTime = x.StartDateTime;
            var endDateTime = x.EndDateTime
            var timeReference = x.TimeReference;


            if (activity == "Start Duty") {
                currentPeriod.DutyStart = {
                    ActivityType: 'Start of duty',
                    StartDateTime: startDateTime,
                    DepartureAirportCode: x.StartAirportCode,
                    TimeReference: timeReference
                }
            }

            if (activity == "End Duty") {
                currentPeriod.DutyEnd = {
                    ActivityType: 'End of duty',
                    EndDateTime: endDateTime,
                    ArrivalAirportCode: x.EndAirportCode,
                    SectorsFlown: x.SectorsFlown,
                    TimeReference: timeReference
                }

                periods.push(currentPeriod);
                currentPeriod = { Status: 'incomplete', Activities: [], Key: UtilityService.GenerateUuidv4(), UserId: userId };
            }

            if (activity == "Main Sleep") {
                currentPeriod.MainSleep = {
                    SleepStart: startDateTime,
                    SleepEnd: endDateTime,
                    DepartureAirportCode: x.StartAirportCode,
                    TimeReference: timeReference
                }
            }

            if (activity != "Start Duty" && activity != "End Duty" && activity != "Main Sleep") {
                var newActivity = {
                    Key: UtilityService.GenerateUuidv4(),
                    ActivityType: activity,
                    StartDateTime: startDateTime,
                    EndDateTime: endDateTime,
                    TimeReference: timeReference
                }

                if (activity == "Flight") {
                    newActivity.NumberOfPilots = x.NumberOfPilots;
                }

                if (activity == "Travel") {
                    newActivity.ModeOfTransport = x.ModeOfTransport;
                }

                currentPeriod.Activities.push(newActivity);
            }


        });

        return periods;
    },

    ValidatePeriod(period) {
        var errors = [];
        let inCompletedActivityErrors = [];
        // convert duty start and end into activities so we can arrange all in chronological order
        // one pass to check for inconsistent start and end locations
        // one pass to check for inconsistent start and end times

        if(!period.MainSleep.IsComplete)
        {
            errors.push("Main sleep is incomplete");
        }

        if(!period.DutyStart.IsComplete){
            const {StartDateTime} = period.DutyStart;
            inCompletedActivityErrors.push({ message: 'Duty Start is incomplete', dateTime: this.GetIsoFormattedDateTime(StartDateTime)});
        }

        if(!period.DutyEnd.IsComplete){
            const {EndDateTime} = period.DutyEnd;
            inCompletedActivityErrors.push({ message: 'Duty End is incomplete', dateTime: this.GetIsoFormattedDateTime(EndDateTime)});
        }

        var activities = period.Activities;
        
        if (activities.length) {
            //activities.push(period.DutyStart);
            //activities.push(period.DutyEnd);

            var ordereredActivities = Enumerable.from(activities).orderBy(x => x.StartDateTime).toArray();



            var firstActivity = ordereredActivities[0];
            var firstActivityStartLocation = firstActivity.DepartureAirport.Code;
            var lastActivity = ordereredActivities[ordereredActivities.length - 1];
            var lastActivityEndLocation = null;

            if (lastActivity.ArrivalAirport != null) lastActivityEndLocation = lastActivity.ArrivalAirport.Code;
            if (lastActivity.ArrivalAirport == null && lastActivity.DepartureAirport != null) lastActivityEndLocation = lastActivity.DepartureAirport.Code;

            if (lastActivityEndLocation != period.DutyEnd.ArrivalAirport.Code) {
                errors.push("Your duty end does not occur where your last activity finishes at " + lastActivityEndLocation);
            }
            else {
                if (lastActivity.StartDateTime > period.DutyEnd.EndDateTime || lastActivity.EndDateTime > period.DutyEnd.EndDateTime) {
                    errors.push("You cannot have an activity ending after your duty end time");
                    return errors;
                }
            }

            if (firstActivityStartLocation != period.DutyStart.DepartureAirport.Code) {
                errors.push("Your " + firstActivity.ActivityType + " activity at " + firstActivityStartLocation + " does not start where your duty starts at " + period.DutyStart.DepartureAirport.Code);
            }

            ordereredActivities.forEach(activity => {
                var activityIndex = ordereredActivities.indexOf(activity);
                if (activityIndex > 0) {

                    var previousActivity = ordereredActivities[activityIndex - 1];

                    console.log(activityIndex);
                    console.log(previousActivity);
                    var previousEndLocation = null;

                    if (previousActivity.ArrivalAirport != null) previousEndLocation = previousActivity.ArrivalAirport.Code;
                    if (previousActivity.ArrivalAirport == null && previousActivity.DepartureAirport != null) previousEndLocation = previousActivity.DepartureAirport.Code;

                    if (previousEndLocation != activity.DepartureAirport.Code) // first check if locations chain
                    {
                        errors.push('Your ' + activity.ActivityType + ' activity at ' + activity.DepartureAirport.Code + ' doesn\'t start where your ' + previousActivity.ActivityType + ' activity finishes at ' + previousEndLocation + '. Please add a Positioning activity in between.');
                    }
                    else {
                        if (new Date(previousActivity.EndDateTime) > new Date(activity.StartDateTime)) // now that the locations chain check times for overlapping
                        {
                            
                            errors.push('Your ' + activity.ActivityType + ' activity starting at ' + activity.DepartureAirport.Code + ' starts before your ' + previousActivity.ActivityType + ' activity finshes at ' + previousEndLocation);
                        }
                    }

                }
            });


            const inCompletedActivities = ordereredActivities.filter(activity => !activity.IsComplete).map(({ActivityType, StartDateTime}) =>{
                return {activityType: ActivityType, dateTime: StartDateTime}
            } );

            if (inCompletedActivities.length) {
                inCompletedActivities.forEach(({activityType, dateTime}) => {
                    inCompletedActivityErrors.push({ message: `${activityType}  is incomplete.`, dateTime: this.GetIsoFormattedDateTime(dateTime)});
                })
            }

            

            
        }
        
        inCompletedActivityErrors = Enumerable.from(inCompletedActivityErrors).orderBy(error => error.dateTime).select(x => x.message).toArray();

        errors = [...errors, ...inCompletedActivityErrors];

        return errors;
    },

    GetIsoFormattedDateTime(dateTime) {
       const convertedUtcDateTime =  new Date(dateTime).toISOString();
       return Date.parse(convertedUtcDateTime);
    },

    ValidateActivity(activity) {
        return null;
    },

    GetIncompletedActivitiesMessage(inCompleteActivities) {
        return `${inCompleteActivities.join(' , ')} not completed yet.`;
    },

    async MergeLocalAndServerChanges(serverData, keepServerData, navigation) {


        serverData = serverData || [];
        const loggedInUser = await UserService.GetLoggedInUser();
        const convertedServerPeriods = await this.ParseServerPeriods(serverData) || [];
        let allPeriods = await this.GetPeriods();
        let loggedInUserPeriods = JSON.parse(JSON.stringify(allPeriods.filter(x => x.UserId === loggedInUser.Id)));
        allPeriods = allPeriods.filter(period => !loggedInUserPeriods.find(userPeriod => period.UserId === userPeriod.UserId));

        let mergedPeriods = [];

        if (keepServerData) {
            const unConflictedLocalPeriods = this.GetLocalUnConflictedPeriods(loggedInUserPeriods, convertedServerPeriods);
            mergedPeriods = [ ...allPeriods, ...convertedServerPeriods, ...unConflictedLocalPeriods];
        }
        else {
            const unConflictedServerPeriods = this.GetServerUnConflictedPeriods(convertedServerPeriods, loggedInUserPeriods);
            mergedPeriods = [ ...allPeriods, ...loggedInUserPeriods, ...unConflictedServerPeriods];
        }

        StorageService.Set("DutyPeriods", JSON.stringify(mergedPeriods))
        Alert.alert("Success");
        navigation.navigate('AllPeriods');
    },

    GetLocalUnConflictedPeriods(localPeriods, serverPeriods) {
        return this.GetUnConflictedPeriods(localPeriods, serverPeriods);
    },

    GetServerUnConflictedPeriods(serverPeriods, localPeriods) {
        return this.GetUnConflictedPeriods(serverPeriods, localPeriods);
    },

    GetUnConflictedPeriods(periodsToReturn, periodsToCompare) {
        return periodsToReturn.filter(period => {

            const periodEndDateTime = this.GetPeriodEndDateTime(period);
            if (!periodEndDateTime) return true;
            const periodMainSleepStartTime = DateService.GetISOFormatUTCString(period.MainSleep.SleepStart);

            const filteredComparedPeriod = periodsToCompare.find(periodToCompare => {
                const comparedPeriodEndDateTime = this.GetPeriodEndDateTime(periodToCompare);
                if (!comparedPeriodEndDateTime) return;

                const comparedPeriodMainSleepStartTime = DateService.GetISOFormatUTCString(periodToCompare.MainSleep.SleepStart);
                const isPeriodConflicting = this.CheckIfPeriodsAreConflicting(periodMainSleepStartTime, comparedPeriodMainSleepStartTime, periodEndDateTime, comparedPeriodEndDateTime);

                if (isPeriodConflicting) {
                    return periodToCompare;
                }

                else {
                    return;
                }

            })
            return !filteredComparedPeriod;
        })
    },

    GetPeriodEndDateTime(period) {
        const { Activities = [], DutyEnd = "" } = period;
        const lastActivity = this.GetLastActivityOfPeriodIfAny(Activities);
        const lastActivityEndDateTime = this.GetISOFormatParsedDateTime(lastActivity ?.EndDateTime);
        const dutyEndDateTime = this.GetISOFormatParsedDateTime(DutyEnd ?.EndDateTime);
        const periodEndDateTime = dutyEndDateTime || lastActivityEndDateTime;
        return periodEndDateTime;
    },

    GetLastActivityOfPeriodIfAny(Activities) {
        const lastActivityIndex = Activities.length - 1;
        lastActivityIndex ? Activities[lastActivityIndex] : "";
    },

    GetISOFormatParsedDateTime(DateTime) {
        return DateTime ? DateService.GetISOFormatUTCString(DateTime) : "";
    },

    CheckIfPeriodsAreConflicting(periodOneStartTime, periodTwoStartTime, periodOneEndTime, periodTwoEndTime) {
        const isInBetween = this.CheckIfIsInBetween(periodOneStartTime, periodTwoStartTime, periodOneEndTime, periodTwoEndTime);
        const isOverlapping = this.CheckIfIsOverlapping(periodOneStartTime, periodTwoStartTime, periodOneEndTime, periodTwoEndTime)
        return isInBetween || isOverlapping;
    },

    CheckIfIsInBetween(periodOneStartTime, periodTwoStartTime, periodOneEndTime, periodTwoEndTime) {
        const isPeriodOneBigger = (new Date(periodOneStartTime) <= new Date(periodTwoStartTime) && new Date(periodOneEndTime) >= new Date(periodTwoEndTime));
        const isPeriodTwoBigger = (new Date(periodTwoStartTime) <= new Date(periodOneStartTime) && new Date(periodTwoEndTime) >= new Date(periodOneEndTime));
        return isPeriodOneBigger || isPeriodTwoBigger;
    },

    CheckIfIsOverlapping(periodOneStartTime, periodTwoStartTime, periodOneEndTime, periodTwoEndTime) {
        const isPeriodOneBigger = (new Date(periodOneStartTime) <= new Date(periodTwoStartTime) && new Date(periodOneEndTime) >= new Date(periodTwoStartTime) && new Date(periodTwoEndTime) >= new Date(periodOneEndTime));
        const isPeriodTwoBigger = (new Date(periodTwoStartTime) <= new Date(periodOneStartTime) && new Date(periodTwoEndTime) >= new Date(periodOneStartTime) && new Date(periodOneEndTime) >= new Date(periodTwoEndTime));
        return isPeriodOneBigger || isPeriodTwoBigger;
    }
};

export default DutyPeriodService;