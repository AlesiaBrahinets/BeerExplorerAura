public class BeerSearchAuraController {
    @AuraEnabled
    public static List<Beer_Kind__c> searchBeer(String searchParam) {
        String likesearch = '%' + searchParam + '%';
        String search = '';
        if(searchParam != null) {
           search = 'Select id, Name,Beer_Image__c, Collection__c,Brewery_Name__c,Remaining_Quantity__c, Volume_of_bottle__c, Alcohol__c, Price__c  FROM Beer_Kind__c where Name like :likesearch LIMIT 100';
        } else {
           search = 'Select id, Name,Beer_Image__c,  Collection__c,Brewery_Name__c,Remaining_Quantity__c, Volume_of_bottle__c, Alcohol__c, Price__c  FROM Beer_Kind__c LIMIT 100';
        }
        List<sObject> listOfBeer = Database.query(search);
        return listOfBeer; 
        
    }

}