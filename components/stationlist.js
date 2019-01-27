import React from 'react';
import { FlatList, Text } from 'react-native';

import StationItem from "../components/stationitem.js";
import styles from "../style";

export default class StationList extends React.Component{
	constructor(props){
		super(props);
		this.sortStations = this.sortStations.bind(this);
	}
	
	//Sort function for stations
	sortStations(query){
		
		return function(a,b){
			const stationA = a.stationName.toLowerCase();
			const stationB = b.stationName.toLowerCase();
			const indexA = stationA.indexOf(query);
			const indexB = stationB.indexOf(query);
			
			//Sort higher station, that contains query in lower index
			//Stations containing query only in shortCode, soft lower
			if(a.stationShortCode.toLowerCase() == query) return -1;
			if(indexA == -1) return 1;
			if(indexA > 2) return 0;
			if(indexA < indexB)
				return -1;
			if(indexA > indexB)
				return 1;
			return 0;
		}
	}
	
	render(){
		let {stations, stationPressed, filterQuery} = this.props;
		filterQuery = filterQuery.toLowerCase();
		//If stations is empty return loading text
		if(stations.length == 0){
			return (
				<Text style={styles.listItem}>Ladataan asemia...</Text>
			);
		}
		//If searchText is empty, show all stations in alphabetical order
		let stationData;
		if(filterQuery == ""){
			stationData = stations;
			
		}else{
			//Filter and sort stations using searchText
			stationData = stations.filter((station) => {
							return (station.stationName.toLowerCase().indexOf(filterQuery) !== -1 || station.stationShortCode.toLowerCase().indexOf(filterQuery) !== -1)})
						.sort(this.sortStations(filterQuery));
		}
		return (
				<FlatList key = "flatList"
					style = {styles.stationList}	
					data={stationData}
					keyExtractor = {item => item.stationShortCode}
					renderItem={({item}) => (
					<StationItem station = {item}
						onPress = {stationPressed}/>
					)}
				/>
			);
	}
}