import React from 'react';
import { AppRegistry, StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import { StackNavigator, } from 'react-navigation';
import styles from "../style";
import "../stations.js";

export default class StationScreen extends React.Component {
	static navigationOptions = {
    title: 'Saapuvat ja lähtevät junat',
  };
	constructor(props){
		super(props);
		this.state = {count: 0, station: this.props.navigation.state.params.station, trains: [{trainNumber: 0}], trainArray: [], departure: [], arrival: []};
	}
	updateTrains(){
		//let stationArray =  <Text>Moro</Text>; 
		//this.setState({count: this.state.count+1});
		var trains = []
		for(var key in this.state.trains){
			for(var key2 in this.state.trains[key].timeTableRows){
				if (this.state.trains[key].timeTableRows[key2].stationShortCode === this.state.station.stationShortCode){
					trains.push({trainNumber: this.state.trains[key].trainNumber, 
					type: this.state.trains[key].timeTableRows[key2].type, 
					time: new Date(this.state.trains[key].timeTableRows[key2].scheduledTime), 
					coming: this.state.trains[key].timeTableRows[0].stationShortCode,
					going: this.state.trains[key].timeTableRows[this.state.trains[key].timeTableRows.length-1].stationShortCode});
					this.setState({count: this.state.count+1});
				}
			}
		}
		trains.sort(this.sortTrainsByDate)
		var dateFormat = require('dateformat');
		var count = 0;
		var array = trains.map((train, i) =>
			{
				if (train.type === "DEPARTURE"){
					return(
							<TouchableOpacity className ="departure" key = {train.trainNumber + train.time.toString()} style={styles.train} >
								<Text key = {train.trainNumber + train.time.toString()+"t"} style={styles.listItem}>Menossa: {global.stationShorts[train.going]}</Text>
								<Text key = {train.trainNumber + train.time.toString()+"l"} style={styles.listItem}>Lähtee {train.time.getDate()}.{(train.time.getMonth()+1).toString()}.{train.time.getFullYear()} {train.time.getHours()}:{train.time.getMinutes()<10?'0':''}{train.time.getMinutes()}:{train.time.getSeconds()<10?'0':''}{train.time.getSeconds()}</Text>
							</TouchableOpacity>
					);
					count += 1;
				}
			});
		if (array.length == 0){
			array = <Text key = {"eilahe"} style={styles.listItem}>Ei lähteviä junia.</Text>;
			count += 1;
		}
	  this.setState({departure: array});
	  array = trains.map((train, i) =>
			{
				if (train.type === "ARRIVAL"){
					return(
							<TouchableOpacity key = {train.trainNumber + train.time.toString()} className ="departure" style={styles.train} >
								<Text key = {train.trainNumber + train.time.toString()+"t"} style={styles.listItem}>Tulossa: {global.stationShorts[train.coming]}</Text>
								<Text key = {train.trainNumber + train.time.toString()+"l"} style={styles.listItem}>Saapuu {train.time.getDate()}.{(train.time.getMonth()+1).toString()}.{train.time.getFullYear()} {train.time.getHours()}:{train.time.getMinutes()<10?'0':''}{train.time.getMinutes()}:{train.time.getSeconds()<10?'0':''}{train.time.getSeconds()}</Text>
							</TouchableOpacity>
						);
					count += 1;
				}
					/*if (train.stationShortCode === this.state.station.stationShortCode){
						return(
							<TouchableOpacity onPress={() => this.stationPressed(train)} >
								<Text style={styles.listItem}>{train.type}</Text>
							</TouchableOpacity>
						);
					}*/
			//<Station name = station.stationName />
		
			});
		if (array.length == 0){
			array = <Text key = {count} style={styles.listItem}>Ei saapuvia	 junia.</Text>;
			count += 1;
		}
	  this.setState({arrival: array});
	}
	componentDidMount(){
		this.getTrains();
	}
	stationPressed(station){
	}
	sortTrainsByDate(a,b){
		if(a.time < b.time)
			return -1;
		if(a.time > b.time)
			return 1;
		return 0;
		/*
		if(a.stationUICCode < b.stationUICCode)
			return -1;
		if(a.stationUICCode > b.stationUICCode)
			return 1;
		return 0;
		*/
	}
	async getTrains(){
		try{
			let response = await fetch("https://rata.digitraffic.fi/api/v1/live-trains/station/" + this.state.station.stationShortCode + "?arrived_trains=0&arriving_trains=10&departed_trains=0&departing_trains=10&include_nonstopping=false");
			let responseJson = await response.json();
			this.setState({trains: responseJson});
			this.updateTrains();
		} catch(error){
			
		}
	}
  render() {
	  const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
	  <Text style={styles.stationName}>{this.state.station.stationName} ({this.state.station.stationShortCode})</Text>
		<ScrollView style={styles.scrollView}>
			<Text style={styles.listHeader}>Lähtevät junat</Text>
			{this.state.departure}
			 <Text style={styles.listHeader}>Saapuvat junat</Text>
			{this.state.arrival}
		</ScrollView>
      </View>
    );
  }
}

