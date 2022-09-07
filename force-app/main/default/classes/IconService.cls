public with sharing class IconService {
    
    public static void createIconPixels(Icon__c icon) {
        
        List<Pixel__c> pixels = new List<Pixel__c>();
        
        for(Integer r = 0; r < icon.Width__c; r++) {
            for(Integer c = 0; c < icon.Height__c; c++) {
                pixels.add(new Pixel__c(
                    X__c = r,
                    Y__c = c,
                    Color__c = icon.DefaultColor__c,
                    Icon__c = icon.Id
                ));
            }
        }

        insert pixels;

    }

}

/*
Icon__c i = new 
*/
