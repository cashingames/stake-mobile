import React, { useState, useEffect } from 'react';
import {Text} from 'react-native';

const InputError = ({ text, textStyle }) => {
    return (
        <>
            <Text style={textStyle}>{text}</Text>
        </>
    )
}
export default InputError