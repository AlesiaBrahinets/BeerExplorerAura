({
    init : function(cmp, event, helper) {
        var navService = cmp.find("navService");
        var pageRef = {
            type: "standard__objectPage",
            attributes: {
                objectApiName: "Account",
                actionName: "new"
            },
            state: {
            }
        }
        // Replace with your own field values
        var defaultFieldValues = {
            Name: "Burlington Textiles Corp of America",
            OwnerId: "001Qy00000DAr6KIAT",
            AccountNumber: "CD656092"
            
        };
        pageRef.state.defaultFieldValues = cmp.find("pageRefUtils").encodeDefaultFieldValues(defaultFieldValues);
        cmp.set("v.pageReference", pageRef);
        var defaultUrl = "#";

        // Generate a Link for the Aura Link example
        navService.generateUrl(pageRef)
        .then($A.getCallback(function(url) {
            cmp.set("v.url", url ? url : defaultUrl);
        }), $A.getCallback(function(error) {
            cmp.set("v.url", defaultUrl);
        }));
    },
    
    // Navigate to the record create page for the Aura PageRef example
    handleClick : function(cmp, event, helper) {
        var navService = cmp.find("navService");
        var pageRef = cmp.get("v.pageReference");
        event.preventDefault();
        navService.navigate(pageRef);
    }
})