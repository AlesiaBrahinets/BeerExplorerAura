({
	callAuraMethodServerTrip : function(component, event, helper) {
		var childCmp = component.find("child");
        childCmp.retrieveAccounts(function(result){
            console.log('callback for aura:method was executed');
            console.log('result=',result);
            alert(result);
            component.set("v.accountRecords",result);
            alert(component.get("v.accountRecords"));
        });
	}
})