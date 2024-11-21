({
    doInit : function(component, event, helper) {
        let getCartIdFromHeaderComp = component.get('v.cartId');

        if(getCartIdFromHeaderComp == null) {
        	let action = component.get('c.getIdAndQuantity');
            action.setCallback(this, function(response){
                let state = response.getState();
                
            	if(state === 'SUCCESS' || state === 'DRAFT') {
                	let cartMap = response.getReturnValue();
                    for(let key in cartMap){
                        component.set('v.cartId', key);
        				component.set('v.itemsQuantity', cartMap[key]);
                    }
                } else {
                 console.log('Error_Getting_CartId_InHeaderComponent= ');   
                }
            });  
            $A.enqueueAction(action);                                         
        }                          
}, 
    
    goToCart : function(component, event, helper) { 
        $A.get('e.force:refreshView').fire();
        let cartIdForGoing = component.get('v.cartId');
       
        if(cartIdForGoing == null) {
            let action = component.get('c.createCart');
            action.setCallback(this, function(response) {
                let state = response.getState();
                
            	if(state === 'SUCCESS' || state === 'DRAFT') {
                    cartIdForGoing = response.getReturnValue();
                    component.set('v.cartId',cartIdForGoing);   
                } else {
                 console.log('Error_Getting_CartId_InHeaderComponent= ');   
                }
            });  
            $A.enqueueAction(action);
        } 
        let pageReference = component.find("navigation");   
        let pageReferenceNav = {
                type: "standard__navItemPage",
                attributes : {
                    apiName: "Cart_Detail"
                },
                state: {
                        "c__cartId": cartIdForGoing  
                }
            };
        event.preventDefault();
        pageReference.navigate(pageReferenceNav, true);
    },
   
    createNewCartItems : function(component, event, helper) {
        let names = [];
        let ln = component.get('v.recordList').length - 1;
        names.push(component.get('v.recordList')[ln].Id);
        component.set('v.beerNameList', names);
        let getCartIdFromHeaderComp = component.get('v.cartId');     
        let action = component.get('c.createNewCartItems');
        action.setParams({
            'beerList' : component.get('v.beerNameList'),
            'cartId': getCartIdFromHeaderComp
        });
        action.setCallback(this, function(response){
            let state = response.getState();
            if(state === 'SUCCESS' || state === 'DRAFT') {
                let quantity = component.get('v.itemsQuantity');
                quantity += 1;
                component.set('v.itemsQuantity', quantity);                                                                     
            } else if(state === 'INCOMPLETE') {
                console.log('User is offline System does not support offline');
            } else if(state ==='ERROR') {
                let errors = response.getError();
                if(errors || errors[0].pageMessage){
                    console.log(' page Error In Cart Info', errors[0].pageMessage);
                }
            } else {
              console.log('Unknown Error');  
            }
        });
        $A.enqueueAction(action);    
    }
})