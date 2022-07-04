import React from 'react';
import RBSheet from "react-native-raw-bottom-sheet";
import NoGame from './NoGame';

const NoGameNotification = ({ onClose, refBottomSheet }) => {

    return (
        <RBSheet
            ref={refBottomSheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            height={400}
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
            <NoGame onClose={onClose} />
        </RBSheet>

    )
}

export default NoGameNotification;
