({
    validate : function(component, event, helper) {console.log('ValidateAddress');
        var isValid = component.find('address').reduce(function (validSoFar, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();
            inputCmp.set('v.validity', {valid:false, badInput :true});
            return validSoFar && inputCmp.get('v.validity').valid;
        }, true);
        console.log('ValidateAddress_isValid=',isValid);
        return isValid; 
	},
    fetchAddress : function(component, event, helper){console.log('fetchAddress_In Helper');
        var action = component.get('c.fetchAddressBook');
        
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log('state=',state);
            if(state === 'SUCCESS' || state === 'DRAFT'){console.log('stateSUCCESS=',state);
                var responseData = response.getReturnValue();console.log('resultData_IN FETCHmethodNOTParse=', responseData);
                //var resultData = JSON.parse(responseData);
                //console.log('resultData_IN FETCHmethod', resultData);
                console.log('resultData_IN FETCHmethodNOTParse=', response.getReturnValue());
                let listAddress = [];
for (let i=0; i<responseData.length; i++) {
    let address = responseData[i].Country__c +" "+responseData[i].State__c +" "+responseData[i].City__c +" "+responseData[i].Street__c ;
    console.log('address '+[i]+"= ", address);
    console.log('Id ', responseData[i].Id);

    listAddress.push({'label':address, 'value':responseData[i].Id});
}
                component.set('v.addressList' , listAddress);
                console.log('AddresListInFetch=',JSON.stringify(component.get('v.addressList')));
            } else if(state === 'INCOMPLETE'){
                console.log('User is offline and System does not support offline!.');
            }else if(state === 'ERROR'){
                var errors = response.getError();
                console.log('Error Occured ', errors);
            }else{
                
            }
        });
        action.setStorable();
        $A.enqueueAction(action);
    }
})
