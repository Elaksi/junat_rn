import React from 'react';
import { AppRegistry, StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Button, AsyncStorage, FlatList, } from 'react-native';
import { StackNavigator, } from 'react-navigation';
import styles from "../style";
import "../stations.js";

export default class StationsScreen extends React.Component {
	static navigationOptions = {
    title: 'Asemat',
  };
	constructor(){
		super();
		this.state = {stations: [{stationName: "Ladataan asemia...", stationShortCode: "MOI", stationUICCode: 100000} ], count: 0, stationArray: [], searchText: ""};
		this.sortStations = this.sortStations.bind(this)
	}
	async getStations(){
		try{
			try{
				var savedStations = await AsyncStorage.getItem('stations');
				if (savedStations != null){
					this.setState({stations: JSON.parse(savedStations)});
					//this.updateStations("mo");
					this.updateStations(this.state.searchText);
				}else{
					savedStations = "";
				}
			}catch(error){
				this.setState({stations: [{stationName: "1" + error.toString(), stationShortCode: "MOI"}]});
			}	
			let response = await fetch("https://rata.digitraffic.fi/api/v1/metadata/stations");
			let responseJson = await response.json();
			let responseString = JSON.stringify(responseJson);
			if (savedStations == "" || responseString != savedStations){
				this.setState({stations: responseJson});
				this.state.stations.sort(this.sortStations);	
				this.updateStations(this.state.searchText);
				await AsyncStorage.setItem('stations', responseString);
			}
		}catch(error){
			this.setState({stations: [{stationName: error.toString(), stationShortCode: "MOI", stationUICCode: 100000}]});
			this.updateStations("");
		}	
	}
	componentDidMount(){
		this.updateStations("");
		this.getStations();
	}
	updateStations(filter){
		//let stationArray =  <Text>Moro</Text>; 
		//this.setState({count: this.state.count+1});
		/*
		let array = this.state.stations.map((station, i) =>
			{	
				if (global.stationShorts[station.stationShortCode] == undefined){
					global.stationShorts[station.stationShortCode] = station.stationName;
				}
				this.setState({count: this.state.count+1});
				if(station.stationName.toLowerCase().indexOf(filter.toLowerCase()) !== -1 || station.stationShortCode.toLowerCase().indexOf(filter.toLowerCase()) !== -1){
					if (station.statioName == "Ladataan asemia..."){
						return(
							<Text style={styles.listItem} key = {station.stationName}>{station.stationName}</Text>
						);
					}else{
						return(
							<TouchableOpacity key = {station.stationName} onPress={() => this.stationPressed(station)} >
								<Text key = {"t" + station.stationName} style={styles.listItem}>{station.stationName}</Text>
							</TouchableOpacity>
						);
					}
				}
				
			//<Station name = station.stationName />
		
	  });
	  */
	  var array = [];
		for(var key in this.state.stations){
			if (global.stationShorts[this.state.stations[key].stationShortCode] == undefined){
					global.stationShorts[this.state.stations[key].stationShortCode] = this.state.stations[key].stationName;
				}
			if(this.state.stations[key].stationName.toLowerCase().indexOf(filter.toLowerCase()) !== -1 || this.state.stations[key].stationShortCode.toLowerCase().indexOf(filter.toLowerCase()) !== -1){
				array.push(this.state.stations[key]);
			}
		}
	  this.setState({stationArray: array});
	}
	searchChanged(txt){
		this.setState({searchText: txt.text.toLowerCase()});
		this.state.stations.sort(this.sortStations);
		this.updateStations(txt.text);
	}
	stationPressed(station){
		this.props.navigation.navigate('Station', {station: station})
	}
	
	sortStations(a,b){
		if (this.state.searchText != ""){
			if(a.stationName.toLowerCase().indexOf(this.state.searchText) < b.stationName.toLowerCase().indexOf(this.state.searchText))
				return -1;
			if(a.stationName.toLowerCase().indexOf(this.state.searchText) > b.stationName.toLowerCase().indexOf(this.state.searchText))
				return 1;
			return 0;
		}else{
			if(a.stationName < b.stationName)
				return -1;
			if(a.stationName > b.stationName)
				return 1;
			return 0;
		}
		/*
		if(a.stationUICCode < b.stationUICCode)
			return -1;
		if(a.stationUICCode > b.stationUICCode)
			return 1;
		return 0;
		*/
	}
	
	render() {
		const {navigate} = this.props.navigation;
		return (
			<View key = "view" style={styles.container}>
				<TextInput key = "tIp" placeholder="Etsi asemia" style={{height: 40}} onChangeText={(text) => this.searchChanged({text})} autoFocus = {true}></TextInput>
				<FlatList
					key = "fL"
					data={this.state.stationArray}
					keyExtractor={item => item.stationName}
					renderItem={({item}) => (
						<TouchableOpacity onPress={() => this.stationPressed(item)} >
							<Text style={styles.listItem}>{item.stationName}</Text>
						</TouchableOpacity>
					)}
				/>
			</View>
		);
	}
}