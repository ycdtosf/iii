# III - Inefficient Icon Inventory

Make Icons in Salesforce for all the wrong reasons.

## Data Model

### Icon

The Icon object represents an icon with some dimensions.

* Name
* Dimensions

### Pixel

The Pixel object represents a space in the Icon grid.

* Name (AutoNumber)
* Icon (MD)
* Color (Lookup)

### Color

The Color object represents a color in a family of colors (ex. HEX)

* Name (Text)
* Value (HEX/RBG/etc)

### Color Family

TBD

# Components

## LWCs

### iconDisplay

The purpose of iconDisplay is to render the Icon.

# Backlog

* Pixel coordinates should not exceed Icon dimensions.