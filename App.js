import { View, Text } from 'react-native'
import React from 'react'
import Screen1 from './src/screens/Screen1'
import Loader from './src/components/Loader'
import Screen2 from './src/screens/Screen2'

const App = () => {
  return (
    <View style={{flex:1}}>
      <Screen1/>
      {/* <Screen2/> */}
    </View>
  )
}

export default App