import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const startGame = createAsyncThunk(
    'game/startGame',
    async (data, thunkAPI) => {
        console.log(data)
        const response = await axios.post('v2/game/start/single-player', data)
        return response.data
    }
)

export const endGame = createAsyncThunk(
    'game/endGame',
    async (data, thunkAPI) => {
        //make a network request to the server
        const response = await axios.post('v2/game/end/single-player', data)
        console.log('game ended' );
        return response.data

        //return true;
    }
)

//This is to store the currently ongoing active game
const initialState = {
    gameMode: {},
    gameCategory: {},
    gameType: {},
    gameSessionToken:'',
    questions: [],
    currentQuestionPosition: 0,
    totalQuestionCount: 10,
    isLastQuestion: false,
    chosenOptions: [],
     consumedBoosts:[],
    pointsGained:0,
    isEnded: true,
    displayedOptions: [],
    displayedQuestion: {}
}

//This is to store the currently ongoing active game
// const initialState = {
//     gameMode: {},
//     gameCategory: {
//         name: "Premier Leaque football"
//     },
//     gameType: {},
//     gameSessionToken:'',
//     questions: [
//         {
//             "id": 42,
//             "label": "SG93IG1hbnkgcHJlbWllciBsZWFndWUgZ2FtZXMgZGlkIGFyc2VuYWwgZmMgbG9vc2UgaW4gdGhlIDIwMTctMjAxOCBzZWFzb24/",
//             "level": "bWVkaXVt",
//             "game_type_id": "2",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 166,
//                     "question_id": "42",
//                     "title": "MTA=",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 168,
//                     "question_id": "42",
//                     "title": "MTM=",
//                     "is_correct": "MQ=="
//                 },
//                 {
//                     "id": 167,
//                     "question_id": "42",
//                     "title": "MTE=",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 165,
//                     "question_id": "42",
//                     "title": "MTU=",
//                     "is_correct": "MA=="
//                 }
//             ]
//         },
//         {
//             "id": 27,
//             "label": "TWFuY2hlc3RlciBjaXR5IGZjIHdlcmUga25vY2tlZCBvdXQgb2Ygd2hpY2ggcm91bmQgaW4gdGhlIDIwMTctMjAxOCBVRUZBIENoYW1waW9ucyBsZWFndWUgPw==",
//             "level": "ZWFzeQ==",
//             "game_type_id": "2",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 107,
//                     "question_id": "27",
//                     "title": "cm91bmQgb2YgMTY=",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 106,
//                     "question_id": "27",
//                     "title": "c2VtaSBmaW5hbHM=",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 105,
//                     "question_id": "27",
//                     "title": "Z3JvdXAgc3RhZ2U=",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 108,
//                     "question_id": "27",
//                     "title": "UXVhcnRlciBmaW5hbHM=",
//                     "is_correct": "MQ=="
//                 }
//             ]
//         },
//         {
//             "id": 169,
//             "label": "QXRsZXRpY28gTWFkcmlkIHdvbiB0aGUgTGEgTGlnYSB0aXRsZSBpbiB0aGUgMjAxMy8yMDE0IHNlYXNvbg==",
//             "level": "ZWFzeQ==",
//             "game_type_id": "1",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 573,
//                     "question_id": "169",
//                     "title": "RkFMU0U=",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 574,
//                     "question_id": "169",
//                     "title": "VFJVRQ==",
//                     "is_correct": "MQ=="
//                 }
//             ]
//         },
//         {
//             "id": 84,
//             "label": "VGhlIDIwMTgtMjAxOSBzZWFzb24gd2FzIGNoZWxzZWEgZmMgX19fX19fX18gY29uc2VjdXRpdmUgc2Vhc29uIGluIHRoZSBwcmVtaWVyIGxlYWd1ZSA/",
//             "level": "ZWFzeQ==",
//             "game_type_id": "2",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 336,
//                     "question_id": "84",
//                     "title": "Mjd0aA==",
//                     "is_correct": "MQ=="
//                 },
//                 {
//                     "id": 334,
//                     "question_id": "84",
//                     "title": "Mjh0aA==",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 335,
//                     "question_id": "84",
//                     "title": "MjZ0aA==",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 333,
//                     "question_id": "84",
//                     "title": "MjFzdA==",
//                     "is_correct": "MA=="
//                 }
//             ]
//         },
//         {
//             "id": 120,
//             "label": "RWRlbiBIYXphcmQgam9pbmVkIENoZWxzZWEgZnJvbSBMaWxsZQ==",
//             "level": "ZWFzeQ==",
//             "game_type_id": "1",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 476,
//                     "question_id": "120",
//                     "title": "VFJVRQ==",
//                     "is_correct": "MQ=="
//                 },
//                 {
//                     "id": 475,
//                     "question_id": "120",
//                     "title": "RkFMU0U=",
//                     "is_correct": "MA=="
//                 }
//             ]
//         },
//         {
//             "id": 49,
//             "label": "SG93IG1hbnkgRUZMIGdvYWxzIGRpZCBBbmRyZSBBeWV3IHNjb3JlIGluIHRoZSAyMDE3LTIwMTggc2Vhc29uPw==",
//             "level": "ZWFzeQ==",
//             "game_type_id": "2",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 196,
//                     "question_id": "49",
//                     "title": "Mw==",
//                     "is_correct": "MQ=="
//                 },
//                 {
//                     "id": 193,
//                     "question_id": "49",
//                     "title": "NA==",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 194,
//                     "question_id": "49",
//                     "title": "Mg==",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 195,
//                     "question_id": "49",
//                     "title": "MQ==",
//                     "is_correct": "MA=="
//                 }
//             ]
//         },
//         {
//             "id": 83,
//             "label": "VGhlIDIwMTgtMjAxOSBzZWFzb24gd2FzIGNoZWxzZWEgZmMgX19fX19fX18gY29uc2VjdXRpdmUgc2Vhc29uIGluIHRoZSB0b3AgZmxpZ2h0IG9mIEVuZ2xpc2ggRm9vdGJhbGwgPw==",
//             "level": "ZWFzeQ==",
//             "game_type_id": "2",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 330,
//                     "question_id": "83",
//                     "title": "MzFzdA==",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 332,
//                     "question_id": "83",
//                     "title": "MzZ0aA==",
//                     "is_correct": "MQ=="
//                 },
//                 {
//                     "id": 331,
//                     "question_id": "83",
//                     "title": "MzR0aA==",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 329,
//                     "question_id": "83",
//                     "title": "MzB0aA==",
//                     "is_correct": "MA=="
//                 }
//             ]
//         },
//         {
//             "id": 144,
//             "label": "Sm9yZ2luaG8gam9pbmVkIENoZWxzZWEgZnJvbSBOYXBvbGk=",
//             "level": "ZWFzeQ==",
//             "game_type_id": "1",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 524,
//                     "question_id": "144",
//                     "title": "VFJVRQ==",
//                     "is_correct": "MQ=="
//                 },
//                 {
//                     "id": 523,
//                     "question_id": "144",
//                     "title": "RkFMU0U=",
//                     "is_correct": "MA=="
//                 }
//             ]
//         },
//         {
//             "id": 32,
//             "label": "TGl2ZXJwb29sIGZjIHdlcmUga25vY2tlZCBvdXQgb2Ygd2hpY2ggcm91bmQgaW4gdGhlIDIwMTctMjAxOCBVRUZBIENoYW1waW9ucyBMZWFndWUgPw==",
//             "level": "ZWFzeQ==",
//             "game_type_id": "2",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 126,
//                     "question_id": "32",
//                     "title": "c2VtaSBmaW5hbA==",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 127,
//                     "question_id": "32",
//                     "title": "cm91bmQgb2YgMTY=",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 128,
//                     "question_id": "32",
//                     "title": "ZmluYWw=",
//                     "is_correct": "MQ=="
//                 },
//                 {
//                     "id": 125,
//                     "question_id": "32",
//                     "title": "cXVhcnRlciBmaW5hbHM=",
//                     "is_correct": "MA=="
//                 }
//             ]
//         },
//         {
//             "id": 56,
//             "label": "SG93IG1hbnkgdGVhbXMgcGFydGljaXBhdGVkIGluIHRoZSAyMDE4LTIwMTkgcHJlbWllciBsZWFndWUgc2Vhc29uPw==",
//             "level": "ZWFzeQ==",
//             "game_type_id": "2",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 223,
//                     "question_id": "56",
//                     "title": "MjE=",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 222,
//                     "question_id": "56",
//                     "title": "MjI=",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 224,
//                     "question_id": "56",
//                     "title": "MjA=",
//                     "is_correct": "MQ=="
//                 },
//                 {
//                     "id": 221,
//                     "question_id": "56",
//                     "title": "MjQ=",
//                     "is_correct": "MA=="
//                 }
//             ]
//         },
//         {
//             "id": 33,
//             "label": "VmlyZ2lsIFZhbiBEaWprIHdhcyB0cmFuc2ZlcnJlZCB0byBsaXZlcnBvb2wgZmMgZnJvbSB3aGljaCBjbHViIGluIHRoZSAyMDE3LTIwMTggc2Vhc29uID8=",
//             "level": "bWVkaXVt",
//             "game_type_id": "2",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 131,
//                     "question_id": "33",
//                     "title": "Y2hlbHNlYSBmYw==",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 130,
//                     "question_id": "33",
//                     "title": "d2VzdCBoYW0gdW5pdGVkIGZj",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 132,
//                     "question_id": "33",
//                     "title": "U291dGhhbXB0b24gZmM=",
//                     "is_correct": "MQ=="
//                 },
//                 {
//                     "id": 129,
//                     "question_id": "33",
//                     "title": "c3VuZGVybGFuZCBmYw==",
//                     "is_correct": "MA=="
//                 }
//             ]
//         },
//         {
//             "id": 39,
//             "label": "d2hvIHdhcyB0aGUgQXJzZW5hbCBmYyBtYW5hZ2VyIGluIHRoZSAyMDE3LTIwMTggc2Vhc29uPw==",
//             "level": "ZWFzeQ==",
//             "game_type_id": "2",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 154,
//                     "question_id": "39",
//                     "title": "VW5haSBlbWVyeQ==",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 155,
//                     "question_id": "39",
//                     "title": "dG9ueSBwdWxpcw==",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 156,
//                     "question_id": "39",
//                     "title": "QXJzZW5lIHdlbmdlcg==",
//                     "is_correct": "MQ=="
//                 },
//                 {
//                     "id": 153,
//                     "question_id": "39",
//                     "title": "TWlrZWwgYXJ0ZXRh",
//                     "is_correct": "MA=="
//                 }
//             ]
//         },
//         {
//             "id": 175,
//             "label": "Sm9zZSBNb3VyaW5obyB3b24gb25lIExhIExpZ2EgdGl0bGU=",
//             "level": "ZWFzeQ==",
//             "game_type_id": "1",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 585,
//                     "question_id": "175",
//                     "title": "RkFMU0U=",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 586,
//                     "question_id": "175",
//                     "title": "VFJVRQ==",
//                     "is_correct": "MQ=="
//                 }
//             ]
//         },
//         {
//             "id": 17,
//             "label": "SG93IG1hbnkgbGVhZ3VlIGdvYWxzIGRpZCBoYXJyeSBrYW5lIHNjb3JlIGluIHRoZSAyMDE3LTIwMTggc2Vhc29uPw==",
//             "level": "ZWFzeQ==",
//             "game_type_id": "2",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 65,
//                     "question_id": "17",
//                     "title": "MzE=",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 66,
//                     "question_id": "17",
//                     "title": "MzI=",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 68,
//                     "question_id": "17",
//                     "title": "MzA=",
//                     "is_correct": "MQ=="
//                 },
//                 {
//                     "id": 67,
//                     "question_id": "17",
//                     "title": "MzQ=",
//                     "is_correct": "MA=="
//                 }
//             ]
//         },
//         {
//             "id": 116,
//             "label": "VGhlIDIwMTgtMjAxOSBFRkwgY3VwIGZpbmFsIHdhcyBwbGF5ZWQgaW4gd2hpY2ggc3RhZGl1bSA/",
//             "level": "ZWFzeQ==",
//             "game_type_id": "2",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 463,
//                     "question_id": "116",
//                     "title": "TWlsbGVuaXVt",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 464,
//                     "question_id": "116",
//                     "title": "V2VtYmxleQ==",
//                     "is_correct": "MQ=="
//                 },
//                 {
//                     "id": 461,
//                     "question_id": "116",
//                     "title": "SkpCIHN0YWRpdW0=",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 462,
//                     "question_id": "116",
//                     "title": "U3RhZGl1bSBvZiBsaWdodA==",
//                     "is_correct": "MA=="
//                 }
//             ]
//         },
//         {
//             "id": 108,
//             "label": "SG93IG1hbnkgcHJlbWllciBsZWFndWUgZ29hbHMgZGlkIE1hcmN1cyBSYXNoZm9yZCBzY29yZSBpbiB0aGUgMjAxOC0yMDE5IHNlYXNvbiA/",
//             "level": "aGFyZA==",
//             "game_type_id": "2",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 432,
//                     "question_id": "108",
//                     "title": "MTA=",
//                     "is_correct": "MQ=="
//                 },
//                 {
//                     "id": 431,
//                     "question_id": "108",
//                     "title": "OA==",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 430,
//                     "question_id": "108",
//                     "title": "OQ==",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 429,
//                     "question_id": "108",
//                     "title": "MTM=",
//                     "is_correct": "MA=="
//                 }
//             ]
//         },
//         {
//             "id": 69,
//             "label": "V2hvIHdhcyB0aGUgTWFuY2hlc3RlciBjaXR5IHRvcCBzY29yZXIgaW4gdGhlIDIwMTgtMjAxOSBzZWFzb24/",
//             "level": "ZWFzeQ==",
//             "game_type_id": "2",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 275,
//                     "question_id": "69",
//                     "title": "cmFoZWVtIHN0ZXJsaW5n",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 274,
//                     "question_id": "69",
//                     "title": "S2V2aW4gRGUgQnJ5dW5l",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 273,
//                     "question_id": "69",
//                     "title": "R2FicmllbCBqZXN1cw==",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 276,
//                     "question_id": "69",
//                     "title": "U2VyZ2lvIEFndWVybw==",
//                     "is_correct": "MQ=="
//                 }
//             ]
//         },
//         {
//             "id": 14,
//             "label": "V2hpY2ggcGxheWVyIHdvbiB0aGUgcHJlbWllciBsZWFndWUgcGxheWVyIG9mIHRoZSBtb250aCBvZiBvY3RvYmVyIGF3YXJkICBpbiB0aGUgMjAxNy0yMDE4IHNlYXNvbj8=",
//             "level": "aGFyZA==",
//             "game_type_id": "2",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 53,
//                     "question_id": "14",
//                     "title": "c2VyZ2lvIGFndWVybw==",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 56,
//                     "question_id": "14",
//                     "title": "bGVyb3kgc2FuZQ==",
//                     "is_correct": "MQ=="
//                 },
//                 {
//                     "id": 54,
//                     "question_id": "14",
//                     "title": "d2lsZnJpZWQgemFoYQ==",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 55,
//                     "question_id": "14",
//                     "title": "bW9oYW1tZWQgc2FsYWg=",
//                     "is_correct": "MA=="
//                 }
//             ]
//         },
//         {
//             "id": 131,
//             "label": "VGhpYWdvIFNpbHZhIGpvaW5lZCBDaGVsc2VhIEZDIGZyb20gUFNH",
//             "level": "ZWFzeQ==",
//             "game_type_id": "1",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 497,
//                     "question_id": "131",
//                     "title": "RkFMU0U=",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 498,
//                     "question_id": "131",
//                     "title": "VFJVRQ==",
//                     "is_correct": "MQ=="
//                 }
//             ]
//         },
//         {
//             "id": 149,
//             "label": "RnJhbmsgTGFtcGFyZCB3b3JlIHRoZSBOdW1iZXIgOCBqZXJzZXkgYXMgYSBDaGVsc2VhIEZDIHBsYXllcg==",
//             "level": "ZWFzeQ==",
//             "game_type_id": "1",
//             "category_id": "102",
//             "created_by": null,
//             "options": [
//                 {
//                     "id": 533,
//                     "question_id": "149",
//                     "title": "RkFMU0U=",
//                     "is_correct": "MA=="
//                 },
//                 {
//                     "id": 534,
//                     "question_id": "149",
//                     "title": "VFJVRQ==",
//                     "is_correct": "MQ=="
//                 }
//             ]
//         }
//     ],
//     currentQuestionPosition: 0,
//     totalQuestionCount: 10,
//     isLastQuestion: false,
//     chosenOptions: [],
//     consumedBoosts:[],
//     pointsGained:0,
//     isEnded: true,
//     displayedOptions: [
//         {
//             "id": 166,
//             "question_id": "42",
//             "title": "MTA=",
//             "is_correct": "MA=="
//         },
//         {
//             "id": 168,
//             "question_id": "42",
//             "title": "MTM=",
//             "is_correct": "MQ=="
//         },
//         {
//             "id": 167,
//             "question_id": "42",
//             "title": "MTE=",
//             "is_correct": "MA=="
//         },
//         {
//             "id": 165,
//             "question_id": "42",
//             "title": "MTU=",
//             "is_correct": "MA=="
//         }
//     ],
//     displayedQuestion: {
//         "id": 27,
//         "label": "TWFuY2hlc3RlciBjaXR5IGZjIHdlcmUga25vY2tlZCBvdXQgb2Ygd2hpY2ggcm91bmQgaW4gdGhlIDIwMTctMjAxOCBVRUZBIENoYW1waW9ucyBsZWFndWUgPw==",
//         "level": "ZWFzeQ==",
//         "game_type_id": "2",
//         "category_id": "102",
//         "created_by": null,
//     }
// }


export const GameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameMode: (state, action) => {
            state.gameMode = action.payload;
        },
        setGameType: (state, action) => {
            state.gameType = action.payload;
        },
        setGameCategory: (state, action) => {
            state.gameCategory = action.payload;
        },
        setPointsGained: (state, action) => {
            state.pointsGained = action.payload;
        },
        questionAnswered: (state, action) => {
            state.displayedOptions.map(x => {
                x.isSelected = x.id === action.payload.id
                return x;
            })
            state.chosenOptions.push(action.payload)
        },
        nextQuestion: (state) => {
            state.currentQuestionPosition += 1;
            state.displayedQuestion = state.questions[state.currentQuestionPosition]
            state.displayedOptions = state.displayedQuestion.options
            state.isLastQuestion = state.currentQuestionPosition === state.totalQuestionCount - 1
        },
       
    },

    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading sAWAWAWAWtate as needed
        builder
            .addCase(startGame.fulfilled, (state, action) => {
                state.questions = action.payload.data.questions;
                state.displayedQuestion = state.questions[state.currentQuestionPosition]
                state.displayedOptions = state.displayedQuestion.options
                state.gameSessionToken = action.payload.data.game.token
            })
            .addCase(endGame.fulfilled, (state, action) => {
                state.isEnded = true;
                state.pointsGained = action.payload.data.points_gained;
                
            })

    },
})

export const { setGameType, setGameMode, setGameCategory, setPointsGained, questionAnswered, nextQuestion, } = GameSlice.actions

export default GameSlice.reducer