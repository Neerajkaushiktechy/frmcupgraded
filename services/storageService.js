import AsyncStorage from '@react-native-community/async-storage';

const StorageService = {
     async Get (key) {      
            try {        
              const value = await AsyncStorage.getItem(key)
                
              return value;
            } catch(e) {                
              throw e;
            }
          }
        ,

   async Set(key, value){        
            try {    

                
              await AsyncStorage.setItem(key, value)
            } catch (e) {
              console.log('error saving ' + e);
            }           
     
    },

    async Remove(key, value){        
      try {    

          
        await AsyncStorage.removeItem(key)
      } catch (e) {
        console.log('error removing ' + e);
      }           

}
}

export default StorageService;