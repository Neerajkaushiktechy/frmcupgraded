import {Dimensions, StyleSheet, Platform} from 'react-native'
import Utils from '../shared/utils';


let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
let TabletWidth = 500;
let IsTablet = Platform.isPad;
let IsBigScreenTablet = IsTablet && ScreenWidth > 800;


const colors = {
    primaryDark:'#152668',
    primaryLight:'#1381BF',
    secondaryLight:'#248DC4',
    headerBgColor:'#152668',
    subHeaderBgColor:'#248DC4',
    screenBgColor: '#1381BF'    ,
    green : "#A8CF15",
    DarkGreen: "#13AA39",
    Red: "#CD0206",
    PastelRed:"#ff6961",
    Orange: "#FA5A06",
    Yellow: "#FFC000",
    White: "#FFFFFF",
    Text: "#333333",
    Grey: "#CCCCCC",
    DarkGrey: "#444444",
    FieldText: "#999999",
    Purple:"#b19cd9",
    
    Blue    : "#0080C2",
    LightBlue : "#3399CE",
    DarkBlue  : "#13246A",
    formBgColor:'white',
    textColor:'white'
  }

const styles = StyleSheet.create({
    screenHeight:800,

    screenBackground:{
        backgroundColor:colors.screenBgColor,
        flex:1,
        height:ScreenHeight,
        paddingTop:10
    },

    scrollContainer:{
        backgroundColor:colors.screenBgColor,
        flex:1,
        height:ScreenHeight,
        paddingTop:10
    },

    formText:{
        fontFamily:'System',
        fontSize:18,
        paddingTop:10,
        paddingBottom:20,        
    },

    headerContainer:{
        backgroundColor:colors.headerBgColor        ,
        height: 80,  justifyContent: "flex-end", paddingBottom:10 
    },
    headerTitle:{
        alignSelf:"center",
        color:'white',
        fontSize:26
    },

    screenContainer:{
        flex:1,
        backgroundColor:colors.screenBgColor,
        padding:IsTablet ? 15 : 10,
        
    },

    
    paragraphText:{
        color:colors.textColor,
        fontSize:16
    },

    formContainer:{
        backgroundColor:colors.formBgColor,
        borderRadius:5,
        padding:10,
        paddingTop:60,
        paddingBottom:20
    },

    formContainerIconWrapper:{
        borderRadius:180,
        width:80,
        height:80,
        backgroundColor:colors.headerBgColor,
        
        alignSelf: IsTablet ? 'flex-start' : 'center',
        top:-40,
        marginLeft: IsTablet ? 20 : 0,
        justifyContent:'center',
        position:'absolute'
    },

    formContainerIcon:{
        color:'white',  
        alignSelf:'center',

        
    },

    formInputLabelOld:{
        alignSelf:IsTablet ? 'flex-start': 'center',        
        
        color:colors.screenBgColor,
        fontSize:18,
        fontWeight:'600',
        //textAlign:"center",
        paddingLeft:20,
        paddingRight:20
    },

    formInputLabel:{
        alignSelf: 'flex-start', //IsTablet ? 'flex-start': 'center',        
        
        color:'black',
        fontSize:18,
        fontWeight:'400',
        //textAlign:"center",
        paddingLeft:0,
        paddingRight:20
    },

    formErrorLabel:{
        alignSelf: 'flex-start', //IsTablet ? 'flex-start': 'center',        
        
        color:colors.Red,
        fontSize:18,
        fontWeight:'600',
        //textAlign:"center",
        paddingLeft:0,
        paddingRight:20
    },

    formSwitchInputLabel:{
        alignSelf: 'flex-start',        
        
        color:colors.screenBgColor,
        fontSize:18,
        fontWeight:'600',
        //textAlign:"center",
        paddingLeft:20,
        paddingRight:20,
        flex: 1
    },

    formDescriptionLabel:{
        alignSelf:'flex-start',
        color:colors.DarkGrey
    },

    formInputContainer:{
        marginTop:IsTablet ? 25 : 18
        
    },
    
    formInput:{
        borderColor:'lightgray',
        borderRadius:4,
        height:45,
        borderWidth:1,    
        paddingLeft:10,
        marginTop:15,  
        fontSize:17,
        color:"#aaa" 
    },

    formPicker:{
        marginTop:10,
        backgroundColor:'#eee',
        
        //padding:0
    },

    formPromptMessage:{
        fontSize:16,
        
    },

    formTitle:{
        color:colors.primaryLight,
        fontWeight:"600",
        fontSize:17
    },

    formButton:{
        paddingLeft:30,
        paddingRight:30,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:colors.headerBgColor,
        borderRadius:5,
        // alignSelf:'center',
        //justifyContent:'center',
        marginTop:10,
        display:'flex',
        flex:1
        
    },

    altButton:{
        paddingLeft:30,
        paddingRight:30,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:colors.LightBlue,
        borderRadius:5,
        // alignSelf:'center',
        // justifyContent:'center',
        marginTop:10,
        display:'flex',
        flex:1
    },

    deleteButton:{
        paddingLeft:30,
        paddingRight:30,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:colors.Red,
        borderRadius:5,
        // alignSelf:'center',
        // justifyContent:'center',
        marginTop:10,
        display:'flex',
        flex:1
    },

    formButtonLabel:{
        color:'white',
        textAlign:'center'
    },

    sliderSelectedText:{
        alignSelf:'center',
        color:colors.Blue,
        fontSize:40,
        fontWeight:"600",
        
        
        
    },

    sliderMaxText:{
        alignSelf:'center',
        color:colors.Grey,
        fontSize:20,
        
    },

    sliderDescriptionText:{
        alignSelf:'flex-start',
        justifyContent:'flex-end',
        fontSize:16
    },

    sliderTextRow:{
        flexDirection:'row',
        flex:1,        
        justifyContent:'space-between',
    },
    
    dutyPeriodHeader:{
        backgroundColor:colors.subHeaderBgColor,
        color:colors.White,
        paddingTop:20,
        paddingBottom:20
        
    },

    dutyPeriodTitle:{
        textAlign:"center",
        color:colors.White,
        fontSize:18,
        fontWeight:"500"
    },

    dutyPeriodResult:{
        paddingLeft:15,
        paddingRight:20,
        paddingTop:20,
        paddingBottom:20,
        flexDirection:'row',
        height:88                
    },

    activityResult:{
        paddingLeft:15,
        paddingRight:20,
        paddingTop:20,
        flexDirection:'row',
        height:88   ,
          
    },

    dashedLineView:{ // deprecated
        borderColor:colors.White,
        borderStyle:'dashed',
        borderWidth:1,
        borderRadius:1,
        marginLeft:15,
        marginRight:15
    },

    dutyPeriodContent:{
        color:"white", 
        fontSize:18, 
        fontWeight:"600",
       
    },

    activityResultTitle:{
        color:colors.White,
        fontWeight:"600",
        fontSize:18
    },

    activityResultContent:{
        //flex:1,
        //flexWrap:"wrap",
        color:colors.White,
        fontSize:16
    },

    dutyPeriodIconWrapper:{
        borderRadius:180,
        width:50,
        height:50,
        backgroundColor:colors.headerBgColor,
        alignSelf:'center',
        left:0,
        justifyContent:'center',
        position:'absolute'
    },

    hidden:{
        opacity:0,
        height:0,
        width:0
    },

    checkIcon:{        
        backgroundColor:colors.primaryDark        
    },

    flightIcon:{        
        backgroundColor:colors.green        
    },
    hotelIcon:{        
        backgroundColor:colors.Purple        
    },
    simulatorIcon:{        
        backgroundColor:colors.Orange        
    },
    positioningIcon:{        
        backgroundColor:colors.DarkGreen        
    },
    waitingIcon:{        
        backgroundColor:colors.PastelRed      
    },
    standbyIcon:{        
        backgroundColor:colors.LightBlue        
    },
    groundDutyIcon:{        
        backgroundColor:colors.Yellow        
    },
    travelIcon:{        
        backgroundColor:colors.LightBlue        
    },    
    napIcon:{        
        backgroundColor:colors.DarkGrey     
    },
    otherIcon:{        
        backgroundColor:colors.Grey        
    },

    row:{
        
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
        
    },
    column:{
        
        flexDirection: "column",
        paddingLeft: IsTablet ? 10 : 0,
        paddingRight:IsTablet ? 10 : 0,
        
        width:IsTablet ? "50%" : "100%",
   
    },
    columnWithoutPadding:{
        
        flexDirection: "column",        
        width:IsTablet ? "50%" : "100%",
   
    },
    columnFull:{
        
        flexDirection: "column",
        paddingLeft: IsTablet ? 10 : 0,
        paddingRight:IsTablet ? 10 : 0,
        
        width:"100%",
   
    },
    columnFullWithoutPadding:{
        
        flexDirection: "column",
  
        
        width:"100%",
   
    },
    hyperlink:{
        color: colors.LightBlue
    },
    activityIndicator:{
        flex:1,
        position:"absolute",
        left:0,
        right:0,
        bottom:0,
        top:0,
        zIndex:100,
        
    }   
    ,
    activityIndicatorOverlay:{
        flex:1,
        position:"absolute",
        backgroundColor:"#222",
        opacity:0.6,
        zIndex:500,
        left:0,
        right:0,
        bottom:0,
        top:0,
        alignSelf:"center",
        justifyContent:"center",
        
    },

    activityIndicatorOverlay2:{
        flex:1,
        position:"absolute",
        zIndex:501,
        
        left:0,
        right:0,
        bottom:0,
        top:0,
        alignSelf:"center",
        justifyContent:"center",
        
    },

    activityIndicatorWrapper:{        
        height:100,
        width:100,
        backgroundColor:"white",alignSelf:"center",
        left:0,
        right:0,
        bottom:0,
        top:0,
        justifyContent:"center",
        borderRadius:4
        
    },

    incompleteIndicator :{
        height : 8 ,
        width :8,
        borderRadius: 1000,
        backgroundColor:colors.PastelRed
       }

    // innerFormContainer: IsBigScreenTablet ? {flexDirection:'row', flexWrap:'wrap', width: Utils.getPercentageWiseWidth(95)} : {flexDirection:'column'},

    // formControlsContainer: IsBigScreenTablet ? {flex:2.87} : {flexDirection:'column'}

  });

  


  
  export{styles, colors, IsTablet, IsBigScreenTablet}