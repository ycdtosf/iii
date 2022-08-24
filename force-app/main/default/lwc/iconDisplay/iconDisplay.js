import { LightningElement, api, track } from 'lwc';
import loadIcon from '@salesforce/apex/lwcIconDisplay.loadIcon';
import loadPixels from '@salesforce/apex/lwcIconDisplay.loadPixels';
import loadColors from '@salesforce/apex/lwcIconDisplay.loadColors';
import { updateRecord } from 'lightning/uiRecordApi';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';

export default class IconDisplay extends LightningElement {

    @api recordId;
    pixels;
    colors;
    @track pixelMatrix;
    inited = false;
    channelName = '/event/PixelEvent__e';
    
    _gridWidth;
    get gridWidth() { return this._gridWidth; }
    set gridWidth(value) { 
        this._gridWidth = value;
        document.documentElement.style.setProperty('--gridWidth', value + 'px'); 
    }

    _pixelSize;
    get pixelSize() { return this._pixelSize; }
    set pixelSize(value) { 
        this._pixelSize = value;
        document.documentElement.style.setProperty('--pixelSize', value + 'px'); 
    }

    connectedCallback() {

        this.gridWidth = 0;
        this.pixelSize = 1;

        document.documentElement.style.setProperty('--gridStyle', 'solid');
        document.documentElement.style.setProperty('--gridColor', '#000');

        this.init();
    }

    async init() {
        try {
            this.colors = await loadColors();
            this.icon = await loadIcon({ iconId : this.recordId });
            this.pixels = await loadPixels({ iconId : this.recordId });
            this.buildPixelMatrix();

            let _this = this;

            const messageCallback = function(response) {

                let iconId = response.data.payload.IconId__c;
                let pixelId = response.data.payload.PixelId__c;
                let color = response.data.payload.Color__c;

                if(_this.recordId === iconId) {
                    _this.setPixelElementStyle(pixelId, color);
                }

                console.log('New message received: ', JSON.stringify(response));
                // Response contains the payload of the new message received
            };

            subscribe(this.channelName, -1, messageCallback).then((response) => {
                // Response contains the subscription information on subscribe call
                console.log(
                    'Subscription request sent to: ',
                    JSON.stringify(response.channel)
                );
            });

            
        }
        catch(error) {
            console.log(error);
        }
        finally {
            console.log('IconDisplay component initialized.');
            this.inited = true;
        }
    }

    

    buildPixelMatrix() {

        let matrix = [];
        let rowIndex = -1;

        for(let p = 0; p < this.pixels.length; p++) {
            
            let pixel = this.pixels[p];
            pixel.style = 'background-color:' + pixel.Color__r.Value__c + ';';

            if(rowIndex < pixel.Y__c) {
                rowIndex = pixel.Y__c; 
                matrix.push({ index : rowIndex, pixels : [] });
            }
            
            matrix[rowIndex].pixels.push(pixel);

        }

        this.pixelMatrix = matrix;
        
    }

    toggleGrid(e) {
        this.gridWidth = this.gridWidth === 0 ? 1 : 0;   
    }

    zoomIn(e) {
        this.pixelSize = this.pixelSize * 2;  
    } 

    zoomOut(e) {
        this.pixelSize = this.pixelSize / 2;
        if(this.pixelSize < 1) this.pixelSize = 1;
    } 

    findColorByValue(val) {
        return this.colors.find(item => item.Value__c === val);
    }

    setPixelElementStyle(sfid, color) {
        let style = 'background-color:' + color + ';';
        let element = this.template.querySelector('[data-sfid="' + sfid + '"]');
        element.style = style;
        element.dataset.color = color;
    }

    async pixelClick(e) {

        let sfid = e.srcElement.dataset.sfid;
        let color = e.srcElement.dataset.color;
        if(color === '#FFFFFF') color = '#000000';
        else color = '#FFFFFF';

        this.setPixelElementStyle(sfid, color);

        let colorRecord = this.findColorByValue(color);

        try {
            await updateRecord({ 
                fields: {
                    Id : sfid,
                    Color__c : colorRecord.Id
                }
            });
        }
        catch(error) {
            console.log(error);
        }
        finally {
            console.log('Pixel color updated.');
        }
        

    }

}