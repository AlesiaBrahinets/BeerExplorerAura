({
    doInit : function(component, event, helper) {
        let actions = [{
            label: 'Show Details',
            name: 'Show_details',
            iconName : 'action:preview'
            
        },                
        {
            label: 'Delete',
            name: 'delete',
            iconName : 'action:delete'
            
        }];
        
        component.set('v.columns', [
            
            {label: 'Account name', fieldName: 'Name', type: 'text'},
            {label: 'Industry', fieldName: 'Industry', type: 'text'},
            {label: 'Rating', fieldName: 'Rating', type: 'text'},
            {label: 'Phone', fieldName: 'Phone', type: 'text'},
            {type: "action", typeAttributes : {rowActions : actions}}
        ]);
        let action = component.get('c.fetchAccount');
        action.setCallback(this, function(response) {console.log('response=',response);
            let state = response.getState();console.log('state=',state);
            if(state === 'SUCCESS' || state === 'DRATF') {
                let responseValue = response.getReturnValue();
                component.set('v.data', responseValue);
                console.log('responseValue=',responseValue);
            }
        });
        $A.enqueueAction(action);

    },
    doSelectedRecord : function(component, event, helper) {
     	let selectedRows = event.getParam('selectedRows');
        console.log('selectedRows=', selectedRows);
        
    },
    
    handleRowActions : function(component, event, helper) {
        let action = event.getParam('action');
        let row = event.getParam('row');
        console.log('action=', action);
        console.log('row=',row);
        
    }
})