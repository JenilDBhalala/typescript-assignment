//Floating to Degree Minutes Seconds Conversion
function convertFloatingToDMS(degree : number) : string {
    var deg : number = degree | 0;
    var frac : number = Math.abs(degree - deg);
    var min : number = (frac * 60) | 0;
    var sec : number = (frac * 3600 - min * 60) | 0;
    return deg + "°" + min + "'" + sec + '"';
}

//Degree Minutes Seconds to Floating Conversion
function convertDMSToFloating(degrees : number, minutes : number, seconds : number) : number {
    var degree : number = (degrees) + (minutes / 60) + (seconds / (60 * 60));
    return degree;
}

export {convertFloatingToDMS, convertDMSToFloating};