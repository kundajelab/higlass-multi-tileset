import register from 'higlass-register';
import MultiTilesetDataFetcher from './scripts/multi-tileset-fetcher';

register({
  dataFetcher: MultiTilesetDataFetcher,
  config: MultiTilesetDataFetcher.config
}, {
  pluginType: 'dataFetcher'
});

export default MultiTilesetDataFetcher;