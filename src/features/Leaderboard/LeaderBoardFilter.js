import React, { useRef } from 'react';
import { Pressable, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { responsiveScreenWidth } from '../../utils/normalize';
import {
    getCategoryLeadersByDate,
    getGlobalLeadersByDate
} from '../CommonSlice';
import DatePicker from 'react-native-date-ranges';
import EStyleSheet from 'react-native-extended-stylesheet';


const LeaderBoardFilter = () => {
    const dispatch = useDispatch();
    const datePickerRef = useRef();

    const onFilterLeaders = (dateRange) => {
        const startDate = dateRange.startDate
        const endDate = dateRange.endDate
        // console.log(dateRange.startDate);
        // console.log(dateRange.endDate);
        dispatch(getGlobalLeadersByDate({
            startDate,
            endDate
        }));
        dispatch(getCategoryLeadersByDate({
            startDate,
            endDate
        }));
    }

    const customButton = (onConfirm) => (
        <>
            <Pressable onPress={onConfirm} style={styles.confirmButton}>
                <Text style={styles.confirmText}>Ok</Text>
            </Pressable>
            <Pressable onPress={() => datePickerRef.current.setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
        </>

    )


    return (
        <>

            <DatePicker //Datepicker is hidden in favour of our custom text below
                ref={datePickerRef}
                style={styles.filterContainer}
                customStyles={{
                    placeholderText: { fontSize: 14, color: '#EF2F55', },
                    headerStyle: { backgroundColor: '#FAC502' },
                    headerMarkTitle: { fontSize: 15 },
                    headerDateTitle: { fontSize: 15 },
                    contentInput: { backgroundColor: '#FAC502', height: 0, width: 0 },
                    contentText: { fontSize: 14, color: '#EF2F55', } //after selected daterange, this replaces the placeholder Style
                }}
                placeholder={"Yes"}
                mode={'range'}
                markText={'Select date'}
                onConfirm={onFilterLeaders}
                customButton={customButton}
                selectedBgColor={'#EF2F55'}
            />
            <Text style={{ fontSize: 14, color: '#EF2F55' }} onPress={() => datePickerRef.current.setModalVisible(true)}> Filter by date</Text>

        </>
    )
}
export default LeaderBoardFilter;

const styles = EStyleSheet.create({

    filterContainer: {
        marginLeft: responsiveScreenWidth(11),
        width: 0,
        borderRadius: 0,
        borderTopWidth: 0,
        borderWidth: 0,
        backgroundColor: '#FFFF',

    },
    confirmButton: {
        backgroundColor: '#EF2F55',
        paddingHorizontal: '3rem',
        paddingVertical: '.5rem',
        borderRadius: 5,
        textAlign: 'center',
        marginRight: '1rem'
    },
    cancelButton: {
        backgroundColor: '#FFFF',
        paddingHorizontal: '3rem',
        paddingVertical: '.5rem',
        borderRadius: 5,
        textAlign: 'center',
        borderColor: '#EF2F55',
        borderWidth: 1
    },
    confirmText: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    cancelText: {
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
    },

});

