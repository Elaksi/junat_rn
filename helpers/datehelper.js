const dateHelper = {
	//Format date
	formatTime : function(date){
		return (date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes() + ":" + (date.getSeconds()<10?'0':'') + date.getSeconds()).toString();
	},
	//Format date -> time
	formatDate : function(date){
		return (date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear() + " " + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes() + ":" + (date.getSeconds()<10?'0':'') + date.getSeconds()).toString();
	},
	//Check if given date has passed
	hasPassed : function(date){
		let d = new Date();
		return (date.getTime() < d.getTime());
	},
	secondsUntil : function(date){
		return (date - new Date())/1000;
	},
	//How much time (hh.mm.ss) until date
	timeUntil : function(date){
		const totalSeconds = dateHelper.secondsUntil(date);
		if(totalSeconds <= 0){
			return "00.00.00";
		}
		
		const hours = Math.floor(totalSeconds/(60*60));
		const minutes = Math.floor((totalSeconds/60)%(60));
		const seconds = Math.floor((totalSeconds)%(60));
		
		const time = ((hours < 10 ? '0' + hours : hours) + '.' + (minutes < 10 ? '0' + minutes : minutes) + '.' + (seconds < 10 ? '0' + seconds : seconds));
		
		return time;
	}
}

export default dateHelper;