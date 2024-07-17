({
    makeOrder : function(component, event, helper) {
    	//console.log("make orderR_InBeerDetail");
     //   console.log('beerId=',component.get('v.beerId'));
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
        //console.log('makeOrder_PageReferenceN=', pageReferenceN);
        navService.navigate(pageReferenceN);		
        //component.set("v.isOpenView", false);		
	}
    
   
})