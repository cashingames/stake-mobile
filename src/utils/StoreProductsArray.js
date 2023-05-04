// import React from "react";
// import { useSelector } from "react-redux";

import { Platform } from "react-native";

// const plans = useSelector(state => state.common.plans);
// const boosts = useSelector(state => state.common.boosts);

export const PRODUCTS = [
    {"priceAmountMicros":160000000,"title":"Bomb (GameArk)","productId":"boost_plan_bomb","type":0,"priceCurrencyCode":"NGN","description":"Takes out two options","price":"₦100.00","subscriptionPeriod":"P0D"},
    {"priceAmountMicros":160000000,"title":"Time Freeze (GameArk)","productId":"boost_plan_time_freeze","type":0,"priceCurrencyCode":"NGN","description":"Freezes game time For 15 Seconds","price":"₦100.00","subscriptionPeriod":"P0D"},
    {"priceAmountMicros":160000000,"title":"Skip (GameArk)","productId":"boost_plan_skip","type":0,"priceCurrencyCode":"NGN","description":"Freezes game time For 15 Seconds","price":"₦150.00","subscriptionPeriod":"P0D"},
    {"priceAmountMicros":160000000,"title":"Ultimate (GameArk)","productId":"game_plan_ultimate","type":0,"priceCurrencyCode":"NGN","description":"Freezes game time For 15 Seconds","price":"₦1000.00","subscriptionPeriod":"P0D"},
    {"priceAmountMicros":160000000,"title":"DiceyMultiples (GameArk)","productId":"game_plan_dicey_multiples","type":0,"priceCurrencyCode":"NGN","description":"Freezes game time For 15 Seconds","price":"₦800.00","subscriptionPeriod":"P0D"},
    {"priceAmountMicros":160000000,"title":"Double O (GameArk)","productId":"game_plan_doubleo","type":0,"priceCurrencyCode":"NGN","description":"Freezes game time For 15 Seconds","price":"₦500.00","subscriptionPeriod":"P0D"},
    {"priceAmountMicros":160000000,"title":"Least Plan (GameArk)","productId":"game_plan_least","type":0,"priceCurrencyCode":"NGN","description":"Freezes game time For 15 Seconds","price":"₦100.00","subscriptionPeriod":"P0D"},
    {"priceAmountMicros":160000000,"title":"Mini Plan (GameArk)","productId":"game_plan_mini","type":0,"priceCurrencyCode":"NGN","description":"Freezes game time For 15 Seconds","price":"₦150.00","subscriptionPeriod":"P0D"}
]

export const items = Platform.select({
    android: ['boost_plan_time_freeze', 'boost_plan_skip', 'game_plan_ultimate', 'game_plan_dicey_multiples', 'game_plan_doubleo', 'game_plan_least', 'game_plan_mini', 'boost_plan_bomb'],
    ios: ['boost_plan_time_freeze', 'boost_plan_skip', 'game_plan_ultimate', 'game_plan_dicey_multiples', 'game_plan_doubleo', 'game_plan_least', 'game_plan_mini', 'boost_plan_bomb'],
});