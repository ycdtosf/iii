import { LightningElement, api, track } from 'lwc';
import loadIcon from '@salesforce/apex/lwcIconDisplay.loadIcon';
import loadPixels from '@salesforce/apex/lwcIconDisplay.loadPixels';
import loadColors from '@salesforce/apex/lwcIconDisplay.loadColors';
import writePixelHover from '@salesforce/apex/lwcIconDisplay.writePixelHover';
import writePixelLeave from '@salesforce/apex/lwcIconDisplay.writePixelLeave';
import { updateRecord } from 'lightning/uiRecordApi';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';

export default class IconDisplay extends LightningElement {

    @api recordId;
    @track pixels = [];
    colors;
    @track pixelMatrix;
    inited = false;
    channelName = '/event/PixelEvent__e';
    pixelClickColor = '#000000';
    componentInstanceId = self.crypto.randomUUID();
    iconFlexStyle = '';

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

            let recordChunkCount = 5000;
            let idx = 0;
            let somePixels = null;
            let resultCount = 0;

            this.icon = await loadIcon({ iconId : this.recordId });
            console.log(new Date().getTime());
            do {
                somePixels = await loadPixels({ iconId : this.recordId, indexStart : idx, recordCount : recordChunkCount });
                resultCount = somePixels.length;
                idx += resultCount;
                this.pixels.push(...somePixels);
            } while(resultCount > 0);
            console.log(new Date().getTime());

            this.iconFlexStyle = 'width: ' + this.icon.Width__c + 'px;';

            //let element = this.template.querySelector('.icon-flex');
            //element.style.width = this.icon.Width__c + 'px';

            this.buildPixelMatrix();

            let _this = this;

            const messageCallback = function(response) {

                let iconId = response.data.payload.IconId__c;
                let pixelId = response.data.payload.PixelId__c;
                let color = response.data.payload.Color__c;
                let type = response.data.payload.Type__c;
                let interactionId = response.data.payload.UniqueId__c;

                if(_this.recordId === iconId && _this.componentInstanceId !== interactionId) {
                    if(type === 'CLICK') {
                        _this.setPixelClickStyle(pixelId, color);
                    }
                    if(type === 'HOVER') {
                        _this.setPixelHoverStyle(pixelId, color);
                    }
                    if(type === 'LEAVE') {
                        _this.setPixelLeaveStyle(pixelId);
                    }
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

        this.pixels.forEach(px => {
            px.style = 'width: 1px; height: 1px; background-color:' + px.Color__r.Value__c + ';';
            //if(matrix[px.Y__c] === undefined) matrix[px.Y__c] = { index : px.Y__c, pixels : [] };
            //if(matrix[px.Y__c].pixels[px.X__c] === undefined) matrix[px.Y__c].pixels[px.X__c] = px;
        });

        /*
        for(let p = 0; p < this.pixels.length; p++) {
            
            let pixel = this.pixels[p];
            pixel.style = 'background-color:' + pixel.Color__r.Value__c + ';';

            if(rowIndex < pixel.Y__c) {
                rowIndex = pixel.Y__c; 
                matrix.push({ index : rowIndex, pixels : [] });
            }
            
            matrix[rowIndex].pixels.push(pixel);

        }*/

        this.pixelMatrix = matrix;
        
    }

    toggleGrid(e) {
        this.gridWidth = this.gridWidth === 0 ? 1 : 0;   
    }

    zoomIn(e) {

        let element = this.template.querySelector('.icon-flex');
        element.style.transform = 'scale(2.0)';
    } 

    zoomOut(e) {
        let element = this.template.querySelector('.icon-flex');
        element.style.transform = 'scale(1.0)';
    } 

    setPixelClickColor(e) {

        let newColor = e.detail.value;
        const regex = new RegExp('^#(?:[0-9a-fA-F]{3}){1,2}$', 'g');

        if(regex.test(newColor) && newColor.length === 7) {
            this.pixelClickColor = newColor;
            e.srcElement.style.color = newColor;
        }
        
    }

    findColorByValue(val) {
        return this.colors.find(item => item.Value__c === val);
    }

    setPixelHoverStyle(sfid, color) {
        let style = 'border: solid 1px ' + color + ';';
        let element = this.template.querySelector('[data-sfid="' + sfid + '"]');
        element.style.borderColor = color;
        element.style.borderStyle = 'solid';
        element.style.borderWidth = '1px';
    }

    setPixelLeaveStyle(sfid) {
        let element = this.template.querySelector('[data-sfid="' + sfid + '"]');
        element.style.borderWidth = '0px';
    }

    setPixelClickStyle(sfid, color) {
        let element = this.template.querySelector('[data-sfid="' + sfid + '"]');
        element.style.backgroundColor = color;
        element.dataset.color = color;
    }

    async pixelHover(e) {
        let sfid = e.srcElement.dataset.sfid;
        await writePixelHover({ 
            iconId : this.recordId,
            pixelId : sfid,
            color : '#CC3333' 
        });
    }

    async pixelLeave(e) {
        let sfid = e.srcElement.dataset.sfid;
        await writePixelLeave({ 
            iconId : this.recordId,
            pixelId : sfid
        });
    }

    async pixelClick(e) {

        let sfid = e.srcElement.dataset.sfid;
        //let color = e.srcElement.dataset.color;
        //if(color === '#FFFFFF') color = '#000000';
        //else color = '#FFFFFF';

        this.setPixelClickStyle(sfid, this.pixelClickColor);

        let colorRecord = this.findColorByValue(this.pixelClickColor);

        let updatedRecord = {
            fields: {
                Id : sfid,
                InteractionId__c : this.componentInstanceId
            }
        };

        if(colorRecord === undefined) {
            updatedRecord.fields.ColorValue__c = this.pixelClickColor;
            updatedRecord.fields.Color__c = null;
        }
        else {
            updatedRecord.fields.Color__c = colorRecord.Id;
        }

        try {
            await updateRecord(updatedRecord);
        }
        catch(error) {
            console.log(error);
        }
        finally {
            console.log('Pixel color updated.');
        }
        

    }

}