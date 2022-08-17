import React from 'react';
import RBSheet from "react-native-raw-bottom-sheet";

const UniversalBottomSheet = ({ refBottomSheet,subComponent,height }) => {

    return (
        <RBSheet
            ref={refBottomSheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            height={height}
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
            {subComponent}
        </RBSheet>

    )
}

export default UniversalBottomSheet;
