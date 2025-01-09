import DutyPeriodService from '../services/dutyPeriodService';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import UserService from '../services/userService';
import ApiService from '../services/apiService';
import LogService from '../services/logService';
import LookupService from '../services/lookupService';
import StorageService from '../services/storageService';
import PubSub from 'pubsub-js';
import AppleHealthKit, { HealthValue, HealthKitPermissions } from 'react-native-health';
import Enumerable from 'linq';
import utils from '../shared/utils';

const SurveyProcessor = {
  async SendPending() {
    //console.log('checking for periods');

    var pendingPeriods = await DutyPeriodService.GetPendingPeriods();
    var sendingPeriods = [];
    //console.log(pendingPeriods);
    if (pendingPeriods.length > 0) {
      //   console.log('sending periods ' + pendingPeriods);
      // send the periods to API - on success move the periods to complete

      // first convert each period
      pendingPeriods.forEach(x => {
        var activities = x.Activities;
        var dutyStart = x.DutyStart;
        var dutyEnd = x.DutyEnd;
        var mainSleep = x.MainSleep;

        var genericActivities = [];

        genericActivities.push(this.ConvertMainSleepToGenericActivity(mainSleep));

        if (dutyStart != null) {
          genericActivities.push(this.ConvertDutyStartToGenericActivity(dutyStart));
        }

        if (dutyEnd != null) {
          genericActivities.push(this.ConvertDutyEndToGenericActivity(dutyEnd));
        }

        //console.log(genericActivities);

        sendingPeriods.push({
          Activities: genericActivities.concat(this.ConvertActivitiesToGenericActivities(activities))
        });
      });

      var loggedInUser = await UserService.GetLoggedInUser();

      if (loggedInUser == null) return;
      console.log('logged in user is not null!!!');
      var instanceId = JSON.parse(loggedInUser.Instances)[0].Id;

      //var deviceId = getUniqueId();


      var deviceId = "BAD1809E-E872-48F5-9FA6-A11D0D7D7E83"

     // 80d58a05309031e1
      var userProfile = await UserService.GetUserProfile()

      var savedProfile = JSON.parse(userProfile);

      var payload = {
        periods: sendingPeriods,
        deviceID: deviceId,
        instanceId: instanceId,
        user: {
          homeBase: 'LHR',
          username: "test@test.com"
        },
        userProfile: {
          UserId: loggedInUser.Id,
          //JobRole: savedProfile.JobRoleId != null ? LookupService.GetLookupFromValue(savedProfile.JobRoleId, LookupService.GetJobRoles()).Value : null,
          Rank: savedProfile.RankId != null ? LookupService.GetLookupFromId(savedProfile.RankId, LookupService.GetRanks()).Value : null,
          //TimeInRole: savedProfile.TimeRoleId != null ? LookupService.GetLookupFromId(savedProfile.TimeRoleId, LookupService.GetTimeInRoles()).Value : null,
          AirportCode: savedProfile.HomeAirport != null ? savedProfile.HomeAirport.Id : null,
          HomeBase: savedProfile.HomeAirport != null ? savedProfile.HomeAirport.Value : null,
          Gender: savedProfile.GenderId != null ? LookupService.GetLookupFromId(savedProfile.GenderId, LookupService.GetGenders()).Value : null,
          Age: savedProfile.AgeId != null ? LookupService.GetLookupFromId(savedProfile.AgeId, LookupService.GetAges()).Value : null,
          Chronotype: savedProfile.ChronotypeId != null ? LookupService.GetLookupFromId(savedProfile.ChronotypeId, LookupService.GetChronotypes()).Value : null,
          CommuteTime: savedProfile.CommuteId != null ? LookupService.GetLookupFromId(savedProfile.CommuteId, LookupService.GetCommuteTimes()).Value : null,
          StudyName: savedProfile.StudyName          
        }
      }

      //console.log(payload.user);
      // now send to api

      //console.log(loggedInUser);
      //var response = await ApiService.Post('api/UploadSurveyPayload', payload);
      //console.log(response);

      var response = await this.UploadRecursive(payload);

      if (response && response.status >= 200 && response.status < 300) {
        // only when successful do we mark period as completed

        await DutyPeriodService.CompletePeriods(pendingPeriods);
        PubSub.publish('PERIODSCOMPLETED', null);
      }
    }
  },

  async UploadRecursive(payload, isHealthKitEnabled) {

    try {
      console.log('sending to API');
      var response = await ApiService.Post('api/UploadSurveyPayload', payload);


      if (isHealthKitEnabled) {
        try {

          let latestEndedPeriod = await StorageService.Get("latestEndedPeriod");

          if (latestEndedPeriod) {
            const healthKitData = await this.getHealthKitData(latestEndedPeriod);
            ApiService.Post("api/Survey/UploadHealthData", healthKitData).then(resp => {
              StorageService.Remove("latestEndedPeriod");
            }).catch(err => {
              console.log(err);
            })
          }
        } catch (err) {
          console.log(err);
        }
      }

      console.log(response.status);
      if (response.status > 300) {
        console.log('error: ' + response.status + ', waiting to retry');
        await this.Sleep(15000);
        console.log('retying...');
        await this.UploadRecursive(payload);
      }
      else {
        //LogService.Log("UPLOAD ERROR: " + response.toString());
        return response;
      }
    }
    catch (ex) {
      LogService.Log("UPLOAD ERROR: " + ex);
     // throw ex;
      /*console.log('error: ' + ex +', waiting to retry');
      await this.Sleep(15000);
      console.log('retying...');
      this.UploadRecursive(payload);*/
    }
  },

  async Sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
  },

  ConvertActivitiesToGenericActivities(activities) {
    var convertedActivities = [];

    activities.forEach(x => {
      convertedActivities.push(this.ConvertActivityToGenericActivity(x));
    });

    return convertedActivities;
  },

  ConvertActivityToGenericActivity(activity) {
    return {
      Activity: activity.ActivityType,
      DepartureAirport: activity.DepartureAirport != null ? activity.DepartureAirport.Value : null,
      DepartureAirportCode: activity.DepartureAirport != null ? activity.DepartureAirport.Id : null,
      ArrivalAirport: activity.ArrivalAirport != null ? activity.ArrivalAirport.Value : null,
      ArrivalAirportCode: activity.ArrivalAirport != null ? activity.ArrivalAirport.Id : null,
      StartDateTime: activity.StartDateTime,
      EndDateTime: activity.EndDateTime,
      NumberOfPilots: activity.NumberOfPilots,
      FatigueRating: activity.FatigueRating,
      Workload: activity.Workload,

      HassleFactors: activity.HassleFactors,

      SleepLocation: activity.SleepLocation,
      Details: activity.Details,
      ReasonForWaking: activity.ReasonForWaking,
      ModeOfTransport: activity.ModeOfTransport,
      Location: activity.Location,
      SleepQuality: activity.SleepQuality,
      SleptLongEnough: activity.SleptLongEnough,
      TimeReference: activity.TimeReference,
      JobRole: activity.JobRole
    }
  },

  ConvertMainSleepToGenericActivity(mainSleep) {
    return {
      Activity: "Main Sleep",
      StartDateTime: mainSleep.SleepStart,
      EndDateTime: mainSleep.SleepEnd,
      SleptLongEnough: mainSleep.SleptLongEnough,
      ReasonForWaking: mainSleep.ReasonForWaking,
      SleepLocation: mainSleep.SleepLocation,
      DepartureAirport: mainSleep.Airport.Value,
      DepartureAirportCode: mainSleep.AirportCode,
      SleepQuality: mainSleep.SleepQuality,
      FatigueRating: mainSleep.FatigueRating,
      OnStandBy: mainSleep.OnStandBy,
      TimeReference: mainSleep.TimeReference
    }
  },

  ConvertDutyStartToGenericActivity(dutyStart) {
    return {
      Activity: "Start Duty",
      StartDateTime: dutyStart.StartDateTime,
      DepartureAirport: dutyStart.DepartureAirport != null ? dutyStart.DepartureAirport.Value : null,
      DepartureAirportCode: dutyStart.DepartureAirport != null ? dutyStart.DepartureAirport.Id : null,
      FatigueRating: dutyStart.FatigueRating,
      Recovered: dutyStart.HasRecovered,
      TimeReference: dutyStart.TimeReference.Value
    }
  },

  ConvertDutyEndToGenericActivity(dutyEnd) {
    return {
      Activity: "End Duty",
      EndDateTime: dutyEnd.EndDateTime,
      ArrivalAirport: dutyEnd.ArrivalAirport != null ? dutyEnd.ArrivalAirport.Value : null,
      ArrivalAirportCode: dutyEnd.ArrivalAirport != null ? dutyEnd.ArrivalAirport.Id : null,
      FatigueRating: dutyEnd.FatigueRating,
      SectorsFlown: dutyEnd.SectorsFlown != null ? dutyEnd.SectorsFlown.Value : null,
      SupplyIssues: dutyEnd.SupplyIssues != null ? dutyEnd.SupplyIssues.Value : null,
      InstabilityIssues: dutyEnd.InstabilityIssues != null ? dutyEnd.InstabilityIssues.Value : null,
      AnythingElse: dutyEnd.AnythingElse,
      TimeReference: dutyEnd.TimeReference.Value
    }
  },

  async GetActivitesFromServer(email, overwrite, mergeMode, instanceId) {
    var payload = {
      email: email,
      overwrite: overwrite,
      mergeMode: mergeMode,
      instanceId: instanceId
    };

    try {

      return await ApiService.Get('api/Survey/PullActivitiesToDevice', payload);
    }
    catch (err) {
      console.log('error getting activities');
      console.log(err);
    }
  },

  async getHealthKitData(latestEndedPeriod) {


    let { MainSleep, DutyEnd } = JSON.parse(latestEndedPeriod);
    const sleepStartDateTime = new Date(MainSleep.SleepStart);
    sleepStartDateTime.setMinutes(0, 0, 0);
    const dutyEndDateTime = new Date(DutyEnd.EndDateTime);
    dutyEndDateTime.setMinutes(0, 0, 0);

    const bodyTemperature = await this.getBodyTemperature(sleepStartDateTime, dutyEndDateTime);
    const sleepData = await this.getSleepAnalysisData(sleepStartDateTime, dutyEndDateTime);
    const activeEnergyBurnt = await this.getActiveEnergyBurnt(sleepStartDateTime, dutyEndDateTime);

    const heartRateSamples = await this.getHeartRate(sleepStartDateTime, dutyEndDateTime);
    const heartRate = this.getHourlyHeartRate(heartRateSamples);

    return {
      sleepStartDate: sleepStartDateTime,
      dutyEndDate: dutyEndDateTime,
      bodyTemperature,
      sleepData,
      activeEnergyBurnt,
      heartRate
    }
  },

  getHeartRate(startDate, endDate) {

    let heartRateOptions = {
      unit: 'bpm', // optional; default 'bpm'
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ascending: true
    };
    if(utils.checkIfPlatformIOS())

{    return new Promise(
      (resolve, reject) => {
        AppleHealthKit.getHeartRateSamples(heartRateOptions, (err, results) => {
          if (err) reject(err);

          resolve(results);
        })
      });}
  },

  getHourlyHeartRate(heartRateSamples) {

    const groupedHeartRates = this.getHourlyGroupedHeartRates(heartRateSamples);

    return groupedHeartRates.map(heartRates => {
      const averageValue = heartRates.map(heartRate => heartRate.value).reduce((a, b) => a + b) / heartRates.length;
      return { value: Math.abs(Math.round(averageValue)), startDate: heartRates[0].startDate, endDate: heartRates[0].endDate };
    });
  },

  getHourlyGroupedHeartRates(heartRateSamples) {

    const heartRates = heartRateSamples.map(heartRate => {
      const hour = new Date(heartRate.startDate).getHours();
      const day = new Date(heartRate.startDate).getDay();
      const groupId = `${day}-${hour}`;

      const startDateHourTimeStamp = new Date(heartRate.startDate).setMinutes(0, 0, 0);
      const startDate = new Date(startDateHourTimeStamp).toISOString();

      let endDate = this.getAddedHoursEndDate(hour, heartRate.endDate);
      const endDateHourTimeStamp = new Date(endDate).setMinutes(0, 0, 0);
      endDate = new Date(endDateHourTimeStamp).toISOString();

      return { ...heartRate, groupId, startDate, endDate };
    });

    return Enumerable.from(heartRates).groupBy(heartRate => heartRate.groupId).select(x => x.getSource()).toArray();
  },

  getBodyTemperature(startDateTime, endDateTime) {

    let options = {
      unit: "fahrenheit",
      startDate: new Date(startDateTime).toISOString(),
      endDate: new Date(endDateTime).toISOString(),
      ascending: true
    };
    if(utils.checkIfPlatformIOS() )
{    return new Promise(
      (resolve, reject) => {
        AppleHealthKit.getBodyTemperatureSamples(options, (err, results) => {
          if (err) reject(err);

          const parsedResults = this.getParsedActivityResults(results);

          resolve(parsedResults);
        })
      });}
  },

  getActiveEnergyBurnt(startDateTime, endDateTime) {
    let options = {
      startDate: new Date(startDateTime).toISOString(),
      endDate: new Date(endDateTime).toISOString(),
      ascending: true
    };
    if(utils.checkIfPlatformIOS())
{
    return new Promise(
      (resolve, reject) => {
        AppleHealthKit.getActiveEnergyBurned(options, (err, results) => {
          if (err) reject(err);

          const parsedResults = this.getParsedActivityResults(results);

          resolve(parsedResults);
        })
      });}
  },

  getSleepAnalysisData(startDateTime, endDateTime) {
    let options = {
      startDate: new Date(startDateTime).toISOString(),
      endDate: new Date(endDateTime).toISOString()
    };
    if(utils.checkIfPlatformIOS())

{    return new Promise(
      (resolve, reject) => {
        AppleHealthKit.getSleepSamples(options, (err, results) => {
          if (err) reject(err);

          const parsedResult = results ?.length ? { value: results[0]["value"], startDate: results[0]["startDate"], endDate: results[0]["endDate"] } : [];

          resolve(parsedResult);
        })
      });}
  },

  getParsedActivityResults(results) {
    return results.map(result => {
      const startDate = new Date(result.startDate).toISOString();
      const endDate = this.getAddedHoursEndDate(new Date(result.startDate).getHours(), result.endDate);
      return { value: result.value, startDate, endDate };
    })
  },

  getAddedHoursEndDate(hour, endDate) {
    const hoursToAddInEndDate = hour + 1;
    return this.addHours(endDate, hoursToAddInEndDate).toISOString();
  },

  addHours(dateTime, hour) {
    return new Date(new Date(dateTime).setHours(hour));
  }

  //GetSurveyUpload(string userId, int instanceId) {
}

export default SurveyProcessor;
