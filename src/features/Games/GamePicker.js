
import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import GameSubcategoryCard from './GameSubcategoryCard';


export default () => {
    const categories = useSelector(state => state.game.gameType?.categories ?? []);

    return (
        <>
            <View style={styles.cards}>
                {categories.map(category =>
                    category.subcategories.map(subcategory =>
                        <GameSubcategoryCard
                            key={subcategory.id}
                            subcategory={subcategory}
                        />
                    )
                )}
            </View>
        </>
    )
};


const styles = EStyleSheet.create({
    cards: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom:'2.5rem'
        // flexWrap:'wrap'
    },
});