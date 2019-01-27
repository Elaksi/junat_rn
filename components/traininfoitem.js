import React from 'react';
import { View, Text } from 'react-native';

import ScheduleView from "../components/scheduleview.js";
import styles from "../style";

export default class TrainInfoItem extends React.Component{
	
	constructor(props){
		super(props);
	}
	
	render(){
		const train = this.props.train;
		return (
			<View>
				<Text key = "trainHeader"
					style={styles.listHeader}>Juna</Text>
				<Text key = "trainText"
					style={styles.listItem}>{train.trainType} {train.trainNumber}</Text>
				<Text key = "trackHeader"
					style={styles.listHeader}>Raide</Text>
				<Text key = "trackText"
					style={styles.listItem}>{train.track}</Text>
				<Text key = "terminusHeader"
					style={styles.listHeader}>Reitti</Text>
				<Text key = "terminusText"
					style={styles.listItem}>{global.stationShorts[train.coming]} - {global.stationShorts[train.going]}</Text>
				<ScheduleView key = "arrivalView"
					type = "arrival"
					train = {train}/>
				<ScheduleView key = "departureView"
					type = "departure"
					train = {train}/>
			</View>
		);
	}
}