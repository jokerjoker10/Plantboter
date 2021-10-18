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

export default {
    timeToString: timeToString
}