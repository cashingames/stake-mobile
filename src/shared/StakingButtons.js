import React from "react";
import { View} from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../utils/normalize";
import AppButton from "./AppButton";


const StakingButtons = ({onPress}) => {
    return (
        <View style={styles.nextButton}>
            <AppButton
                onPress={onPress}
                text='Stake Cash'
                style={styles.stakingButton}
            />
        </View>
    )
}

export default StakingButtons;

const styles = EStyleSheet.create({
      proceedButton: {
        marginVertical: 10,
        width: '9rem',
      },
      stakingButton: {
        marginVertical: 10,
        width: '9rem',
      },
      stakingButtonText: {
        color: '#EF2F55'
      },
      nextButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
})