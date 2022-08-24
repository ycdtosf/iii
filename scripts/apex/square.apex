delete [select Id from Icon__c];
delete [select Id from Color__c];

Icon__c icon = new Icon__c(Name = 'Square', Height__c = 4, Width__c = 4);
insert icon;

Color__c black = new Color__c(Name = 'Black', Value__c = '#000000');
Color__c white = new Color__c(Name = 'White', Value__c = '#FFFFFF');
insert new List<Color__c> { black, white };

List<Pixel__c> pixels = new List<Pixel__c>{
    new Pixel__c(Icon__c = icon.Id, X__c = 0, Y__c = 0, Color__c = black.Id),
    new Pixel__c(Icon__c = icon.Id, X__c = 1, Y__c = 0, Color__c = black.Id),
    new Pixel__c(Icon__c = icon.Id, X__c = 2, Y__c = 0, Color__c = black.Id),
    new Pixel__c(Icon__c = icon.Id, X__c = 3, Y__c = 0, Color__c = black.Id),
    new Pixel__c(Icon__c = icon.Id, X__c = 0, Y__c = 1, Color__c = black.Id),
    new Pixel__c(Icon__c = icon.Id, X__c = 1, Y__c = 1, Color__c = white.Id),
    new Pixel__c(Icon__c = icon.Id, X__c = 2, Y__c = 1, Color__c = white.Id),
    new Pixel__c(Icon__c = icon.Id, X__c = 3, Y__c = 1, Color__c = black.Id),
    new Pixel__c(Icon__c = icon.Id, X__c = 0, Y__c = 2, Color__c = black.Id),
    new Pixel__c(Icon__c = icon.Id, X__c = 1, Y__c = 2, Color__c = white.Id),
    new Pixel__c(Icon__c = icon.Id, X__c = 2, Y__c = 2, Color__c = white.Id),
    new Pixel__c(Icon__c = icon.Id, X__c = 3, Y__c = 2, Color__c = black.Id),
    new Pixel__c(Icon__c = icon.Id, X__c = 0, Y__c = 3, Color__c = black.Id),
    new Pixel__c(Icon__c = icon.Id, X__c = 1, Y__c = 3, Color__c = black.Id),
    new Pixel__c(Icon__c = icon.Id, X__c = 2, Y__c = 3, Color__c = black.Id),
    new Pixel__c(Icon__c = icon.Id, X__c = 3, Y__c = 3, Color__c = black.Id)
};

insert pixels;