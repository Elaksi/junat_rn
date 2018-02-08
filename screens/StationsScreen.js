import React from 'react';
import { AppRegistry, StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Button,} from 'react-native';
import { StackNavigator, } from 'react-navigation';
import styles from "../style";
import "../stations.js";

export default class StationsScreen extends React.Component {
	static navigationOptions = {
    title: 'Asemat',
  };
	constructor(){
		super();
		this.state = {stations: [{stationName: "Ladataan asemia...", stationShortCode: "MOI"} ], count: 0, stationArray: [], searchText: ""};
		this.sortStations = this.sortStations.bind(this)
	}
	async getStations(){
		try{
			let response = await fetch("https://rata.digitraffic.fi/api/v1/metadata/stations");
			let responseJson = await response.json();
			this.setState({stations: responseJson});
			this.state.stations.sort(this.sortStations);
			this.updateStations(this.state.searchText);
		} catch(error){
			this.setState({stations: [{stationName: "Ladataan asemia....", stationShortCode: "MOI"}]});
		}
	}
	componentDidMount(){
		this.updateStations("");
		this.getStations();
		this.state.stations.sort(this.sortStations);
		this.updateStations("");
	}
	updateStations(filter){
		//let stationArray =  <Text>Moro</Text>; 
		//this.setState({count: this.state.count+1});
		let array = this.state.stations.map((station) =>
	  {
		  global.stationShorts[station.stationShortCode] = station.stationName;
		  this.setState({count: this.state.count+1});
		  if(station.stationName.toLowerCase().indexOf(filter.toLowerCase()) !== -1 || station.stationShortCode.toLowerCase().indexOf(filter.toLowerCase()) !== -1){
			  if (station.statioName == "Ladataan asemia...."){
				  return(
				<Text style={styles.listItem}>{station.stationName}</Text>
			);
			  }else{
			return(
			<TouchableOpacity onPress={() => this.stationPressed(station)} >
				<Text style={styles.listItem}>{station.stationName}</Text>
			</TouchableOpacity>
			);
			  }
			}
			//<Station name = station.stationName />
		
	  });
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
		if(a.stationName.toLowerCase().indexOf(this.state.searchText) < b.stationName.toLowerCase().indexOf(this.state.searchText))
			return -1;
		if(a.stationName.toLowerCase().indexOf(this.state.searchText) > b.stationName.toLowerCase().indexOf(this.state.searchText))
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
	
  render() {
	  const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
  <TextInput placeholder="Etsi asemia" style={{height: 40}} onChangeText={(text) => this.searchChanged({text})} autoFocus = {true}></TextInput>
		<ScrollView style={styles.scrollView}>
			{this.state.stationArray}
		</ScrollView>
      </View>
    );
  }
}