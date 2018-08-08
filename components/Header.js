import React from 'react'
import BlockContent from '@sanity/block-content-to-react';
import Subscribe from './Subscribe'
import imageUrlBuilder from '@sanity/image-url'
import client from '../lib/client'

const builder = imageUrlBuilder(client)

function urlFor (source) {
  return builder.image(source)
}

class Header extends React.Component {
  render () {
    const { title, subtitle, coverArt, hosts } = this.props.podcast
    console.log(this.props)
    return (
      <header className="header">
        <div className="header__left">
          <img
            className="header__logo"
            src={urlFor(coverArt)
              .width(300)
              .url()}
            alt="Syntax"
          />
        </div>
        <div className="header__right">
          <div className="title">
            <h2 className="tagline">
              {title} {subtitle}
            </h2>
            <a
              target="_blank"
              href="https://docs.google.com/forms/d/e/1FAIpQLSfQlAo1wXHiJMySdU-h8QMtfoz92aMS9eycEHXB6eRCLh8KHA/viewform"
              className="title__potluck-btn"
            >
              Ask a Potluck Question →
            </a>
          </div>
          <div className="people">
            {hosts.map(({ _id, name, social, description, image }) => (
              <div key={_id} className="person">
                <img src={urlFor(image).width(75).url()} alt="" className="avatar" />
                <h3>{name}</h3>
                <a
                  target="_blank"
                  href={`https://twitter.com/${social.twitter}`}
                  className="person__social person__social--twitter"
                >
                  @{social.twitter}
                </a>
                <BlockContent blocks={description} />
              </div>
            ))}
          </div>
        </div>
        <Subscribe />
      </header>
    )
  }
}
export default Header
