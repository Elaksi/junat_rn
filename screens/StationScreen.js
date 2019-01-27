import React from 'react';
import { Text, View, ScrollView, Alert, RefreshControl, } from 'react-native';
import { StackNavigator } from 'react-navigation';

import TrainList from "../components/trainlist.js";
import dateHelper from '../helpers/datehelper';
import styles from "../style";
import "../stations.js";

export default class StationScreen extends React.Component {
	
	//Set screen title
	static navigationOptions = {
		title: 'Saapuvat ja lähtevät junat',
	};
	
	constructor(props){
		super(props);
		this.state = {trains: [{trainNumber: 0}], 
			refreshing: true};
		this.trainPressed = this.trainPressed.bind(this);
		this.sortArrivalTrains = this.sortArrivalTrains.bind(this);
		this.sortDepartureTrains = this.sortDepartureTrains.bind(this);
		
		this.station = this.props.navigation.state.params.station; 
	}
	
	componentDidMount(){
		this.getTrains();
	}
	
	//Get trains from API
	async getTrains(){
		try{
			let response = await fetch("https://rata.digitraffic.fi/api/v1/live-trains/station/" + this.station.stationShortCode + "?arrived_trains=10&arriving_trains=10&departed_trains=10&departing_trains=10&include_nonstopping=false");
			let responseJson = await response.json();
			
			//Update train data
			this.updateTrains(responseJson);
			this.setState({refreshing: false});
		} catch(error){
			//Show error to user
			Alert.alert('Jokin meni vikaan.', error.toString());
		}
	}
	
	//Update station list data
	updateTrains(trainData){
		var trains = [];
		
		//Putting needed data to more simple structure:
		let estimatedArrival;
		let scheduledArrival;
		let estimatedDeparture;
		let scheduledDeparture;
		var commercialStop;
		var track;
		
		//Iterate trainData	array
		trainData.forEach((train) => {
			estimatedArrival = "";
			scheduledArrival = "";
			estimatedDeparture = "";
			scheduledDeparture = "";
			//Iterate trains timeTableRows
			train.timeTableRows.filter((row) => {
				//If timeTableRows isn't for this station, continue
				return (row.stationShortCode === this.station.stationShortCode && row.hasOwnProperty("commercialTrack") && row.commercialTrack != "")
			}).forEach((row) => {
				track = row.commercialTrack;
				if(row.type === "DEPARTURE"){
					scheduledDeparture =  new Date(row.scheduledTime);
					//Get liveEstimateTime if exists, otherwise estimate=scheduled
					if(row.hasOwnProperty("liveEstimateTime")){
						estimatedDeparture = new Date(row.liveEstimateTime);
					}else{
						estimatedDeparture = scheduledDeparture;
					}
				}
				if(row.type === "ARRIVAL"){
					scheduledArrival =  new Date(row.scheduledTime);
					//Get liveEstimateTime if exists, otherwise estimate=scheduled
					if(row.hasOwnProperty("liveEstimateTime")){
						estimatedArrival = new Date(row.liveEstimateTime);
					}else{
						estimatedArrival = scheduledArrival;
					}
				}
				//Get commercialStop bool
				if(row.hasOwnProperty("commercialStop")){
					commercialStop = row.commercialStop;
				}else{
					commercialStop = false;
				}
			});
				
			//Train number
			trains.push({trainNumber: train.trainNumber, 
			//Train type
			trainType: train.trainType, 
			//Track number
			track: track, 
			//Commercial stop (bool)
			commercialStop: commercialStop, 
			//Scheduled arrival time
			scheduledArrival: scheduledArrival, 
			//Estimated arrival time
			estimatedArrival: estimatedArrival, 
			//Scheduled departure time
			scheduledDeparture: scheduledDeparture, 
			//Estimated departure time
			estimatedDeparture: estimatedDeparture, 
			//Train's first station
			coming: train.timeTableRows[0].stationShortCode,
			//Train's last station
			going: train.timeTableRows[train.timeTableRows.length-1].stationShortCode
			});
		});
		
		this.setState({trains: trains});
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
	
	trainPressed(train){
		this.props.navigation.navigate("Train", {train: train, station: this.station});
	}
	
	//On list refresh get data from API
	onRefresh(){
		this.setState({refreshing: true});
		this.getTrains();
	}
	
	render() {
		const {navigate} = this.props.navigation;
		return (
			<View style={styles.container}>
				<Text key = "stationNameText" 
					style={styles.stationName}>{this.station.stationName} ({this.station.stationShortCode})</Text>
				<ScrollView key = "trainScrollView"
					style={styles.scrollView}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this.onRefresh.bind(this)}/>
					}>
					<TrainList 
						key = "departureList"
						type = "departure" 
						trains = {this.state.trains.filter((train) => 
						{
							//Filter out unwanted trains 
							return (train.scheduledDeparture instanceof Date && train.track !== "" && !dateHelper.hasPassed(train.estimatedDeparture) && train.commercialStop);
						})
						//Sort by estimated departure time
						.sort(this.sortDepartureTrains)} 
						onPress = {this.trainPressed}/>
					<TrainList 
						key = "arrivalList"
						type = "arrival" 
						trains = {this.state.trains.filter((train) => 
						{
							//Filter out unwanted trains 
							return (train.scheduledArrival instanceof Date && train.track !== "" && !dateHelper.hasPassed(train.estimatedArrival) && train.commercialStop);
						})
						//Sort by estimated arrival time
						.sort(this.sortArrivalTrains)} 
						onPress = {this.trainPressed} />
				</ScrollView>
			</View>
		);
	}
}