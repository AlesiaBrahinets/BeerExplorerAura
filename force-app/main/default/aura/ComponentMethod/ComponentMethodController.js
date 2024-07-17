({
	retrieveAccounts : function(component, event, helper) {
        var params = event.getParam('arguments');
        var actcallback;
        if(params) {
            actcallback = params.callback;
        }
        var action = component.get("c.getAccounts");
        action.setCallback(this, function(responce){
            var records = responce.getReturnValue();
            actcallback(records);
        });
        $A.enqueueAction(action);
		
	}
})