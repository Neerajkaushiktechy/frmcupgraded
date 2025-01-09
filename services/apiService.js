import ConfigService from '../services/configService';
import UtilityService from '../services/utilityService';
import StorageService from '../services/storageService';
import UserService from '../services/userService';
import AppNavigation from '../AppNavigation';

    const GetLoggedInUser =  async () => {

        const loggedInUser = await StorageService.Get('LoggedInUser');
        if (loggedInUser == null) {
        // broadcast to nav to login
        PubSub.publish('NAVLOGIN', null);
        return;
        }
        return JSON.parse(loggedInUser);
    }
    
    const Get = async (url, payload) => {

        // if offline we should kick this somewhere

        var loggedInUser = await GetLoggedInUser();

        var response = await fetch(ConfigService.BaseUri + "/" + url + "?" + UtilityService.JsonToQueryString(payload), {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + loggedInUser.AccessToken
            }            
        });

        return handleApiResponse(response);
        
    }

    const Post = async (url, payload) => {
        // if offline we should kick this somewhere
        var loggedInUser = await GetLoggedInUser();
        
        var response = await fetch(ConfigService.BaseUri + "/" + url, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + loggedInUser.AccessToken
            },
            body: JSON.stringify(payload)
        })

        return handleApiResponse(response);


        /*
            .then(response => {
                //console.log(response);

                var status = response.status;

                //if (status >= 200 && status <= 300) {
                // successful login so store session data and redirect
                var result = response.json();
            })
            .catch(
                function (error) {
                    reject(new Error("Get request error.\n${error.message}"));
                }
            );*/
    }
    const handleApiResponse = (response) => {
        const { status } = response;
    
        if (status === 401) {
            UserService.Logout();
            AppNavigation.navigate('Login')
    
            return null;
        }
    
        else 
          return response;
    }

const ApiService = {GetLoggedInUser, Get, Post};

export default ApiService;