if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return i[e]||(s=new Promise(async s=>{if("document"in self){const i=document.createElement("script");i.src=e,document.head.appendChild(i),i.onload=s}else importScripts(e),s()})),s.then(()=>{if(!i[e])throw new Error(`Module ${e} didn’t register its module`);return i[e]})},s=(s,i)=>{Promise.all(s.map(e)).then(e=>i(1===e.length?e[0]:e))},i={require:Promise.resolve(s)};self.define=(s,a,n)=>{i[s]||(i[s]=Promise.resolve().then(()=>{let i={};const c={uri:location.origin+s.slice(1)};return Promise.all(a.map(s=>{switch(s){case"exports":return i;case"module":return c;default:return e(s)}})).then(e=>{const s=n(...e);return i.default||(i.default=s),i})}))}}define("./service-worker.js",["./workbox-d9851aed"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:".DS_Store",revision:"5ed0a63c6f23b6c1dc7ce82c4c31b87a"},{url:"android-chrome-192x192.png",revision:"ade212afd879f972cb9d945d37a2ac1d"},{url:"android-chrome-384x384.png",revision:"7a576712081a35c06ea18ddc26102d64"},{url:"apple-touch-icon-120x120.png",revision:"928ef32c52b8b7671d4fb061cd589f63"},{url:"apple-touch-icon-152x152.png",revision:"31623a2a74a25af60b7637e6c91c2ea4"},{url:"apple-touch-icon-180x180.png",revision:"0b36907eaf60b2b6f4587fc999668ea4"},{url:"apple-touch-icon-60x60.png",revision:"ddfd5699e66020a1c5718569a621123e"},{url:"apple-touch-icon-76x76.png",revision:"947c2bedc5317c3913368d52c29492b7"},{url:"apple-touch-icon.png",revision:"0b36907eaf60b2b6f4587fc999668ea4"},{url:"browserconfig.xml",revision:"67a10bea40ba5357c26766b67d3e074b"},{url:"cd6a85967efed150d6fc.css",revision:"4287120aeb540223e4cd30bb94765785"},{url:"engines/stockfish.js",revision:"56bec4d032076b87017db58a379a6029"},{url:"engines/stockfish.wasm",revision:"567fb45196e523adcc5275a538254e20"},{url:"engines/stockfish.wasm.js",revision:"6b5226c9b76b2f0153bfdb0288a555b8"},{url:"favicon-16x16.png",revision:"4c3b8e6c73daf0a191e8c1decd9627fd"},{url:"favicon-32x32.png",revision:"758f1ed725a5340ac0402fa20934610e"},{url:"favicon.ico",revision:"85597d37897e20ed0a480fd447799230"},{url:"fbd7478532f7d8eb90c6.js",revision:"eab01bcf461186914a86c353951b136d"},{url:"img/.DS_Store",revision:"a308c6e245ed5552b93835b10924a4a1"},{url:"img/board-background.png",revision:"3866f7ca18e6a5f90e60f2acee04155f"},{url:"img/btn_google_light_normal_ios.eps",revision:"27c87ab9ea3407ca5cc6dfe05e95c323"},{url:"img/btn_google_signin_light_normal_web@2x.png",revision:"52a05e731e61db85e7d96bf3f10d919c"},{url:"img/chess-analysis-logo.svg",revision:"b5d96d7105efa8a918ba61442bfe834c"},{url:"img/chesspieces/.DS_Store",revision:"a1a896dd4d5935b710e272c6f8a1ee28"},{url:"img/chesspieces/alpha/bB.png",revision:"990638736a537c9a8448bc6705fec01c"},{url:"img/chesspieces/alpha/bK.png",revision:"f9b129682df75a296cc53823737cace4"},{url:"img/chesspieces/alpha/bN.png",revision:"e18f2f58923d601ef9c164b36742a693"},{url:"img/chesspieces/alpha/bP.png",revision:"2ec395555c97fa8811b5a8bc697513d6"},{url:"img/chesspieces/alpha/bQ.png",revision:"4819740b629be40e6a69cf747a507cf3"},{url:"img/chesspieces/alpha/bR.png",revision:"fea76686c4cdd59a84cdf37bbe6c70d5"},{url:"img/chesspieces/alpha/wB.png",revision:"52c2a3bdb5d9fa579001bab9f98537f2"},{url:"img/chesspieces/alpha/wK.png",revision:"788f2cb0c857e18f544caed2925c130f"},{url:"img/chesspieces/alpha/wN.png",revision:"4c32e56417020c9bda434c5570ce6a86"},{url:"img/chesspieces/alpha/wP.png",revision:"7c2859665123932249fe2a250a1521b7"},{url:"img/chesspieces/alpha/wQ.png",revision:"7760a113cb5c75c357869ec52d9d0408"},{url:"img/chesspieces/alpha/wR.png",revision:"aa7017bfaa736fa0ab917172abe75096"},{url:"img/chesspieces/uscf/bB.png",revision:"c8d8aa4668eeb5854c961a5a81ab5ac1"},{url:"img/chesspieces/uscf/bK.png",revision:"8323ae016ff88b25f0bc547d20df47ee"},{url:"img/chesspieces/uscf/bN.png",revision:"bc905ca11edb3c0bbf13ee00f17da63c"},{url:"img/chesspieces/uscf/bP.png",revision:"94d279543f0771f297fc76991b400c7c"},{url:"img/chesspieces/uscf/bQ.png",revision:"a2dc27c18a9e4be84b6ecda33fa5a3f0"},{url:"img/chesspieces/uscf/bR.png",revision:"20c9aa4027db3d2a509dff3bf2f64605"},{url:"img/chesspieces/uscf/wB.png",revision:"e779196c5562d9ca42701f37fae28a8a"},{url:"img/chesspieces/uscf/wK.png",revision:"b6272b75e4e641c299120e0b6e446511"},{url:"img/chesspieces/uscf/wN.png",revision:"28fad96c7f474f6bd75d323f557d11fa"},{url:"img/chesspieces/uscf/wP.png",revision:"819efb9465b676f1dbc6da7d11dced38"},{url:"img/chesspieces/uscf/wQ.png",revision:"09f92e74662f5c972ed3988a6b42ef54"},{url:"img/chesspieces/uscf/wR.png",revision:"b4922198b38a031b67b5c5d00d6ad9fa"},{url:"img/chesspieces/wikipedia/bB.png",revision:"3b014212f9bc5ecc6a73c191252ff2a4"},{url:"img/chesspieces/wikipedia/bK.png",revision:"474307eef58a34990b954abab2181b64"},{url:"img/chesspieces/wikipedia/bN.png",revision:"a2e451246463158983b3a280051d4fde"},{url:"img/chesspieces/wikipedia/bP.png",revision:"9473e99a93f36c2c5e34b16c2b80da18"},{url:"img/chesspieces/wikipedia/bQ.png",revision:"12e26dc3ea07e500793505c0fb7ff848"},{url:"img/chesspieces/wikipedia/bR.png",revision:"5f85bb3c47b5faf6d37d93cd472f273a"},{url:"img/chesspieces/wikipedia/wB.png",revision:"7dc2524b02ba373c558fe86ade8d974f"},{url:"img/chesspieces/wikipedia/wK.png",revision:"3023695ee08ba79d3426233b36f7e2f0"},{url:"img/chesspieces/wikipedia/wN.png",revision:"37398b803db0bb1dcbd7824f22970903"},{url:"img/chesspieces/wikipedia/wP.png",revision:"f57254b7320b9a2f9113a203c483246f"},{url:"img/chesspieces/wikipedia/wQ.png",revision:"aee6543bc4f1a7b82e1df31c6e516180"},{url:"img/chesspieces/wikipedia/wR.png",revision:"84c7134294991eced0cfd6d13531174e"},{url:"img/satinweave.png",revision:"9b1612dd5073bee5c6721071f0e33a2f"},{url:"index.html",revision:"4bb3809287f83224ee94f7ab69cd001a"},{url:"manifest.json",revision:"615bf4a633eefc33d90c04e0a1804bb7"},{url:"mstile-144x144.png",revision:"842d85e8ee4628061c96f8cc97083524"},{url:"mstile-150x150.png",revision:"a604218293d30b7cfdc5d014a55a0253"},{url:"mstile-310x150.png",revision:"3bc5f4040ab8fdda5b806b68bca95403"},{url:"mstile-310x310.png",revision:"fd0c7645d3b5d62900e53831d5768702"},{url:"mstile-70x70.png",revision:"b51e1c2545836150398eb538e726adae"},{url:"safari-pinned-tab.svg",revision:"a94ab8176beb7e006437989e847e3f34"},{url:"site.webmanifest",revision:"240b73bd9f1483494dee37c241aafee1"},{url:"splash/android/android-launchericon-144-144.png",revision:"b550edd2d7cdafdb9da2d7afb3e2a059"},{url:"splash/android/android-launchericon-192-192.png",revision:"565a86755c980c371a8cce3a21dfdbd6"},{url:"splash/android/android-launchericon-48-48.png",revision:"b5c40ba52e8d86831b891bd2b464f26a"},{url:"splash/android/android-launchericon-512-512.png",revision:"e644b0f4568a251977dc959a5ba70d57"},{url:"splash/android/android-launchericon-72-72.png",revision:"ac80576f6d22283cf895ca6823fe5d85"},{url:"splash/android/android-launchericon-96-96.png",revision:"f9dde88f77a05306a20d945d3c2453ec"},{url:"splash/chrome/chrome-extensionmanagementpage-48-48.png",revision:"b5c40ba52e8d86831b891bd2b464f26a"},{url:"splash/chrome/chrome-favicon-16-16.png",revision:"b0fa90b5fb9a7c3279e19e6903cfc8bb"},{url:"splash/chrome/chrome-installprocess-128-128.png",revision:"1515441960dc86825fb3d892e6b639be"},{url:"splash/firefox/firefox-general-128-128.png",revision:"1515441960dc86825fb3d892e6b639be"},{url:"splash/firefox/firefox-general-16-16.png",revision:"b0fa90b5fb9a7c3279e19e6903cfc8bb"},{url:"splash/firefox/firefox-general-256-256.png",revision:"c2371eabdefc71ba547758cdfe4c20b4"},{url:"splash/firefox/firefox-general-32-32.png",revision:"172dcb1d41353965fdd72480b29c39ee"},{url:"splash/firefox/firefox-general-48-48.png",revision:"b5c40ba52e8d86831b891bd2b464f26a"},{url:"splash/firefox/firefox-general-64-64.png",revision:"89627aedaa07530bf2a273783dbf3bd4"},{url:"splash/firefox/firefox-general-90-90.png",revision:"d475f7ed6f9ccd5fb3e0ff99b7dc9010"},{url:"splash/firefox/firefox-marketplace-128-128.png",revision:"1515441960dc86825fb3d892e6b639be"},{url:"splash/firefox/firefox-marketplace-512-512.png",revision:"e644b0f4568a251977dc959a5ba70d57"},{url:"splash/icons.json",revision:"172142be2f4df9510ea5bcefb86e72a5"},{url:"splash/ios/ios-appicon-1024-1024.png",revision:"eca54b1c64128465e9db414baabe0a59"},{url:"splash/ios/ios-appicon-120-120.png",revision:"479714b276d8037dbf838ea028e1755a"},{url:"splash/ios/ios-appicon-152-152.png",revision:"3480dc404ba3932be9b0f38fd570216f"},{url:"splash/ios/ios-appicon-180-180.png",revision:"67eba33621978b82ccd912206029644e"},{url:"splash/ios/ios-appicon-76-76.png",revision:"12b42b3791c0590354fe95b874a8f51e"},{url:"splash/ios/ios-launchimage-1024-768.png",revision:"396c7d8b81706ad9216c14bed3342e5d"},{url:"splash/ios/ios-launchimage-1242-2208.png",revision:"744fca30cf4184f29770983f406779f2"},{url:"splash/ios/ios-launchimage-1334-750.png",revision:"412dbe838bb0020149622b260ac92b93"},{url:"splash/ios/ios-launchimage-1536-2048.png",revision:"0eb3113aa3a7f07e8817a6b3c08d2510"},{url:"splash/ios/ios-launchimage-2048-1536.png",revision:"278836116c2b1f24a0e73c9dd916cb7e"},{url:"splash/ios/ios-launchimage-2208-1242.png",revision:"49cb1d2fd9655864fcf8a8600dd6646f"},{url:"splash/ios/ios-launchimage-640-1136.png",revision:"ca7e0e45b77ee3ee715e606bbaf51bd2"},{url:"splash/ios/ios-launchimage-640-960.png",revision:"7780246e8ced2a652a037529f25ec1de"},{url:"splash/ios/ios-launchimage-750-1334.png",revision:"05345216bb9e652ce02018cb3ede0d50"},{url:"splash/ios/ios-launchimage-768-1024.png",revision:"28b4c334266c1d5da03e08d5fd41a9e4"},{url:"splash/windows/windows-smallsquare-24-24.png",revision:"e5743a61998950b371243fbf912948f6"},{url:"splash/windows/windows-smallsquare-30-30.png",revision:"859e62c2d35a51a8353ce12fd258379a"},{url:"splash/windows/windows-smallsquare-42-42.png",revision:"c6cb12caad4ba75b6cca460bf580eb94"},{url:"splash/windows/windows-smallsquare-54-54.png",revision:"f69e6b582fab23cff3530340863d07ca"},{url:"splash/windows/windows-splashscreen-1116-540.png",revision:"0769ba7acb3f512d6b9526d063c1cfe6"},{url:"splash/windows/windows-splashscreen-620-300.png",revision:"ef38c4d1f7fb9719c70c8fe4215b0fb7"},{url:"splash/windows/windows-splashscreen-868-420.png",revision:"03e2eb2832000dd7a8c9c6a5ffeda368"},{url:"splash/windows/windows-squarelogo-120-120.png",revision:"479714b276d8037dbf838ea028e1755a"},{url:"splash/windows/windows-squarelogo-150-150.png",revision:"309ade4573b61f2ce19801a68e16d5d2"},{url:"splash/windows/windows-squarelogo-210-210.png",revision:"d6874f17e8eea0379ea0dcf173d626db"},{url:"splash/windows/windows-squarelogo-270-270.png",revision:"51c965711b90c44c7dc9fde75630da51"},{url:"splash/windows/windows-storelogo-50-50.png",revision:"e1c2b2751b336418fe6df8413d2649d3"},{url:"splash/windows/windows-storelogo-70-70.png",revision:"a57145bd9d79273ea5fac0c34d1430f4"},{url:"splash/windows/windows-storelogo-90-90.png",revision:"d475f7ed6f9ccd5fb3e0ff99b7dc9010"},{url:"splash/windows/windowsphone-appicon-106-106.png",revision:"b2cf0857fb8def2298eb5773670cf4bc"},{url:"splash/windows/windowsphone-appicon-44-44.png",revision:"fadc5dc71874ca0063c64beab2bff16a"},{url:"splash/windows/windowsphone-appicon-62-62.png",revision:"0e93b3be638cb66d0a44163c7fd3c651"},{url:"splash/windows/windowsphone-mediumtile-150-150.png",revision:"309ade4573b61f2ce19801a68e16d5d2"},{url:"splash/windows/windowsphone-mediumtile-210-210.png",revision:"d6874f17e8eea0379ea0dcf173d626db"},{url:"splash/windows/windowsphone-mediumtile-360-360.png",revision:"22f77dfbe0d1ba059dc7ab04184bb41e"},{url:"splash/windows/windowsphone-smalltile-170-170.png",revision:"4a67f6ae0008247cb140e9de615b5e6f"},{url:"splash/windows/windowsphone-smalltile-71-71.png",revision:"4c7f91bacfccd9780ab7b28d5f5425f0"},{url:"splash/windows/windowsphone-smalltile-99-99.png",revision:"664074d0506fb690f809cda2ab662ef5"},{url:"splash/windows/windowsphone-storelogo-120-120.png",revision:"479714b276d8037dbf838ea028e1755a"},{url:"splash/windows/windowsphone-storelogo-50-50.png",revision:"e1c2b2751b336418fe6df8413d2649d3"},{url:"splash/windows/windowsphone-storelogo-70-70.png",revision:"a57145bd9d79273ea5fac0c34d1430f4"},{url:"splash/windows10/SplashScreen.scale-100.png",revision:"ef38c4d1f7fb9719c70c8fe4215b0fb7"},{url:"splash/windows10/SplashScreen.scale-125.png",revision:"46e93da3b2897b13cea4e8a300e85e1e"},{url:"splash/windows10/SplashScreen.scale-150.png",revision:"cb6c3cd17673f5cdffe860044a643d98"},{url:"splash/windows10/SplashScreen.scale-200.png",revision:"6616acc5481a68e28412d5c3153ed5d4"},{url:"splash/windows10/SplashScreen.scale-400.png",revision:"198c0014c23e30c185aa918eda6db99b"},{url:"splash/windows10/Square150x150Logo.scale-100.png",revision:"309ade4573b61f2ce19801a68e16d5d2"},{url:"splash/windows10/Square150x150Logo.scale-125.png",revision:"4987691bb25f9555ea991342addd24c4"},{url:"splash/windows10/Square150x150Logo.scale-150.png",revision:"a8ecb5cd3bd0431a44947a90b372c3aa"},{url:"splash/windows10/Square150x150Logo.scale-200.png",revision:"090f73d94af2576b6bb05e29a8772308"},{url:"splash/windows10/Square150x150Logo.scale-400.png",revision:"cb2a50a59a90f3fd32d7705860eac976"},{url:"splash/windows10/Square310x310Logo.scale-100.png",revision:"dc55a20efd68ee9ce208381d8114be64"},{url:"splash/windows10/Square310x310Logo.scale-125.png",revision:"644bf84b5052bb96c24185094a2ec189"},{url:"splash/windows10/Square310x310Logo.scale-150.png",revision:"edf3095dfc50008145539c1930c4a448"},{url:"splash/windows10/Square310x310Logo.scale-200.png",revision:"5f28f982b7b4aa4161b7df4e7de79480"},{url:"splash/windows10/Square310x310Logo.scale-400.png",revision:"886df30a1a859c530f1d000ab00e6683"},{url:"splash/windows10/Square44x44Logo.scale-100.png",revision:"fadc5dc71874ca0063c64beab2bff16a"},{url:"splash/windows10/Square44x44Logo.scale-125.png",revision:"c2b29b12432e7eed08190c86e4e24c66"},{url:"splash/windows10/Square44x44Logo.scale-150.png",revision:"61180ee6d3c58976fad07e2e18edd3cc"},{url:"splash/windows10/Square44x44Logo.scale-200.png",revision:"792551b09df4741a13d46bba548ac509"},{url:"splash/windows10/Square44x44Logo.scale-400.png",revision:"fcef00ea95b64d18a7a71beeccd39202"},{url:"splash/windows10/Square44x44Logo.targetsize-16.png",revision:"b0fa90b5fb9a7c3279e19e6903cfc8bb"},{url:"splash/windows10/Square44x44Logo.targetsize-16_altform-unplated.png",revision:"b0fa90b5fb9a7c3279e19e6903cfc8bb"},{url:"splash/windows10/Square44x44Logo.targetsize-24.png",revision:"e5743a61998950b371243fbf912948f6"},{url:"splash/windows10/Square44x44Logo.targetsize-24_altform-unplated.png",revision:"e5743a61998950b371243fbf912948f6"},{url:"splash/windows10/Square44x44Logo.targetsize-256.png",revision:"c2371eabdefc71ba547758cdfe4c20b4"},{url:"splash/windows10/Square44x44Logo.targetsize-256_altform-unplated.png",revision:"c2371eabdefc71ba547758cdfe4c20b4"},{url:"splash/windows10/Square44x44Logo.targetsize-48.png",revision:"b5c40ba52e8d86831b891bd2b464f26a"},{url:"splash/windows10/Square44x44Logo.targetsize-48_altform-unplated.png",revision:"b5c40ba52e8d86831b891bd2b464f26a"},{url:"splash/windows10/Square71x71Logo.scale-100.png",revision:"4c7f91bacfccd9780ab7b28d5f5425f0"},{url:"splash/windows10/Square71x71Logo.scale-125.png",revision:"45a42daa644f9ff3f2c9836e8469c6bd"},{url:"splash/windows10/Square71x71Logo.scale-150.png",revision:"22afc3c312e0eb0a5197444e28ecf0d8"},{url:"splash/windows10/Square71x71Logo.scale-200.png",revision:"caa7e01560fd7856dc9fbcd00a54188d"},{url:"splash/windows10/Square71x71Logo.scale-400.png",revision:"77bdde28c70c535c08fa7fb2e74b845c"},{url:"splash/windows10/StoreLogo.png",revision:"e1c2b2751b336418fe6df8413d2649d3"},{url:"splash/windows10/StoreLogo.scale-100.png",revision:"e1c2b2751b336418fe6df8413d2649d3"},{url:"splash/windows10/StoreLogo.scale-125.png",revision:"9b98c01bdd6562051afcc798b8e45d5f"},{url:"splash/windows10/StoreLogo.scale-150.png",revision:"f3c4997307496f7911b6f9b7d53feaa8"},{url:"splash/windows10/StoreLogo.scale-200.png",revision:"524aed2e37d8d66928574e0cce1dcb60"},{url:"splash/windows10/StoreLogo.scale-400.png",revision:"7fcdf02ecbdfc3cd56fe46e804ece7fb"},{url:"splash/windows10/Wide310x150Logo.scale-100.png",revision:"4c77d69e5be0a0ea2a6a6ad59a315f7d"},{url:"splash/windows10/Wide310x150Logo.scale-125.png",revision:"86b031bf72b9f8cb51ba2036d0a2a041"},{url:"splash/windows10/Wide310x150Logo.scale-150.png",revision:"2dcccf47267a008d90ba7d0da350ef28"},{url:"splash/windows10/Wide310x150Logo.scale-200.png",revision:"ef38c4d1f7fb9719c70c8fe4215b0fb7"},{url:"splash/windows10/Wide310x150Logo.scale-400.png",revision:"6616acc5481a68e28412d5c3153ed5d4"}],{})}));
//# sourceMappingURL=service-worker.js.map
