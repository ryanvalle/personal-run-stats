import { Roboto, Orbitron } from 'next/font/google'
import Hero from '../components/Hero.js';
import NextRaceCard from '../components/NextRaceCard.js';
import RaceTile from '../components/RaceTile.js';
import RaceHistory from '../components/RaceHistory.js';
import TrendChart from '../components/TrendChart.js';
import StatCounter from '../components/StatCounter.js';
import SectionHeader from '../components/SectionHeader.js';
import SectionSubHeader from '../components/SectionSubHeader.js';
import MetaHead from '@/components/MetaHead.js';
import { TYPE_LABELS, raceMiles, formatPace } from '../helpers/race';
import { Client } from "@notionhq/client"

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '500', '700']
})

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['800']
})

const COUNT_CARDS = [
  ['marathon', 'Marathons'],
  ['half', 'Half Marathons'],
  ['tenk', '10Ks'],
  ['fivek', '5Ks']
];

export default function Home(props) {
  const { upcoming, previous, stats, records, prIds } = props;
  const [nextRace, ...laterRaces] = upcoming;
  const maxYearCount = Math.max(...stats.byYear.map(([, count]) => count), 1);

  return (
    <main className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 ${roboto.className}`}>
      <MetaHead data={{ secondary: 'Every race, record, and mile — personal records, finish-time trends, and upcoming events.' }} />
      <Hero stats={stats.hero} />
      <div className="max-w-7xl w-[90%] mx-auto pb-16">
        {nextRace && (
          <>
            <SectionHeader emoji="⏱" text="Next Up" />
            <NextRaceCard race={nextRace} />
            {laterRaces.length > 0 && (
              <>
                <SectionSubHeader text="Also on the calendar" />
                <div className="grid md:grid-cols-2 gap-3 pt-3">
                  {laterRaces.map((race) => <RaceTile key={race.id} data={race} />)}
                </div>
              </>
            )}
          </>
        )}

        <SectionHeader emoji="📊" text="Stats & Records" />
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
          {COUNT_CARDS.map(([key, label]) => (
            <li
              key={key}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center transition-transform duration-300 hover:-translate-y-1"
            >
              <StatCounter className={`${orbitron.className} text-3xl md:text-4xl`} value={stats.counts[key] || 0} />
              <div className="uppercase text-xs tracking-widest text-slate-500 pt-2">{label}</div>
            </li>
          ))}
        </ul>

        {records.length > 0 && (
          <>
            <SectionSubHeader text="Personal Records" />
            <ul className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 pt-3">
              {records.map((record) => {
                const finishTime = record.race_stats.finish_time;
                const raceDate = new Date(record.date);
                return (
                  <li
                    key={record.id}
                    className="relative overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-50 to-white dark:from-amber-500/10 dark:to-slate-900 p-4 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <span className="absolute right-3 top-3 text-2xl" aria-hidden="true">🏆</span>
                    <span className="uppercase text-xs tracking-widest text-amber-600 dark:text-amber-400 font-medium">
                      {TYPE_LABELS[record.race_type] || record.distance_string}
                    </span>
                    <div className={`${orbitron.className} text-3xl pt-1`}>
                      {finishTime.hour}:{finishTime.minutes}:{finishTime.sec}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 pt-2">
                      {formatPace(finishTime.epoch, raceMiles(record.race_type))} /mi pace
                    </p>
                    <p className="text-sm font-light italic pt-1">
                      {record.name} • {raceDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </p>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {stats.byYear.length > 0 && (
          <>
            <SectionSubHeader text="Races Per Year" />
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-6 mt-3 space-y-2">
              {stats.byYear.map(([year, count]) => (
                <div key={year} className="flex items-center gap-3 group">
                  <span className="w-12 text-sm text-slate-500">{year}</span>
                  <div className="flex-1 h-5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300 group-hover:from-orange-600 group-hover:to-amber-500"
                      style={{ width: `${(count / maxYearCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-sm font-medium text-right">{count}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <SectionHeader emoji="📈" text="Finish Times Over the Years" />
        <TrendChart races={previous} />

        <SectionHeader emoji="🏁" text="Race History" />
        <RaceHistory races={previous} prIds={prIds} />
      </div>
      <footer className="border-t border-dashed border-slate-300 dark:border-slate-800 py-8 text-center text-sm text-slate-500">
        <span className="font-medium">running</span>with<span className="font-medium">ryan</span> 🏃‍♂️ • est. 2015
      </footer>
    </main>
  )
}

export async function getServerSideProps(ctx) {
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate'
  )
  // Initializing a client
  const notion = new Client({
      auth: process.env.NOTION_TOKEN
  })
  // https://www.notion.so/1a9e4ac2a61f44939d8c3b6108563e9f?v=13be8888c1c643859841357a0e929b89&pvs=4
  const databaseId = '1a9e4ac2a61f44939d8c3b6108563e9f'; // homepage v2 content
  const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [{
        property: "date",
        direction: "descending"
      }]
  });
  var mappedResults = response.results.map(async (resp) => {
    let properties = resp.properties || {};
    let location = (properties.location.select.name || '').split('|');
    let distanceMap = {
      marathon: '26.2 miles',
      half: '13.1 miles',
      tenk: '6.21 miles',
      fivek: '3.1 miles'
    };

    let distance_string = distanceMap[properties.type.select.name];
    return {
      id: resp.id || null,
      name: properties.name.title[0].plain_text,
      race_type: properties.type.select.name,
      distance_string: distance_string || `${properties.type.select.name} miles`,
      date: properties.date.date.start + 'T00:00:00',
      race_stats: {
        finish_time: {
          hour: (properties['result-hour'].number || 0).toLocaleString('en-US', {minimumIntegerDigits: 2}),
          minutes: (properties['result-minutes'].number || 0).toLocaleString('en-US', {minimumIntegerDigits: 2}),
          sec: (properties['result-sec'].number || 0).toLocaleString('en-US', {minimumIntegerDigits: 2}),
          epoch: (properties['result-hour'].number * 60 * 60) + (properties['result-minutes'].number * 60) + properties['result-sec'].number
        },
        bib: properties.bib.number,
        results_url: properties['result-url'].url
      },
      recap_video: properties['recap-video-url'].url,
      location: {
        city: location[0],
        state: location.length > 1 ? location[1] : '',
        id: properties.location.select.name
      },
      event_url: properties['event-url'].url,
      event_url_text: (properties['event-url-text'].rich_text[0] || {}).plain_text || ''
    };
  });

  var dateNow = new Date().getTime().toString();
  var results = await Promise.all(mappedResults);
  var previous = results.filter(resp => {
    let respDate = new Date(resp.date).getTime().toString();
    return respDate < dateNow;
  });

  var upcoming = results.filter(resp => {
    let respDate = new Date(resp.date).getTime().toString();
    return respDate > dateNow;
  }).reverse();

  var stats = {
    counts: {},
    locations: {}
  }
  previous.forEach(resp => {
    stats['counts'][resp.race_type] = (stats.counts[resp.race_type] || 0) + 1,
    stats['locations'][resp.location.id] = (stats.locations[resp.location.id] || 0) + 1
  })

  // fastest finish per distance (skips races without a recorded time)
  var records = Object.keys(TYPE_LABELS).map((type) => {
    return previous
      .filter((p) => p.race_type === type && p.race_stats.finish_time.epoch > 0)
      .sort((a, b) => a.race_stats.finish_time.epoch - b.race_stats.finish_time.epoch)[0];
  }).filter(Boolean);

  var totalMiles = previous.reduce((sum, race) => sum + raceMiles(race.race_type), 0);

  var byYearMap = {};
  previous.forEach((race) => {
    let year = new Date(race.date).getFullYear();
    byYearMap[year] = (byYearMap[year] || 0) + 1;
  });
  var byYear = Object.entries(byYearMap)
    .map(([year, count]) => [Number(year), count])
    .sort((a, b) => a[0] - b[0]);

  var raceYears = previous.map((race) => new Date(race.date).getFullYear());
  var yearsRunning = raceYears.length
    ? new Date().getFullYear() - Math.min(...raceYears) + 1
    : 0;

  stats.hero = {
    totalRaces: previous.length,
    totalMiles: Math.round(totalMiles * 10) / 10,
    totalCities: Object.keys(stats.locations).length,
    yearsRunning: yearsRunning
  };
  stats.byYear = byYear;

  return {
      props: {
          upcoming: upcoming,
          previous: previous,
          stats: stats,
          records: records,
          prIds: records.map((record) => record.id)
      }
  }
}
