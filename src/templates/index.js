import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

import { rhythm, scale } from '../utils/typography'


const BlogIndex = ({ data, location, pageContext }) => {
  const { humanPageNumber, numberOfPages, previousPagePath, nextPagePath } = pageContext;
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allContentfulBlogPost.edges
  const group = 4

  let listOfArrays = []
  let inner = []
  for (let i = 1; i <= numberOfPages ; i++) {
    inner.push(i)
    if (i % group === 0 || i === numberOfPages) {
      listOfArrays.push(inner)
      inner = []
    }
  }
  
  // Find which array we are currently in.
  let rangeArray = []
  let index = 0
  for (let i = 0; i < listOfArrays.length; i++) {
      if (listOfArrays[i].includes(humanPageNumber)) {
          index = i
          rangeArray = listOfArrays[i]
      }
  } 

  let isFirstGroup = index === 0 ? true : false
  let isLastGroup = index === listOfArrays.length - 1 ? true : false

  

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Bio />
        <p>
          No blog posts found on contentful lool.
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Bio />
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.node.title
          return (
            <div key={post.node.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4)
                }}
              >
                <Link style={{ 
                boxShadow: 'none', 
                letterSpacing: `0.5px`,
                textShadow: `0.5px 0px`,    
                }} to={"/" + post.node.slug}>
                  {title}
                </Link>
              </h3>
              <small>{post.node.createdAt}</small>
              <p>{post.node.subtitle}</p>
            </div>
          )
        })}
      </ol>
      <ul
          style={{
            marginTop: `65px`,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            listStyle: 'none',
            padding: 0,
          }}
        >
      {!isFirstGroup && (
            <Link style={{boxShadow: 'none', marginRight: '10px', color: 'purple'}} to={previousPagePath} rel="prev">
              Prev {}
            </Link>
          )}
          {Array.from(rangeArray, i => (
            <li
              key={`pagination-number${i}`}
              style={{
                margin: 0,
              }}
            >
              <Link
                to={`/${i === 1 ? '' : i}`}
                style={{
                  boxShadow: 'none',
                  padding: rhythm(1 / 4),
                  marginLeft: '10px',
                  marginRight: '10px',
                  textDecoration: 'none',
                  color: 'purple',
                  opacity: i === humanPageNumber ? '1' : '0.5',
                  fontWeight: i === humanPageNumber ? 'bolder' : 'inherit'
                }}
              >
                {i}
              </Link>
            </li>
          ))}
          {!isLastGroup &&
            (<Link style={{boxShadow: 'none', marginLeft: '0px', color: 'purple', }} to={nextPagePath} rel="next">
              ... Next
            </Link>)}
        </ul>
    </Layout>
  )
}


function range(start, stop, step) {
  if (typeof stop == 'undefined') {
      // one param defined
      stop = start;
      start = 0;
  }

  if (typeof step == 'undefined') {
      step = 1;
  }

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
      return [];
  }

  var result = [];
  for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
      result.push(i);
  }

  return result;
};

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  query(    
    $skip: Int! 
    $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulBlogPost(sort: {fields: createdAt, order: DESC}, skip: $skip limit: $limit) {
      edges {
        node {
          title
          author
          subtitle
          slug
          id
          createdAt(formatString: "MMMM DD, YYYY")
          body {
            raw
          }
        }
      }
    }
  }
`
