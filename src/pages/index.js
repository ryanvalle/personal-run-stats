import { Roboto } from 'next/font/google'
import Hero from '../components/Hero.js';
import MetaHead from '@/components/MetaHead.js';

const { Client } = require("@notionhq/client")

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100','300', '500']
})

export default function Home(props) {
  return (
    <main className={roboto.className}>
      <MetaHead />
      <Hero />
      <h2>Upcoming Races</h2>
      <ul>
        {props.upcoming.map(data => {
          return <li>{data.name} • {new Date(data.date).toLocaleString('default', { month: 'short', day: '2-digit', year: 'numeric' }) }</li>
        })}
      </ul>
      <h2>Running Stats</h2>
      <ul>
        <li>{props.stats.counts.marathon} marathons</li>
        <li>{props.stats.counts.half} half marathons</li>
        <li>{props.stats.counts['10k']} 10k's</li>
        <li>{props.stats.counts['5k']} 5k's</li>
      </ul>
      <h2>Previous Races</h2>
      <ul>
        {props.previous.map(data => {
          return <li>{data.name} • {new Date(data.date).toLocaleString('default', { month: 'short', day: '2-digit', year: 'numeric' }) }</li>
        })}
      </ul>
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

    return {
      uid: properties.id || null,
      name: properties.name.title[0].plain_text,
      race_type: properties.type.select.name,
      date: properties.date.date.start + 'T00:00:00',
      race_stats: {
        finish_time: {
          hour: properties['result-hour'].number,
          minutes: properties['result-minutes'].number,
          sec: properties['result-sec'].number
        },
        bib: properties.bib.number,
        results_url: properties['result-url'].url
      },
      recap_vide: properties['recap-video-url'].url,
      location: {
        city: location[0],
        state: location.length > 1 ? location[1] : '',
        id: properties.location.select.name
      },
      event_url: properties['event-url'].url
    };
  });

  var dateNow = new Date().getTime().toString();
  var results = await Promise.all(mappedResults);
  var previous = results.filter(resp => {
    let respDate = new Date(resp.date).getTime().toString();
    return respDate < dateNow;
  })
  var upcoming = results.filter(resp => {
    let respDate = new Date(resp.date).getTime().toString();
    return respDate > dateNow;
  })

  var stats = {
    counts: {},
    locations: {}
  }
  previous.forEach(resp => {
    stats['counts'][resp.race_type] = (stats.counts[resp.race_type] || 0) + 1,
    stats['locations'][resp.location.id] = (stats.locations[resp.location.id] || 0) + 1
  })

  return {
      props: {
          upcoming: upcoming,
          previous: previous,
          stats: stats
      }
  }
}
