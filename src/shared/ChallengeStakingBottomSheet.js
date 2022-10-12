
import React, { useRef } from "react";
import { Image, Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native';
import normalize from "../utils/normalize";
import AppButton from "./AppButton";
import UniversalBottomSheet from "./UniversalBottomSheet";
import ChallengeInviteSuccessText from "./ChallengeInviteSuccessText";


const ChallengeStakingBottomSheet = ({ stakeCash, sendInvite}) => {
    const navigation = useNavigation();
    const refRBSheet = useRef();

    const closeBottomSheet = () => {
        refRBSheet.current.close()
    }
    const openBottomSheet = () => {
        refRBSheet.current.open()
    }
    const proceedWithoutStaking = () => {
        sendInvite()
        openBottomSheet()
    }
    return (
        <View style={styles.stakeOption}>
            <View style={styles.avatarContainer}>
                <Image
                    style={styles.avatar}
                    source={require("../../assets/images/thinking-face.png")}
                />
            </View>
            <View style={styles.stakeContainer}>
                <Text style={styles.stakeText}>Double your winnings by staking an amount for this challenge</Text>
            </View>
            <View style={styles.selectButtons}>
                <AppButton text='Stake Cash' onPress={stakeCash} style={styles.stakeButton} />
                <AppButton text='Play for Free' onPress={proceedWithoutStaking} style={styles.proceedButton} textStyle={styles.proceedText} />
            </View>
            <UniversalBottomSheet
                refBottomSheet={refRBSheet}
                height={450}
                subComponent={<ChallengeInviteSuccessText onClose={closeBottomSheet} />}
            />
        </View>

    )
}
export default ChallengeStakingBottomSheet;

const styles = EStyleSheet.create({
    stakeOption: {
        paddingHorizontal: normalize(25),
        paddingVertical: normalize(18)
    },
    avatarContainer: {
        alignItems: 'center'
    },
    avatar: {
        width: normalize(80),
        height: normalize(80),
    },
    stakeText: {
        fontSize: '1rem',
        fontFamily: 'graphik-medium',
        color: '#ffff',
        textAlign: 'center',
        lineHeight: '1.5rem'
    },
    stakeContainer: {
        backgroundColor: '#518EF8',
        borderRadius: 15,
        paddingHorizontal: "3rem",
        paddingVertical: "2rem",
        marginTop: ".8rem",
        marginBottom: ".5rem",
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.85
    },
    selectButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    proceedButton: {
        backgroundColor: '#FFFF',
        borderColor: '#EF2F55',
        borderWidth: 1,
        width: normalize(150)
    },
    stakeButton: {
        width: normalize(150)
    },
    proceedText: {
        color: '#EF2F55',
    }
})