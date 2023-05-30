import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import Animated, { BounceInRight, SlideInRight } from "react-native-reanimated";
import normalize, { responsiveWidth } from "../../utils/normalize";
import { formatNumber, isTrue } from "../../utils/stringUtl";
import { randomEnteringAnimation } from "../../utils/utils";
import Constants from 'expo-constants';


export default ({ category, onSelect, isSelected, activeCategory, activeSubcategory, onSubCategorySelected }) => {
    return (
        <Animated.View style={styles.card} entering={BounceInRight.duration(2000)}>
            <Pressable onPress={() => onSelect(category)} >
                <View style={styles.categoryCardTopRow}>
                <Image
                        style={styles.cardIcon}
                        source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${category.icon}` }}
                    />
                    <Text style={styles.cardTitle}>{category.name} Quiz</Text>
                </View>
            </Pressable>
        </Animated.View>
    )
}


const styles = EStyleSheet.create({

    card: {
        width: responsiveWidth(43),
        padding: normalize(15),
        borderRadius: normalize(50),
        marginBottom: normalize(10),
        backgroundColor: '#15397D',
        borderBottomColor: '#0D2859',
        borderBottomWidth: 4,
    },
    cardIcon: {
        width: 40,
        height: 15,
        borderRadius: normalize(10)
    },
    cardTitle: {
        fontSize: '1rem',
        color: '#FFFF',
        fontFamily: 'blues-smile',
        marginVertical: normalize(8),
    },
    cardInstruction: {
        fontSize: '0.73rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
    },
    cardIcon: {
        width: 40,
        height: 41.5,
        borderRadius: normalize(10)
    },
    checkbox: {
        // backgroundColor: '#FFFF',
    },
    categoryCardTopRow: {
        display: 'flex',
        // flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    checkIcon: {
        backgroundColor: '#EF2F55',
        borderRadius: 10,
        height: normalize(16),
        width: normalize(16),
        textAlign: 'center',
    },

});