function timeToString(time: number): string{
    var seconds = Math.floor((time / 1000) % 60);
    var minutes = Math.floor((time / (1000 * 60)) % 60);
    var hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    var days = Math.floor((time / (1000 * 60 * 60 * 24)))

    var output = "";

    if(days > 1){
        output += Math.floor(days) + " d ";
    }

    if(hours > 1){
        output += Math.floor(hours) + " h ";
    }

    if(minutes > 1){
        output += Math.floor(minutes) + " m ";
    }
    
    if(seconds > 1){
        output += Math.floor(seconds) + " s";
    }

    return output;
}

function dateToString(date: Date): string{
    var tmp_date = new Date(date);
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    return ' ' + tmp_date.getDay().toString() + ' ' + monthNames[tmp_date.getMonth()] + ' ' + tmp_date.getFullYear();
}

export default {
    timeToString: timeToString,
    dateToString: dateToString
}