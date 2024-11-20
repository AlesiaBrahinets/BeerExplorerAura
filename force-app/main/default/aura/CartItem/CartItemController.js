({
    deleteCartItem : function(component, event, helper) {
		let cartItemId = event.currentTarget.id;       
        let action = component.get('c.deleteItem');
        action.setParams({
            "cartItemId" : cartItemId
        });
        action.setCallback(this, function(response){
            let state = response.getState();
            if(state === 'SUCCESS'){console.log('Refresh cart');
                $A.get('e.force:refreshView').fire(); 
            }else{
               console.log('Error IN CartItem Methos Delete') ;
            }
        });
        $A.enqueueAction(action);
	},
    
    handleChangeValue: function(component, event, helper) {console.log('!!!!!!!!textvalue_handleChangeValue');
        let textvalue = component.get("v.cartItem.Item_Quantity__c");
        console.log('textvalue_handleChangeValue=',textvalue);
        let action = component.get('c.changeQuantityInCartItem');
        action.setParams({
            "cartItemId" : component.get("v.cartItem.Id"), 
            "quantity" : textvalue 
        });                                                  
                                                           
        action.setCallback(this, function(response){
            let state = response.getState();
            if(state === 'SUCCESS'){console.log('Refresh cart');
               
                console.log('state=',state);
          let changeBeerQuantity = component.getEvent('changeBeerQuantity');
        changeBeerQuantity.setParams({
            quantity: textvalue
        });
        changeBeerQuantity.fire();
            }else{
               console.log('Error IN CartItem Methos Delete') ;
            }
        });
        $A.enqueueAction(action);                                                  
                                                           
    }
})