import React from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import { Overlay } from "react-native-elements";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../utils/normalize";
import { Ionicons } from "@expo/vector-icons";

const DoubleButtonAlert = ({ setModalVisible, modalVisible, visible, setVisible,
    textLabel, alertImageVisible, buttonLabel, alertImage, actionLabel, onPress }) => {

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const closeModal = () => {
        setVisible(false)
        setModalVisible(false)
    }
    return (
        <Overlay isVisible={visible} onBackdropPress={toggleOverlay} backdropStyle={{ backgroundColor: 'rgba(7, 33, 105, .74)' }}>
            <View style={styles.onView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        // Alert.alert("Modal has been closed.");
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
                                        style={styles.buttonOk}
                                        onPress={closeModal}
                                    >
                                        <Text style={styles.text}>{buttonLabel}</Text>
                                    </Pressable>
                                    <Pressable
                                        style={styles.buttonOk}
                                        onPress={onPress}
                                    >
                                        <Text style={styles.text}>{actionLabel}</Text>
                                    </Pressable>
                                </View>

                            </View>

                        </View>
                    </View>
                </Modal>
            </View>
        </Overlay>
    )
}
export default DoubleButtonAlert;

const styles = EStyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        // alignItems: "center",
        marginTop: 22,
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
    buttonOk: {
        backgroundColor: '#E15220',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(15),
        // paddingHorizontal: normalize(28),
        borderRadius: 13,
        marginTop: 20,
    },
    text: {

        letterSpacing: 0.25,
        color: 'white',
        fontFamily: 'gotham-medium',
        fontSize: '0.85rem'
    },
    labelText: {
        letterSpacing: 0.25,
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '.95rem',
        textAlign: 'center'
    },
})