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
    public static List<Pixel__c> loadPixels(Id iconId, Integer indexStart, Integer recordCount) {

        List<Pixel__c> pixels = new List<Pixel__c>();

        Integer indexEnd = indexStart + recordCount;

        return [
            select 
            Id, 
            X__c, 
            Y__c, 
            Index__c,
            Color__r.Name,
            Color__r.Value__c
            from Pixel__c
            where Icon__c = :iconId
            and Index__c >= :indexStart
            and Index__c < :indexEnd
            order by Index__c asc
        ];
       
    }

    @AuraEnabled
    public static List<Color__c> loadColors() {
        return [select Id, Name, Value__c from Color__c];
    }

    @AuraEnabled
    public static void writePixelHover(Id iconId, Id pixelId, String color) {
        PixelEvent__e e = new PixelEvent__e(
            IconId__c = iconId,
            PixelId__c = pixelId, 
            Type__c = 'HOVER',
            Color__c = color
        );
        EventBus.publish(e);
    }

    @AuraEnabled
    public static void writePixelLeave(Id iconId, Id pixelId) {
        PixelEvent__e e = new PixelEvent__e(
            IconId__c = iconId,
            PixelId__c = pixelId, 
            Type__c = 'LEAVE'
        );
        EventBus.publish(e);
    }

}
