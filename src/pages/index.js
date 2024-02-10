import { Roboto, Kalam } from 'next/font/google'
import Hero from '../components/Hero.js';
import RaceTile from '../components/RaceTile.js';
import SectionHeader from '../components/SectionHeader.js';
import SectionSubHeader from '../components/SectionSubHeader.js';
import MetaHead from '@/components/MetaHead.js';

const { Client } = require("@notionhq/client")

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100','300', '500']
})

const kalam = Kalam({
  subsets: ['latin'],
  weight: ['700']
})

export default function Home(props) {
  return (
    <main className={`dark:bg-black ${roboto.className}`}>
      <MetaHead />
      <Hero />
      <div className="max-w-7xl w-[90%] mx-auto my-0 text-black dark:text-white">
        <SectionHeader text="Upcoming Races"/>
        <div className="grid md:grid-cols-2 gap-2 py-2 auto-rows-fr">
          {props.upcoming.map((data, idx) => {
            return <RaceTile key={data.id} data={data} idx={idx} />
          })}
        </div>

        <SectionHeader text="Race Stats & Highlights"/>
        <ul className='grid grid-cols-2 md:grid-cols-4 gap-2 auto-rows-fr p-2'>
          <li className='grid text-center border-[1px] border-dotted border-black dark:border-white rounded-xl p-1' key="marathon">
            <span className='font-light uppercase text-xs'>marathons</span>
            <span className={`${kalam.className} text-4xl leading-[1.25em]`}>{props.stats.counts.marathon}</span>
          </li>
          <li className='grid text-center border-[1px] border-dotted border-black dark:border-white rounded-xl p-1' key="a=half">
            <span className='font-light uppercase text-xs'>half marathons</span>
            <span className={`${kalam.className} text-4xl leading-[1.25em]`}>{props.stats.counts.half}</span>
          </li>
          <li className='grid text-center border-[1px] border-dotted border-black dark:border-white rounded-xl p-1' key="10k">
            <span className='font-light uppercase text-xs'>10k</span>
            <span className={`${kalam.className} text-4xl leading-[1.25em]`}>{props.stats.counts.tenk}</span>
          </li>
          <li className='grid text-center border-[1px] border-dotted border-black dark:border-white rounded-xl p-1' key="5k">
            <span className='font-light uppercase text-xs'>5k</span>
            <span className={`${kalam.className} text-4xl leading-[1.25em]`}>{props.stats.counts.fivek}</span>
          </li>
        </ul>
        
        <SectionSubHeader text="Race Stats & Highlights" />
        <ul className='grid auto-rows-fr p-2 md:grid-cols-2 gap-2'>
          {props.records.map((record, idx) => {
            let finishTime = record.race_stats.finish_time;
            let raceDate = new Date(record.date);
            return <li key={idx} className='grid text-center border-[1px] border-dotted border-black dark:border-white rounded-xl p-1'>
              <span className='text-sm font-light uppercase'>{record.race_type === 'marathon' ? 'marathon' : 'half-marathon'}</span>
              <span className={`text-2xl ${kalam.className} text-center p-0 leading-[1.75rem]`}>{finishTime.hour}:{finishTime.minutes}:{finishTime.sec}</span>
              <span className='text-sm font-light italic'>{record.name} • {raceDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: '2-digit', 
                            year: 'numeric'
                        })}</span>
            </li>
          })}
        </ul>


        <SectionHeader text="Previous Races" />
        <div className="grid md:grid-cols-2 gap-2 py-2">
          {props.previous.map((data, idx) => {
            return <RaceTile key={data.id} data={data} idx={idx} />
          })}
        </div>
      </div>
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

  var pr = [
      previous.filter((p) => p.race_type === 'marathon').sort((a,b) => {
        return a.race_stats.finish_time.epoch - b.race_stats.finish_time.epoch
      })[0],
      previous.filter((p) => p.race_type === 'half').sort((a,b) => {
        return a.race_stats.finish_time.epoch - b.race_stats.finish_time.epoch
      })[0]
    ]  
  return {
      props: {
          upcoming: upcoming,
          previous: previous,
          stats: stats,
          records: pr
      }
  }
}
