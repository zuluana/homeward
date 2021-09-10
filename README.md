# Homeward
> 
*Simple Cross-Platform Shortcuts*

Homeward is a web app used to save URLs (including Deep Links) to a user's mobile home-screen.

This is a technique used by several popular apps and documented on [Stack Overflow](https://stackoverflow.com/questions/28042152/link-to-safari-add-to-home-screen-from-inside-app).

>  **IMPORTANT**
>  This repository hosts the web-app code displayed to the user.  If you're looking to save Shortcuts from a React Native app, we highly recommend the [Homeward SDK](https://github.com/CodalReef/Homeward)

*See [Pitch / Antipitch](#pitch--anti-pitch) and [Disclaimer](#disclaimer) prior to use.*

##  API Usage

Homeward has a single HTTP endpoint accessed as follows:

```bash
curl -l <SERVER_URL>?link=<LINK>&manifest=<MANIFEST>
```

-  *SERVER_URL*:  The URL of the Homeward Server
-  *LINK*:  The URL-Encoded deep link to save to the home-screen
-  *MANIFEST*:  The URL-Encoded [WebAppManifest JSON](https://developer.mozilla.org/en-US/docs/Web/Manifest)

###  Public Endpoint

The public endpoint is hosted on Github Pages here:  https://codalreef.github.io/homeward

###  Default Icon

On iOS, if no icon is specified, a screen-shot of the generated page is used.

![Example](https://res.cloudinary.com/practicaldev/image/fetch/s--TmgpWgZl--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/anu7aab9g5bwmlnr2nl3.png)

The page uses the `theme_color` and `name` manifest fields to generate a page and style the icon.

The background color of the icon will be set to `theme_color` , and the first letter of the `name` field will be centered upon it.

On Android, if no icon is specified, the system automatically generates a default icon.

###  Custom Icon

Android has full support for custom icons specified in the `icons` manifest field.

To use a custom icon on iOS, specify a "180x180" icon in the `icons` manifest field.

>  iOS appears to have [issues](https://stackoverflow.com/questions/49568333/pwa-icons-are-not-used-in-ios-11-3) with manifest icons.  We solve this by dynamically adding a [apple-touch-icon](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html) field to the generated page.
> 

### JS / TS Example

Again, we recommend using our TS / JS SDK to simplify the logic.  But, you may also implement manually:

```javascript
import { Linking } from 'react-native';

//  Set the Homeward Server
const server = "https://codalreef.github.io/Homeward-Server";

//  Create a WebManifest
//  REFERENCE:  https://developer.mozilla.org/en-US/docs/Web/Manifest
const manifest = {
    name: "Test",
    background_color: "#79ccd2",
    theme_color: "#79ccd2",
    "icons": [{
        "src": <URL>,
        "sizes": "512x512",
        "type": "image/jpeg"
    }]
};

//  Create the Link
const link = "myapp://feature1.context1?payload={ ... }"

//  Save to Home
const saveToHome = () => {

    //  Encode Parameters
    const eManifest = encodeURLComponent(JSON.stringify(manifest));
    const eLink = encodeURLComponent(link);

    //  Combine Parameters
    const params = `manifest=${ eManifest }&link=${ eLink }`;
    Linking.openURL(`${server}${queryParams}`);

};
```

##  Deployment

The single page application is build using React Native Web and Expo.

Follow [documentation here](https://docs.expo.dev/distribution/publishing-websites/) to build and deploy the app.

### Github Pages

If you'd like to deploy your own Github Pages instance:

#### Configure Github
1.  Fork [Homeward-Server](https://github.com/CodalReef/Homeward-Server)
2.  [Enable Github Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)
3.  [Change the Github Pages Publishing Source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) to `docs`

#### Configure The Codebase

1.  Install Dependencies:  `npm i`
2.  Set the `homepage` field of package.json to your Github Pages path
3.  Build the App:  `expo build:web`
4.  Rename `web-build` to `docs`
5.  Commit and Push to Github

NOTE:  In the future we may de-couple Github Pages from Homeland-Server and deploy with `gh-pages`:  https://docs.expo.dev/distribution/publishing-websites/?redirected

## Pitch / Anti-Pitch

###  Advantages
-  Cross-Platform
-  Expo Compatible
-  MIT License

###  Disadvantages
-  Requires Internet Connection
-  Requires Browser Redirect

>  **Github Pages**
> The default endopint hosted on Github Pages is URL length-limitied, and it requires transacting with a 3rd party server.  This can be fixed by [deploying your own endpoint](#deployment).

While other solutions *are* available now, this library was inspired by concerns documented in our Dev.to article:  Article Link


##  Roadmap

This library helps bridge a technology-specific gap while we wait for a non-viral wrapper around Siri Shortcuts and Expo support.

Once that happens, it shouldn't be difficult to build a native solution that doesn't re-direct to a browser.  In the meantime, here are some ideas for improving this library:

-  Extensibility
--  Modularize the renderer to use a user-specified component.
--  Support "Plugins" to dynamically generate various icon types.
--  Remove theh "dev" vs. "prod" distinction and inject that differentiation with a Plugin as needed.
--  Generally, make this library "Pluggable" as I discuss here:  
-  Publish on NPM
-  Save State Info (Success, Failure, etc)

###  Disclaimer

The public Github Pages end-point (currently located at https://codalreef.github.io/homeward) is provided AS IS, without warranty, subject to undocumented change, and is not recommended for production, confidential, or otherwise sensitive payloads.  It is subject to terms of the MIT License.

##  Contact

Email:  codalreef@gmail.com

Reddit:  https://www.reddit.com/user/CodalReef

Dev.to:  https://dev.to/codalreef

Twitter:  https://twitter.com/CodalReef
