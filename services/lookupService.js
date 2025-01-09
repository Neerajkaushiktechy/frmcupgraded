import React from 'react';
import {Picker} from '@react-native-picker/picker';
import Enumerable from 'linq'

const LookupService = {

    GetLookupFromValue:function(value, values){
        var lookup = Enumerable.from(values).firstOrDefault(x => x.Value == value, null);
                
        return lookup;
    },

    GetLookupFromId:function(id, values){
        var lookup = Enumerable.from(values).firstOrDefault(x => x.Id == id, null);
                
        return lookup;
    },

    GetGenders: function () {
        return [
            { Id: 0, Value: "" },
            { Id: 1, Value: 'Male', IconSrc:"https://lh3.googleusercontent.com/proxy/WaDuMF8BJj--CHIUGrV_UUdYwRC937B-5GJxwDm8a4SbSc2k0TCQVnfqbxFjF3mbECMLeYCow3zINgnqIx-QfjfScrHTATKIi63glq3VtX6DpIOs38T1zOND7wPzENmI_jnveabCl78da4NR" },
            { Id: 2, Value: 'Female', IconSrc:"http://www.beckenhamrunning.co.uk/wp-content/uploads/2020/02/Person-silhouette.png" },
            { Id: 3, Value: 'Other', IconSrc:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Gender-Symbol_Other_dark_transparent_Background.png/300px-Gender-Symbol_Other_dark_transparent_Background.png" }
        ]
    },

    GetAges: function () {
        return [
            { Id: 0, Value: "" },
            { Id: 1, Value: '18-24' },
            { Id: 2, Value: '25-34' },
            { Id: 3, Value: '35-44' },
            { Id: 4, Value: '45-54' },
            { Id: 5, Value: '55-64' },
            { Id: 6, Value: '65+' }

        ]
    },


    GetChronotypes: function () {
        return [
            { Id: 0, Value: "" },
            { Id: 1, Value: "Don't know" },
            { Id: 2, Value: "Definite morning type" },
            { Id: 3, Value: "Slightly morning type" },
            { Id: 4, Value: "Neither one or the other" },
            { Id: 5, Value: "Slightly evening type" },
            { Id: 6, Value: "Definite evening type" }

        ]
    },


    GetJobRoles: function () {
        return [
            { Id: 0, Value: "" },
            { Id: 1, Value: "Pilot Flying" },
            { Id: 2, Value: "Pilot monitoring" },
            { Id: 3, Value: "Augmenting Pilot" },
            { Id: 4, Value: "Flight Attendant, in-charge" },
            { Id: 5, Value: "Flight Attendant" },
            { Id: 6, Value: "Maintenance Engineer" },
            { Id: 7, Value: "Engineer/Winchman, Flying" },
        ]
    },

    GetTimeInRoles: function () {
        
        return  [
            { Id: 0, Value: "" },
            { Id: 1, Value: "Less than 1 year" },
            { Id: 2, Value: "1-5 years" },
            { Id: 3, Value: "5-10 years" },
            { Id: 4, Value: "10-20 years" },
            { Id: 5, Value: "20-30 years" },
            { Id: 6, Value: "30 plus years" }
        ]
    },

    GetRanks: function () {
        
        return  [
            { Id: 0, Value: "" },
            { Id: 1, Value: "Captain" },
            { Id: 2, Value: "First Officer" },
            { Id: 3, Value: "Augmenting Pilot" }          
        ]
    },

    GetCommuteTimes: function () {
        return [
            { Id: 0, Value: "" },
            { Id: 1, Value: "up to 30 mins" },
            { Id: 2, Value: "30 mins to 1 hour" },
            { Id: 3, Value: "1-2 hours" },
            { Id: 4, Value: "3-4 hours" },
            { Id: 5, Value: "More than 5 hours" }
            

        ];
    },

    GetSleepQualities: function () {
        return [
            { Id: 0, Value: "" },
            { Id: 1, Value: "" },
            { Id: 2, Value: "" },
            { Id: 3, Value: "" },
            { Id: 4, Value: "" },
            { Id: 5, Value: "" },
            { Id: 6, Value: "" },
            { Id: 7, Value: "" },
            { Id: 8, Value: "" },
            { Id: 9, Value: "" },
            { Id: 10, Value: "" }
        ];
    },

    GetWorkloads: function () {
        var values = [];
        for (i = 0; i <= 100; i++) {
            values.push({ Id: i, Value: "" });
        }

        return values;
    },

    ConvertLookupsToPickerItems(lookups) {
        return typeof lookups != 'undefined' && lookups.length > 0 ? lookups.map((s, i) => { return <Picker.Item key={i} value={s.Id} label={s.Value} /> }) : null;
    },

    GetFatigueRatings: function () {
        return [
            { Id: 0, Value: "No answer" },
            { Id: 1, Value: "Fully alert, wide awake" },
            { Id: 2, Value: "Very lively, responsive, but not at peak" },
            { Id: 3, Value: "Okay, somewhat fresh" },
            { Id: 4, Value: "A little tired, less than fresh" },
            { Id: 5, Value: "Moderately tired, let down" },
            { Id: 6, Value: "Extremely tired, very difficult to concentrate" },
            { Id: 7, Value: "Completely exhausted, unable to function effectively" }
        ]

    },

    GetContactCategories: function () {
        return [
            { Id: 0, Value: "General Questions" },
            { Id: 1, Value: "Login Issue" },
            { Id: 2, Value: "Registration Information" },
            { Id: 3, Value: "Help & Support" },
            { Id: 4, Value: "App Feedback" }
        ]
    },

    GetWakeUpReasons: function () {
        return [
            { Id: 0, Value: "" },
            { Id: 1, Value: "Naturally" },
            { Id: 2, Value: "Alarm set by self" },
            { Id: 3, Value: "Wake-up call" },
            { Id: 4, Value: "Environmental disturbance" },
        ]
    },

    GetSleepLocations: function () {
        return [
            { Id: 0, Value: "" },
            { Id: 1, Value: "Home in bed" },
            { Id: 2, Value: "Home in chair" },
            { Id: 3, Value: "Hotel bed" },
            { Id: 4, Value: "Class 1 (bunk)" },
            { Id: 5, Value: "Class 2 (business class)" },
            { Id: 6, Value: "Class 3 (flight deck)" },
            { Id: 7, Value: "Class 4 (jump seat)" },
            { Id: 8, Value: "Other" },
        ]
    },

    GetPositioningOptions: function () {
        return [
            { Id: 0, Value: "" },
            { Id: 1, Value: "Flight" },
            { Id: 2, Value: "Self drive vehicle" },
            { Id: 3, Value: "Ground based passenger (taxi, car, bus, rail etc)" }

        ]
    },

    GetModeOfTransports: function () {
        return [
            { Id: 0, Value: "" },
            { Id: 1, Value: "Car" },
            { Id: 2, Value: "Train" },
            { Id: 3, Value: "Bus" },
            { Id: 4, Value: "Taxi" },
            { Id: 5, Value: "Aircraft" },
            { Id: 6, Value: "Multimodal" }

        ]
    },

    GetActivities: function () {
        return [
            { Id: 1, Value: "Check in" },
            { Id: 2, Value: "Flight" },
            { Id: 3, Value: "Waiting time" },
            { Id: 4, Value: "Time at hotel" },
            { Id: 5, Value: "Positioning" },
            { Id: 6, Value: "Commuting" },
            { Id: 7, Value: "Simulator duty" },
            { Id: 8, Value: "Ground duty" },
            { Id: 9, Value: "Check out" },
            
            { Id: 10, Value: "Standby duty" },
            // { Id: 10, Value: "Vacation" },
            // { Id: 11, Value: "Day off" },

            { Id: 11, Value: "Nap or sleep" },
            { Id: 12, Value: "Other" }
        ]
    },

    GetHassleFactors: function () {
        return [
            { Id: 0, Value: "Weather" },
            { Id: 1, Value: "Terrain" },
            { Id: 2, Value: "Air traffic control" },
            { Id: 3, Value: "Time pressure" },
            { Id: 4, Value: "Aircraft/equipment" },
            { Id: 5, Value: "Visiblity" },
            { Id: 6, Value: "Air traffic congestion" },
            { Id: 7, Value: "Other human factors" },
            { Id: 8, Value: "Team factors" },
            { Id: 9, Value: "Inexperience" },
            { Id: 10, Value: "Delay" },
            { Id: 11, Value: "Other" }

        ]
    },

    GetTimeReferences: function () {
        return [

            { Id: 0, Value: "Local time" },
            { Id: 1, Value: "UTC" },
            { Id: 2, Value: "Base time" }
        ]

    },

    GetNumberOfPilots: function () {
        return [
            {Id: 0, Value:"0"},
            {Id: 1, Value:"1"},
            {Id: 2, Value:"2"},
            {Id: 3, Value:"3"},
            {Id: 4, Value:"4"},
            {Id: 5, Value:"5"}
        ]

    },

    GetSectors: function () {
        return [
            {Id: 0, Value:"0"},
            {Id: 1, Value:"1"},
            {Id: 2, Value:"2"},
            {Id: 3, Value:"3"},
            {Id: 4, Value:"4"},
            {Id: 5, Value:"5"},
            {Id: 6, Value:"6"},
            {Id: 7, Value:"7"},
            {Id: 8, Value:"8"},
            {Id: 9, Value:"9"}
          
            
        ]
    },

    GetExtents:function(){
        return [

            { Id: 0, Value: "Not at all" },
            { Id: 1, Value: "To some extent" },
            { Id: 2, Value: "To a greater extent" },
            { Id: 3, Value: "To a large extent" },
            { Id: 4, Value: "Mostly" }
        
        ]
    },

    GetSwitchLookups:function(){
        return [
            {Id: 0, Value: "Yes"},
            {Id: 1, Value: "No"}
          ]
    },

    GetSwitchValue:function(value){
        return value === null? null: value === "Yes"? 0: 1;
    },

    GetErrorHandlers: function(){
        return [
            {Id: 0, Value: ""},
            {Id: 1, Value: "Prevent users from proceeding"},
            {Id: 2, Value: "Allow users to proceed with a warning"},
        ]
    },

    GetAirportCodeFormats: function(){
        return [            
            {Id: 1, Value: "IATA"},
            {Id: 2, Value: "ICAO"},
        ]
    }
};

export default LookupService;