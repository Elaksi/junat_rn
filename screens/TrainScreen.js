import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, RefreshControl, } from 'react-native';
import { StackNavigator, } from 'react-navigation';
import styles from "../style";
import "../stations.js";

export default class StationScreen extends React.Component {
	//Set screen title
	static navigationOptions = {
		title: 'Junan tiedot',
	};
	constructor(props){
		super(props);
		this.state = {train: this.props.navigation.state.params.train, 
		arrival: <View/>, 
		departure: <View/>,
		refreshing: false};
	}
	componentDidMount(){
		this.getTrain();
		this.updateTrain();
	}
	//Get train from API
	async getTrain(){
		try{
			let response = await fetch("https://rata.digitraffic.fi/api/v1/trains/latest/" + this.state.train.trainNumber.toString());
			let responseJson = await response.json();
			let train = this.state.train;
			//If this.state.train has valid scheduledArrival, update it
			if(train.scheduledArrival instanceof Date && !isNaN(train.scheduledArrival.getTime())){
				var filteredRow = responseJson[0].timeTableRows.filter((row) =>	{
					return (row.stationShortCode === train.stationShortCode && row.type === "ARRIVAL");
				});
				train.scheduledArrival = new Date(filteredRow[0].scheduledTime);
				if (filteredRow[0].hasOwnProperty("liveEstimateTime") && filteredRow[0].liveEstimateTime !== filteredRow[0].scheduledTime){
					train.estimatedArrival = new Date(filteredRow[0].liveEstimateTime);
				}
			}
			//If this.state.train has valid scheduledDeparture, update it
			if(train.scheduledDeparture instanceof Date && !isNaN(train.scheduledDeparture.getTime())){
				var filteredRow = responseJson[0].timeTableRows.filter((row) =>	{
					return (row.stationShortCode === train.stationShortCode && row.type === "DEPARTURE");
				});
				train.scheduledDeparture = new Date(filteredRow[0].scheduledTime);
				if (filteredRow[0].hasOwnProperty("liveEstimateTime") && filteredRow[0].liveEstimateTime !== filteredRow[0].scheduledTime){
					train.estimatedDeparture = new Date(filteredRow[0].liveEstimateTime);
				}
			}
			this.setState({train: train})
			//Update train UI
			this.updateTrain();
			this.setState({refreshing: false});
		} catch(error){
			//Show error to user
			Alert.alert('Jokin meni vikaan.', error.toString());
		}
	}
	//Update train UI
	updateTrain(){
		let train = this.state.train;
		//Update arrival UI
		if (train.scheduledArrival instanceof Date && !isNaN(train.scheduledArrival.getTime()) && !this.hasPassed(train.estimatedArrival)){
			if (train.scheduledArrival.getTime() == train.estimatedArrival.getTime()){
				this.setState({arrival: <Text style={styles.listItem}>Saapuu: {this.formatDate(train.scheduledArrival)}</Text>});
			}else{
				this.setState({arrival: <Text style={styles.listItem}>Saapuu: {this.formatDate(train.scheduledArrival)} -> {this.formatTime(train.estimatedArrival)}</Text>});
			}
		}else{
			this.setState({arrival: <View/>});
		}
		//Update departure UI
		if (train.scheduledDeparture instanceof Date &&!isNaN(train.scheduledDeparture) && !this.hasPassed(train.estimatedDeparture)){
			if (train.scheduledDeparture.getTime() == train.estimatedDeparture.getTime()){
				this.setState({departure: <Text style={styles.listItem}>Lähtee: {this.formatDate(train.scheduledDeparture)}</Text>});
			}else{
				this.setState({departure: <Text style={styles.listItem}>Lähtee: {this.formatDate(train.scheduledDeparture)} -> {this.formatTime(train.estimatedDeparture)}</Text>});
			}
		}else{
			this.setState({departure: <View/>});
		}
	}
	//Format date
	formatDate(date){
		return (date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear() + " " + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes() + ":" + (date.getSeconds()<10?'0':'') + date.getSeconds()).toString();
	}
	//Format date -> time
	formatTime(date){
		return (date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes() + ":" + (date.getSeconds()<10?'0':'') + date.getSeconds()).toString();
	}
	//Check if given date has passed
	hasPassed(date){
		let d = new Date();
		return (date.getTime() < d.getTime());
	}
	//On screen refresh get data from API
	_onRefresh(){
		this.setState({refreshing: true});
		this.getTrain().then(() => {
			this.setState({refreshing: false});
		});
	}
	render() {
		const {navigate} = this.props.navigation;
		return (
		<View style={styles.container}>
			<ScrollView 
			style={styles.scrollView}
			refreshControl={
				<RefreshControl
					refreshing = {this.state.refreshing}
					onRefresh={this._onRefresh.bind(this)}/>
				}>
				<Text style={styles.listItem}>{this.state.train.trainType} {this.state.train.trainNumber}</Text>
				<Text style={styles.listItem}>Raide {this.state.train.track}</Text>
				<Text style={styles.listItem}>{global.stationShorts[this.state.train.coming]} - {global.stationShorts[this.state.train.going]}</Text>
				{this.state.arrival}
				{this.state.departure}
			</ScrollView>
		</View>
		);
	}
}

