({
    checkValue: function (cmp, event, helper) {console.log('checkValue');
        let valueParams = event.getParams();
        cmp.set("v.ifNeedToEnterAddress",!valueParams);
        let fields = event.getParam('field');
        
        console.log('CheckAddress_fields=',fields);
    },

	handleLoad: function (cmp, event, helper) {
       console.log('handleLoad');
        let record = event.getParam("recordUi");    
        console.log('handleLoad_recordUI=',record);   //fields   
    },
    
    handleSubmit : function (cmp, event, helper) {
        console.log('handleSubmit');
         event.preventDefault();       // stop the form from submitting
         var fields = event.getParam('fields');
        let beerId  =cmp.get('v.beerId');
        console.log('handleSubmit__beerId=',beerId);
        console.log('handleSubmit__BEFORE_fields=',fields);
        let quantity = cmp.get("v.remainingQuantityOfBeerKind");
        let newQuantity = quantity - fields["Ordered_Quantity__c"];
        if(newQuantity<0){
            let resultToast = $A.get('e.force:showToast');
        resultToast.setParams({
            "title": "We don't have so much beer! Remaining Quantity Of this Beer Kind is"+ quantity,
            "message": "Remaining Quantity Of this Beer Kind is"+ quantity,
            "type": "Warning"
        });
        resultToast.fire();
        } else {
            cmp.set("v.remainingQuantityOfBeerKind", newQuantity);
        console.log('quantity=',quantity);
        console.log('newQuantity=',newQuantity);
           fields["Beer_Kind__c"] = beerId;
           fields["Order_Amount__c"] = cmp.get("v.price").value * fields["Ordered_Quantity__c"];
           fields["Status__c"] = "New";

           if(fields["Billing_the_same_as_Shipping__c"]) {
            fields["Billing_Country__c"] = fields["Shipping_Country__c"];
            fields["Billing_Province__c"] = fields["Shipping_Province__c"];
            fields["Billing_City__c"] = fields["Shipping_City__c"];
            fields["Billing_Street__c"] = fields["Shipping_Street__c"];
            fields["Billing_CPostal_Code__c"] = fields["Shipping_Postal_Code__c"];
           }
     
        cmp.find('recordEditForm').submit(fields);
        console.log('FieldsForReset_1',cmp.find('field'));
        }
    },
    
    handleSuccess : function (cmp, event, helper) {
      console.log('handleSuccess'); 
      console.log('FieldsForReset_2=',cmp.find('field'));
        var updatedRecord =JSON.stringify(event.getParams());
        console.log('updatedRecord=',updatedRecord);
            var recordId = event.getParam('response').id;
         
        console.log('NewOrderRecordId=',recordId);
        cmp.set('v.orderId',recordId);
      
        let resultToast = $A.get('e.force:showToast');
        resultToast.setParams({
            "title": "Order placing",
            "message": "Your order has been successfully placed",
            "type": "Success"
        });
        resultToast.fire();
        cmp.find('field').forEach(function(f) {
            f.reset();
        });
        let cmpKind = cmp.find('recordViewer');
      
        cmpKind.submit({"Remaining_Quantity__c":cmp.get("v.remainingQuantityOfBeerKind")});
        console.log("FinishHandleSuccess");
       /* var navService = cmp.find("navService");        
        var pageReferenceN = {
            type: 'standard__component',         
            attributes: {              
                componentName: 'c__BeerOrderDetail'  
            },
            state: {
                'c__orderId': myRecordId, 
                'c__objectApiName': apiName
            }   
        
    };
        //component.set("v.orderId", myRecordId);
            
        //var pageReference = component.get("v.pageReference");
        navService.navigate(pageReferenceN); */
    },
      
    handleLoadBeer: function (cmp, event, helper) {
        console.log('handleLoadBeer');
        var record = event.getParam("recordUi");
        cmp.set("v.price", record.record.fields.Price__c);
        cmp.set("v.remainingQuantityOfBeerKind",record.record.fields.Remaining_Quantity__c.value);
        console.log('Price=',record.record.fields.Remaining_Quantity__c);
        console.log('Price=',record.record.fields.Price__c);
        console.log('FieldsBeer=',record.record.fields);
        cmp.set("v.recordBeerKind",record.record.fields); 
    },
    
    submitUpdating : function (cmp, event, helper) {console.log('submitUpdating');
    console.log('FieldsForReset_3=',cmp.find('field'));
        event.preventDefault(); 
        var fields = event.getParam('fields');
        console.log('submitUpdating_fields for BeerKind=',fields);
    },

handleBeerSuccess : function (cmp, event, helper) {
    console.log('FieldsForReset_4=',cmp.find('field'));
    console.log('handleBeerSuccess_Success');
    var navService = cmp.find("navService");        
        var pageReferenceN = {
            type: 'standard__component',         
            attributes: {              
                componentName: 'c__BeerOrderDetail'  
            },
            state: {
                'c__orderId': cmp.get('v.orderId'), 
                'c__objectApiName': 'Beer_Order__c'
            }   
    };
        navService.navigate(pageReferenceN);    
        console.log('FINISH_handleBeerSuccess');
},

     doInit: function(cmp, event, helper) {console.log('Init');
      let pageReference = cmp.get('v.pageReference');console.log('pageReference=',pageReference);
            if(pageReference) {console.log('pageReference In Init');
            let state = pageReference.state;
            cmp.set('v.beerId',state.c__beerId);
            console.log('beerId_Init_MakeOrder=',state.c__beerId);
                              }
    },
   
})