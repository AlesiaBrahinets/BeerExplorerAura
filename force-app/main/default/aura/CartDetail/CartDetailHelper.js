({
   fetchAddress : function(component, event, helper){console.log('fetchAddress_In Helper');
        let action = component.get('c.fetchAddressBook');
        
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log('state=',state);
            if(state === 'SUCCESS' || state === 'DRAFT'){
                var responseData = response.getReturnValue();
                let listAddress = [];
for (let i=0; i<responseData.length; i++) {
    let address = responseData[i].Country__c +" "+responseData[i].State__c +" "+responseData[i].City__c +" "+responseData[i].Street__c ;
    console.log('address '+[i]+"= ", address);
    console.log('Id ', responseData[i].Id);

    listAddress.push({'label':address, 'value':responseData[i].Id});
}
                component.set('v.addressList' , listAddress);
               
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