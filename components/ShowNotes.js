import React from 'react'
import BlockContent from '@sanity/block-content-to-react';

export default ({ show = {}, setCurrentPlaying }) =>
  <div className="showNotes">
    <p className="show__date">{show.displayDate}</p>
    <h2>{show.title}</h2>
    <button className="button" onClick={() => setCurrentPlaying(show.displayNumber)}><span className="icon">🎵</span> Play Episode {show.displayNumber}</button>
    <a className="button" download href={`${show.url}?dl`}><span className="icon">👇</span> Download Show</a>
    {<a className="button" href={`https://syntaxfm.sanity.studio/desk/episode/edit/${show._id}`} target='_blank'><span className="icon">✏️</span> Edit Show Notes</a>}
    <BlockContent blocks={show.content} serializers={{marks: { timestamp: () => <span></span>} }} />
  </div>

