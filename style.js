import React from 'react';
import { StyleSheet, } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
	paddingTop: 10,
	paddingLeft: 10,
	paddingRight: 10,
	paddingBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  listItem: {
	height: 30,
	fontSize: 20,
  },
  listHeader: {
	height: 30,
	fontSize: 20,
	fontWeight: 'bold',
  },
  stationName: {
	height: 35,
	fontSize: 25,
	fontWeight: 'bold',
  },
  train: {
	paddingBottom: 5,
  },
  searchBar: {
	height: 40,
  },
  stationButton: {
    flex: 1,
	height: 30,
	fontSize: 20,
	paddingBottom: 5,
	color: '#fff',
  },
});