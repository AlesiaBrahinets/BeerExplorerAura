({
	doInit : function(component, event, helper) {
        let pageReference = component.get('v.pageReference');
        
        if(pageReference) {                           //console.log('pageReference In Init');
            let state = pageReference.state;
            component.set('v.orderId',state.c__orderId);
            component.set('v.objectApiName',state.c__objectApiName);                                 
        }
	}
})