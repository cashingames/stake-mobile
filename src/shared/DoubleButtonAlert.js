import React from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../utils/normalize";

const DoubleButtonAlert = ({ setModalVisible, modalVisible,
    textLabel, alertImageVisible, buttonLabel, alertImage, actionLabel, onPress }) => {


    const closeModal = () => {
        setModalVisible(false)
    }
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.container}>
                            {alertImageVisible &&
                                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                    <Image
                                        source={alertImage}
                                    />
                                </View>

                            }

                            <Text style={styles.labelText}>{textLabel}</Text>
                            <View>
                                <Pressable
                                    style={styles.button}
                                    onPress={onPress}
                                >
                                    <Text style={styles.text}>{actionLabel}</Text>
                                </Pressable>
                                <Pressable
                                    style={styles.buttonOk}
                                    onPress={closeModal}
                                >
                                    <Text style={styles.textOk}>{buttonLabel}</Text>
                                </Pressable>
                            </View>

                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    )
}
export default DoubleButtonAlert;

const styles = EStyleSheet.create({
    centeredView: {
        justifyContent: "center",
        // alignItems: "center",
        flex: 1,
        // paddingVertical: responsiveHeight(2),
        backgroundColor: 'rgba(17, 41, 103, 0.77)'
    },
    modalView: {
        margin: 20,
        borderRadius: 13,
        shadowColor: "black",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
        backgroundColor: '#FFF',
    },
    container: {
        paddingHorizontal: normalize(28),
        paddingVertical: normalize(25),
        background: '#66142E',

    },
    button: {
        backgroundColor: '#E15220',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(15),
        // paddingHorizontal: normalize(28),
        borderRadius: 13,
        marginTop: 20,
    },
    buttonOk: {
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(15),
        // paddingHorizontal: normalize(28),
        borderRadius: 13,
        marginTop: 20,
        borderWidth: 2,
        borderColor: '#1C453B'
    },
    text: {

        letterSpacing: 0.25,
        color: 'white',
        fontFamily: 'gotham-medium',
        fontSize: '0.95rem'
    },
    textOk: {

        letterSpacing: 0.25,
        color: '#1C453B',
        fontFamily: 'gotham-medium',
        fontSize: '1rem'
    },
    labelText: {
        letterSpacing: 0.25,
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '1.1rem',
        textAlign: 'center'
    },
})