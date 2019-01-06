import React, { Component } from 'react';
import { StyleSheet, View, ART, PixelRatio } from 'react-native';
import ViewShot, { captureRef } from "react-native-view-shot";

const { Surface, Shape, Path } = ART

export default class Draw extends Component {

  constructor(props) {
    super(props)
    this.state = {
      path: new Path()
    }
  }

  render() {
    const { width, height } = this.props
    return (
      <View style={styles.view}
        onStartShouldSetResponder={_event => true}
        onResponderGrant={event => this.onTouch('ACTION_DOWN', event)}
        onResponderMove={event => this.onTouch('ACTION_MOVE', event)}>
        <ViewShot ref={ref => this._view = ref}>
          <Surface style={styles.surface} width={width} height={height}>
            <Shape d={this.state.path} width={width} height={height}
              stroke={'black'} strokeWidth={25} />
          </Surface>
        </ViewShot>
      </View>
    )
  }

  onTouch = (action, event) => {
    const { locationX, locationY } = event.nativeEvent
    const path = new Path(this.state.path)

    if (action == 'ACTION_DOWN')
      path.moveTo(locationX, locationY)
    else if (action == 'ACTION_MOVE')
      path.lineTo(locationX, locationY)

    this.setState({ path: path })
  }

  onCapture = (height, width) => {
    return captureRef(this._view, {
      result: "base64",
      format: "jpg",
      width,
      height,
    })
  }

  clearPath = () => {
    this.setState({ path: new Path() })
  }
}

const styles = StyleSheet.create({
  surface: {
    backgroundColor: 'white',
  },
  view: {
    alignSelf: 'center',
    borderWidth: 1,
    backgroundColor: 'white',
  }
});