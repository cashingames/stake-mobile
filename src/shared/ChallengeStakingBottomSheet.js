
import React, { useRef } from "react";
import { Alert, Image, Platform, Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native';
import normalize from "../utils/normalize";
import AppButton from "./AppButton";
import UniversalBottomSheet from "./UniversalBottomSheet";
import ChallengeInviteSuccessText from "./ChallengeInviteSuccessText";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { sendFriendInvite } from "../features/Games/GameSlice";
import { useState } from "react";
import analytics from '@react-native-firebase/analytics';


const ChallengeStakingBottomSheet = ({ stakeCash}) => {
    const navigation = useNavigation();
    const refRBSheet = useRef();
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user)
    const selectedOpponent = useSelector(state => state.game.selectedFriend);
    const activeCategory = useSelector(state => state.game.gameCategory);
    const [disableClick, setDisableClick] = useState(false);

    const closeBottomSheet = () => {
        refRBSheet.current.close()
    }
    const openBottomSheet = () => {
        refRBSheet.current.open()
    }

    const sendWithoutStaking = () => {
        setDisableClick(true)
        dispatch(sendFriendInvite({
            opponentId: selectedOpponent.id,
            categoryId: activeCategory.id
        }
        ))
            .then(unwrapResult)
            .then(async result => {
                await analytics().logEvent("challenge_invite_sent_without_staking", {
                    'id': user.username,
                    'phone_number': user.phoneNumber,
                    'email': user.email
                })
                setDisableClick(false)
                openBottomSheet()
            })
            .catch((rejectedValueOrSerializedError) => {
                Alert.alert(rejectedValueOrSerializedError.message);
                setDisableClick(false)
            });
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
                <AppButton disabled={disableClick} text={disableClick ? 'Loading...' : 'Play for Free'} onPress={sendWithoutStaking} style={styles.proceedButton} textStyle={styles.proceedText} />
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
        width: normalize(155),
        paddingVertical: Platform.OS === 'ios' ? normalize(12) : normalize(15),
    },
    stakeButton: {
        width: normalize(155),
        paddingVertical: Platform.OS === 'ios' ? normalize(12) : normalize(15),
    },
    proceedText: {
        color: '#EF2F55',
    }
})