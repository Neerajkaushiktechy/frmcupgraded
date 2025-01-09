import React from 'react';
import { openDatabase } from 'react-native-sqlite-storage';
import Enumerable from 'linq';

var db = openDatabase({ name: "airports.db", createFromLocation: 1 }, function () { console.log('db open success') }, function () { alert('db open error') });

String.prototype.replaceAll = function (str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
}

const AirportsRepository = {

    AirportSearch: function (search, callback) {
        db.transaction((tx) => {
            tx.executeSql("SELECT * from airports WHERE lower(IATACode) = ? OR lower(ICAOCode) = ?1 OR lower(FAACode) = ?2",
                [search],
                (tx, results) => {

                    var codes = results.rows.raw();

                    tx.executeSql("SELECT * from airports WHERE lower(Name) LIKE '%' || ? || '%'",
                        [search],
                        (tx2, results2) => {

                            var codes2 = results2.rows.raw();
                            callback(codes.concat(codes2));
                        });

                });
        });
    },

    AirportSearchAsync: function (search, callback) {
        return new Promise((resolve, reject) => {
            try {
                db.transaction((tx) => {
                    tx.executeSql("SELECT * from airports WHERE lower(IATACode) = ? OR lower(ICAOCode) = ?1 OR lower(FAACode) = ?2",
                        [search],
                        (tx, results) => {

                            var codes = results.rows.raw();

                            tx.executeSql("SELECT * from airports WHERE lower(Name) LIKE '%' || ? || '%'",
                                [search],
                                (tx2, results2) => {

                                    var codes2 = results2.rows.raw();
                                    callback(codes.concat(codes2));
                                    resolve();
                                });

                        });
                });
            }
            catch (err) {
                reject(err);
            }
        })
    },

    SearchByExactName: function (search, callback) {
        db.transaction((tx) => {

            tx.executeSql("SELECT * from airports WHERE Name = ?",
                [search],
                (tx, results) => {
                    callback(results.rows.raw());
                });
        });
    },

    SearchById: function (search, callback) {
        return new Promise((resolve, reject) => {
            try {

                db.transaction((tx) => {

                    tx.executeSql("SELECT * from airports WHERE Id = ?",
                        [search],
                        (tx, results) => {
                            callback(results.rows.raw());
                            resolve();
                        });
                });
            }
            catch (err) {
                reject(err);
            }
        })

    },

    SearchByIATACode: function (search, callback) {
        db.transaction((tx) => {

            tx.executeSql("SELECT * from airports WHERE IATACode = ?",
                [search],
                (tx, results) => {
                    callback(results.rows.raw());
                });
        });
    },

    TestAirportCount: function () {
        return new Promise((resolve, reject) => {
            try {
                db.transaction((tx) => {
                    tx.executeSql("select count(*) from airports",
                        [],
                        (tx, results) => {
                            // get the exact value here and return
                            debugger;
                            var raw = results.rows.raw();
                            callback(results.rows.raw());
                            //debugger;
                            resolve();
                        },
                        (error) => {
                            debugger;
                            reject(error);
                        });
                });
            }
            catch (err) {
                debugger;
                reject(err);
            }
        });
    },

    TestTimezoneCount: function () {
        return new Promise((resolve, reject) => {
            try {
                db.transaction((tx) => {
                    tx.executeSql("select count(*) from timezonesDST",
                        [],
                        (tx, results) => {
                            // get the exact value here and return
                            debugger;
                            var raw = results.rows.raw();
                            callback(results.rows.raw());
                            //debugger;
                            resolve();
                        },
                        (error) => {
                            debugger;
                            reject(error);
                        });
                });
            }
            catch (err) {
                debugger;
                reject(err);
            }
        });
    },

    GetAirportOffSets: function (airportId, date, callback) {

        return new Promise((resolve, reject) => {
            try {
                db.transaction((tx) => {
                    tx.executeSql("SELECT * From airports a JOIN timezonesDST t ON a.TZWindowsID = t.TZWindowsID WHERE a.Id = ?",
                    //tx.executeSql("SELECT * From airports a JOIN timezonesDST t ON a.TZWindowsID = t.TZWindowsID WHERE a.Id = 14258",
                        //tx.executeSql("SELECT * From airports",
                        //tx.executeSql("SELECT * From timezonesDST",
                        //tx.executeSql("SELECT * From airports WHERE Id = ?",
                        [airportId],
                        (tx, results) => {
                            // get the exact value here and return

                            var rows = results.rows.raw();
                            var row = Enumerable.from(rows).firstOrDefault(x => date >= new Date(x.From) && date < new Date(x.To), null);

                            /*
                            rows.forEach(x =>{
                                var from = new Date(x.From);
                                var to = new Date(x.To);
                                console.log(date);
                               console.log(from);
                               console.log(to);

                                
                               if (date > from)
                               {
                                   console.log('TRUE, greater than from');
                                   
                               }

                               if (date < to)
                               {
                                   console.log('TRUE, less than to');
                                   
                               }

                               console.log('.....');
                            });
*/

                            if (row == null) {
                                callback(0); // no data so set to zero to avoid breaking
                            }
                            else {
                                callback(row.Offset);
                            }

                            resolve();
                        },
                        (error) => {
                            debugger;
                            reject(error);
                        });
                });
            }
            catch (err) {
                debugger;
                reject(err);
            }
        });
    },

    OverWriteAirportsTable: function (rows) {

        const sqlQueryParamValues = rows.map(({ ICAOCode, IATACode, FAACode, Name, TZWindowsID, StdUtcOffset, DaylightUtcOffset, Id }) => `(${ICAOCode ? `'${ICAOCode}'` : '""'}, ${IATACode ? `'${IATACode}'` : '""'}, ${FAACode ? `'${FAACode}'` : '""'}, '${this.EscapeSingleQuoteIfAny(Name)}', ${TZWindowsID ? `'${TZWindowsID}'` : '""'}, ${StdUtcOffset ? `${StdUtcOffset}` : null}, ${DaylightUtcOffset ? `${DaylightUtcOffset}` : null},${Id ? `${Id}` : null})`).join(`,`);

        const sqlQuery = `INSERT INTO airports ( ICAOCode, IATACode, FAACode, Name, TZWindowsID, StdUtcOffset, DaylightUtcOffset, Id) VALUES 
    ${sqlQueryParamValues};`

        return new Promise((resolve, reject) => {
            try {
                db.transaction((tx, error, success) => {
                    tx.executeSql('delete from airports', null, (tx, results) => {

                        tx.executeSql(sqlQuery, null, (tx, results) => {

                            resolve();
                        })

                    })
                })
            }
            catch (err) {
                reject(err);
            }
        })
    },

    EscapeSingleQuoteIfAny: function (text) {
        const doesTextContainsSingleQuote = text.indexOf("'") === -1;
        return !doesTextContainsSingleQuote ? text.replaceAll("'", "''") : text;
    }
};

export default AirportsRepository;
