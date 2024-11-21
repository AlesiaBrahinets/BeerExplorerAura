({
    doInit : function(component, event, helper) {
        helper.fetchAddress(component, event, helper);
        component.set('v.isNewAddress',false);
        let pageReference = component.get('v.pageReference');
        
        if(pageReference) {
            let state = pageReference.state;

            if(state.c__cartId){
                component.set('v.cartId',state.c__cartId );
                let action = component.get('c.getCartItems');
                action.setParams({
                    'cartId' : state.c__cartId
                });
                action.setCallback(this, function(response){
                    let stateResponse = response.getState();
                    if(stateResponse === 'SUCCESS' || stateResponse === 'DRAFT'){
                        let resultData = response.getReturnValue();
                        let items = [];
                        let subTotal;
                        for(let key in resultData){
                            items.push(resultData[key]);
                            
                            if(subTotal){
                                subTotal = subTotal + resultData[key].Total_Amount__c;  
                            } else {
                                subTotal = resultData[key].Total_Amount__c;    
                            }
                        }
                        component.set('v.subTotal', subTotal);
                        component.set('v.cartItemList', items); 
                    } else if(stateResponse === 'INCOMPLETE') {
                        console.log('User is offline System does not support offline');
                    } else if(stateResponse ==='ERROR') {
                        let errors = response.getError();
                        if(errors || errors[0].pageMessage) {
                            console.log(' page Error In Cart Detail ', errors[0].pageMessage);
                        }
                        if(errors || errors[0].duplicateResults) {
                            console.log(' duplicate Error In Cart Detail ', errors[0].duplicateResults);
                        }
                    } else{  
                        console.log('ERROR_CartDdetail');
                    }
                });
                $A.enqueueAction(action);
            }
        }
    },
    
    
    homePage : function(component, event, helper) {component.set('v.cartId', null);
        let pageReference = component.find("navigation");
        let pageReferenceNav = {
            type: "standard__navItemPage",
            attributes : {
                apiName: "Beer_Explorer"
            }
        };
        $A.get('e.force:refreshView').fire();
        pageReference.navigate(pageReferenceNav, true);
    },
    
    applyCoupon : function(component, event, helper){
        component.set('v.isCouponAplied', true);
    },
    
    doApplyCoupon : function(component, event, helper){
        let CouponNo = component.find('CouponNo').get('v.value');
        let cartId = component.get('v.cartId');

        if(CouponNo) {
            let action = component.get('c.checkCoupon');
            action.setParams({
                'name' : CouponNo,
                'cartId' : cartId
            });
            action.setCallback(this, function(response){
                let state = response.getState();
                
                if(state === 'SUCCESS' || state ==='DRAFT') {
                    let resultData = response.getReturnValue();

                    if(resultData) {
                        component.set('v.discountAmount', resultData);
                        component.set('v.errorDiscount',null);
                        component.set('v.isCouponSuccess', true);
                    } else {
                        component.set('v.errorDiscount','Coupon is not Valid OR Expired.');
                        component.set('v.discountAmount',null);
                         component.set('v.isCouponSuccess', false);
                    }
                }
            });
            $A.enqueueAction(action);
        }else{
            alert('Please Enter your Coupon No');
        }
    },
    
    doCheckout : function(component, event, helper){
        component.set('v.isCheckout', true);
    },
    
    doSaveAddress : function(component, event, helper){
         let userId = $A.get("$SObjectType.CurrentUser.Id");
         event.preventDefault();     
         let fields = event.getParam('fields');
         fields["User__c"] = userId;
         component.set('v.addressBook',fields); 
         component.find('recordCreator').submit(fields);
    },
    
    handleSuccess : function(component, event, helper){
        let recordId = event.getParam('response').id;
        let showToast = $A.get('e.force:showToast');
        showToast.setParams({
            "title" : "Record Saved",
            "type" : "success",
            "message" : "AddressBook Has been Save with the Record Id "+recordId
        });
        showToast.fire();

        let addList = [];
        let addrList = component.get('v.addressList');

        if(addrList) {
            let address = component.get('v.addressBook');
            address['Id']=recordId;
            component.set('v.addressBook' , address);
            let label = address['Country__c']+" "+ address['State__c'] + " "+ address['City__c']+ " "+ address['Street__c'];
            addrList.push({'label': label, 'value':recordId});
            component.set('v.addressList' , addrList);
        } else {
            let address = component.get('v.addressBook');
            address['Id']=recordId;
            component.set('v.addressBook' , address);
            let label = address['Country__c']+" "+ address['State__c'] + " "+ address['City__c']+ " "+ address['Street__c'];
            addList.push({'label': label, 'value':recordId});
            component.set('v.addressList' , addList); 
        }
        component.set('v.isNewAddress', false);
    },

    getAddress : function(component, event, helper){
        let isTrue = component.get('v.isCheckout');
        if(isTrue){
            console.log('AddresListInGetAddress=',component.get('v.addressList'));
        }
    },
    
    onSelect : function(component, event, helper){
        let selected = event.getParam("value");
        component.set('v.selectedAddress', selected);
    },
    
  

    placeOrder : function(component, event, helper){
        let selectedAdd = component.get('v.selectedAddress');
        if(selectedAdd) {
            let userId = $A.get("$SObjectType.CurrentUser.Id");
            let action = component.get('c.createOrder');
            action.setParams({
                "addressId" : selectedAdd,
                "cartId" : component.get('v.cartId'),
                "userId" : userId,
                "subtotal" : component.get('v.subTotal')
            });
            action.setCallback(this, function(response){
                let state = response.getState();
                if(state === 'SUCCESS' || state === 'DRAFT'){
                    let showToast = $A.get('e.force:showToast');
                    let resultData = response.getReturnValue();
                    showToast.setParams({
                        "title" : "Record Saved",
                        "type" : "success",
                        "message" : "Your Order Has been Successfully Placed." +
                        "Your tracking Order no is "
                    });
                    showToast.fire();
                    
                    let pageReference = component.find("navigation");
                    let pageReferenceNav = {    
                        "type": "standard__recordPage",
                        "attributes": {
                            "recordId": resultData.Id,
                            "objectApiName": "Group_Beer_Order__c",
                            "actionName": "view"   
                        }
                    };
                    $A.get('e.force:refreshView').fire();
                    pageReference.navigate(pageReferenceNav, true);
                } else if(state === 'INCOMPLETE'){
                    console.log('User is offline and System does not support offline!.');
                }else if(state === 'ERROR'){
                    let errors = response.getError();
                    console.log('Error Occured ', errors);
                }else{
                     console.log('Error Occured ');
                }
            });
            $A.enqueueAction(action);
        } else {
            alert('Please Select Address');
        }
    },
    
    addNewAddress : function(component, event, helper){
        component.set('v.isNewAddress', true);
    },
    
    catchChangingEvent : function(component, event, helper){
        let params = event.getParam('quantity');
        $A.get('e.force:refreshView').fire(); 
    }
})