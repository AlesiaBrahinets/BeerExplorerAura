({
    doInit : function(component, event, helper) {console.log('!!!!DO_INIT_CART_INFO');
        let getCartIdFromHeaderComp = component.get('v.cartId');
       
        if(getCartIdFromHeaderComp == null){
        	let action = component.get('c.getIdAndQuantity');
            action.setCallback(this, function(response){
                let state = response.getState();
                
            	if(state === 'SUCCESS' || state === 'DRAFT'){
                	let cartMap = response.getReturnValue();
                    
                    for(let key in cartMap){
                        console.log('cartMap_value=',cartMap[key]);
                        console.log('cartMap_key=',key);
                        component.set('v.cartId',key);
        				component.set('v.itemsQuantity', cartMap[key]);
                    }
                } else{
                 console.log('Error_Getting_CartId_InHeaderComponent= ');   
                }
            });  
            $A.enqueueAction(action);                                         
        }                          
}, 
    
    goToCart : function(component, event, helper) { console.log('New Go To Cart');
     $A.get('e.force:refreshView').fire();
        let resultData;
        let cartIdForGoing = component.get('v.cartId');
       
        if(cartIdForGoing == null){
        let action = component.get('c.getCartOnlyId');
            action.setCallback(this, function(response){
                let state = response.getState();
            	if(state === 'SUCCESS' || state === 'DRAFT'){
                cartIdForGoing = response.getReturnValue();
                component.set('v.cartId',cartIdForGoing);   
                } else{
                 console.log('Error_Getting_CartId_InHeaderComponent= ');   
                }
            });  
            $A.enqueueAction(action);
        } 
                let pageReference = component.find("navigation");
               
        let pageReferenceNav = {
            type: "standard__navItemPage",
            attributes : {
                apiName: "Cart_Detail"
            },
            state: {
                    "c__cartId": cartIdForGoing  
            }
        };
         
       
                event.preventDefault();
                pageReference.navigate(pageReferenceNav, true);
        
                                            
           console.log('GoToCart_CartInfo_FINISH');  
    },

   
    createCartItems : function(component, event, helper){
        let getCartIdFromHeaderComp = component.get('v.cartId');
        
       
        let names = [];
        let ln = component.get('v.recordList').length - 1;
        names.push(component.get('v.recordList')[ln].Id);
        component.set('v.beerNameList', names);
        console.log('names=',JSON.stringify(names));
              
        let action = component.get('c.createCartItemsNew');
        action.setParams({
            'beerList' : component.get('v.beerNameList'),
            'cartId': getCartIdFromHeaderComp
        });
        action.setCallback(this, function(response){
            let state = response.getState();
            if(state === 'SUCCESS' || state === 'DRAFT'){
                let cartIdFind = response.getReturnValue();
                let quantity = component.get('v.itemsQuantity');
        quantity += 1;
        component.set('v.itemsQuantity', quantity);
        console.log(' createCartItems In CartInfo_UPDATE_QUANTITY========',quantity);
                        
                        let items = component.get('v.itemList');
                        let subTotal;
                            items.push(names[0]);
                            if(subTotal){
                                subTotal = subTotal + names[0].Total_Amount__c;                          
                            } else {
                                subTotal = names[0].Total_Amount__c;                              
                            }      
                        component.set('v.subTotal', subTotal);
                       
                        console.log('resultDataCartInfo=', JSON.stringify(items));                                                                     
            }else if(state === 'INCOMPLETE'){
                console.log('User is offline System does not support offline');
            }else if(state ==='ERROR'){
                let errors = response.getError();
                if(errors || errors[0].pageMessage){
                    console.log(' page Error In Cart Info', errors[0].pageMessage);
                }
                
            }else{
              console.log('ELSE2222*****');  
            }
        });
        $A.enqueueAction(action);

                let action2 = component.get('c.getCartItems');
                action2.setParams({
                    'cartId' : component.get('v.cartId')
                });
                action2.setCallback(this, function(response){
                    let stateResponse = response.getState();
                    if(stateResponse === 'SUCCESS' || stateResponse === 'DRAFT'){
                        let resultData = response.getReturnValue();
                        console.log('cartItemList_AFTER=' , JSON.stringify(resultData));
                        let items = [];
                       
                        for(let key in resultData){
                            items.push(resultData[key]);
                           
                        }
                        
                        component.set('v.itemList', items);
                        console.log('itemList=',JSON.stringify(items));
                    }
        console.log('AFTER ACTION*****');
                });
                                                       $A.enqueueAction(action2);
        
    }
})