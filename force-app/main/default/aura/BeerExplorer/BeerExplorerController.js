({
	handleCompEvent : function(component, event, helper) {
        console.log('Init Beer Explorer');
        let searchParam = event.getParam('searchText');
       
        let action = component.get('c.searchBeer');
        action.setParams({
            searchParam: searchParam
        });
        action.setCallback(this, function(response){
            let state = response.getState();
            if(state==="SUCCESS") {
                let returnValue = response.getReturnValue();
                component.set("v.beerList", returnValue);
            } else {
                console.log('Error=', response.getError());
            }
        });
        $A.enqueueAction(action);
    },
    updateCart : function(component, event, helper) {
        
        let params = event.getParam('beerRecord');
       // component.set('v.beerRecord',beerRecord);
       let headerComp = component.find('headerComp');
        headerComp.updateCart(params);
    }
})