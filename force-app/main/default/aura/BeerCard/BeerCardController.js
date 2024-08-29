({
    showDetail : function(component, event, helper) {
        console.log('showDetail');
        let beerId = event.getSource().get('v.name');
        $A.createComponent(
            "c:BeerDetails",
            {
                "beerId" : beerId
            },
            function(beerDetails, status) {
                if(status === "SUCCESS") {console.log('STATUS in SUCCESS=',status);                              
                component.find('overLayLib').showCustomModal({
                       header: "Beer Details",
                       body: beerDetails,
                       showCloseButton: true,
                       closeCallback: function() {
                           console.log('You closed the alert!');
                           component.find("overlayLib").notifyClose();
                       }
                   });
            } else if (status === "INCOMPLETE") {console.log('STATUS in INCOMPLETE=',status);
                console.log("No response from server or client is offline.")
            } else {
                console.log('STATUS in ERROR=',status);   
            }
        })
	},
    
    addToCart : function(component, event, helper) {
        console.log('addToCart in CardComp');
        let addToCartEvent = component.getEvent('addToCart');
        addToCartEvent.setParams({
            beerRecord: component.get('v.beerKind')
        });
        addToCartEvent.fire();
    }
})