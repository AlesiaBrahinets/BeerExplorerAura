public with sharing class CartDetailsAuraServices {

    private static List<Coupon__c> getCoupon(String name){
        System.debug('name_IN_getCoupon='+name);
        List<Coupon__c> coupon = [SELECT Id, Price__c, Expired__c, Remaining_Quantity__c FROM Coupon__c WHERE Name =: name];
        System.debug('coupon_IN_getCoupon='+coupon);
        return coupon;
    }
    
    @AuraEnabled
    public static Decimal checkCoupon(String name, String cartId){
        System.debug('name_IN_checkCoupon='+name);
        List<Coupon__c> couponList =  getCoupon(name);
        System.debug('couponList='+couponList);
        if(couponList !=null && couponList.size() > 0 && !couponList[0].Expired__c && couponList[0].Remaining_Quantity__c > 0){ System.debug('couponList.size()='+couponList.size());
            Cart_Of_Beer__c cart = new Cart_Of_Beer__c(Id = cartId, Coupon__c =couponList[0].Id );
            update cart; System.debug('cart='+cart);
            return couponList[0].Price__c;
        }else{ System.debug('ELSE='+couponList);
            return null;
        }
    }
    
    @AuraEnabled
    public static String createCartItems(List<String> beerList, String cartId){
        System.debug('#### beerList '+ beerList);
        List<Cart_Item__c> cartItemList = new List<Cart_Item__c>();
        List<Cart_Item__c> cartItemToUpdate = new List<Cart_Item__c>();
        Map<Id, Cart_Item__c> beerQntyMap = getCartItems(cartId);
        For(String beer : beerList){
            if(beerQntyMap != null && beerQntyMap.containsKey(beer)){
                Cart_Item__c it = beerQntyMap.get(beer);
                Cart_Item__c item = new Cart_Item__c(
                    Item_Quantity__c = it.Item_Quantity__c+1,
                    Id = it.Id
                );
                cartItemToUpdate.add(item);
            }else{
                Integer Qty = 1;
                Cart_Item__c item = new Cart_Item__c(
                    Cart_Of_Beer__c = cartId,
                    Beer_Kind__c = beer,
                    Item_Quantity__c = Qty
                );
                cartItemList.add(item);
            }
        }
        insert cartItemList;
        if(cartItemToUpdate != null && cartItemToUpdate.size() > 0)
            update cartItemToUpdate;
        return cartId;
    }
    
    @AuraEnabled 
    public static String getCartId(List<String> beerList){
        List<Cart_Of_Beer__c> cartList = getCart();
        if(cartList != null && cartList.size() > 0){
            createCartItems(beerList, cartList[0].Id);
                                system.debug('cartlist1:'+cartList[0].Id);

            return cartList[0].Id;

            
        }else{
            Cart_Of_Beer__c cart = new Cart_Of_Beer__c(Coupon__c = getCoupon('Default')[0].Id,Cart_Id__c=String.valueOf(Math.random()),
                                      Cart_Status__c='Open', Is_Active__c=true, User__c = UserInfo.getUserId());
            insert cart;
            createCartItems(beerList, cart.Id);
            return  cart.Id;
        }
    }
    private static List<Cart_Of_Beer__c> getCart(){
        List<Cart_Of_Beer__c> cartList = [Select Id, Name From Cart_Of_Beer__c Where User__c=: UserInfo.getUserId() AND Is_Active__c = true];
        system.debug('cartlist:'+cartList);
        return cartList;

    }
    
    @AuraEnabled
    public static Map<Id, Cart_Item__c> getCartItems(String cartId){
        List<Cart_Item__c> existingItemList = [Select Id, Name, Item_Quantity__c,Total_Amount__c, Beer_Kind__c, Beer_Kind__r.Name From Cart_Item__c 
                                               Where Cart_Of_Beer__c =: cartId];
        Map<Id, Cart_Item__c> beerQntyMap = new Map<Id, Cart_Item__c>();
        For(Cart_Item__c item : existingItemList){
            if(!beerQntyMap.containsKey(item.Beer_Kind__c)){
                beerQntyMap.put(item.Beer_Kind__c, item);
            }
        }
        return beerQntyMap;
    }
    
    @AuraEnabled
    public static void deleteItem(String cartItemId){
        Database.delete(cartItemId);
    }

    @AuraEnabled(cacheable=true)
    public static  List<Address_Book__c> fetchAddressBook(){
        List<Address_Book__c> addressList = [SELECT Id, Name, Street__c, State__c,Country__c, City__c, Postal_Code__c 
        FROM Address_Book__c WHERE User__c =: UserInfo.getUserId()];
        return addressList;
    }

    @AuraEnabled
    public static Group_Beer_Order__c createOrder(String addressId, String cartId, String userId, Decimal subtotal){
        Group_Beer_Order__c order = new Group_Beer_Order__c(
            Cart_Of_Beer__c = cartId,
            User__c = userId,
            Shipping_Address__c = addressId,
            Order_Amount__c = subtotal
        );
        Cart_Of_Beer__c cart = new Cart_Of_Beer__c(
            Id= cartId,
            Cart_Status__c = 'Closed',
            Is_Active__c = false,
            Total_Amount__c = subtotal
        );
        insert order;
        update cart;
        
        Group_Beer_Order__c newOrder = [SELECT Id, Name FROM Group_Beer_Order__c WHERE Id =: order.Id];
        return newOrder;
    }
}