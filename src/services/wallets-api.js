import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Constants from 'expo-constants';
export const walletsApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: Constants.expoConfig.extra.apiBaseUrl,
        prepareHeaders: (headers, { getState }) => {
            // By default, if we have a token in the store, let's use that for authenticated requests
            const token = getState().auth.token;

            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }

            headers.set('x-brand-id', Constants.expoConfig.extra.brandId);

            return headers
        },
    }),

    endpoints: (builder) => ({
        getTransactions: builder.query({
            query: (walletType, pageNo) => `v3/wallet/transactions/${walletType}?page=${pageNo}`,
        }),
    }),
})

// Export hooks for usage in functional components
export const { useGetTransactionsQuery } = walletsApi