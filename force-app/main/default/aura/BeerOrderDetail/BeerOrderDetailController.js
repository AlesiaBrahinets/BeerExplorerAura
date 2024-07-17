({
	doInit : function(component, event, helper) {
		console.log('doInitinOrderDetail');
        let pageReference = component.get('v.pageReference');
        //console.log('pageReference=',pageReference);
                                         if(pageReference) {
                                            //console.log('pageReference In Init');
                                               let state = pageReference.state;
                                               component.set('v.orderId',state.c__orderId);
                                               component.set('v.objectApiName',state.c__objectApiName);
                                               
                                           }
	}
})