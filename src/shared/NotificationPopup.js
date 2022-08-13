import React, { useRef, useState } from "react";
import { Text, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

const NotificationPopup = ({remoteMessage, onClose,ref}) => {
    return (
        <View>
            <RBSheet
                ref={ref}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={480}
                customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    },
                    draggableIcon: {
                        backgroundColor: "#000",
                    },
                    container: {
                        borderTopStartRadius: 25,
                        borderTopEndRadius: 25,
                    }
                }}
            >
                <NotificationMessage onClose={onClose} remoteMessage={remoteMessage} />
            </RBSheet>
        </View>
    )
}

const NotificationMessage = ({remoteMessage}) => {
    return (
        <View>
            <Text>{remoteMessage.title}</Text>
        </View>
    )
}
export default NotificationPopup;