({
	doInit : function(component, event, helper) {
        console.log("fromInit_BeerListComponent_recordList=",component.get("v.recordList"));
	},
    catchEvent : function(component, event, helper) {
        console.log("catchEventInListComponent");
    }
    
})