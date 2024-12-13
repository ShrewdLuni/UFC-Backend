import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import * as cheerio from 'cheerio';
import { Event, Fight, Fighter } from '../types/types';
import { createEvent } from '../services/event';
import { createFighter, getFighterByUniqueFields } from '../services/fighter';
import { createFight } from '../services/fight';
import { serializeEventWithID } from '../serializers/event';
import { serializeFighterWithID } from '../serializers/fighter';
import { serializeFightWithID } from '../serializers/fight';
import { ExtendedEvent, ExtenedFighter } from '../types/extendedTypes';
import { roundTo } from './utils';

const http = rateLimit(axios.create(), { maxRequests: 100, perMilliseconds: 1000 })

const collectData = async () => {
  console.time(`DATA`);
  const events: string[] = await collectEventLinks();
  events.shift()
  let i = 0
  for(const link of events){
    console.time(`collectEventData - ${link} ${i}/${events.length} ${roundTo((i / events.length) * 100, 2)}%`);
    await collectEventData(link)
    console.timeEnd(`collectEventData - ${link} ${i}/${events.length} ${roundTo((i / events.length) * 100, 2)}%`);
    i++;
  }
  console.timeEnd(`DATA`);
}

const collectEventLinks = async () => {
  const $ = await fetchHTML("http://www.ufcstats.com/statistics/events/completed?page=all");
  return $("body > section > div > div > div > div.b-statistics__sub-inner > div > table > tbody > tr").map((_, element) => $(element).find("td.b-statistics__table-col > i > a").attr("href")).get().filter(Boolean);
};

const collectEventData: (link: string) => Promise<Event> = async (link: string) => {
  const $ = await fetchHTML(link);
  const fights: Fight[] = []
  const data = {
    name: clean($("body > section > div > h2").text()),
    date: clean($("body > section > div > div > div.b-list__info-box.b-list__info-box_style_large-width > ul > li:nth-child(1)").text().split(":")[1]),
    location: clean($("body > section > div > div > div.b-list__info-box.b-list__info-box_style_large-width > ul > li:nth-child(2)").text().split(":")[1]),
  }

  const serializedEvent = serializeEventWithID(await createEvent(data))

  $("body > section > div > div > table > tbody > tr").each((index, row) => {fights.push(collectFight($(row)))});

  for(const fight of fights){

    const fighterOne = await collectFighter(fight.fighterOne.link!)
    fight.fighterOne.id = fighterOne.id

    const fighterTwo = await collectFighter(fight.fighterTwo.link!)
    fight.fighterTwo.id = fighterTwo.id
    const serialziedFight = serializeFightWithID(await createFight(fight, serializedEvent.id))
  }
  return {
    name: data.name,
    date: data.date,
    location: data.location,
    fights: fights
  }
};

const fighterCache = new Map<string, ExtenedFighter>();

const collectFighter = async (link: string): Promise<ExtenedFighter> => {
  if (fighterCache.has(link)) {
    return fighterCache.get(link)!;
  }
  const $ = await fetchHTML(link);
  const [height, weight, reach, stance, dob] = $("body > section > div > div > div.b-list__info-box.b-list__info-box_style_small-width.js-guide > ul > li").map((_, listItem) => clean($(listItem).text().split(":")[1])).get();
  const name = clean($("body > section > div > h2 > span.b-content__title-highlight").text())
  const nickname = clean($("body > section > div > p").text())


  const heightInInches = (height: string) => height.split("'").map(val => parseInt(val.replace('"', ''), 10)).reduce((acc, curr, index) => acc + (index === 0 ? curr * 12 : curr), 0);
  const data: Fighter = {
    name,
    nickname,
    height: heightInInches(height),
    weight: parseInt(weight.replace(/[^\d]/g, ''), 10),
    reach: parseInt(reach.replace(/[^\d]/g, ''), 10),
    stance,
    dob: dob == "--" ? null : dob
  }
  const existingFighter = await getFighterByUniqueFields(name, dob)
  const serializedFighter = existingFighter
  ? serializeFighterWithID(existingFighter)
  : serializeFighterWithID(await createFighter(data));
  fighterCache.set(link, serializedFighter);
  return serializedFighter;
};

const collectFight: ($row: cheerio.Cheerio) => Fight = ($row: cheerio.Cheerio) => {
  const getData = ($row: cheerio.Cheerio, tdIndex: number, pIndex: number = 0, toFind: string = 'p'): string => {
    return clean($row.find('td').eq(tdIndex).find(toFind).eq(pIndex).text());
  };

  const getFighterData = (fighterIndex: number) => ({
    name: getData($row, 1, fighterIndex, 'a'),
    link: clean($row.find('td').eq(1).find('a').eq(fighterIndex).attr('href')!)
  });

  return {
    winner: getData($row, 0, 0, 'a'),
    fighterOne: getFighterData(0),
    fighterTwo: getFighterData(1),
    weightClass: getData($row, 6),
    method: {
      name: getData($row, 7),
      details: getData($row, 7, 1),
    },
    round: +getData($row, 8),
    time: getData($row, 9),
  };
};

const clean = (text: string) => text.trim().replace(/\s+/g, ' ');

const fetchHTML = async (url: string) => {
  // console.time(`get - ${url}`);
  const response = await http.get(url);
  // const response = await fetch(url);
  // console.timeEnd(`get - ${url}`)
  // console.log('\n')
  const html = response.data;
  // const html = await response.text();
  const $ = cheerio.load(html);
  return $;
};

collectData();