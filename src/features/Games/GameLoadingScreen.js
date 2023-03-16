import React from "react";
import { Text, ScrollView, View, Image } from "react-native";
import { useSelector } from "react-redux";
import Constants from 'expo-constants';
import { formatCurrency, formatNumber } from "../../utils/stringUtl";
import EStyleSheet from "react-native-extended-stylesheet";


const GameLoadingScreen = () => {
    const boosts = useSelector(state => state.common.boosts);

    return (
        <ScrollView>
            <Text>
                Preparing your game board
            </Text>
            <View>
                <Text>Do you know you can score higher by using boosts?</Text>
                {boosts.map((boost, i) => <BoostCardDetails key={i} boost={boost} />)}
            </View>
        </ScrollView>
    )
}

const BoostCardDetails = ({ boost }) => {
    return (
        <>
            <Image
                source={{ uri: `${Constants.expoConfig.extra.assetBaseUrl}/${boost.icon}` }}
                style={styles.boostIcon}
            />
            <View style={styles.boostDetailsContainer}>
                <View style={styles.boostNameCount}>
                    <Text style={styles.storeItemName}>{boost.name}</Text>
                    <Text style={styles.number}>x{formatNumber(boost.pack_count)}</Text>
                </View>
                <Text style={styles.cardDescription}>{boost.description}</Text>
            </View>
            <Text style={styles.buyWithCash}>&#8358;{formatCurrency(boost.currency_value)}</Text>
        </>
    )
}
export default GameLoadingScreen;

const styles = EStyleSheet.create({})