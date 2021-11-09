import React from "react";
import { StyleSheet ,Text, View,Image} from 'react-native';
import { normalize } from "../constants/NormalizeFont";

export default function AuthBanner() {

    return (
        <View >
            <Image
                style={styles.image}
                source={require('../../assets/images/confetti.png')}
            />
        </View>
    );



}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: "center",
        position: 'absolute',
        left: normalize(10),
        top:normalize(15)
      },

});
