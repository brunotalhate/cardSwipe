import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions, LayoutAnimation, UIManager, Platform } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH / 3;
const SWIPE_OUT_WIDTH = SCREEN_WIDTH * 1.25;
const SWIPE_OUT_DURATION = 375;

class Deck extends Component {
  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipeRight();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipeLeft();
        } else this.resetPosition();
      }
    });

    this.state = { panResponder, position };
  }

  forceSwipeRight() {
    Animated.timing(this.state.position, {
      toValue: { x: SWIPE_OUT_WIDTH, y: 0 },
      duration: SWIPE_OUT_DURATION,
    }).start();
  }

  forceSwipeLeft() {
    Animated.timing(this.state.position, {
      toValue: { x: -SWIPE_OUT_WIDTH, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start();
  }

  resetPosition() {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  getCardStyle() {
    const { position } = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: ['-45deg', '0deg', '45deg']
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  }

  renderCards() {
    return this.props.data.map((item, index) => {
      if (index === 0) {
        return (
          <Animated.View
            key={item.id}
            style={this.getCardStyle()}
            {...this.state.panResponder.panHandlers}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        );
      }
      return this.props.renderCard(item);
    });
  }

  render() {
    return (
      <View>
        {this.renderCards()}
      </View>
    );
  }
}

export default Deck;
