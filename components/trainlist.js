import React from 'react';
import { View, Text } from 'react-native';

import TrainItem from "../components/trainitem.js";
import styles from "../style";


export default class TrainList extends React.Component{
	
	constructor(props){
		super(props);
	}
	
	render(){
		const {type, trains} = this.props;
		return (
			<View>
				<Text key = "listHeaderText"
					style={styles.listHeader}>{this.props.type == "arrival" ? "Saapuvat junat" : "Lähtevät junat"}</Text>
				<Trains
					key = "trains"
					trains = {trains} 
					type = {type}
					onPress = {this.props.onPress}/>
			</View>
		);
	}
}

function Trains(props){
	if(props.trains == false){
		return (<Text style={styles.listItem}>Ei {props.type == "arrival" ? "saapuvia" : "lähteviä"} junia</Text>);
	}
	return(
		<View
			key="trains">
		{
			props.trains.map((train) => 
				<TrainItem key = {train.trainNumber}
				train = {train}
				onPress = {props.onPress}
				type = {props.type}/>
				)
			
		}
		</View>
	);
}