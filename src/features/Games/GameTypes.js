

//Not in use currently
function GameCards() {

    //when we have game types
    const games = useSelector(state => state.common.gameTypes);

    if (!isTrue(games) || games.length === 0)
        return <></>;

    return (
        <Animated.View entering={BounceIn.delay(1000)} style={styles.games}>
            <Text style={styles.lightTitle}>Play New Game</Text>
            <View style={styles.cards}>
                <SwiperFlatList >
                    {games.map((game, i) => <GameCard key={i} game={game} />)}
                </SwiperFlatList>
            </View>
        </Animated.View>

    )
}

function GameCard({ game }) {
    const navigation = useNavigation();
    return (
        <Pressable style={[styles.card]} onPress={() => navigation.navigate('Game')}>
            <Image
                style={styles.cardIcon}
                source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${game.icon}` }}
                resizeMode='contain'
            />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{game.displayName}</Text>
                <Text style={styles.cardInstruction}>{game.description}</Text>
            </View>

        </Pressable>
    );
}


const styles = EStyleSheet.create({
    scrollView: {
        paddingBottom: normalize(30),
        backgroundColor: '#F8F9FD',
    },
    container: {
        flex: 1,
        paddingHorizontal: '1.2rem',
    },
    userDetails: {
        backgroundColor: '#072169',
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(20),
    },
    wallet: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(10),
    },
    walletText: {
        fontSize: '1.2rem',
        color: '#FFFF',
        lineHeight: '1.2rem',
        fontFamily: 'graphik-medium',
        marginLeft: normalize(8),
    },
    points: {
        backgroundColor: '#518EF8',
        borderRadius: normalize(10),
        marginVertical: normalize(10),
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        paddingVertical: normalize(15),
        paddingRight: normalize(10),
        paddingLeft: normalize(20),
    },
    trophy: {
        position: 'relative',
        zIndex: 2,
        marginTop: normalize(-25)
    },
    pointsNumber: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#072169",
        borderRadius: 100,
        padding: 20,
    },
    userPoint: {
        fontSize: '0.8rem',
        lineHeight: '0.8rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    pointDetail: {
        color: '#e3e3e3',
        fontSize: '0.6rem',
        fontFamily: 'graphik-medium',
        textTransform: 'uppercase',
    },
    userRanking: {
        backgroundColor: '#FFFF',
        borderRadius: normalize(10),
        marginTop: normalize(10),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(30),
    },
    globalRanking: {
        alignItems: 'flex-end'
    },
    rankNumber: {
        fontSize: '1.5rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
    },
    rankDetail: {
        color: '#151c2f73',
        fontFamily: 'graphik-bold',
        fontSize: '0.7rem',
    },
    games: {
        paddingTop: normalize(10, "height"),
    },
    title: {
        fontSize: Platform.OS === 'ios' ? '1.4rem' : '1.3rem',
        lineHeight: '1.3rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        marginTop: responsiveHeight(3),
    },
    planInstruction: {
        color: '#151C2F',
        fontSize: Platform.OS === 'ios' ? '0.9rem' : '0.8rem',
        fontFamily: 'graphik-regular',
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(2),
    },
    lightTitle: {
        fontSize: '1rem',
        color: '#151C2F',
        fontFamily: 'graphik-regular',
        marginTop: normalize(10),
    },
    cards: {
        display: 'flex',
        marginTop: normalize(18),
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: normalize(10),
        alignItems: 'center',
        marginRight: responsiveWidth(3),
        flexDirection: "row",
        borderColor: '#0F000000',
        width: responsiveScreenWidth(70),
        '@media (min-height: 781) and (max-height: 1200)': {
            height: responsiveHeight(10),
        },
        '@media (min-height: 300) and (max-height: 780)': {
            height: responsiveHeight(11),
        },
    },
    cardIcon: {
        flex: 1,
        height: '2rem',
        width: '2rem',
        alignSelf: 'center',
    },
    cardIconBigger: {
        flex: 2,
        width: normalize(48),
        height: normalize(48),
        alignSelf: 'center',
    },
    cardContent: {
        flex: 4,
        paddingHorizontal: responsiveScreenWidth(1),
        justifyContent: "space-evenly",
    },
    cardTitle: {
        fontSize: '0.93rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
    },
    cardInstruction: {
        fontSize: '0.75rem',
        color: '#151C2F',
        fontFamily: 'graphik-regular',
        lineHeight: '1rem',
        opacity: .7,
        flexWrap: 'wrap',
        flexShrink: 1,
        marginTop: Platform.OS === 'ios' ? normalize(2) : normalize(1),

    },
    replay: {
        fontSize: '0.7rem',
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        textTransform: 'uppercase',
        marginTop: Platform.OS === 'ios' ? normalize(5) : normalize(1),
    },
});