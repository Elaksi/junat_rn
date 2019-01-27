import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import styles from "../style";

export default class StationItem extends React.Component{
	
	constructor(props){
		super(props);
	}
	
	render(){
		const station = this.props.station;
		return (
		<TouchableOpacity onPress={() => this.props.onPress(station)}>
			<Text style={styles.listItem}>{station.stationName}</Text>
		</TouchableOpacity>
		);
	}
}