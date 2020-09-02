export function getUniqDatesList(myData) {
    let uniqDatesList = [];
    myData.forEach(function(item) {
        if(uniqDatesList.indexOf(new Date(item.date).toDateString()) === -1) {
            uniqDatesList.push(new Date(item.date).toDateString());
        }
    });
    return uniqDatesList;
};

export function getDatesWithCoordsList(myData) {
    let uniqDatesList = getUniqDatesList(myData);
    let dataCoordsList = [];
    uniqDatesList.forEach(function(item) {
        dataCoordsList.push(
            {
                date:item,
                coords: []
            })
    });
    dataCoordsList.forEach(function(d) {
        myData.forEach(function (c) {
            if(d.date === new Date(c.date).toDateString()) {
                d.coords.push({
                    lat: c.lat,
                    lon: c.lon,
                    date: c.date
                })
            }
        })
    });
    return dataCoordsList;
}

export function getDataDistance(myData) {
    let dataDistanceList = [];
    if(myData.length > 0) {
        let dataCoordsList = getDatesWithCoordsList(myData);
        dataCoordsList.forEach(function(item) {
            let itemDist = distance(item.coords);
            dataDistanceList.push({
                date: item.date,
                distance: itemDist
            })
        });
    }
    console.log(dataDistanceList);
    return dataDistanceList;
}

export function distance(data) {
    const pi = Math.PI;
    const r = 6372795;
    let delitadist = [];
    if(data.length) {
        data.forEach(function (d, i) {
            if (data[i + 1]) {
                let cl1 = Math.cos(d.lat * pi / 180);
                let cl2 = Math.cos(data[i + 1].lat * pi / 180);
                let sl1 = Math.sin(d.lat * pi / 180);
                let sl2 = Math.sin(data[i + 1].lat * pi / 180);
                let delta = data[i + 1].lon * pi / 180 - d.lon * pi / 180;
                let cdelta = Math.cos(delta);
                let sdelta = Math.sin(delta);
                let y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
                let x = sl1 * sl2 + cl1 * cl2 * cdelta;
                let ad = Math.atan2(y, x);
                delitadist.push(ad * r);
            }
        });
        return delitadist.length ?  delitadist.reduce(function (result, num) {
            return result + num;
        }).toFixed() : null
    }
    return 0;
}

export function getUniqTypesList(myData) {
    let uniqTypesList = [];
    myData.forEach(function(item) {
        if(uniqTypesList.indexOf(item.type) === -1) {
            uniqTypesList.push(item.type);
        }
    });
    return uniqTypesList;
};

export function getTypesWithCoordsList(myData) {
    let uniqTypesList = getUniqTypesList(myData);
    let typeCoordsList = [];
    uniqTypesList.forEach(function(item) {
        typeCoordsList.push(
            {
                type:item,
                coords: []
            })
    });
    typeCoordsList.forEach(function(d) {
        myData.forEach(function (c) {
            if(d.type === c.type) {
                d.coords.push({
                    lat: c.lat,
                    lon: c.lon
                })
            }
        })
    });
    return typeCoordsList;
}

export function getTypeDistance(myData) {
    let typeDistanceList = [];
    if(myData.length > 0){
        let typeCoordsList = getTypesWithCoordsList(myData);
        typeCoordsList.forEach(function(item) {
            let itemDist = distance(item.coords);
            typeDistanceList.push({
                type: item.type,
                distance: itemDist
            })
        });
    }
    return typeDistanceList;
}

export function getCoordsIntervals(intervals, myData) {
    let arrayOfIntervals = [];

    intervals.forEach(function(interval) {
        arrayOfIntervals.push(interval.split(', '));
    });

    if(myData.length > 0) {
        let dataCoordsList = getDatesWithCoordsList(myData);
        dataCoordsList.forEach(function(day) {
            day.intervals = {};
            intervals.forEach(function(interval, i) {
                day.intervals[interval] = {};
                day.intervals[interval].coords = day.coords.filter(function(location) {
                    let date = new Date(location.date);
                    return (date.getHours() * 60 + date.getMinutes() >= minutesOfDay(arrayOfIntervals[i][0])) &&
                        (date.getHours() * 60 + date.getMinutes()  < minutesOfDay(arrayOfIntervals[i][1]));
                });
                day.intervals[interval].distance = distance(day.intervals[interval].coords);
            });
        });
        return dataCoordsList;
    }
    else return [];
}

export function getIntervalsWithDistances(intervals, myData){
    let coordsInervals = getCoordsIntervals(intervals, myData),
        data = [];
    coordsInervals.forEach(function (day) {
        let counter = 0;
        for (let key in day.intervals) {
            if(coordsInervals.length > 7){
                data.push({
                        day: new Date(day.date).getDate(),
                        intervalNumber: ++counter,
                        value: day.intervals[key].distance
                    }
                );
            }
            else {
                data.push({
                        day: new Date(day.date).getDay() + 1,
                        intervalNumber: ++counter,
                        value: day.intervals[key].distance
                    }
                );
            }
        }
    });
    return data;
}

export function minutesOfDay(time) {
    let m = time.split(':');
    return m[1] + m[0] * 60;
}