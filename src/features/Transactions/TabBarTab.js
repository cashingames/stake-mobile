import { Animated, View, Text, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
    useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { TabBar, TabBarIndicator } from 'react-native-tab-view';


export default function TabBarTab({ state, navigation, descriptors, ...rest }) {
    const { colors, fonts } = useTheme();
    const focusedOptions = descriptors[state.routes[state.index].key].options;

    return (
        <TabBar
            {...rest}
            navigationState={state}
            scrollEnabled={focusedOptions.tabBarScrollEnabled}
            bounces={focusedOptions.tabBarBounces}
            activeColor={focusedOptions.tabBarActiveTintColor}
            inactiveColor={focusedOptions.tabBarInactiveTintColor}
            pressColor={focusedOptions.tabBarPressColor}
            pressOpacity={focusedOptions.tabBarPressOpacity}
            tabStyle={focusedOptions.tabBarItemStyle}
            indicatorStyle={[
                { backgroundColor: colors.primary },
                focusedOptions.tabBarIndicatorStyle,
            ]}
            gap={focusedOptions.tabBarGap}
            android_ripple={focusedOptions.tabBarAndroidRipple}
            indicatorContainerStyle={focusedOptions.tabBarIndicatorContainerStyle}
            contentContainerStyle={focusedOptions.tabBarContentContainerStyle}
            style={[{ backgroundColor: colors.card }, focusedOptions.tabBarStyle]}
            getAccessibilityLabel={({ route }) =>
                descriptors[route.key].options.tabBarAccessibilityLabel
            }
            getTestID={({ route }) =>
                descriptors[route.key].options.tabBarButtonTestID
            }
            onTabPress={({ route, preventDefault }) => {
                const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                });

                if (event.defaultPrevented) {
                    preventDefault();
                }
            }}
            onTabLongPress={({ route }) =>
                navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                })
            }
            // renderTabBarItem={({route}) => {
            //     return <Text>A</Text>
            // }}
            renderLabel={({ route, focused, color }) => {
                const { options } = descriptors[route.key];

                if (options.tabBarShowLabel === false) {
                    return null;
                }

                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : (route).name;

                if (typeof label === 'string') {
                    return (
                        <View style={ [options.tabBarLabelContainerStyle, focused ? options.activeTabBarLabelContainerStyle: {}]}>
                            <Text
                                style={[
                                    { color },
                                    styles.label,
                                    options.tabBarLabelStyle
                                ]}
                                allowFontScaling={options.tabBarAllowFontScaling}
                            >
                                {label}
                            </Text>
                        </View>
                    );
                }

                const children =
                    typeof options.tabBarLabel === 'string'
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                return label({ focused, color, children });
            }}
            renderIndicator={({ state, ...rest }) => {
                return focusedOptions.tabBarIndicator ? (
                    focusedOptions.tabBarIndicator({
                        state: state,
                        ...rest,
                    })
                ) : (
                    <TabBarIndicator navigationState={state} {...rest} />
                );
            }}
        />)
}


const styles = EStyleSheet.create({
    icon: {
        height: 24,
        width: 24,
    },
    label: {
        textAlign: 'center',
        textTransform: 'uppercase',
        fontSize: 13,
        margin: 4,
        backgroundColor: 'transparent',
    },
});

