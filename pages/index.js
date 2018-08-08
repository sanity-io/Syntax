import React from 'react';
import { withRouter } from 'next/router';
import ShowList from '../components/ShowList';
import ShowNotes from '../components/ShowNotes';
import Player from '../components/Player';
import Meta from '../components/meta';
import Page from '../components/Page';
import client from '../lib/client';

const query = `{
  "shows": *[_type == "episode" && (defined(file) || defined(fileUrl))]{
    ...,
    "url": coalesce(fileUrl, file.asset->url)
    }|order(schedule.publish desc),
  "podcast": *[_type == "podcast" && slug.current == $slug][0]{
    ...,
    "hosts": hosts[]->
  }
}`

const params = { slug: "syntax"}

async function getData() {
  const { shows = [], podcast } = await client.fetch(query, params)
  const showsNumber = shows.reduce((acc, curr, index) => ([...acc, { ...curr, displayNumber: `0${shows.length - index}`, number: shows.length - index }]), [])
  return { shows: showsNumber, podcast }
}

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    const currentShow = props.router.query.number || props.shows[0].displayNumber;

    this.state = {
      currentShow,
      currentPlaying: currentShow,
      shows: props.shows,
      podcast: props.podcast
    };
  }

  static async getInitialProps({ req }) {
    const protocol = req && req.headers.host.indexOf('syntax.fm') > -1 ? 'https' : req ? req.protocol : '';
    const baseURL = req ? `${protocol}://${req.headers.host}` : window.location.origin;
    const { shows, podcast } = await getData()
    return { shows, podcast, baseURL };
  }

  componentWillReceiveProps(nextProps) {
    const { query } = nextProps.url;
    if (query.number) {
      this.setState({ currentShow: query.number });
    }
  }
  componentDidMount() {
    this.subscription = client.listen(query, params).subscribe(async () => {
      const { shows, podcast } = await getData()
      this.setState({ shows, podcast })
    })
  }
  componentWillUnmount() {
    this.subscription.unsubscribe()
  }

  setCurrentPlaying = currentPlaying => {
    console.log('Setting current playing');
    this.setState({ currentPlaying });
  };

  render() {
    const { baseURL } = this.props;
    const {shows, podcast} = this.state
    const { currentShow, currentPlaying } = this.state;
    // Currently Shown shownotes
    const show = shows.find(show => show.displayNumber === currentShow);
    // Currently Playing
    const current = shows.find(show => show.displayNumber === currentPlaying);
    return (
      <Page podcast={podcast} >
        <Meta show={show} baseURL={baseURL} />
        <div className="wrapper">
          <div className="show-wrap">
            <Player show={current} />
            <ShowList
              shows={shows}
              currentShow={currentShow}
              currentPlaying={currentPlaying}
              setCurrentPlaying={this.setCurrentPlaying}
            />
            <ShowNotes show={show} setCurrentPlaying={this.setCurrentPlaying} />
          </div>
        </div>
      </Page>
    );
  }
}
export default withRouter(IndexPage)