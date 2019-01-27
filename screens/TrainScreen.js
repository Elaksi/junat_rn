import React from 'react';
import { View, Alert, ScrollView, RefreshControl, } from 'react-native';
import { StackNavigator } from 'react-navigation';

import TrainInfoItem from '../components/traininfoitem';
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
		refreshing: false};
		
		this.onRefresh = this.onRefresh.bind(this);
	}
	
	componentDidMount(){
		this.getTrain();
	}
	
	//Get train from API
	async getTrain(){
		try{
			const response = await fetch("https://rata.digitraffic.fi/api/v1/trains/latest/" + this.state.train.trainNumber.toString());
			const responseJson = await response.json();
			const train = this.state.train;
			
			//Update estimates is possible
			responseJson.filter((row) => {
				return (row.stationShortCode === this.props.navigation.state.params.station.stationShortCode);
			}).forEach((row) => {
				if(row.type === "DEPARTURE" && row.hasOwnProperty("liveEstimateTime")){
					train.estimatedDeparture = new Date(row.liveEstimateTime);
				}
				if(row.type === "ARRIVAL" && row.hasOwnProperty("liveEstimateTime")){
					train.estimatedArrival = new Date(row.liveEstimateTime);
				}
			});
			this.setState({train: train})

			this.setState({refreshing: false});
		} catch(error){
			//Show error to user
			Alert.alert('Jokin meni vikaan.', error.toString());
		}
	}

	//On screen refresh get data from API
	onRefresh(){
		this.setState({refreshing: true});
		this.getTrain();
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
					onRefresh={this.onRefresh}/>
				}>
				<TrainInfoItem 
					key="trainInfoItem"
					train = {this.state.train}/>
			</ScrollView>
		</View>
		);
	}
}

