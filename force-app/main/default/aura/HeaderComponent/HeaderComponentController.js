({
	updateCart : function(component, event, helper) {console.log('updateCart_IN_HEADER_Component');
		let params = event.getParam('arguments');
        if(params ){
            let beerRecord = params.beerRecord;console.log('updateCart_IN_HEADER_Component_beerRecord=',beerRecord);
            let existingRecords = component.get('v.recordList');
            
             if(existingRecords.length > 0) {
                console.log('existingRecords_InHeaderComponent=',JSON.stringify(existingRecords));
                existingRecords.push(beerRecord);
                component.set('v.recordList',existingRecords);
            } else {
                console.log('existingRecords.length=0');
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
                                                     
        console.log('!!!!!!FiNISH_UPDATECART_METHOD_InHeaderComponent');
                                                     
	},

    doInit : function(component, event, helper) {
        let action = component.get('c.getCartOnlyId');
            action.setCallback(this, function(response){console.log('SUCCESS_HEADERCOMP_DO_INIT');
                let state = response.getState();
            	if(state === 'SUCCESS' || state === 'DRAFT'){
                let cartId = response.getReturnValue();
                console.log('createdCartId_InHeaderComponent= ',cartId);
                component.set('v.createdCartId',cartId);
                   
                } else{
                 console.log('Error_Getting_CartId_InHeaderComponent= ');   
                }
            });  
            $A.enqueueAction(action);
        let existingRecords = component.get('v.recordList');
       console.log('existingRecords_DO_INIT_InHeaderComponent',existingRecords);  
    }
})