import React from 'react';
import { Text, View, TextInput, Alert } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { SearchBar } from 'react-native-elements';

import StationList from "../components/stationlist.js";
import styles from "../style";
import "../stations.js";

export default class StationsScreen extends React.Component {
	
	//Set screen title
	static navigationOptions = {
		title: 'Asemat',
	};
	
	constructor(){
		super();
		this.state = {stations: [], 
			searchText: ""};
		this.stationPressed = this.stationPressed.bind(this);
	}
	
	componentDidMount(){
		this.getStations();
	}
	
	//Get stations from API
	async getStations(){
		try{
			const response = await fetch("https://rata.digitraffic.fi/api/v1/metadata/stations");
			const responseJson = await response.json();

			this.setState({stations: responseJson});
			
			//Update stationShorts dictionary
			this.state.stations.filter((station) => {
				return global.stationShorts[station.stationShortCode] == undefined;
			}).forEach((station) =>{
				global.stationShorts[station.stationShortCode] = station.stationName;
			});
		}catch(error){
			//Show error to user
			Alert.alert('Jokin meni vikaan!', error.toString());
		}	
	}
	
	//searchInput changed -> update state
	searchChanged(query){
		const searchQuery = query.text;
		this.setState({searchText: searchQuery});
	}
	
	stationPressed(station){
		this.props.navigation.navigate('Station', {station: station});
	}
	
	render() {
		return (
			<View key = "containerView" style={styles.container}>
				<SearchBar lightTheme
					clearIcon = {{color: 'black'}}
					key = "searchInput" 
					placeholder = "Etsi asemia" 
					onChangeText={(text) => this.searchChanged({text})}></SearchBar>
				<StationList
					key = "stationList" 
					stations = {this.state.stations}
					stationPressed = {this.stationPressed}
					filterQuery = {this.state.searchText}/>
			</View>
		);
	}
}

