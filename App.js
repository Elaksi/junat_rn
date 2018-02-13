import React from 'react';
import { StackNavigator, } from 'react-navigation';
import StationsScreen from "./screens/StationsScreen";
import StationScreen from "./screens/StationScreen";
import TrainScreen from "./screens/TrainScreen";
import styles from "./style";

//Screens
export const Screens = StackNavigator({
	Stations: {screen: StationsScreen, },
	Station: {screen: StationScreen, },
	Train: {screen: TrainScreen, },
});

export default class App extends React.Component {
	render() {
    return (
		<Screens/>
    );
  }
}