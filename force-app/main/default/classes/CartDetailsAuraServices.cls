public with sharing class CartDetailsAuraServices {

    @AuraEnabled
    public static void deleteItem(String cartItemId) {
        Database.delete(cartItemId);
    }

    @AuraEnabled(cacheable=true)
    public static  List<Address_Book__c> fetchAddressBook() {
        List<Address_Book__c> addressList = [SELECT Id, Name, Street__c, State__c,Country__c, City__c, Postal_Code__c 
                                             FROM Address_Book__c 
                                             WHERE User__c =: UserInfo.getUserId()];
        return addressList;
    }

    @AuraEnabled
    public static Group_Beer_Order__c createOrder(String addressId, String cartId, String userId, Decimal subtotal) {
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
        
        Group_Beer_Order__c newOrder = [SELECT Id, Name 
                                        FROM Group_Beer_Order__c 
                                        WHERE Id =: order.Id];
        return newOrder;
    }  
    
    private static List<Coupon__c> getCoupon(String name) {
        List<Coupon__c> coupon = [SELECT Id, Price__c, Expired__c, Remaining_Quantity__c 
                                  FROM Coupon__c 
                                  WHERE Name =: name];
        return coupon;
    }
    
    @AuraEnabled
    public static Decimal checkCoupon(String name, String cartId) {
        List<Coupon__c> couponList =  getCoupon(name);

        if(couponList !=null 
           && couponList.size() > 0 
           && !couponList[0].Expired__c 
           && couponList[0].Remaining_Quantity__c > 0) { 

            Cart_Of_Beer__c cart = new Cart_Of_Beer__c(Id = cartId, Coupon__c =couponList[0].Id );
            update cart; 
            return couponList[0].Price__c;
        } else { 
            return null;
        }
    }
    
    private static String getCartId() {
        List<Cart_Of_Beer__c> cartList = [SELECT Id, Name 
                                          FROM Cart_Of_Beer__c 
                                          WHERE User__c=: UserInfo.getUserId() 
                                          AND Is_Active__c = true];

        if(cartList.isEmpty()) return null;
        return cartList[0].Id;
    }
    
    @AuraEnabled
    public static String createNewCartItems(List<String> beerList, String cartId) {
        List<Cart_Item__c> cartItemList = new List<Cart_Item__c>();
        List<Cart_Item__c> cartItemToUpdate = new List<Cart_Item__c>();

        if(cartId==null) {
            cartId = createCart();
        }
        List<Cart_Item__c> existedCartItems = getCartItems(cartId);
        Map<Id, Cart_Item__c> beerQntyMap = new Map<Id, Cart_Item__c>();
        for(Cart_Item__c item : existedCartItems) {
            if(!beerQntyMap.containsKey(item.Beer_Kind__c)) {
                beerQntyMap.put(item.Beer_Kind__c, item);
            }
        }
        for(String beer : beerList){
            if(beerQntyMap != null && beerQntyMap.containsKey(beer)) {
                Cart_Item__c it = beerQntyMap.get(beer);
                Cart_Item__c item = new Cart_Item__c(
                    Item_Quantity__c = it.Item_Quantity__c+1,
                    Id = it.Id
                );
                cartItemToUpdate.add(item);
            } else {
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
    public static String createCart() {
        String cartId = getCartId();
        if(cartId == null) {
            Cart_Of_Beer__c cart = new Cart_Of_Beer__c(Coupon__c = getCoupon('Default')[0].Id,
                                                       Cart_Id__c=String.valueOf(Math.random()),
                                      				   Cart_Status__c='Open', 
                                                       Is_Active__c=true, 
                                                       User__c = UserInfo.getUserId());
            insert cart;
            cartId = cart.Id;
        }
        return cartId;
    }

    @AuraEnabled 
    public static void changeQuantityInCartItem(String cartItemId, Integer quantity) {
        Cart_Item__c item = getCartItem(cartItemId);
        if (item != null) {
            item.Item_Quantity__c = quantity;
        }
        update item;
    }
    
    @AuraEnabled 
    public static Map<Id, Integer> getIdAndQuantity() {
        String cartId = getCartId();
        Map<Id, Integer> cartMap = new Map<Id, Integer>();

        if(cartId == null) {
            cartMap.put(null, 0);
            return cartMap;
        }
        Integer quantity = getQuantityItems();
        cartMap.put(cartId, quantity);
        return cartMap;
    }
    
    @AuraEnabled 
    public static Integer getQuantityItems() {
        Integer quantityBeerItems = 0;
        String existedCartId = getCartId();

        if (existedCartId == null) return quantityBeerItems;
        List<Cart_Item__c> existingItemList = getCartItems(existedCartId);
  
        for(Cart_Item__c item : existingItemList) {
            quantityBeerItems += (Integer)item.Item_Quantity__c;
        }
        return quantityBeerItems;
    }

    @AuraEnabled
    public static List<Cart_Item__c> getCartItems(String cartId) {
        List<Cart_Item__c> existingItemList = [SELECT Id, Name, Item_Quantity__c, Total_Amount__c, Beer_Kind__c, Beer_Kind__r.Name
                                               FROM From Cart_Item__c 
                                               WHERE Cart_Of_Beer__c =: cartId];                        
        return existingItemList;
    }

    @AuraEnabled
    public static Cart_Item__c getCartItem(String cartItemId) {
        Cart_Item__c existingItem = [SELECT Id, Name,
                                     FROM Cart_Item__c 
                                     WHERE Id =: cartItemId];                             
        return existingItem;
    }
    
}