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
            query: ({ walletType, pageNo }) => {
                console.log("walletType", walletType, pageNo);
                return `v3/wallet/transactions/${walletType}?page=${pageNo}`
            },
            merge: (currentState, incomingState) => {
                console.log("currentState", currentState);
                console.log("incomingState", incomingState);
                return [...currentState, ...incomingState]
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                console.log("currentArgs", currentArg);
                console.log("previousArg", previousArg);
                const force = currentArg?.pageNo !== previousArg?.pageNo
                console.log("force", force);
                return force;
            },
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                // if (endpointName === 'getTransactions') {
                //     return [queryArgs.walletType, queryArgs.pageNo]
                // }
                const key = `${endpointName}-${queryArgs.walletType}`
                console.log("key", key);
                return key;
            }
        }),
    }),
})

// Export hooks for usage in functional components
export const { useGetTransactionsQuery } = walletsApi