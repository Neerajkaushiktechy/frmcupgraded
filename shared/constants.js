import {DefaultCard, LongCard, SemiLongCard, IconInCenterCard, DefaultCardShort} from '../components/frmscCardTemplates';

export const Constants = {
  watchNotificationTitle: 'How tired are you feeling?',
  checkBoxType: {
    square: 'square',
    circle: 'circle',
  },
  welcomeModalContent: {
    heading: "Welcome to FRMSc",
    points: [
      {
        header: 'Track user activity and fatigue',
        description:
          'Participate in a scientific study of sleepiness and alertness by using this app to track your activity and alertness levels.',
      },
      {
        header: 'SAFE Integration',
        description: 'Import your schedule directly from a SAFE roster. ',
      },
      {
        header: 'Notifications',
        description:
          'You will be receiving notifications at the end of every activity to ask how you are feeling. Works with Apple Watch.',
      },
    ],
    bottomContent:
      'Your data will be received anonymously hiding the identity of the user. We only need relevant details of your age, gender, sleeping patterns and home time zone. Data is sent to our secure servers via encrypted technology.',
  },
  timeZoneHelperModalContent: {
    heading: "Time References",
    points: [
      {
        header: 'Local',
        description:
          'Time is in reference to the local time of where the activity took place. For flights, the departure time would be referencing the time of the departure airport and the arrival time would be referencing the time of the arrival airport.',
          icon: require("../clock.png")
        },
      {
        header: 'Base',
        description: 'Time is in reference to the home airport of the schedule',
        icon: require("../clock.png")
      },
      {
        header: 'UTC',
        description:
          'Time is in reference to Coordinated Universal time',
          icon: require("../clock.png")
      },
    ]
  },
  cardTemplateType: {
    defaultCard: 'defaultCard',
    longCard: 'longCard',
    semiLongCard: "semiLongCard",
    iconInCenterCard: "iconInCenterCard",
    defaultCardShort: "defaultCardShort"
  },
  cardTemplates: [
    {type: "defaultCard", cardElement: DefaultCard, defaultHeight: 11, tabletWidth: "31.3%", mobileWidth: "48%", itemsAlignment:"center"},
    {type: "defaultCardShort", cardElement: DefaultCardShort, defaultHeight: 5, tabletWidth: "31.3%", mobileWidth: "48%", itemsAlignment:"center"},
    {type: "longCard", cardElement: LongCard, defaultHeight: 8, tabletWidth: "48%", mobileWidth: "98%", itemsAlignment:"flex-start"},
    {type: "semiLongCard", cardElement: SemiLongCard, defaultHeight: 6, tabletWidth: "31.3%", mobileWidth: "31.3%", itemsAlignment:"center"},
    {type: "iconInCenterCard", cardElement: IconInCenterCard, defaultHeight: 11, tabletWidth: "31.3%", mobileWidth: "48%", itemsAlignment:"center"},
  ],
  itemsAlignment: {
    center: "center",
    flexStart: "flex-start",
    flexEnd: "flex-end"
  },
  timezoneSelectionIsRequiredMessage: 'Please Select a Time Zone to Proceed.',
  advancedDataCaptureContent: {
    heading: "Advanced Data Capture",
    points: [
      {
        
        description:
          `This app captures activity and sleep data to help predict fatigue levels.

Basic data capture uses data captured directly though this app only.

Advanced data capture uses data captured directly through this app as well as data captured through the Health app. The Health app can help to provide data on your body temperature, energy used and sleep metrics to help predict fatigue levels more accurately.

How would you like to proceed?`,
          
        }
    ]
  }
};
