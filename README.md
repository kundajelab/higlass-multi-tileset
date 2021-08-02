# higlass-multi-tileset
Multi-tileset data fetcher for HiGlass

## Installation

If you are using NPM:
```sh
npm install higlass-multi-tileset
```

Then you can load it by adding this import to your JavaScript:

```js
import MultiTilesetDataFetcher from 'higlass-multi-tileset';

// Alternatively, if you don't need programmatic access:
import 'higlass-multi-tileset';
```

Otherwise, load `higlass-multi-tileset` from a CDN. You can use this script tag:

```html
<script src="https://unpkg.com/higlass-multi-tileset"></script>
<!-- Make sure to load higlass-multi-tileset before hglib.js -->
<script src="hglib.js"></script>
```

## Usage

The multi tileset data fetcher can be used to fetch data from multiple tilesets at once.

```js
{
  "data": {
    // The "type" field tells HiGlass to use this data fetcher
    "type": "multi-tileset",
    // An array of data configs 
    "configs": [
      {
        "server": "http://localhost:8001/api/v1",
        "tilesetUid": "my-bigwig-tileset",
      },
      {
        "server": "https://my-higlass-server.com/api/v1",
        "tilesetUid": "my-fasta-tileset",
        
        // The primary data config will be the source of
        // tileset info, and only tiles that exist in the
        // primary tileset will be returned.

        // Defaults to the first config specified (index 0)
        "primary": true
      },
      {
        "type": "local-tiles",
        "tilesetInfo": { ... },
        "tiles": { ... }
      }
    ]
  },
  // Other options for the track go here
  ...
}
```

The tiles returned from the data fetcher will have an array for the `tileData` property that includes the tile data from every config specified.

For example, in your track you might use:

```js
renderTile(tile) {
  const firstTile = tile.tileData[0];
  render(firstTile.dense);
  // The second data config is the source for this tile data
  const secondTile = tile.tileData[1];
}
```

## Features

This data fetcher comes with a special feature: tile ID filters. If you want to filter out some tile IDs from some data configs to avoid fetching them when they aren't needed, you can use the `setFilter()` function on the dataFetcher.

```js
updateOptions(newOptions) {
  if (
    this.dataFetcher.constructor.config &&
    this.dataFetcher.constructor.config.type == 'multi-tileset'
  ) {
    // Applies to the primary data config (no second argument)
    this.dataFetcher.setFilter(tileId => tileId != 'banned-id');
    // Don't fetch any tiles from the second data config
    // (second argument is index)
    this.dataFetcher.setFilter(_ => false, 1);
  }
}
```

This can be helpful to improve performance in situations where one of the data configs is not necessary. For example, in [`higlass-dynseq`](https://github.com/kundajelab/higlass-dynseq), a filter is applied to the FASTA data config to avoid fetching the sequence unless it is visible on screen.

## Support
[File an issue](https://github.com/kundajelab/higlass-multi-tileset/issues) if you have found a bug, would like help resolving a problem, or want to ask a question about using the track.

Alternatively, contact [Arjun Barrett](https://github.com/101arrowz) for more information.