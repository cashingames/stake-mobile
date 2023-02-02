import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import MiniHead from './miniHead'
import { Dimensions } from 'react-native'
import { Image } from 'react-native'
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import { Walkthroughable } from '../../Tour/Walkthrouable';
import { defaultToolTip } from '../Index'

const window = Dimensions.get("window")

function PopupPrizePool(props) {
    const CopilotProps = props;
    useEffect(()=>{
      if(props.id === props.activeScreen){
          setTimeout(()=>{
              
              // console.log('reach11')
              CopilotProps.start()
              CopilotProps.copilotEvents.on('stop', handleTourStop)

              return () => {
                  CopilotProps.copilotEvents.off('stop', handleTourStop)
              }
          }, 300)
      }
  }, [props.activeScreen])

  const handleTourStop = ()=>{
      // console.warn(Object.keys(CopilotProps))
      CopilotProps.goToNext()
      // navigation.navigate("LiveTriviaLeaderboard", {
      //     triviaId: 0
      // })
  }


    return (
      <View style={styles.container}>
        <MiniHead bg={"rgba(112, 31, 136, 1)"} title={"Global Leaderboard"} />

        <CopilotStep text={
                      <View>
                          <Text style={styles.tourTitle} >Prize Pool</Text>
                          <Text style={styles.tourDesc}>
                            Win cash prizes when you appear as the top three on the weekly leaderboard
                          </Text>
                      </View>
                  } order={5} name={`Order${5}`}>
                    <Walkthroughable>
                        <View style={{ position: 'absolute', width: '80%', left: '14%', height: 300, top: '40%' }} />
                    </Walkthroughable>
        </CopilotStep>
          
        <Image style={{ flex: 1, width: '100%' }} source={require("../../../../assets/images/popup_leaderboard.png")} />
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: window.width
  },
  tourTitle: {
    color: '#EF2F55',
    fontWeight: '600',
    fontSize: 22,
    marginBottom: 10
  },
  tourDesc: {
    width: window.width * 0.7
  }
})

export default copilot({
  animated: true,
  overlay: 'svg',
  labels: {
      finish: 'Next',
      skip: ' ',
  },
  arrowColor: 'rgba(0, 0, 0, 0)',
  tooltipComponent: defaultToolTip
})(PopupPrizePool);