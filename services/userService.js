import ApiService from './apiService';
import StorageService from './storageService';

const UserService = {
  async GetUserProfile() {
    var userProfiles = await this.GetAllUserProfiles();
    const { Id } = await this.GetLoggedInUser();
    const loggedInAccountUserProfile = userProfiles.find(userProfile => userProfile.UserId === Id);
    
    return loggedInAccountUserProfile? JSON.stringify(loggedInAccountUserProfile): null;
  },

  async GetAllUserProfiles() {
    var userProfiles = await StorageService.Get('UserProfiles');
    userProfiles = JSON.parse(userProfiles) || [];
    return userProfiles;
  },

  async UpsertUserProfile(profile) {
    let userProfiles = await this.GetAllUserProfiles();
    const { Id } = await UserService.GetLoggedInUser() || {};
    profile = JSON.parse(profile);
    profile.UserId = Id;

    userProfiles = userProfiles.filter(x => x.UserId !== Id);

    if (!userProfiles.length) {
      StorageService.Set("UserProfiles", JSON.stringify([profile]));
    }
    else {
      userProfiles.push(profile);
      StorageService.Set("UserProfiles", JSON.stringify(userProfiles));
    }
  },

  SetLoggedInUser(user) {
   return StorageService.Set('LoggedInUser', JSON.stringify(user));
  },

  async GetLoggedInUser() {
    return ApiService.GetLoggedInUser();
  },

  async Logout() {
    await StorageService.Remove('LoggedInUser');
  },

  async Link(email) {   

    var loggedInUser = await this.GetLoggedInUser();
    var payload = {
      email: email,
      instanceId: loggedInUser.DefaultInstance.Id,
    };

    var result = await ApiService.Post('api/Survey/LinkEmail', payload);
    console.log(result);

    if (result.ok) {
      return true;
    } else {
      return false;
    }
  },

  async Verify(code, email) {
    var loggedInUser = await this.GetLoggedInUser();
    var payload = {
      email: email,
      code: code,
      instanceId: loggedInUser.DefaultInstance.Id,
    };

    console.log('payload');
    console.log(JSON.stringify(payload));

    var result = await ApiService.Post('api/Survey/VerifyEmail', payload);
    console.log('verified?');
    var success = await result.text();
    console.log(success);
    if (success == 'true') {
      return true;
    } else {
      return false;
    }
  },

  async syncAccountProfile(accountProfile) {
    var loggedInUser = await this.GetLoggedInUser();

    var accountProfilePayload = {
      AccountProfile:accountProfile,
      InstanceId:loggedInUser.DefaultInstance.Id      
    }
    
    var result = await ApiService.Post(
      'api/Survey/SyncAccountProfile',
      accountProfilePayload,
    );
    return result;
  },

  async checkIfAllRequiredSettingsAreConfigured(props) {
    const {navigate} = props.navigation;
    const profile = await this.GetUserProfile();
    const parsedProfile = JSON.parse(profile);
    const isTimeZoneHasValue = parsedProfile? parsedProfile['TimeZone'] || parsedProfile['TimeZone'] === 0:"";

    const isAllRequiredSettingsConfigured = parsedProfile
      ? parsedProfile['UsualWakeTime'] &&
        parsedProfile['UsualBedTime'] &&
        parsedProfile['HomeAirport'] &&
        isTimeZoneHasValue
      : false;

    if (!isAllRequiredSettingsConfigured || !parsedProfile) {
      return false
    }
    else
    {
      return true
    }
  },

 

  // StartWatchMode()
  // {
  //     StorageService.Set("isWatchModeRunning", "running");
  // },

  // async EndWatchMode()
  // {
  //     await StorageService.Remove("isWatchModeRunning");
  // },

  // async CheckIfWatchModeIsRunning(){
  //     const isRunning = await StorageService.Get("isWatchModeRunning");
  //     return isRunning;
  // }
};

export default UserService;
