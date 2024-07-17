({
    showDetailIf : function(component, event, helper) {console.log('showDetail');
    let beerId = event.getSource().get('v.name');
  //  console.log('beer.Id_CardComp_1=', beerId);
    component.set("v.isOpenView", true);
                                                    },
    
showDetail : function(component, event, helper) {console.log('showDetail');
    let beerId = event.getSource().get('v.name');
  //  console.log('beer.Id_CardComp=', beerId);
    //component.set("v.isOpenView", true);
    
    $A.createComponent(
        "c:BeerDetails",
        {
            "beerId" : beerId
        },
        function(beerDetails, status) {
            if(status === "SUCCESS") {console.log('STATUS in SUCCESS=',status);
            //console.log('STATUS in SUCCESS_beerDetails=',beerDetails);
                                  
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
            } else {console.log('STATUS in ERROR=',status);
                
            }
        })
	},
    
    closeView : function(component, event, helper) {
   // console.log("Close View");
    component.set("v.isOpenView", false);		
	},
    
   /* makeOrder : function(component, event, helper) {
    	console.log("make orderR_InBeerDetail");
        component.set("v.isOpenView", false);
        let navService = component.find("navigation");
        let pageReferenceN = {
            type: 'standard__component',
            attributes: {
                componentName: 'c__MakeOrder'
            }, 
            state: {
                myAttr: "attrValue"
            }
        };
        navService.navigate(pageReferenceN);	
       
       		
	},*/
    
    addToCart : function(component, event, helper) {console.log('addToCart in CardComp');
        let eventSource = event.getSource();
        let beerId = eventSource.get('v.name');
        let beerName = eventSource.get('v.value');
        let addToCartEvent = component.getEvent('addToCart');
       
        addToCartEvent.setParams({
            beerRecord: component.get('v.beerKind')
        });
        addToCartEvent.fire();
    }
})