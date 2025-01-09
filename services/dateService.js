import React from 'react';
import Moment from 'moment';
import UtilityService from './utilityService';
import LookupService from '../services/lookupService';
import AirportsRepository from '../data/airportsRepository';

const DateService = {
  ParseDate: function (date) {
    try {
      return Moment(date.toString()).format('ddd MMM Do YYYY, HH:mm');
    } catch {
      return date;
    }
  },

  ParseDate2: function (date) {
    try {

      var parsedDate = this.ParseUTCDateString(date);
      return Moment(parsedDate.toString()).format('Do MMM YYYY HH:mm');
    } catch {
      debugger; 
      return date;
    }
  },

  ConcatDateAndTime: function (dateToGetDate, dateToGetTime) {
    try {
      var date = Moment(this.ParseUTCDateString(dateToGetDate.toISOString())).format('YYYY-MM-DD');
      var time = Moment(this.ParseUTCDateString(dateToGetTime)).format('HH:mm');

      return this.ParseUTCDateString(date + 'T' + time);
      //return Moment(date + ' ' + time);
    } catch {
      return dateTime;
    }
  },

  GetLongDate: function (date) {
    try {        
      var parsedDate = this.ParseUTCDateString(date);
      return Moment(parsedDate.toString()).format('Do MMMM YYYY');
    } catch {
      return date;
    }
  },

  Get24HrTime: function (date) {
    try {      
      var parsedDate = this.ParseUTCDateString(date);
      return Moment(parsedDate.toString()).format('HH:mm');
    } catch (err){
      console.log(err);
      return date;
    }
  },
  Get24HrTimeFromDate: function (date) {
    try {      
      
      return Moment(date.toString()).format('HH:mm');
    } catch (err){
      console.log(err);
      return date;
    }
  },

  Get24HrTimeFromDate: function (date) {
    try {            
      return Moment(date.toString()).format('HH:mm');
    } catch (err){
      console.log(err);
      return date;
    }
  },

  AddHours: function (date, hoursToAdd) {
    var cloneDate = this.CloneDate(date);
    cloneDate.setTime(cloneDate.getTime() + hoursToAdd * 60 * 60 * 1000);
    return cloneDate;
  },

  AddMinutes: function (date, minsToAdd) {
    var cloneDate = this.CloneDate(date);
    cloneDate.setTime(cloneDate.getTime() + minsToAdd * 60 * 1000);
    return cloneDate;
  },

  CloneDate: function (date) {
    var copy = new Date(date.getTime());
    return copy;
  },
  ConvertTimezone: function (date, from, to, localOffset, baseOffset, lastConvertedDateTime, timeRefs) {
    if (from === to) {
      return lastConvertedDateTime;
    }

    from = timeRefs.find(timeRef => timeRef.Id === from).Value;
    to = timeRefs.find(timeRef => timeRef.Id === to).Value;

    if (from == 'UTC' && to == 'Local time') {
      return this.AddMinutes(date, localOffset);
    }

    if (from == 'UTC' && to == 'Base time') {
      return this.AddMinutes(date, baseOffset);
    }

    if (from == 'Local time' && to == 'UTC') {
      return this.AddMinutes(date, -localOffset);
    }

    if (from == 'Local time' && to == 'Base time') {
      var localToUtc = this.AddMinutes(date, -localOffset);
      return this.AddMinutes(localToUtc, baseOffset);
    }

    if (from == 'Base time' && to == 'Local time') {
      var baseToUtc = this.AddMinutes(date, -baseOffset);
      return this.AddMinutes(baseToUtc, localOffset);
    }

    if (from == 'Base time' && to == 'UTC') {
      return this.AddMinutes(date, -baseOffset);
    }

    throw "Invalid conversion";
  },
  ConvertTimezone2: function (date, from, to, localOffset, baseOffset) {

    if (from == 0) from = 'Local time';
    if (from == 1) from = 'UTC';
    if (from == 2) from = 'Base time';

    if (to == 0) to = 'Local time';
    if (to == 1) to = 'UTC';
    if (to == 2) to = 'Base time';

    if (from == to) {
      return date;
    }

    if (from == 'UTC' && to == 'Local time') {
      return this.AddMinutes(date, localOffset);
    }

    if (from == 'UTC' && to == 'Base time') {
      return this.AddMinutes(date, baseOffset);
    }

    if (from == 'Local time' && to == 'UTC') {
      return this.AddMinutes(date, -localOffset);
    }

    if (from == 'Local time' && to == 'Base time') {
      var localToUtc = this.AddMinutes(date, -localOffset);
      return this.AddMinutes(localToUtc, baseOffset);
    }

    if (from == 'Base time' && to == 'Local time') {
      var baseToUtc = this.AddMinutes(date, -baseOffset);
      return this.AddMinutes(baseToUtc, localOffset);
    }

    if (from == 'Base time' && to == 'UTC') {
      return this.AddMinutes(date, -baseOffset);
    }

    throw "Invalid conversion";
  },
  ConvertTimesByAirport:async function(date, from, to, localAirportId, baseAirportId){

    var localOffset = null;
    
    await AirportsRepository.GetAirportOffSets(localAirportId, date, (result) => {
      
      localOffset = result
    });
    var baseOffset = null;
    
    await AirportsRepository.GetAirportOffSets(baseAirportId, date, (result) => {
      baseOffset = result;
    });

    if (from == 0) from = 'Local time';
    if (from == 1) from = 'UTC';
    if (from == 2) from = 'Base time';

    if (to == 0) to = 'Local time';
    if (to == 1) to = 'UTC';
    if (to == 2) to = 'Base time';

    if (from == to) {
      return date;
    }

    if (from == 'UTC' && to == 'Local time') {
      return this.AddMinutes(date, localOffset);
    }

    if (from == 'UTC' && to == 'Base time') {
      return this.AddMinutes(date, baseOffset);
    }

    if (from == 'Local time' && to == 'UTC') {
      return this.AddMinutes(date, -localOffset);
    }

    if (from == 'Local time' && to == 'Base time') {
      var localToUtc = this.AddMinutes(date, -localOffset);
      return this.AddMinutes(localToUtc, baseOffset);
    }

    if (from == 'Base time' && to == 'Local time') {
      var baseToUtc = this.AddMinutes(date, -baseOffset);
      return this.AddMinutes(baseToUtc, localOffset);
    }

    if (from == 'Base time' && to == 'UTC') {
      return this.AddMinutes(date, -baseOffset);
    }

    throw "Invalid conversion";
  },
  /*ConvertTimezoneFromUtcStringDate:function(stringDate, from, to,localOffset, baseOffset){
    // string is utc but not to be confused with our from and to - this is just a device adjustment
    // get it from a utc date back to device so we load it into a date object
    var date = this.ParseUTCDateString(stringDate);
    return this.ConvertTimezone2(date, from, to, localOffset, baseOffset);
  },
  ConvertTimezoneFromUtcStringDateAsString:function(stringDate, from, to,localOffset, baseOffset){
    // string is utc but not to be confused with our from and to - this is just a device adjustment
    // get it from a utc date back to device so we load it into a date object
    var date = this.ParseUTCDateString(stringDate);
    var convertedDate = this.ConvertTimezone2(date, from, to, localOffset, baseOffset);    
    return this.NormalizeUTCDate(convertedDate).toISOString();
  },*/

  ConvertTimezoneFromUtcStringDate:function(stringDate, from, to,localAirport, baseAirport){
    // string is utc but not to be confused with our from and to - this is just a device adjustment
    // get it from a utc date back to device so we load it into a date object
    var date = this.ParseUTCDateString(stringDate);
    return this.ConvertTimesByAirport(date, from, to, localAirport, baseAirport);
  },
  ConvertTimezoneFromUtcStringDateAsString:async function(stringDate, from, to,localAirport, baseAirport){
    // string is utc but not to be confused with our from and to - this is just a device adjustment
    // get it from a utc date back to device so we load it into a date object
    
    var date = this.ParseUTCDateString(stringDate);
    var convertedDate = await this.ConvertTimesByAirport(date, from, to, localAirport, baseAirport);      
    
    return this.NormalizeUTCDate(convertedDate).toISOString();
  },

  ParseUTCDateString: function (dateString, suppressAdjust) {

    var date = null;

    if (dateString.indexOf('Z') == -1) {
      date = new Date(dateString + 'Z');
    }
    else {
      date = new Date(dateString);
    }

    if (typeof (suppressAdjust) == 'undefined' || !suppressAdjust) {
     // date.setHours(date.getHours() + (date.getTimezoneOffset() / 60)); // this sets the hour but does not take into account minutes
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); 
    }
    return date;
  },

  NormalizeUTCDate: function (date) {
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date;
  },

  GetISOFormatUTCString(dateTimeString)
  {
    return new Date(dateTimeString).toISOString();
  }

};

export default DateService;
