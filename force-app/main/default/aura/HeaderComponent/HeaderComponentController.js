({
    doInit: function (component, event, helper) {
        let action = component.get('c.createCart');
        action.setCallback(this, function (response) {
            let state = response.getState();

            if (state === 'SUCCESS' || state === 'DRAFT') {
                let cartId = response.getReturnValue();
                component.set('v.createdCartId', cartId);
            } else {
                console.log('Error_Getting_CartId_InHeaderComponent= ');
            }
        });
        $A.enqueueAction(action);
    },

	updateCart : function(component, event, helper) {
		let params = event.getParam('arguments');

        if(params ) {
            let beerRecord = params.beerRecord;
            let existingRecords = component.get('v.recordList');
            
             if(existingRecords.length > 0) {
                existingRecords.push(beerRecord);
                component.set('v.recordList',existingRecords);
            } else {
                existingRecords = [];
                existingRecords.push(beerRecord);
                component.set('v.recordList',existingRecords);
            }
            let toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title":"Success!",
                "message": beerRecord.Name + " has been added to the Cart",
                "type":"success",
            });
            toastEvent.fire();
        }                                                
	}

})