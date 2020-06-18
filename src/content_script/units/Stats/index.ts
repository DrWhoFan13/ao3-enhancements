import { Options, log } from '@/common';
import { TotalStats } from './TotalStats';
import { ChapterStats } from './ChapterStats';
import Unit from '@/content_script/Unit';

export class Stats extends Unit {
  total: TotalStats;
  chapter: ChapterStats;

  constructor(options: Options) {
    super(options);

    this.total = new TotalStats(options);
    this.chapter = new ChapterStats(options);
  }

  get enabled(): boolean {
    return (
      this.options.showTotalTime ||
      this.options.showTotalFinish ||
      this.options.showChapterTime ||
      this.options.showChapterFinish ||
      this.options.showChapterDate ||
      this.options.showChapterWords ||
      this.options.showStatsColumns ||
      this.options.showKudosHitsRatio
    );
  }

  async clean(): Promise<void> {
    await this.total.clean();
    await this.chapter.clean();

    for (const statsElement of document.querySelectorAll('dl.stats')) {
      statsElement.classList.remove('columns');
    }

    for (const statValueElement of document.querySelectorAll('dl.stats dd')) {
      const original = (statValueElement as HTMLElement).dataset[
        'ao3eOriginal'
      ];
      if (original) {
        statValueElement.textContent = original;
      }
      delete (statValueElement as HTMLElement).dataset['ao3eOriginal'];
    }
  }

  async beforeReady(): Promise<void> {
    if (this.total.enabled) await this.total.beforeReady();
    if (this.chapter.enabled) await this.chapter.beforeReady();
  }

  async ready(): Promise<void> {
    if (this.total.enabled) await this.total.ready();
    if (this.chapter.enabled) await this.chapter.ready();

    if (this.options.showStatsColumns) {
      for (const statsElement of document.querySelectorAll('dl.stats')) {
        statsElement.classList.add('columns');
      }
    }

    // Fix thousands separators
    for (const statValueElement of document.querySelectorAll('dl.stats dd')) {
      // Get stat values as numbers if they are numbers
      // Make sure to split on / so we get both chapter counts
      const statNumericValues: [boolean, string][] = statValueElement
        .textContent!.replace(/\,/g, '')
        .split('/')
        .map((val) => [!isNaN(+val), val]);
      if (!statNumericValues.some(([isNum]) => isNum)) continue;
      (statValueElement as HTMLElement).dataset[
        'ao3eOriginal'
      ] = statValueElement.textContent!;
      statValueElement.textContent = statNumericValues
        .map(([isNum, val]) => {
          if (isNum) {
            return val.replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009');
          } else {
            return val;
          }
        })
        .join('/');
    }
  }
}
