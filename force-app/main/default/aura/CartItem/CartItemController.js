({
    deleteCartItem : function(component, event, helper) {
		let cartItemId = event.currentTarget.id;       
        let action = component.get('c.deleteItem');
        action.setParams({
            "cartItemId" : cartItemId
        });
        action.setCallback(this, function(response){
            let state = response.getState();
            if(state === 'SUCCESS'){
                $A.get('e.force:refreshView').fire(); 
            }else{
               console.log('Error IN CartItem Methos Delete') ;
            }
        });
        $A.enqueueAction(action);
	},
    
    handleChangeValue: function(component, event, helper) {
        let textvalue = component.get("v.cartItem.Item_Quantity__c");
        let action = component.get('c.changeQuantityInCartItem');
        action.setParams({
            "cartItemId" : component.get("v.cartItem.Id"), 
            "quantity" : textvalue 
        });                                                                                                 
        action.setCallback(this, function(response){
            let state = response.getState();

            if(state === 'SUCCESS'){
                console.log('state=',state);
                let changeBeerQuantity = component.getEvent('changeBeerQuantity');
                changeBeerQuantity.setParams({
                    quantity: textvalue
                });
                changeBeerQuantity.fire();
            } else {
               console.log('Error IN CartItem Methos Delete') ;
            }
        });
        $A.enqueueAction(action);                                                                                                      
    }
})