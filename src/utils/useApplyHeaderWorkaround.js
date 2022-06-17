
import React, { useLayoutEffect, useMemo } from 'react';
import { useHeaderHeight } from '@react-navigation/elements';
import { Platform } from 'react-native';

export default function useApplyHeaderWorkaround(setOptions) {
    const headerHeight = useHeaderHeight();

    const androidHeaderFix = useMemo(
        () => ({
            headerTransparent: true,
            // headerStyle: { backgroundColor: 'white' },
            contentStyle: { paddingTop: headerHeight },
        }),
        [headerHeight],
    );

    useLayoutEffect(() => {
        Platform.OS === "android" && setOptions(androidHeaderFix);
    }, [setOptions, androidHeaderFix]);
}