import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import Animated, { SlideInRight } from "react-native-reanimated";
import normalize from "../../utils/normalize";
import { formatNumber } from "../../utils/stringUtl";
import { randomEnteringAnimation } from "../../utils/utils";
import Constants from 'expo-constants';


export default ({ category, onSelect, isSelected }) => {
    return (
        <Animated.View style={[styles.card, { backgroundColor: category.bgColor }]} entering={SlideInRight.duration(2000)}>
            <Pressable onPress={() => onSelect(category)} >
                <View style={styles.categoryCardTopRow}>
                    <Image
                        style={styles.cardIcon}
                        source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${category.icon}` }}
                    />
                    <Ionicons name={isSelected ? "md-ellipse-sharp" : "md-ellipse"} size={24} color={isSelected ? "#EF2F55" : "#FFFF"} />
                </View>
                <Text style={styles.cardTitle}>{category.name} Quiz</Text>
                <Text style={styles.cardInstruction}>{formatNumber(category.played)} times played </Text>
            </Pressable>
        </Animated.View>
    )
};


const styles = EStyleSheet.create({

    card: {
        width: normalize(130),
        padding: normalize(15),
        borderRadius: normalize(7),
        marginBottom: normalize(15),
        marginRight: normalize(10)
    },
    cardIcon: {
        width: 50,
        height: 50,
        borderRadius: normalize(10)
    },
    cardTitle: {
        fontSize: '0.87rem',
        color: '#FFFF',
        fontFamily: 'graphik-bold',
        lineHeight: normalize(17),
        marginVertical: normalize(8),
    },
    cardInstruction: {
        fontSize: '0.73rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
    },
    checkbox: {
        // backgroundColor: '#FFFF',
    },
    categoryCardTopRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    checkIcon: {
        backgroundColor: '#EF2F55',
        borderRadius: 10,
        height: normalize(16),
        width: normalize(16),
        textAlign: 'center',
    },

});