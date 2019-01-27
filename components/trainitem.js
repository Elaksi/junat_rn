import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import dateHelper from '../helpers/datehelper';
import styles from "../style";
import "../stations.js";

export default class TrainItem extends React.Component{
	
	constructor(props){
		super(props);
	}
	
	render(){
		const train = this.props.train;
		
		let scheduled;
		let estimated;
		
		//Use correct time fields
		if(this.props.type == "arrival"){
			scheduled = train.scheduledArrival;
			estimated = train.estimatedArrival;
		}else{
			scheduled = train.scheduledDeparture;
			estimated = train.estimatedDeparture;
		}
		
		let timeString;
		//Format time
		if (scheduled.getTime() !== estimated.getTime()){
			timeString = dateHelper.formatDate(scheduled) + " -> " + dateHelper.formatTime(estimated);
		}else{
			timeString = dateHelper.formatDate(scheduled);
		}
		
		return (
			<TouchableOpacity 
				style={styles.train} 
				onPress={() => this.props.onPress(train)}>
				<Text key = "goingText" 
					style={styles.listItem}>Määränpää: {global.stationShorts[train.going]}</Text>
				<Text key = "timesText" 
					style={styles.listItem}>
				{timeString}
				</Text>
			</TouchableOpacity>
		);
	}
}