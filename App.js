import React from 'react';
import {StyleSheet, View,TouchableOpacity, Text} from 'react-native';
import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

// collection and document variables for firestore connection
var collection = 'records'
var document = 'the record';

// variables to set buttonText according to situtaion
var loadingText = 'loading...';
var savingText = 'saving...';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonText: loadingText,
      isButtonDisable: true,
    };
    this.buttonPressHandler = this.buttonPressHandler.bind(this);
    this.loadValue = this.loadValue.bind(this);
    this.updateValue = this.updateValue.bind(this);
  }

  componentDidMount() {
    this.loadValue();
  }

  async loadValue() {
    // set buttonText
    // make button disable
    this.setState({
      buttonText: loadingText,
      isButtonDisable: true,
    });
    // reading value from firestore
    await firestore()
      .collection(collection)
      .doc(document)
      .get()
      .then(data => {
        // set buttonText
        // make button clickable
        this.setState({
          buttonText: 'value:' + data._data.value.toString(),
          isButtonDisable: false,
        });
      });
  }

  async updateValue() {
    // read cuurent value from firestore
    var currentValue;
    await firestore()
      .collection(collection)
      .doc(document)
      .get()
      .then(data => {
        currentValue = data._data.value;
      });
      // increase value by 1
    await firestore()
      .collection(collection)
      .doc(document)
      .update({
        value: currentValue + 1,
      });
  }

  async buttonPressHandler() {
    // when button clicked set buttonText to savingText
    // make button disable while saving and loading process continues
    this.setState({
      buttonText: savingText,
      isButtonDisable: true,
    });
    // increase value by 1
    await this.updateValue();
    // read updated value and load it 
    await this.loadValue();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          disabled={this.state.isButtonDisable}
          onPress={this.buttonPressHandler}>
          <Text style={styles.buttonText}>{this.state.buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#27acfc',
    width: 80,
    height: 50,
    borderRadius: 22,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});
