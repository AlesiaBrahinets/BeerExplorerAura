({
    makeOrder : function(component, event, helper) {
        let navService = component.find("navigation");
        let pageReferenceN = {
            type: 'standard__component',
            attributes: {
                componentName: 'c__MakeOrder'
            }, 
            state: {
                'c__beerId': component.get('v.beerId')
            }
        };
        navService.navigate(pageReferenceN);				
	} 
})