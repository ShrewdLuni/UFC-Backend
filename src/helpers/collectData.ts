import axios from 'axios';
import * as cheerio from 'cheerio';
import { Event, Fight, Fighter } from '../types/types';

const collectData = async () => {
  const events: string[] = await collectEvents();
  console.log(JSON.stringify(await collectFights(events[1]),null,2))
  // for(const link of events){
  //   console.log(JSON.stringify(await collectFights(link), null, 2))
  //   await new Promise(r => setTimeout(r, 500));
  // }
}

const collectEvents = async () => {
  const $ = await fetchHTML("http://www.ufcstats.com/statistics/events/completed?page=all");
  return $("body > section > div > div > div > div.b-statistics__sub-inner > div > table > tbody > tr").map((_, element) => $(element).find("td.b-statistics__table-col > i > a").attr("href")).get().filter(Boolean);
};

const collectFights: (link: string) => Promise<Event> = async (link: string) => {
  const $ = await fetchHTML(link);
  const fights: Fight[] = []
  $("body > section > div > div > table > tbody > tr").each((index, row) => {
    const fight: Fight = processFightRow($(row))
    fights.push(fight)
    // if(fight.fighters.one.name && fight.fighters.one.link){
    //   collectFighter(fight.fighters.one.link)
    // }
    // if(fight.fighters.one.name && fight.fighters.one.link){
    //   collectFighter(fight.fighters.two.link)
    // }
  });
  return {
    name: clean($("body > section > div > h2").text()),
    date: clean($("body > section > div > div > div.b-list__info-box.b-list__info-box_style_large-width > ul > li:nth-child(1)").text().split(":")[1]),
    location: clean($("body > section > div > div > div.b-list__info-box.b-list__info-box_style_large-width > ul > li:nth-child(2)").text().split(":")[1]),
    fights: fights
  }
};

const collectFighter = async (link: string): Promise<Fighter> => {
  const $ = await fetchHTML(link);
  const [height, weight, reach, stance, dob] = $("body > section > div > div > div.b-list__info-box.b-list__info-box_style_small-width.js-guide > ul > li").map((_, listItem) => clean($(listItem).text().split(":")[1])).get();
  const name = clean($("body > section > div > h2 > span.b-content__title-highlight").text())
  const nickname = clean($("body > section > div > p").text())
  return { name, nickname, height, weight, reach, stance, dob };
};

const processFightRow: ($row: cheerio.Cheerio) => Fight = ($row: cheerio.Cheerio) => {
  const getData = ($row: cheerio.Cheerio, tdIndex: number, pIndex: number = 0, toFind: string = 'p'): string => {
    return clean($row.find('td').eq(tdIndex).find(toFind).eq(pIndex).text());
  };

  const getFighterData = (fighterIndex: number) => ({
    name: getData($row, 1, fighterIndex, 'a'),
    link: clean($row.find('td').eq(1).find('a').eq(fighterIndex).attr('href')!)
  });

  const getFightStats = (statIndex: number) => ({
    one: getData($row, statIndex),
    two: getData($row, statIndex, 1),
  });

  return {
    winner: getData($row, 0, 0, 'a'),
    fighters: {
      one: getFighterData(0),
      two: getFighterData(1),
    },
    KD: getFightStats(2),
    STR: getFightStats(3),
    TD: getFightStats(4),
    SUB: getFightStats(5),
    weightClass: getData($row, 6),
    method: {
      name: getData($row, 7),
      details: getData($row, 7, 1),
    },
    round: getData($row, 8),
    time: getData($row, 9),
  };
};

const clean = (text: string) => text.trim().replace(/\s+/g, ' ');

const fetchHTML = async (url: string) => {
  console.log(url)
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);
  return $;
};

collectData();