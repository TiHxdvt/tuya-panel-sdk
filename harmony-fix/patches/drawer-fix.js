import _ from 'lodash';
import React, { Component } from 'react';
import { Easing, View, Animated, PanResponder } from 'react-native';
import { Utils } from 'tuya-panel-kit';
const { winWidth, winHeight } = Utils.RatioUtils;
const createAnimation = ({ value, toValue, duration, delay, easing, useNativeDriver, isInteraction }) => {
    return Animated.timing(value, {
        toValue,
        duration: duration || 400,
        delay: delay || 0,
        easing: easing || Easing.linear,
        useNativeDriver: useNativeDriver || false,
        isInteraction: isInteraction || false,
    });
};
const DRAWER_DEFAULT_ANIMATION_CONFIG = {
    easing: Easing.linear,
    duration: 400,
    delay: 0,
    isInteraction: true,
};
export default class Drawer extends Component {
    constructor(props) {
        super(props);
        this.componentWillReceiveProps = nextProps => {
            if (nextProps.placement !== this.props.placement) {
                this.direction = ['left', 'right'].includes(nextProps.placement) ? 'row' : 'column';
                this.range = ['left', 'right'].includes(nextProps.placement) ? winWidth : winHeight;
            }
            if (nextProps.visible !== this.props.visible) {
                const animationConfig = {
                    ...DRAWER_DEFAULT_ANIMATION_CONFIG,
                    ...nextProps.animationConfig,
                };
                const { duration, delay, easing, isInteraction } = animationConfig;
                this.setState({ maskState: true }, () => {
                    Animated.parallel([
                        createAnimation({
                            value: this.state.boxLeft,
                            toValue: nextProps.visible ? 0 : -this.range,
                            duration,
                            delay,
                            easing,
                            useNativeDriver: false,
                            isInteraction,
                        }),
                        createAnimation({
                            value: this.state.maskOpacity,
                            toValue: +nextProps.visible,
                            duration,
                            delay,
                            easing,
                            useNativeDriver: false,
                            isInteraction,
                        }),
                    ]).start(() => {
                        if (!nextProps.visible) {
                            this.setState({ maskState: false });
                            this.endOnce = true;
                        }
                        nextProps.onStateChange(nextProps.visible);
                    });
                });
            }
        };
        // harmony fix: PanResponder only on mask, simplified release handler
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => false,
            onPanResponderGrant: () => true,
            onPanResponderMove: () => false,
            onPanResponderRelease: _.throttle(evt => this._handleRelease(evt), 1000, {
                leading: true,
                trailing: false,
            }),
        });
        // harmony fix: simple release - just call onClose
        this._handleRelease = (evt) => {
            const { visible, onClose, maskClosable } = this.props;
            if (!visible || !evt || !evt.nativeEvent) return;
            if (maskClosable && typeof onClose === 'function') {
                onClose();
            }
        };
        this.direction = ['left', 'right'].includes(props.placement) ? 'row' : 'column';
        this.range = ['left', 'right'].includes(props.placement) ? winWidth : winHeight;
        this.endOnce = true;
        this.state = {
            boxLeft: new Animated.Value(props.visible ? 0 : -this.range),
            maskOpacity: new Animated.Value(+props.visible),
            maskState: props.visible,
        };
    }
    render() {
        const { maskStyle, drawerStyle, width, height, renderContent, placement, maskVisible, style, } = this.props;
        return (React.createElement(View, { style: [
                {
                    position: 'absolute',
                    [['left', 'right'].includes(placement) ? 'top' : 'left']: 0,
                    [placement]: 0,
                },
                style,
            ] },
            // harmony fix: PanResponder on mask only, not on container
            maskVisible && this.state.maskState && (React.createElement(Animated.View, Object.assign({ style: [
                    { [['left', 'right'].includes(placement) ? 'top' : 'left']: 0 },
                    maskStyle,
                    { [placement]: 0, opacity: this.state.maskOpacity },
                ] }, this._panResponder.panHandlers))),
            React.createElement(Animated.View, { style: {
                    flexDirection: 'row',
                    position: 'absolute',
                    [['left', 'right'].includes(placement) ? 'top' : 'left']: 0,
                    [placement]: this.state.boxLeft,
                } },
                React.createElement(View, { style: [drawerStyle, { width, height }] }, renderContent))));
    }
}
Drawer.defaultProps = {
    visible: false,
    maskStyle: {
        width: winWidth,
        height: winHeight,
        backgroundColor: 'rgba(0,0,0,0.6)',
        position: 'absolute',
    },
    drawerStyle: {
        backgroundColor: '#F8F8F8',
    },
    style: {},
    placement: 'left',
    maskVisible: true,
    maskClosable: true,
    renderContent: null,
    onClose: () => { },
    onStateChange: () => { },
    width: winWidth / 2,
    height: winHeight,
    animationConfig: DRAWER_DEFAULT_ANIMATION_CONFIG,
};
