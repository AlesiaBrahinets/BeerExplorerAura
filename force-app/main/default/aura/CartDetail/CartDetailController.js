({
    doInit : function(component, event, helper) {
        helper.fetchAddress(component, event, helper);
            console.log('ListAddress=',component.get('v.addressList'));
            
        component.set('v.isNewAddress',false);
        let listAddress = component.get('addressList');
        console.log('listAddress In INIT=',listAddress);
        console.log('DOINIT_CartDetail_cartItemList=', component.get('v.cartItemList'));

        /*component.find('recordCreator').getNewRecord(
            'Address_Book__c',
            null,
            false,
            $A.getCallback(function(){
                let record = component.get('v.record');
                let error = component.get('v.recordError');
                if(error || (record === null)){
                    console.log(' Error while creating the template ',error);
                }else{
                    console.log(' Successfuly Created');
                    //alert('Templated Initiated');
                }
            })
        );*/


        let pageReference = component.get('v.pageReference');
        console.log(pageReference);
        if(pageReference){
            let state = pageReference.state;
            console.log(state);
            console.log('state.cartId', state.c__cartId);
            if(state.c__cartId){
                console.log('gotoAction ' ,state.c__cartId);
                component.set('v.cartId',state.c__cartId );
                let action = component.get('c.getCartItems');
                action.setParams({
                    'cartId' : state.c__cartId
                });
                action.setCallback(this, function(response){
                    let stateResponse = response.getState();
                    if(stateResponse === 'SUCCESS' || stateResponse === 'DRAFT'){
                        let resultData = response.getReturnValue();
                        console.log(' resultData ' , JSON.stringify(resultData));
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
                        /*
                         * for(String item : resultData.keySet())
                         * 		CartItem__C = resultData.get(item);
                         * 
                         */ 
                        component.set('v.cartItemList', items);
                    }else if(stateResponse === 'INCOMPLETE'){
                        console.log('User is offline System does not support offline');
                    }else if(stateResponse ==='ERROR'){
                        let errors = response.getError();
                        if(errors || errors[0].pageMessage){
                            console.log(' page Error In Cart Detail ', errors[0].pageMessage);
                        }
                        if(errors || errors[0].duplicateResults){
                            console.log(' duplicate Error In Cart Detail ', errors[0].duplicateResults);
                        }
                    }else{
                        
                    }
                });
                $A.enqueueAction(action);
            }
        }
        
    },
    homePage : function(component, event, helper) {
        let pageReference = component.find("navigation");
        let pageReferenceNav = {
            type: "standard__navItemPage",
            attributes : {
                apiName: "Beer_Explorer"
            }
        };
        pageReference.navigate(pageReferenceNav, true);
    },
    applyCoupon : function(component, event, helper){
        component.set('v.isCouponAplied', true);
    },
    doApplyCoupon : function(component, event, helper){
        let CouponNo = component.find('CouponNo').get('v.value');
        console.log('CouponNo=',CouponNo);
        let cartId = component.get('v.cartId');
        console.log('cartId=',cartId);
        if(CouponNo){console.log('IfHaveCoupone');
            let action = component.get('c.checkCoupon');
            action.setParams({
                'name' : CouponNo,
                'cartId' : cartId
            });
            action.setCallback(this, function(response){
                let state = response.getState();
              console.log('STATE_Coupone=',state);
                if(state === 'SUCCESS' || state ==='DRAFT') {
                    let resultData = response.getReturnValue();
                    console.log('resultData_Coupone_checkCoupon=',resultData);
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
    doSaveAddress : function(component, event, helper){console.log('doSaveAddress');
       // let isValidAddress = helper.validate(component, event, helper);
        let isValidAddress = true;
        //alert(isValidAddress);
        if(isValidAddress){console.log('isValidAddress');
            let userId = $A.get("$SObjectType.CurrentUser.Id");
            
            console.log('handleSubmit');
         event.preventDefault();       // stop the form from submitting
         let fields = event.getParam('fields');
         fields["User__c"] = userId;
         console.log('fields_address=',fields);
         component.set('v.addressBook',fields); 
         component.find('recordCreator').submit(fields);
         console.log('fields_address_After=',fields);
            /*component.find('recordCreator').saveRecord(function(saveResult){
                if(saveResult.state === 'SUCCESS' || saveResult.state === 'DRAFT'){
                    let showToast = $A.get('e.force:showToast');
                    showToast.setParams({
                        "title" : "Record Saved",
                        "type" : "success",
                        "message" : "AddressBook Has been Save with the Record Id "+saveResult.recordId
                    });
                    showToast.fire();
                    let addList = [];
                    let addrList = component.get('v.addressList');
                    if(addrList){
                        addrList.push(component.get('v.addressBook'));
                        component.set('v.addressList' , addrList);
                    }else{
                       addList.push(component.get('v.addressBook'));
                       component.set('v.addressList' , addList); 
                    }
                    component.set('v.isNewAddress', false);
                } else if(saveResult.state === 'INCOMPLETE'){
                    
                }else if(saveResult.state === 'ERROR'){
                    
                }else{
                    
                }
            });*/
        }
    },
    handleSuccess : function(component, event, helper){
        let updatedRecord =JSON.stringify(event.getParams());
        console.log('updatedRecord_Address=',updatedRecord);
        console.log('updatedRecord_Address_Fields=',event.getParam('response').fields);
        let recordId = event.getParam('response').id;
         
        console.log('NewOrderRecordId=',recordId);
        let showToast = $A.get('e.force:showToast');
        showToast.setParams({
            "title" : "Record Saved",
            "type" : "success",
            "message" : "AddressBook Has been Save with the Record Id "+recordId
        });
        showToast.fire();
        let addList = [];
                    let addrList = component.get('v.addressList');console.log('addrList=',JSON.stringify(addrList));
                    if(addrList){
                        console.log('addressBook=',component.get('v.addressBook') );
                        let address = component.get('v.addressBook');
                        address['Id']=recordId;
                        component.set('v.addressBook' , address);
                        addrList.push({'label': 'Sales', 'value':address});
                        component.set('v.addressList' , addrList);
                    }else{
                        console.log('addressBookElse=',component.get('v.addressBook') );
                        let address = component.get('v.addressBook');
                        address['Id']=recordId;
                        component.set('v.addressBook' , address);
                        addList.push({'label': 'Sales', 'value':address});
                        component.set('v.addressList' , addList); 
                    }
                    component.set('v.isNewAddress', false);
                    

    },

    getAddress : function(component, event, helper){
        console.log('getAddress_isCheckOut');
        let isTrue = component.get('v.isCheckout');
        console.log('isTrue=',isTrue);
        console.log('isNewAddress=',component.get('v.isNewAddress'));
        if(isTrue){console.log('isTrueInsideIf=',isTrue);
           // helper.fetchAddress(component, event, helper);
            console.log('ListAddress=',component.get('v.addressList'));
            console.log('AddresListInGetAddress=',component.get('v.addressList'));
        }
    },
    onSelect : function(component, event, helper){
        console.log('OnSelect_event.getParams=', event.getParams());
        let selected = event.getParam("value");
        console.log('selected_Value=', selected);
        
        component.set('v.selectedAddress', selected);
        
        //console.log('v.selectedAddress_String=', JSON.stringify(selected));
       // component.set('v.selectedAddress_String', JSON.stringify(selected));
        //let selected = event.getSource().get("v.text");
        //let cehcked =  event.getSource().get("v.value");
       /* let allAddress = component.get('v.addressList');
        let selectedAddress = allAddress[selected];
        console.log('selectedAddress ', selectedAddress);
        component.set('v.selectedAddress', selectedAddress);*/
    },
    placeOrder : function(component, event, helper){
        console.log('placeOrder=', component.get('v.selectedAddress'));

        let selectedAdd = component.get('v.selectedAddress');
        if(selectedAdd){
            //alert(selectedAdd.Id);
            //alert(component.get('v.CartId'));
            let userId = $A.get("$SObjectType.CurrentUser.Id");
            //alert(userId);
            let action = component.get('c.createOrder');
            console.log('addressId=',selectedAdd);
            console.log('cartId=',component.get('v.cartId'));
            console.log('userId=',userId);
            console.log('subTotal=',component.get('v.subTotal'));

            action.setParams({
                "addressId" : selectedAdd,
                "cartId" : component.get('v.cartId'),
                "userId" : userId,
                "subtotal" : component.get('v.subTotal')
            });
            
            action.setCallback(this, function(response){
                let state = response.getState();console.log('state=',state);
                if(state === 'SUCCESS' || state === 'DRAFT'){console.log('SUCCESS');
                    let showToast = $A.get('e.force:showToast');
                    let resultData = response.getReturnValue();
                    console.log('resustData_NewOrder=',resultData);
                    console.log('resustData_NewOrder=',resultData.Id);
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
                    pageReference.navigate(pageReferenceNav, true);
                } else if(state === 'INCOMPLETE'){
                    console.log('User is offline and System does not support offline!.');
                }else if(state === 'ERROR'){
                    let errors = response.getError();
                    console.log('Error Occured ', errors);
                }else{
                    
                }
            });
            $A.enqueueAction(action);
        }else{
            alert('Please Select Address');
        }
    },
    addNewAddress : function(component, event, helper){
        
        component.set('v.isNewAddress', true);
    }
})
