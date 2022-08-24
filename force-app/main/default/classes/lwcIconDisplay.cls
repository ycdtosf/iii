public with sharing class lwcIconDisplay {
    
    @AuraEnabled
    public static Icon__c loadIcon(Id iconId) {
        return [select 
            Id, 
            Name, 
            Width__c, 
            Height__c
            from Icon__c
            where Id = :iconId
            limit 1
        ];
    }
    
    @AuraEnabled
    public static List<Pixel__c> loadPixels(Id iconId) {
        return [select 
            Id, 
            X__c, 
            Y__c, 
            Color__r.Name,
            Color__r.Value__c
            from Pixel__c
            where Icon__c = :iconId
            order by Y__c asc, X__c asc
        ];
    }

    @AuraEnabled
    public static List<Color__c> loadColors() {
        return [select Id, Name, Value__c from Color__c];
    }

}
