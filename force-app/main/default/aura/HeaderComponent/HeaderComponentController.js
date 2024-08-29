({
	updateCart : function(component, event, helper) {
        //console.log('updateCart In Header Component');
		let params = event.getParam('arguments');
        //console.log('updateCart In Header Component params=',params);
        if(params ){
            //console.log('IF_updateCart In Header Component');
            let beerRecord = params.beerRecord;
            //console.log('updateCart In Header Component beerRecord=',beerRecord);
            let existingRecords = component.get('v.recordList');
            console.log('existingRecords_InHeaderComponent=',existingRecords);
            if(existingRecords.length > 0) {console.log('existingRecords_IF=');
            console.log('existingRecords_InIF_BEFOREEEEEE=',existingRecords);
                existingRecords.push(beerRecord);
                console.log('existingRecords_InIF_AFTER=',existingRecords);
                component.set('v.recordList',existingRecords);
            } else {
                console.log('existingRecords_ElSeeeeeeee=',existingRecords);
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
                    console.log('v.recordListAfter Adding Beer to cart=',JSON.stringify(component.get('v.recordList')));
        }
	},

    doInit : function(component, event, helper) {
        let existingRecords = component.get('v.recordList');
       console.log('doInit in Header COmp recordList=',existingRecords);  
    }
})