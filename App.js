import React from 'react';
import { AppRegistry, StyleSheet, Text, View, ScrollView, TextInput} from 'react-native';
import { StackNavigator, } from 'react-navigation';
import StationsScreen from "./screens/StationsScreen";
import StationScreen from "./screens/StationScreen";
import styles from "./style";

export const Screens = StackNavigator({
	Stations: {screen: StationsScreen, },
	Station: {screen: StationScreen, },
});


export default class App extends React.Component {
	render() {
    return (
		<Screens/>
    );
  }
}

/*
class Station extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return (
		<Text>{this.props.name}<Text>
		);
	}
}
*/
