({
    doInit: function (componet, event, helper) {
        let pageReference = componet.get('v.pageReference'); 
        if (pageReference) {
            let state = pageReference.state;
            componet.set('v.beerId', state.c__beerId);
        }
    },

    checkValue: function (componet, event, helper) {
        let valueParams = event.getParams();
        componet.set("v.ifNeedToEnterAddress",!valueParams);
    },

	handleLoad: function (componet, event, helper) {
        let record = event.getParam("recordUi");    
        console.log('handleLoad_recordUI=',record); 
    },
    
    handleSubmit : function (componet, event, helper) {
        event.preventDefault();       
        let fields = event.getParam('fields');
        let beerId  =componet.get('v.beerId');
        let quantity = componet.get("v.remainingQuantityOfBeerKind");
        let newQuantity = quantity - fields["Ordered_Quantity__c"];

        if(newQuantity < 0) {
            let resultToast = $A.get('e.force:showToast');
            resultToast.setParams({
                "title": "We don't have so much beer! Remaining Quantity Of this Beer Kind is"+ quantity,
                "message": "Remaining Quantity Of this Beer Kind is"+ quantity,
                "type": "Warning"
            });
            resultToast.fire();
        } else {
            componet.set("v.remainingQuantityOfBeerKind", newQuantity);
            fields["Beer_Kind__c"] = beerId;
            fields["Order_Amount__c"] = componet.get("v.price").value * fields["Ordered_Quantity__c"];
            fields["Status__c"] = "New";

            if(fields["Billing_the_same_as_Shipping__c"]) {
                fields["Billing_Country__c"] = fields["Shipping_Country__c"];
                fields["Billing_Province__c"] = fields["Shipping_Province__c"];
                fields["Billing_City__c"] = fields["Shipping_City__c"];
                fields["Billing_Street__c"] = fields["Shipping_Street__c"];
                fields["Billing_CPostal_Code__c"] = fields["Shipping_Postal_Code__c"];
            }   
            componet.find('recordEditForm').submit(fields);
        }
    },
    
    handleSuccess : function (componet, event, helper) {
        let recordId = event.getParam('response').id;
        componet.set('v.orderId',recordId);
        let resultToast = $A.get('e.force:showToast');
        resultToast.setParams({
            "title": "Order placing",
            "message": "Your order has been successfully placed",
            "type": "Success"
        });
        resultToast.fire();
        componet.find('field').forEach(function(f) {
            f.reset();
        });
        let componetKind = componet.find('recordViewer');
        componetKind.submit({"Remaining_Quantity__c":componet.get("v.remainingQuantityOfBeerKind")});
    },
      
    handleLoadBeer: function (componet, event, helper) {
        let record = event.getParam("recordUi");
        componet.set("v.price", record.record.fields.Price__c);
        componet.set("v.remainingQuantityOfBeerKind",record.record.fields.Remaining_Quantity__c.value);
        componet.set("v.recordBeerKind",record.record.fields); 
    },
    
    submitUpdating : function (componet, event, helper) {
        event.preventDefault(); 
        let fields = event.getParam('fields');
        console.log('submitUpdating_fields for BeerKind=',fields);
    },

    handleBeerSuccess : function (componet, event, helper) {
        let navService = componet.find("navService");        
        let pageReferenceN = {
            type: 'standard__component',         
            attributes: {              
                componentName: 'c__BeerOrderDetail'  
            },
            state: {
                'c__orderId': componet.get('v.orderId'), 
                'c__objectApiName': 'Beer_Order__c'
            }   
        };
        navService.navigate(pageReferenceN);    
    }
})