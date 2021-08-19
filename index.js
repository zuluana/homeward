import { registerRootComponent } from 'expo';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import * as React from "react";
import { StatusBar } from 'react-native';
import "react-native-gesture-handler";
import { AppComponent } from "./src/App";


console.disableYellowBox = true;

export const unpackAsset = (asset) => {
  return asset;
}

export default class NativeApp extends React.Component {
  state = {
    fontsAreLoaded: false,
  };

  async componentWillMount() {

    await Font.loadAsync({

      //  Poppins
      "Poppins-ExtraBoldItalic": unpackAsset(require('./assets/fonts/Poppins/Poppins-ExtraBoldItalic.ttf')),
      "Poppins-Black": unpackAsset(require('./assets/fonts/Poppins/Poppins-Black.ttf')),
      "Poppins-BlackItalic": unpackAsset(require('./assets/fonts/Poppins/Poppins-BlackItalic.ttf')),
      "Poppins-Bold": unpackAsset(require('./assets/fonts/Poppins/Poppins-Bold.ttf')),
      "Poppins-BoldItalic": unpackAsset(require('./assets/fonts/Poppins/Poppins-BoldItalic.ttf')),
      "Poppins-ExtraBold": unpackAsset(require('./assets/fonts/Poppins/Poppins-ExtraBold.ttf')),
      "Poppins-ExtraItalic": unpackAsset(require('./assets/fonts/Poppins/Poppins-ExtraBold.ttf')),
      "Poppins-ExtraLight": unpackAsset(require('./assets/fonts/Poppins/Poppins-ExtraLight.ttf')),
      "Poppins-ExtraLightItalic": unpackAsset(require('./assets/fonts/Poppins/Poppins-ExtraLightItalic.ttf')),
      "Poppins-Italic": unpackAsset(require('./assets/fonts/Poppins/Poppins-Italic.ttf')),
      "Poppins-Light": unpackAsset(require('./assets/fonts/Poppins/Poppins-Light.ttf')),
      "Poppins-LightItalic": unpackAsset(require('./assets/fonts/Poppins/Poppins-LightItalic.ttf')),
      "Poppins-Medium": unpackAsset(require('./assets/fonts/Poppins/Poppins-Medium.ttf')),
      "Poppins-MediumItalic": unpackAsset(require('./assets/fonts/Poppins/Poppins-MediumItalic.ttf')),
      "Poppins-Regular": unpackAsset(require('./assets/fonts/Poppins/Poppins-Regular.ttf')),
      "Poppins-SemiBold": unpackAsset(require('./assets/fonts/Poppins/Poppins-SemiBold.ttf')),
      "Poppins-SemiBoldItalic": unpackAsset(require('./assets/fonts/Poppins/Poppins-SemiBoldItalic.ttf')),
      "Poppins-Thin": unpackAsset(require('./assets/fonts/Poppins/Poppins-Thin.ttf')),
      "Poppins-ThinItalic": unpackAsset(require('./assets/fonts/Poppins/Poppins-ThinItalic.ttf'))
    });

    this.setState({ fontsAreLoaded: true });
  }

  render() {
    
    if (!this.state.fontsAreLoaded) {
      return <AppLoading />;
    }

    return (
      <React.Fragment>
        <StatusBar hidden={ false } />
        <AppComponent />
      </React.Fragment>
    );
  }
}

registerRootComponent(NativeApp);