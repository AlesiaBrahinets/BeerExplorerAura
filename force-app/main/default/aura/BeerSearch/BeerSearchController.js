({
	doSearch : function(component, event, helper) {
        let componentEvent = component.getEvent('BeerEvent');
        let searchParam = component.find('SearchingInput').get('v.value');
        componentEvent.setParams({
            searchText: searchParam
        });
        componentEvent.fire();	
	}
})