import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

function jsonTest(query){
	txt = getJSON(query);
	return txt[0];
}



export default class App extends React.Component {
	getStations(){
		return fetch("https://rata.digitraffic.fi/api/v1/metadata/stations")
		.then((response) => response.json())
		.then((responseJson) => {
			this.setState({stations: responseJson});
		})
		.catch((error) => {
			this.setState({stations: ""});
		});
		}
	constructor(){
		super();
		this.state = {stations: [], count: 0};
	}
	componentDidMount(){
		this.getStations();
	}
  render() {
	  let stationArray = this.state.stations.map((station, key) =>
	  {
		  this.setState = {count: this.state.count+1}
		return(
			<Text>{station.stationName}</Text>
			//<Station name = station.stationName />
		);
	  });
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
		<Text>{this.state.count}</Text>
		<ScrollView>
			{stationArray}
		</ScrollView>
      </View>
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

