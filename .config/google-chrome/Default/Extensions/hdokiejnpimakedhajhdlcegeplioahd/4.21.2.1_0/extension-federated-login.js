var FederatedLogin=new function(){var e=this,t={};FederatedLoginService.call(e),e._ajax=function(e){"undefined"!=typeof base_url&&0!==e.url.indexOf("http")&&(e.url=base_url+e.url),LPServer.ajax(e)},e.login=function(t){t=fix_username(t),e.getPassword(t,function(e,a){LP_do_login(t,e,void 0,void 0,void 0,void 0,void 0,void 0,void 0,a)})};var a=function(t,a){if(t.keypair){var n=(new DOMParser).parseFromString(atob(a),"application/xml").querySelector('Attribute[Name="LastPassKeyPart"]').childNodes[0].textContent;t.valid=!!e._decryptK1WithPrivateKey(atob(n),t.keypair.privateKey)}},n=function(e){try{if(e&&e.formData&&e.formData.SAMLResponse&&1===e.formData.SAMLResponse.length)return e.formData.SAMLResponse[0];if(e&&e.raw){var t=e.raw.reduce(function(e,t){return e+String.fromCharCode.apply(null,new Uint8Array(t.bytes))},"");if(t.length>0){var a=(n={},t.split("&").forEach(function(e){var t=e.split("=");2===t.length&&(n[t[0]]=decodeURIComponent(t[1]))}),n);if(a.SAMLResponse)return a.SAMLResponse}}}catch(e){console.log(e)}var n;return null};e.getPassword=function(r,i,o){r=fix_username(r),LPPlatform.getCurrentTabDetails(function(l){e._initiate(r,function(d,s){LPPlatform.openTab({extension:!0,url:d.IdentityProviderURL+"/auth/saml2/"+d.IdentityProviderGUID,loadHandler:function(f){var u={valid:!1,idp:d,keypair:s};u.cleanup=LPPlatform.onBeforeNavigate(function(t,c){var v=/\/auth\/saml2\/success\/(.*)$/.exec(t);if(v&&2===v.length)return u.valid||!s?e._getAuthInfo(r,v[1],function(t){e._assemblePassword(r,s,t,function(e){i(e,t.authSessionId)},o)},o):e._handleError(o,new Error("K1 not valid!")),LPPlatform.closeTab(f.tabDetails),LPPlatform.activateTab(l),!1;if(s&&!u.valid&&0===t.indexOf(d.IdentityProviderURL)){var p=n(c);if(p)return a(u,p),u.valid}},f.tabDetails),t[f.tabDetails.tabID]=u}})})})},e.validateK1Encryption=function(e,n,r){var i=!0,o=t[r.tabID];o&&o.keypair&&(a(o,e),i=o.valid),n&&n(i)},LPPlatform.onTabClosed(function(e){t[e]&&(t[e].cleanup(),delete t[e])})};
//# sourceMappingURL=sourcemaps/extension-federated-login.js.map
