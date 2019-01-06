import React, { Component } from 'react'
import { StyleSheet, View, Text, Button } from 'react-native';
import Draw from './Draw'

export default class App extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text>Componente Draw</Text>
        <Draw ref={ref => this._draw = ref} height={280} width={280}></Draw>
        <Button title="Predict" onPress={this.predict} />
        <Button title="Limpar" onPress={() => this._draw.clearPath()} />
      </View>
    );
  }

  predict = () => {
    this._draw.onCapture(19, 19) // 19 x 19 == 28 x 28
      .then(this.upload)
      .then(response => response.json())
      .then(responseJson => console.log(`responseJson: '${responseJson}'`))
      .catch(err => console.log(`Erro: '${err}'`))
  }

  upload = imagem => {
    return fetch('http://192.168.0.113:8080/predict', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imagem,
      }),
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
