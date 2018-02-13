import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, RefreshControl, } from 'react-native';
import { StackNavigator, } from 'react-navigation';
import styles from "../style";
import "../stations.js";

export default class StationScreen extends React.Component {
	//Set screen title
	static navigationOptions = {
		title: 'Saapuvat ja lähtevät junat',
	};
	constructor(props){
		super(props);
		this.state = {station: this.props.navigation.state.params.station, 
			trains: [{trainNumber: 0}], 
			trainArray: [], 
			departure: [<Text key="lD" style={styles.listItem}>Ladataan junia...</Text>], 
			arrival: [<Text key="lA" style={styles.listItem}>Ladataan junia...</Text>],
			refreshing: true};
	}
	componentDidMount(){
		this.getTrains();
	}
	//Get trains from API
	async getTrains(){
		try{
			let response = await fetch("https://rata.digitraffic.fi/api/v1/live-trains/station/" + this.state.station.stationShortCode + "?arrived_trains=0&arriving_trains=10&departed_trains=0&departing_trains=10&include_nonstopping=false");
			let responseJson = await response.json();
			//Save trains to state
			this.setState({trains: responseJson});
			//Update train UI
			this.updateTrains();
			this.setState({refreshing: false});
		} catch(error){
			//Show error to user
			Alert.alert('Jokin meni vikaan.', error.toString());
		}
	}
	//Update station list data
	updateTrains(){
		var trains = []
		
		//Putting needed data to more simple structure:
		var estimatedArrival;
		var scheduledArrival;
		var estimatedDeparture;
		var scheduledDeparture;
		var commercialStop;
		var track;
		
		//Iterate trains array
		this.state.trains.forEach((train) => {
			//Enumerate trains timeTableRows
			for(var i = 0, l = train.timeTableRows.length; i < l; i++){
				if (train.timeTableRows[i].stationShortCode === this.state.station.stationShortCode){
					//If timeTableRows isn't for this station, continue
					if(!train.timeTableRows[i].hasOwnProperty("commercialTrack") || train.timeTableRows[i].hasOwnProperty("commercialTrack") == ""){
						continue;
					}else{
						track = train.timeTableRows[i].commercialTrack;
					}
					//If this row is last, the train will not leave (ARRIVAL rows are before DEPARTURE rows)
					if(i === train.timeTableRows.length-1){
						estimatedDeparture = "";
						scheduledDeparture = "";
					}else{
						//scheduledDeparture is next row's scheduledTime
						scheduledDeparture =  train.timeTableRows[i+1].scheduledTime;
						//Get liveEstimateTime if exists, otherwise estimate=scheduled
						if(train.timeTableRows[i + 1].hasOwnProperty("liveEstimateTime")){
							estimatedDeparture = train.timeTableRows[i + 1].liveEstimateTime;
						}else{
							estimatedDeparture = scheduledDeparture;
						}
					}
					//If this row is first, the train will not arrive (ARRIVAL rows are before DEPARTURE rows)
					if(i === 0 && train.timeTableRows[i].type === "DEPARTURE"){
						estimatedArrival = "";
						scheduledArrival = "";
						scheduledDeparture =  train.timeTableRows[i].scheduledTime;
						//Get liveEstimateTime if exists, otherwise estimate=scheduled
						if(train.timeTableRows[i].hasOwnProperty("liveEstimateTime")){
							estimatedDeparture = train.timeTableRows[i].liveEstimateTime;
						}else{
							estimatedDeparture = scheduledDeparture;
						}
					}else{
						//This row is ARRIVAL, get needed info
						scheduledArrival =  train.timeTableRows[i].scheduledTime;
						if(train.timeTableRows[i].hasOwnProperty("liveEstimateTime")){
							estimatedArrival = train.timeTableRows[i].liveEstimateTime;
						}else{
							estimatedArrival = scheduledArrival;
						}
					}
					//Get commercialStop bool
					if(train.timeTableRows[i].hasOwnProperty("commercialStop")){
						commercialStop = train.timeTableRows[i].commercialStop;
					}else{
						commercialStop = false;
					}
					//Train number
					trains.push({trainNumber: train.trainNumber, 
					//Train type
					trainType: train.trainType, 
					//Track number
					track: track, 
					//Commercial stop (bool)
					commercialStop: commercialStop, 
					//ARRIVAL/DEPARTURE
					type: train.timeTableRows[i].type, 
					//Scheduled arrival time
					scheduledArrival: new Date(scheduledArrival), 
					//Estimated arrival time
					estimatedArrival: new Date(estimatedArrival), 
					//Scheduled departure time
					scheduledDeparture: new Date(scheduledDeparture), 
					//Estimated departure time
					estimatedDeparture: new Date(estimatedDeparture), 
					//Train's first station
					coming: train.timeTableRows[0].stationShortCode,
					//Train's last station
					going: train.timeTableRows[train.timeTableRows.length-1].stationShortCode,
					//Station shortcode
					stationShortCode: this.state.station.stationShortCode});
					//This train's info collected, next train
					break;
				}
			}
		});
		var timeString;
		//Add all departure trains in train array to departure trains array
		var departureData = trains.filter((train) => 
			{
				//Filter out unwanted trains 
				return (train.going !== this.state.station.stationShortCode && train.track !== "" && train.commercialStop);
			})
			//Sort by estimated departure time
			.sort(this.sortDepartureTrains)
			.map((train, i) =>
			{
				//Format time
				if (train.scheduledDeparture.getTime() !== train.estimatedDeparture.getTime()){
					timeString = this.formatDate(train.scheduledDeparture) + " -> " + this.formatTime(train.estimatedDeparture);
				}else{
					timeString = this.formatDate(train.scheduledDeparture);
				}
				return(
					<TouchableOpacity className ="departure" key = {train.trainNumber + train.scheduledDeparture.toString()} style={styles.train} onPress={() => this.props.navigation.navigate("Train", {train: train})}>
						<Text key = {train.trainNumber + train.scheduledDeparture.toString()+"t"} style={styles.listItem}>Määränpää: {global.stationShorts[train.going]}</Text>
						<Text key = {train.trainNumber + train.scheduledDeparture.toString()+"l"} style={styles.listItem}>
						{timeString}
						</Text>
					</TouchableOpacity>
				);
			});
		//If no departure trains, show text
		if (departureData.length == 0){
			departureData = [<Text key = {"noderarture"} style={styles.listItem}>Ei lähteviä junia.</Text>];
		}
		this.setState({departure: departureData});
		//Add all arrival trains in train array to arrival trains array
		var arrivalData = trains.filter((train) => 
			{
				//Filter out unwanted trains 
				return (train.scheduledArrival instanceof Date && train.track !== "" && !this.hasPassed(train.estimatedArrival) && train.coming !== this.state.station.stationShortCode && train.commercialStop);
			})
			//Sort by estimated arrival time
			.sort(this.sortArrivalTrains)
			.map((train, i) =>
			{
				//Format time
				if (train.scheduledArrival.getTime() !== train.estimatedArrival.getTime()){
					timeString = this.formatDate(train.scheduledArrival) + " -> " + this.formatTime(train.estimatedArrival);
				}else{
					timeString = this.formatDate(train.scheduledArrival);
				}
				return(
					<TouchableOpacity key = {train.trainNumber + train.scheduledArrival.toString()} className ="departure" style={styles.train} onPress={() => this.props.navigation.navigate("Train", {train: train})}>
						<Text key = {train.trainNumber + train.scheduledArrival.toString()+"t"} style={styles.listItem}>Määränpää: {global.stationShorts[train.going]}</Text>
						<Text key = {train.trainNumber + train.scheduledArrival.toString()+"l"} style={styles.listItem}>
						{timeString}
						</Text>
					</TouchableOpacity>
				);
			});
		//If no arrival trains, show text
		if (arrivalData.length == 0){
			arrivalData = [<Text key = {"noarrival"} style={styles.listItem}>Ei saapuvia junia.</Text>];
		}
		this.setState({arrival: arrivalData});
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
	//Sort trains by estimatedArrival
	sortArrivalTrains(a,b){
		if(a.estimatedArrival.getTime() < b.estimatedArrival.getTime())
			return -1;
		if(a.estimatedArrival.getTime() > b.estimatedArrival.getTime())
			return 1;
		return 0;
	}
	//Sort trains by estimatedDeparture
	sortDepartureTrains(a,b){
		if(a.estimatedDeparture.getTime() < b.estimatedDeparture.getTime())
			return -1;
		if(a.estimatedDeparture.getTime() > b.estimatedDeparture.getTime())
			return 1;
		return 0;
	}
	//On list refresh get data from API
	_onRefresh(){
		this.setState({refreshing: true});
		this.getTrains().then(() => {
			this.setState({refreshing: false});
		});
	}
	render() {
		const {navigate} = this.props.navigation;
		return (
			<View style={styles.container}>
				<Text style={styles.stationName}>{this.state.station.stationName} ({this.state.station.stationShortCode})</Text>
				<ScrollView 
					style={styles.scrollView}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this._onRefresh.bind(this)}/>
					}>
					<Text style={styles.listHeader}>Lähtevät junat</Text>
					{this.state.departure}
					 <Text style={styles.listHeader}>Saapuvat junat</Text>
					{this.state.arrival}
				</ScrollView>
			</View>
		);
	}
}

