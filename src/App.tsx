import * as React from 'react';
import { Image, Linking, Text, View } from 'react-native';
import { ImageResource, WebAppManifest } from 'web-app-manifest';

//
//  Presentational Components
//

const NotificationPage = ({ text, title, onPress }: { text: string, title: string, onPress?: () => void }) => {
  return (
    <View style={{ width: "100%", height: "100%", display: "flex", justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ borderRadius: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: "Poppins-SemiBold", color: '#444444', fontSize: 20 }}>{ title }</Text>
        <Text onPress={ onPress } style={{ fontFamily: "Poppins-SemiBold", color: onPress ? 'blue' : '#444444', fontSize: 15 }}>{ text }</Text>
      </View>
    </View>
  );
}

const ErrorPage = ({ text }: { text: string }) => {
  return <NotificationPage text={text} title="Error" />
}


//
//  Main App
//

//  Config
const secDelay = 10;  //  Delay for 10 Seconds

interface AppProps { }
interface AppState { }

export class AppComponent extends React.Component<AppProps, AppState> {

  public componentDidMount() {

    //  Reprocess the Link on Focus
    //  The PWA remains in the "tray", and when the user taps it again, it should be redirected.
    window.onfocus = () => this.forceUpdate();
  }

  //  TODO:  Pull MOST of this out of Render?
  public render() {

    //  Unpack Request
    const { origin, pathname } = window.location;
    const params = new URLSearchParams(window.location.search);

    //  Unpack Params
    const encodedLink = params.get("link");
    const encodedManifest = params.get("manifest");

    //
    //  Handle Home Page
    //

    if (!encodedLink || !encodedManifest) {
      //  TODO:  Indicate missing link / manifest
      return <NotificationPage title="Welcome to Homeward" text="Click Here for Usage Instruction" onPress={() => Linking.openURL("https://github.com/CodalReef/Homeward")} />
    }

    //  Parse and Decode
    //  TODO:  Validate payloads (Enjoi?)  Currently, if present, we assume valid. 
    const link = decodeURIComponent(encodedLink);
    const manifest: WebAppManifest = JSON.parse(decodeURIComponent(encodedManifest));

    //
    //  Handle Link
    //  

    //  Get the Timestamp
    const timestamp = params.get("timestamp");

    //  Handle Missing Timestamp
    //  Redirects the user back to the same page with a timestamp.
    if (timestamp == null) {
      let paramString = "?";
      params.forEach((value, key) => paramString += `${key}=${encodeURIComponent(value)}&`);
      paramString += `timestamp=${(new Date()).getTime().toString()}`
      const newUrl = `${origin}${pathname}${paramString}`;
      window.location.replace(newUrl);
      return;
    }

    //  Guard Missing
    if (!manifest) { return <ErrorPage text="No Manifest Provided" /> }
    if (!link) { return <ErrorPage text="No Link Provided" /> }

    //  Inject the Manifest
    //  REFERENCE (inspired by):  https://medium.com/@alshakero/how-to-setup-your-web-app-manifest-dynamically-using-javascript-f7fbee899a61
    //  CONSIDER:  Can we use "start_url" to do deep linking without the timing?  I tried, but it wasn't working.
    const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' })
    const manifestURL = URL.createObjectURL(blob);
    document.getElementById("manifest-link")?.setAttribute("href", manifestURL);

    //  Handle Apple Icons (Dynamically set 'apple-touch-icon' to the the "180x180")
    //  REFERENCE:  
    const { icons = [] } = manifest;
    const iOSIcon = icons.find((icon: ImageResource) => icon.sizes === "180x180");
    document.getElementById("apple-touch-icon-link")?.setAttribute("href", iOSIcon?.src || "");

    //  Set the Page Background Color
    document.body.style.backgroundColor = manifest.theme_color || "white";

    //  Determine Browser
    const browserString = navigator.appVersion.toLowerCase();
    //  TODO:  iOS isn't working
    const isSafariIos = browserString.includes("ios") && browserString.includes("safari");
    const isAndroidChrome = browserString.includes("android") && browserString.includes("chrome");

    //  Get the App Letter (or 'U' for Unknown)
    const letter = manifest.name ? manifest.name[0] || "U" : "U";

    //  Get the Timestamps
    const storedTimestamp = Number.parseInt(timestamp);
    const currentTimestamp = (new Date()).getTime();

    //  Convert Second Delay to Milliseconds
    const msDelay = secDelay * 1000;

    //  Determine whether or not we're still waiting for the time to elapse.
    const stillWaiting = currentTimestamp - storedTimestamp <= msDelay

    //  Handle Waiting Case
    if (stillWaiting) {

      // CONSIDER:  Consider Plugins to support additional devices / browsers.

      return (
        <View style={{ height: '100%', width: '100%', backgroundColor: manifest.theme_color, alignItems: 'center', paddingTop: 85 }}>
          <Text style={{ color: 'white', fontSize: 200, fontWeight: "900" }}>{letter}</Text>
          <View style={{ height: 70 }} />
          {
            isSafariIos && (
              <View style={{ borderRadius: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: "Poppins-SemiBold", color: '#444444', fontSize: 15, padding: 15 }}>Tap the</Text>
                <Image source={require("../assets/share.png")} resizeMode="cover" style={{ width: 30, height: 30, borderRadius: 7 }} />
                <Text style={{ fontFamily: "Poppins-SemiBold", color: '#444444', fontSize: 15, padding: 15 }}>button below to Save to Homescreen.</Text>
              </View>
            )
          }
          {
            isAndroidChrome && (
              <View style={{ borderRadius: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: "Poppins-SemiBold", color: '#444444', fontSize: 15, padding: 15 }}>Tap the</Text>
                <Image source={require("../assets/more.png")} resizeMode="cover" style={{ width: 30, height: 30, borderRadius: 7 }} />
                <Text style={{ fontFamily: "Poppins-SemiBold", color: '#444444', fontSize: 15, padding: 15 }}>button above to Save to Homescreen.</Text>
              </View>
            )
          }
          {
            (!isSafariIos && !isAndroidChrome) && (
              <View style={{ borderRadius: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: "Poppins-SemiBold", color: '#444444', fontSize: 15, padding: 15 }}>Use the Browser</Text>
                <Text style={{ fontFamily: "Poppins-SemiBold", color: '#444444', fontSize: 15, padding: 15 }}>to Save to Homescreen.</Text>
              </View>
            )
          }

        </View>
      );
    }

    //  Handle Exceeded Case

    //  Guard Link
    if (link === null) {
      return <Text>{name} + No Link was Provided</Text>
    }

    //  Redirect to the Deep Link
    window.location.replace(link);

    return (
      <View style={{ height: '100%', width: '100%', backgroundColor: manifest.theme_color, alignItems: 'center', paddingTop: 80 }}>
        <Text style={{ color: 'white', fontSize: 200, fontWeight: "900" }}>{letter}</Text>
        <View style={{ height: 70 }} />
        <View style={{ borderRadius: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: "Poppins-SemiBold", color: '#444444', fontSize: 15, padding: 15 }}>Added to Homescreen</Text>
        </View>
      </View>
    );
  }
}
