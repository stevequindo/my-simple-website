import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

import { rhythm, scale } from '../utils/typography'


const BlogIndex = ({ data, location, pageContext }) => {
  const { humanPageNumber, numberOfPages, previousPagePath, nextPagePath } = pageContext;

  console.log(pageContext)
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allContentfulBlogPost.edges

  const isFirst = humanPageNumber === 1 ? true : false;
  const isLast = humanPageNumber === numberOfPages ? true : false;

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
                }} to={post.node.slug}>
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
      {!isFirst && (
            <Link style={{boxShadow: 'none', marginRight: '10px', color: 'purple'}} to={previousPagePath} rel="prev">
              Prev
            </Link>
          )}
          {Array.from({ length: numberOfPages }, (_, i) => (
            <li
              key={`pagination-number${i + 1}`}
              style={{
                margin: 0,
              }}
            >
              <Link
                to={`/${i === 0 ? '' : i + 1}`}
                style={{
                  boxShadow: 'none',
                  padding: rhythm(1 / 4),
                  marginLeft: '10px',
                  marginRight: '10px',
                  textDecoration: 'none',
                  color: 'purple',
                  opacity: i + 1 === humanPageNumber ? '1' : '0.5',
                  // background: i + 1 === humanPageNumber ? '#007acc' : '',
                }}
              >
                {i + 1}
              </Link>
            </li>
          ))}
          {!isLast && (
            <Link style={{boxShadow: 'none', marginLeft: '10px', color: 'purple'}} to={nextPagePath} rel="next">
              Next
            </Link>
          )}
        </ul>
    </Layout>
  )
}

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
