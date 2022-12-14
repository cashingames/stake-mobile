import React from "react";
import { View} from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../utils/normalize";
import AppButton from "./AppButton";


const StakingButtons = ({ onPress, gameMode}) => {
  return (
    <View style={styles.nextButton}>
      <AppButton
        onPress={onPress}
        text='Proceed'
        style={gameMode.name === 'STAKING' ? styles.stakeModeButton : styles.stakingButton}
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
    paddingHorizontal:normalize(5)
  },
  stakeModeButton: {
    marginVertical: 10,
    width: '100%',
    paddingHorizontal:normalize(5)
  },
  nextButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})


