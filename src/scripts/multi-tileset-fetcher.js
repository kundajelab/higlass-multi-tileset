const GLOBAL_PLUGIN_DATA_FETCHERS = window.higlassDataFetchersByType;

export default class MultiTilesetDataFetcher {
  constructor(HGC, dataConfig, pubSub) {
    this.dataConfig = dataConfig;
    this.trackUid = HGC.libraries.slugid.nice();
    if (!dataConfig.configs || !dataConfig.configs.length) {
      throw new Error("Need 1 or more configs for multi-tileset data fetcher");
    }
    this.dataFetchers = dataConfig.configs.map(config => HGC.dataFetchers.getDataFetcher(config, pubSub, GLOBAL_PLUGIN_DATA_FETCHERS || {}));
    this.primaryTileset = Math.max(dataConfig.configs.findIndex(config => config.primary), 0);
    this.filters = dataConfig.configs.map(_ => (x => x));
  }

  /**
   * Sets a filter for tiles to fetch
   * @param {Function} filter The filter function to use for this index
   * @param {number} index The index (default: primary tileset)
   */
  setFilter(filter, index = this.primaryTileset) {
    this.filters[index] = filter;
  }

  tilesetInfo(callback) {
    this.tilesetInfoLoading = true;
    const tilesetInfos = this.dataFetchers.map(fetcher => new Promise(resolve => fetcher.tilesetInfo(resolve)));
    Promise.all(tilesetInfos).then(ti => {
      this.tilesetInfoLoading = false;
      // Should validate other tileset infos here
      // If no validation, could just do dataFetchers[primaryTileset].tilesetInfo()
      callback(ti[this.primaryTileset]);
    })
  }

  fetchTilesDebounced(callback, tileIds) {
    const tilesPromise = this.dataFetchers.map((df, i) => new Promise(resolve => {
      const localTileIds = tileIds.filter(this.filters[i]);
      if (localTileIds.length) df.fetchTilesDebounced(resolve, localTileIds);
      else resolve([]);
    }));
    Promise.all(tilesPromise).then(allTiles => {
      const out = {};
      for (const tileId in allTiles[this.primaryTileset]) {
        out[tileId] = allTiles.map(tiles => tiles[tileId]);
        out[tileId].tilePositionId = tileId;
      }
      callback(out);
    })
  }
}
MultiTilesetDataFetcher.config = {
  type: 'multi-tileset',
};