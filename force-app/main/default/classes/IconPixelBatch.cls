
/*
Icon__c i = [select Id, Width__c, Height__c from Icon__c where Id = 'a021900000DYU43AAH' limit 1];
IconPixelBatch b = new IconPixelBatch();
b.icon = i;
Database.executeBatch(b);
*/

public with sharing class IconPixelBatch implements Database.Batchable<sObject> {
    
    public Icon__c icon;

    public Iterable<sObject> start(Database.BatchableContext context) {

        List<Pixel__c> pixels = new List<Pixel__c>();
        
        for(Integer r = 0; r < this.icon.Width__c; r++) {
            for(Integer c = 0; c < this.icon.Height__c; c++) {
                pixels.add(new Pixel__c(
                    X__c = r,
                    Y__c = c,
                    Color__c = this.icon.DefaultColor__c,
                    Icon__c = this.icon.Id
                ));
            }
        }

        return pixels;
    }

    public void execute(Database.BatchableContext context, List<sObject> scope) {
        insert scope;
    }

    public void finish(Database.BatchableContext context) {
        // TODO: check for another icon request
    }
    
}
