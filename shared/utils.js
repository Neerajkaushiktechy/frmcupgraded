import {Dimensions, Platform} from 'react-native';

const screenHeight = () => Dimensions.get('screen').height;
const screenWidth = () => Dimensions.get('screen').width;

const getPercentageWiseHeight = percentValue => {
  const decimalPercentValue = percentValue / 100;
  const totalValue = screenHeight() * decimalPercentValue;
  return totalValue;
};

const getPercentageWiseWidth = percentValue => {
  const decimalPercentValue = percentValue / 100;
  const totalValue = screenWidth() * decimalPercentValue;
  return totalValue;
};

const stringToBoolean = (string) => {
  switch(string){
      case null :return null
      case "Yes" : return true;
      case "No": return false;
      default: return false
  }
}


const checkIfPlatformIOS = () => {
  return Platform.OS === 'ios';
}

export default { screenHeight, screenWidth, getPercentageWiseHeight, getPercentageWiseWidth, checkIfPlatformIOS, stringToBoolean};
