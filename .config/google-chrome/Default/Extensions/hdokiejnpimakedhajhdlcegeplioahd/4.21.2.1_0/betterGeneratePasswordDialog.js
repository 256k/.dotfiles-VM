var BetterGeneratePasswordDialog=function(e){VaultItemDialog.call(this,e,{additionalHeaderClasses:["icon","leftIcon"],dynamicHeight:!0,hideHeader:!1,responsive:!1,title:Strings.translateString("Generate"),confirmOnClose:!1,overlayDialog:!0,hideButtons:!0})};BetterGeneratePasswordDialog.prototype=Object.create(Dialog.prototype),BetterGeneratePasswordDialog.prototype.constructor=BetterGeneratePasswordDialog,BetterGeneratePasswordDialog.prototype.open=function(e){!0===(e=$.extend(e,{defaultData:{length:bg.Preferences.get("generate_length"),minimumLengthByPolicy:0,uppercase:bg.Preferences.get("generate_upper"),lowercase:bg.Preferences.get("generate_lower"),numeric:bg.Preferences.get("generate_digits"),special:bg.Preferences.get("generate_special"),avoidAmbiguous:bg.Preferences.get("generate_ambig"),pronounceable:bg.Preferences.get("generate_pronounceable"),allCombos:bg.Preferences.get("generate_allcombos")}})).defaultData.avoidAmbiguous&&!0===e.defaultData.pronounceable&&(e.defaultData.avoidAmbiguous=!1,e.defaultData.pronounceable=!1,e.defaultData.allCombos=!0),Dialog.prototype.open.call(this,e)},BetterGeneratePasswordDialog.prototype.configureEasyToSay=function(e){return this.inputFields.numeric.setValue(!e),this.inputFields.special.setValue(!e),e?(this.inputFields.numeric.disable(),this.inputFields.special.disable(),this.inputFields.pronounceable.setValue(!0),this.inputFields.avoidAmbiguous.setValue(!1),this.inputFields.allCombos.setValue(!1)):(this.inputFields.numeric.enable(),this.inputFields.special.enable()),!1},BetterGeneratePasswordDialog.prototype.configureEasyToRead=function(e){return e&&(this.inputFields.numeric.enable(),this.inputFields.special.enable(),this.inputFields.avoidAmbiguous.setValue(!0),this.inputFields.pronounceable.setValue(!1),this.inputFields.allCombos.setValue(!1)),!1},BetterGeneratePasswordDialog.prototype.configureAllCombos=function(e){return e&&(this.inputFields.numeric.enable(),this.inputFields.special.enable(),this.inputFields.uppercase.enable(),this.inputFields.lowercase.enable(),this.inputFields.numeric.setValue(!0),this.inputFields.special.setValue(!0),this.inputFields.uppercase.setValue(!0),this.inputFields.lowercase.setValue(!0),this.inputFields.avoidAmbiguous.setValue(!1),this.inputFields.pronounceable.setValue(!1),this.inputFields.allCombos.setValue(!0)),!1},BetterGeneratePasswordDialog.prototype.updateLength=function(e){return e=Math.max(e,this.data.defaultData.minimumLengthByPolicy).toString(),this.inputFields.length.getValue()!==e&&this.inputFields.length.setValue(e),this.inputFields.lengthInput.getValue()!==e&&this.inputFields.lengthInput.setValue(e),$("#sliderFill").width(e+"%"),!1},BetterGeneratePasswordDialog.prototype.updatePasswordLengthOptions=function(){var e=Math.max(4,this.data.defaultData.minimumLengthByPolicy);this.inputFields.length.input[0].min=e;var t=Math.max(this.data.defaultData.length,e);this.inputFields.length.setValue(t.toString()),this.inputFields.lengthInput.setValue(t.toString())},BetterGeneratePasswordDialog.prototype.initialize=function(){Dialog.prototype.initialize.apply(this,arguments),this.inputFields.password.getElement().LP_addPasswordMeter(null,null,!0),LPFeatures.allowClipboardCopy()||($("#copyPassword").LP_hide(),$("#fillPasswordButton").LP_hide(),$("#btnCopy").LP_hide()),function(e){e.inputFields.password.getElement().on("copy",function(){e.setCopiedGeneratedPassword(e.inputFields.password.getValue())}),$(".iconMoreInfo").hover(function(){$(this).children().fadeIn(200)},function(){$(this).children().fadeOut(100)}),$("#generateBtn").unbind("click"),$("#generateBtn").bind("click",function(){e.submit()}),$("#showHistory").bind("click",function(){e.toggleHistory(e.data.saveOptions.source)}),$("#clearHistory").bind("click",function(){$("#historyBody").empty(),$("#historyTable").hide(),$("#historyEmptyState").show(),bg.set("g_genpws",[]),bg.sendLpImprove("historycleared",{source:e.data.saveOptions.source})}),$("#length").bind("input",function(){e.setupComplete&&e.updateLength(e.inputFields.length.getValue())}),e.inputFields.lengthInput.onChange(function(){e.setupComplete&&e.updateLength(e.inputFields.lengthInput.getValue())});var t=function(){var t=e.inputFields.password.getValue();LPProxy.copyGeneratedPassword(t,e.data.saveOptions.source,e.data.tabURL,$("#generatedPasswordCount").val()),e.setCopiedGeneratedPassword(t),"function"==typeof e.data.onCopy&&e.data.onCopy(),e.close()};LPPlatform.addEventListener(document.getElementById("btnCopy"),"click",t),$("#fillPasswordButton").unbind("click"),e.data.saveOptions&&"icon"===e.data.saveOptions.source?$("#fillPasswordButton").bind("click",function(){e.usePassword()}):($("#fillPasswordButton").text(Strings.Vault.COPY_PASSWORD),$("#fillPasswordButton").bind("click",t)),e.inputFields.pronounceable.onChange(function(t){e.setupComplete&&e.configureEasyToSay(t)}),e.inputFields.avoidAmbiguous.onChange(function(t){e.setupComplete&&e.configureEasyToRead(t)}),e.inputFields.allCombos.onChange(function(t){e.setupComplete&&e.configureAllCombos(t)}),$("input[type='checkbox'],input[type='radio'],input[type='text'],input[type='range']").bind("change",function(){e.submit()}),e.updateButtonState(),$("#password").on("change input paste keyup click",function(t){e.updateButtonState()}),$("#length").on("change paste keyup click",function(t){e.updateButtonState()}),$("#lengthInput").on("change paste keyup click",function(t){e.updateButtonState()})}(this)},BetterGeneratePasswordDialog.prototype.updateButtonState=function(){$("#password").val().length>0?$("#fillPasswordButton").removeAttr("disabled"):$("#fillPasswordButton").attr("disabled","disabled")},BetterGeneratePasswordDialog.prototype.setCopiedGeneratedPassword=function(e){bg.LPTabState&&bg.LPTabState.setCopiedGeneratedPassword&&bg.LPTabState.setCopiedGeneratedPassword(e)},BetterGeneratePasswordDialog.prototype.saveState=function(){var e=this.getData();bg.Preferences.set({generate_length:e.length,generate_upper:e.uppercase,generate_lower:e.lowercase,generate_digits:e.numeric,generate_special:e.special,generate_ambig:e.avoidAmbiguous,generate_pronounceable:e.pronounceable,generate_allcombos:e.allCombos}),this.storePassword()},BetterGeneratePasswordDialog.prototype.close=function(){return this.saveState(),Dialog.prototype.close.apply(this,arguments)},BetterGeneratePasswordDialog.prototype.toggleHistory=function(e){var t=$("#historyView"),a=$("#showHistory"),s=$("#clearHistory"),i=$("#generatePasswordDialogDropdownAdvancedOptions");"none"===t.css("display")?(i.css("display","none"),t.css("display","block"),a.text("Hide History"),s.css("display","block"),bg.sendLpImprove("historyviewed",{source:e})):this.hideHistory(),this.setDynamicHeight()},BetterGeneratePasswordDialog.prototype.hideHistory=function(){var e=$("#historyView"),t=$("#showHistory"),a=$("#clearHistory"),s=$("#generatePasswordDialogDropdownAdvancedOptions");e.css("display","none"),s.css("display","block"),t.text("Show History"),a.css("display","none")},BetterGeneratePasswordDialog.prototype.setPasswordHistory=function(e){var t=$("#historyTable"),a=$("#historyBody"),s=$("#historyEmptyState"),i=this;if(0===e.length)t.hide(),s.show();else{a.empty(),t.show(),s.hide();var o="";e.forEach(function(e){(o=LPTools.createElement("tr")).appendChild(LPTools.createElement("td","",e)),o.appendChild(LPTools.createElement("td","",i.getReadableDate())),a.append(o)})}},BetterGeneratePasswordDialog.prototype.getReadableDate=function(){var e=new Date,t=("0"+e.getMinutes()).slice(-2),a=e.getHours(),s=e.getHours()<12?"AM":"PM";a=0===(a=a>12?a-12:a)?12:a;var i=e.getDate(),o=e.toLocaleString("en-us",{month:"long"})+" "+i+", "+e.getFullYear(),n=a+":"+t+" "+s;return Strings.translateString("%1 at %2",o,n)},BetterGeneratePasswordDialog.prototype.applySitePasswordLengthPolicy=function(){this.data.defaultData.minimumLengthByPolicy=0;var e=bg.get("g_prefoverrides").sitepwlen;if(e)if(e=JSON.parse(e),"function"==typeof bg.get_selected_tab_data_no_extension){var t=this;bg.get_selected_tab_data_no_extension(null,function(a){var s=bg.lp_gettld_url(a.url);if(e[s]){var i=e[s];t.data.defaultData.minimumLengthByPolicy=i,t.updatePasswordLengthOptions()}})}else t.data.defaultData.minimumLengthByPolicy=0,t.updatePasswordLengthOptions()},BetterGeneratePasswordDialog.prototype.setup=function(e,t){this.applySitePasswordLengthPolicy(),Dialog.prototype.setup.apply(this,arguments),this.updateLength(t.defaultData.length),t.defaultData.avoidAmbiguous?this.configureEasyToRead(!0):t.defaultData.pronounceable?this.configureEasyToSay(!0):this.configureAllCombos(!0),this.setPasswordHistory(bg.get("g_genpws")||[]),this.hideHistory()},BetterGeneratePasswordDialog.prototype.postSetup=function(e){Dialog.prototype.postSetup.apply(this,arguments),this.submit()},BetterGeneratePasswordDialog.prototype.storePassword=function(){var e=this.inputFields.password.getValue();if(e&&e.length>0){var t=bg.get("g_genpws")||[];t.unshift(e),t.length>20&&t.splice(20,t.length-20),bg.set("g_genpws",t),this.setPasswordHistory(t)}},BetterGeneratePasswordDialog.prototype.usePassword=function(){var e,t=this.inputFields.password.getValue();this.data.input?(this.data.input.val(t),this.close()):(bg.fillGeneratedPassword(this.data.tabID,this.data.tabURL,t,$.extend(this.data.saveOptions,{avoidAmbiguous:this.inputFields.avoidAmbiguous.getValue(),length:this.inputFields.length.getValue(),lowercase:this.inputFields.lowercase.getValue(),numeric:this.inputFields.numeric.getValue(),pronounceable:this.inputFields.pronounceable.getValue(),special:this.inputFields.special.getValue(),uppercase:this.inputFields.uppercase.getValue(),passwordType:(e=this.inputFields,!0===e.avoidAmbiguous.getValue()?"ambig":!0===e.pronounceable.getValue()?"pronounceable":"allchars"),generatedPasswordCount:$("#generatedPasswordCount").val()})),LPPlatform.closePopup(!0)),this.saveState()},BetterGeneratePasswordDialog.prototype.validate=function(e){var t=Dialog.prototype.validate.apply(this,arguments);return e.lengthInput<this.data.defaultData.minimumLengthByPolicy&&(t=!1),t},BetterGeneratePasswordDialog.prototype.handleSubmit=function(e){this.storePassword(),$("#generatedPasswordCount").val(function(){return parseInt($("#generatedPasswordCount").val())+1}),this.inputFields.password.setValue(bg.lpCreatePass(e.lengthInput,e.uppercase,e.lowercase,e.numeric,e.special,2,e.avoidAmbiguous,!0,e.pronounceable)),this.updateButtonState()};
//# sourceMappingURL=sourcemaps/betterGeneratePasswordDialog.js.map
