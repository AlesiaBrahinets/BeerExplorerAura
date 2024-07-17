public with sharing class DataTableAuraService {
    @AuraEnabled
    public static List<Account> fetchAccount(){
        return [SELECT Id, Name, Industry, Rating, Phone FROM Account];
    }
}