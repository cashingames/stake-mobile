import React from 'react';
import { ImageBackground, ScrollView} from 'react-native';
import GamePicker from './GamePicker';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from '../../utils/normalize';


const SelectGameCategoryScreen = ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);

    return (
        <ImageBackground source={require('../../../assets/images/game-play-background.png')}
            style={{ flex: 1 }}
            resizeMethod="resize">
            <ScrollView style={styles.container}>
                <GamePicker />
            </ScrollView>
        </ImageBackground>
    )
}


export default SelectGameCategoryScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: normalize(14),
        paddingTop: normalize(22)
    },
})