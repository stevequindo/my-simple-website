import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

import { rhythm, scale } from '../utils/typography'


const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allContentfulBlogPost.edges

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
