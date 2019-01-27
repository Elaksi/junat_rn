import React from 'react';
import { View, Text } from 'react-native';

import dateHelper from '../helpers/datehelper';
import styles from "../style";

export default class ScheduleView extends React.Component{
	
	constructor(props){
		super(props);
		
		const train = this.props.train;
		
		//Determine which values to use (arrival/departure)
		if(this.props.type == "arrival"){
			this.estimated = train.estimatedArrival;
			this.scheduled = train.scheduledArrival;
			this.happens = "Saapuu";
			this.happensIn = "Saapumiseen aikaa";
		}else{
			this.estimated = train.estimatedDeparture;
			this.scheduled = train.scheduledDeparture;
			this.happens = "Lähtee";
			this.happensIn = "Lähtöön aikaa";
		}
		
		this.state = ({timeUntil: dateHelper.timeUntil(this.estimated)});
	}
	
	componentDidMount(){
		this.timer = setInterval(() => this.tick(), 1000);
	}
	
	componentWillUnmount(){
		clearInterval(this.timer);
	}
	
	tick(){
		this.setState({timeUntil: dateHelper.timeUntil(this.estimated)});
	}
	
	render(){
		if (this.estimated instanceof Date && !dateHelper.hasPassed(this.estimated)){
			if (this.scheduled.getTime() == this.estimated.getTime()){
				return (<View>
				<Text key = {this.props.type + 'Header'}
					style={styles.listHeader}>{this.happens}</Text>
				<Text key = {this.props.type}
					style={styles.listItem}>{dateHelper.formatDate(this.scheduled)}</Text>
				<Text key = {this.props.type + 'InHeader'}
					style={styles.listHeader}>{this.happensIn}</Text>
				<Text key = {this.props.type + "In"}
					style={styles.listItem}>{this.state.timeUntil}</Text>
				</View>);
			}else{
				return (<View>
				<Text key = {this.props.type + 'Header'}
					style={styles.listHeader}>{this.happens}</Text>
				<Text key = {this.props.type}
					style={styles.listItem}>{dateHelper.formatDate(this.scheduled)} -> {dateHelper.formatTime(this.estimated)}</Text>
				<Text key = {this.props.type + 'InHeader'}
					style={styles.listHeader}>{this.happensIn}</Text>
				<Text key = {this.props.type + "In"}
					style={styles.listItem}>{this.state.timeUntil}</Text>
				</View>);
			}
		}else{
			return null;
		}
	}
}