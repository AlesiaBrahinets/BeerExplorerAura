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
            if(existingRecords) {
                console.log('IF existingRecords=',existingRecords);
                existingRecords.push(beerRecord);
                component.set('v.recordList',existingRecords);
            } else {
                existingRecords = [];
                existingRecords.push(beerRecord);
                component.set('v.recordList',existingRecords);
            }
                    console.log('v.recordList=',component.get('v.recordList'));
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