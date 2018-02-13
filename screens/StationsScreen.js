import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert} from 'react-native';
import { StackNavigator, } from 'react-navigation';
import styles from "../style";
import "../stations.js";

export default class StationsScreen extends React.Component {
	//Set screen title
	static navigationOptions = {
		title: 'Asemat',
	};
	constructor(){
		super();
		this.state = {stations: [{stationName: "Ladataan asemia...", 
			stationShortCode: "MOI", stationUICCode: 100000} ], 
			count: 0, 
			stationArray: [], 
			searchText: ""};
		this.sortStations = this.sortStations.bind(this)
	}
	componentDidMount(){
		this.updateStations("")
		this.getStations();
	}
	//Get stations from API
	async getStations(){
		try{
			let response = await fetch("https://rata.digitraffic.fi/api/v1/metadata/stations");
			let responseJson = await response.json();
			//Put stations to state
			this.setState({stations: responseJson});
			//Sort stations
			this.state.stations.sort(this.sortStations);
			//Update station UI
			this.updateStations(this.state.searchText);
			//Update stationShorts dictionary for StationScreen
			this.state.stations.filter((station) => {
				return global.stationShorts[station.stationShortCode] == undefined;
			}).forEach((station) =>{
				global.stationShorts[station.stationShortCode] = station.stationName;
			});
		}catch(error){
			//Show error to user
			Alert.alert('Jokin meni vikaan.', error.toString());
		}	
	}
	//Update station FlatList data
	updateStations(filter){
	  //Add stations that include filter to data array
		var dataArray = this.state.stations.filter((station) => {
			return (station.stationName.toLowerCase().indexOf(filter.toLowerCase()) !== -1 || station.stationShortCode.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
		});
	  this.setState({stationArray: dataArray});
	}
	//Search TextInput text changed
	searchChanged(txt){
		//Update searchText state
		this.setState({searchText: txt.text.toLowerCase()});
		//Sort stations
		this.state.stations.sort(this.sortStations);
		this.updateStations(txt.text);
	}
	_stationPressed(station){
		this.props.navigation.navigate('Station', {station: station})
	}
	//Sort function for stations
	sortStations(a,b){
		if (this.state.searchText != ""){
			//Sort higher station that contains searchText in lower index
			if(a.stationName.toLowerCase().indexOf(this.state.searchText) < b.stationName.toLowerCase().indexOf(this.state.searchText))
				return -1;
			if(a.stationName.toLowerCase().indexOf(this.state.searchText) > b.stationName.toLowerCase().indexOf(this.state.searchText))
				return 1;
			return 0;
		}else{
			//Alphabetical order 
			if(a.stationName < b.stationName) return -1;
			if(a.stationName > b.stationName) return 1;
			return 0;
		}
	}
	render() {
		return (
			<View key = "mV" style={styles.container}>
				<TextInput key = "tIp" placeholder="Etsi asemia" style={styles.searchBar} onChangeText={(text) => this.searchChanged({text})} autoFocus = {true}></TextInput>
				<FlatList
					key = "fL"
					data={this.state.stationArray}
					keyExtractor={item => item.stationName}
					renderItem={({item}) => (
						<TouchableOpacity onPress={() => this._stationPressed(item)} >
							<Text style={styles.listItem}>{item.stationName}</Text>
						</TouchableOpacity>
					)}
				/>
			</View>
		);
	}
}