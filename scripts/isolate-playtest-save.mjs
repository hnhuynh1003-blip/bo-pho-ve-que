// QA-001: change save namespaces only in the generated playtest copy.
import { readFileSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const PRODUCTION = 've_que_khoi_nghiep_';
const PLAYTEST = 'bpvq_playtest_';

export function rewritePlaytestSave(game, importer) {
  for (const [name, source, keys] of [
    ['js/game.js', game, [
      'progression_v1', 'accounts_v1', 'active_profile_v1', 'legacy_imported_v1',
      'profile_${profileId}_save_v13',
    ]],
    ['chuyen-save.html', importer, [
      'accounts_v1', 'active_profile_v1', "profile_'+id+'_save_v13",
    ]],
  ]) {
    if (source.includes(PLAYTEST) || keys.some(key => !source.includes(PRODUCTION + key))) {
      throw new Error('Unexpected source save namespace/schema: ' + name);
    }
  }
  // Preflight both inputs before either output is written.
  const output = {
    game: game.replaceAll(PRODUCTION, PLAYTEST),
    importer: importer.replaceAll(PRODUCTION, PLAYTEST),
  };
  if (Object.values(output).some(source => source.includes(PRODUCTION))) {
    throw new Error('Production save namespace leaked into playtest');
  }
  return output;
}

export function isolatePlaytestSave(root) {
  if (!root || basename(resolve(root)) !== 'playtest') {
    throw new Error('Expected an explicit generated playtest directory');
  }
  const gamePath = join(root, 'js/game.js');
  const importerPath = join(root, 'chuyen-save.html');
  const output = rewritePlaytestSave(readFileSync(gamePath, 'utf8'), readFileSync(importerPath, 'utf8'));
  writeFileSync(gamePath, output.game, 'utf8');
  writeFileSync(importerPath, output.importer, 'utf8');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  isolatePlaytestSave(process.argv[2]);
}
