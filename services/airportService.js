import { Alert } from 'react-native';

import ApiService from './apiService';
import AirportsRepository from '../data/airportsRepository';
import StorageService from './storageService';

const AirportService ={

    async resetAirportData( instanceId, setLoadingOff, shouldShowSuccessMessage){

      try {
        const airportsData = await ApiService.Get(
          'api/airport/GetAllAirports',{ InstanceId: instanceId}
        );
        
        airportsData.json().then(result => {

          if (result && result.length) {
            this.overwriteAirportsTableData(result, setLoadingOff, shouldShowSuccessMessage)
          }
          else {

            if(setLoadingOff)
            {
              setLoadingOff();
            }
            //this.setState({ isImporting: false })
            Alert.alert("No airport data")
          }
        })
      }
      catch(exception) {

        if(setLoadingOff)
        {
          setLoadingOff();
        }
        // this.setState({ isImporting: false })
        Alert.alert("Error in resetting airports. Contact support")
      }
      },

      overwriteAirportsTableData(importedAirportsData, setLoadingOff, shouldShowSuccessMessage) {

        AirportsRepository.OverWriteAirportsTable(importedAirportsData).then(resp => {

          if(setLoadingOff)
          {
            setLoadingOff()
          }
          // this.setState({ isImporting: false })
          if(shouldShowSuccessMessage)
          {
            alert("Success");
          }
          
        }).catch(ex => {

          if(setLoadingOff)
          {
            setLoadingOff()
          }
          // this.setState({ isImporting: false })
          Alert.alert("Error in inserting airports data. Contact support")
        });
        
      },

      async setAirportDataResetUserId( userId ) {
        let AirportDataResetUserIds = await this.getAllAirportDataResetUserIds();
        AirportDataResetUserIds = JSON.parse(AirportDataResetUserIds) || [];

        AirportDataResetUserIds.push(userId);
        StorageService.Set('AirportDataResetUserIds', JSON.stringify(AirportDataResetUserIds));
      },

      async getAirportDataResetUserId(userId) {
        let AirportDataResetUserIds = await this.getAllAirportDataResetUserIds();
        AirportDataResetUserIds = JSON.parse(AirportDataResetUserIds) || [];
        return AirportDataResetUserIds.find(x => x === userId) || null;
      },

      async getAllAirportDataResetUserIds() {
        return  StorageService.Get('AirportDataResetUserIds');
      }


}
export default AirportService