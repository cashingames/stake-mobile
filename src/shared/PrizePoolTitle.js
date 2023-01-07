import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import { Pressable } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import TopLeadersModal from "./TopLeadersModal";


const PrizePoolTitle = () => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <>
            <Pressable style={styles.prizeContainer}>
                <Ionicons name="information-circle-outline" size={13} color="#FFFF" style={styles.icon} />
                <Text style={styles.prizeTitle} onPress={() => setModalVisible(true)}>PRIZE POOL</Text>
            </Pressable>
            <TopLeadersModal setModalVisible={setModalVisible} modalVisible={modalVisible} />
        </>
    )
}
export default PrizePoolTitle;

const styles = EStyleSheet.create({
    prizeContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    prizeHeaderText: {
        fontSize: '1rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    prizeTitle: {
        fontSize: '.6rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        textDecoration: 'underline',
        marginLeft: '.2rem'
    },
})