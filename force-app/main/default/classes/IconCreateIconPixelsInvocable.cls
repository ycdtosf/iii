public with sharing class IconCreateIconPixelsInvocable {
    
    @InvocableMethod
    public static void execute(List<Icon__c> icons) {
        for(Icon__c icon : icons) {
            IconService.createIconPixels(icon);
        }
    }

}
