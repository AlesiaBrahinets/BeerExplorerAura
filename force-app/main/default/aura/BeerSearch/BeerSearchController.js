({
	doSearch : function(component, event, helper) {
        let componentEvent = component.getEvent('BeerEvent');
        let searchParam = component.find('SearchingInput').get('v.value');
        //console.log('searchParam_In Search Comp=',searchParam );
        componentEvent.setParams({
            searchText: searchParam
        });
        componentEvent.fire();	
	}
})