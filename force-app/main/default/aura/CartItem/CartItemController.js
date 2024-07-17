({
    deleteCartItem : function(component, event, helper) {
		let cartItemId = event.currentTarget.id;
        console.log('cartItemId_IN CartItem Methos Delete=',cartItemId);
        //let itemId = alert(cartItemId);
        let action = component.get('c.deleteItem');
        action.setParams({
            "cartItemId" : cartItemId
        });
        action.setCallback(this, function(response){
            let state = response.getState();
            //alert(state);
            if(state === 'SUCCESS'){console.log('Refresh cart');
                $A.get('e.force:refreshView').fire(); 
            }else{
               console.log('Error IN CartItem Methos Delete') ;
            }
        });
        $A.enqueueAction(action);
	}
})
