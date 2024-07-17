({
    doInit : function(component, event, helper) {console.log('CartInfo_doInit');
    console.log('INIT_CartInfo_recordList=',component.get('v.recordList').length);
    console.log('INIT_CartInfo_beerNameList=',JSON.stringify(component.get('v.beerNameList')));
}, 

    goToCart : function(component, event, helper) {console.log('goTocart');
    console.log('GoToCart_CartInfo_recordList=',component.get('v.recordList'));
    console.log('GoToCart_CartInfo_beerNameList=',JSON.stringify(component.get('v.beerNameList')));

        let action = component.get('c.getCartId');
        action.setParams({
            'beerList' : component.get('v.beerNameList')
        });
     
        action.setCallback(this, function(response){
            let state = response.getState();
            if(state === 'SUCCESS' || state === 'DRAFT'){
                console.log('state_IN_CartInfo=',state);
                console.log('response.getReturnValue()=',response.getReturnValue());
                let pageReference = component.find("navigation");
                let pageReferenceNav = {    
                    type: "standard__component",
                    attributes: {
                        componentName: "c__CartDetail"    
                    },    
                    state: {
                        "c__cartId": response.getReturnValue()
                    }
                };
                pageReference.navigate(pageReferenceNav, true);
                 
            }else if(state === 'INCOMPLETE'){
                console.log('User is offline System does not support offline');
            }else if(state ==='ERROR'){
                let errors = response.getError();
                if(errors || errors[0].pageMessage){
                    console.log(' page Error In Cart Info', errors[0].pageMessage);
                }
                if(errors || errors[0].duplicateResults){
                    console.log(' duplicate Error In Cart Info', errors[0].duplicateResults);
                }
            }else{
                
            }
        });
        $A.enqueueAction(action);
    },

    createCartItems : function(component, event, helper){
        console.log(' createCartItems In CartInfo');
        let names = [];
        for(let i=0; i<component.get('v.recordList').length;  i++){
            names.push(component.get('v.recordList')[i].Id);
        }
        //console.log(names);
        component.set('v.beerNameList', names);
    }
})