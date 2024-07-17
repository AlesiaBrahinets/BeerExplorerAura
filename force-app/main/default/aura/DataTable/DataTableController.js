({
    doInit : function(component, event, helper) {
        cmp.set('v.columns', [
            
            {label: 'Account name', fieldName: 'Name', type: 'text'},
            {label: 'Industry', fieldName: 'Industry', type: 'text'},
            {label: 'Rating', fieldName: 'Rating', type: 'text'},
            {label: 'Phone', fieldName: 'Phone', type: 'phone'}
        ]);
        let action = component.get('c.fetchAccount');
        action.setCallback(this, function(response) {
            let state = response.getState();
            if(state === 'SUCCESS' || state === 'DRATF') {
                let responseValue = response.getReturnValue();
                component.set('v.data', responseValue);
            }
        });
        $A.enqueueAction(action);

    }
})
