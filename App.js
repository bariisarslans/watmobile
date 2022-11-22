import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Button,
  Text,
  ActivityIndicator,
  Platform
} from 'react-native';

import {
  addEventListener,
  removeEventListener,
  requestPermissions,
  EuroMessageApi,
  VisilabsApi,
  logToConsole,
} from 'react-native-related-digital'

const App = () => {
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState(null)

  const appAlias = Platform.OS === 'android' ? 'watmobileandroidtemp' : 'watmobileandroidtemp'

  const siteId = "303946333274563663726F3D";
  const organizationId = "4436677330782F504A78633D";
  const dataSource = "watMobilite";

  const euroMessageApi = new EuroMessageApi(appAlias)
  const visilabsApi = new VisilabsApi(appAlias, siteId, organizationId, dataSource)

  useEffect(() => {
    logToConsole(true)
    addListeners()

    return () => removeListeners()
  }, [])

  const addListeners = () => {
    console.log('adding listeners...')
    addEventListener('register', async (token) => {
      console.log('token is ', token)
      setToken(token)

      euroMessageApi.subscribe(token)

      visilabsApi.register(token, (result) => {
        console.log('visilabsApi result', result)
      })
    }, (notificationPayload) => {
      console.log('notification payload', notificationPayload)
    }, euroMessageApi, visilabsApi)

    addEventListener('registrationError', async (registrationError) => {
      console.log('registrationError is ', registrationError)
    }, euroMessageApi)

    addEventListener('carouselItemClicked', async (carouselItemInfo) => {
      console.log('carouselItemInfo is ', carouselItemInfo)
    }, euroMessageApi)
  }

  const login = async () => {
    let userData = {
      "Keyid": "baris.arslan@euromsg.com",
      "Email": "baris.arslan@euromsg.com",
      "PushPermit": "Y"
    }

    euroMessageApi.setUserProperties(userData).then(()=>{
      euroMessageApi.subscribe(token)
    })
  }

  const logout = async () => {
    let userData = {
      "Keyid": "baris.arslan@euromsg.com",
      "Email": "baris.arslan@euromsg.com",
      "PushPermit": "N"
    }

    euroMessageApi.setUserProperties(userData).then(()=>{
      euroMessageApi.subscribe(token)
    })
  }

  const removeListeners = () => {
    removeEventListener('register')
    removeEventListener('registrationError')
    removeEventListener('carouselItemClicked')
  }

  return (
    <SafeAreaView>
      {
        loading ?
          <ActivityIndicator
            size='large'
            animating={loading} /> :
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Text>Token:{token}</Text>
            <Button
              title='REQUEST PERMISSONS'
              onPress={() => {
                const isProvisional = false
                requestPermissions(isProvisional)
              }}
            />
            <Button
              title='LOGIN'
              onPress={() => {
                login()
              }}
            />

            <Button
              title='LOGOUT'
              onPress={() => {
                logout()
              }}
            />


          </ScrollView>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#FFF',
    padding: 20
  },
  divider: {
    height: 20
  }
});

export default App;
