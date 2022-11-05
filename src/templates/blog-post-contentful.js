import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
// const { documentToReactComponents } = require('@contentful/rich-text-react-renderer');
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from "@contentful/rich-text-types";

const BlogPostContentfulTemplate = ({
  data: { previous, next, site, contentfulBlogPost : post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`


  function renderOptions(references) {
    const assetMap = new Map();
    console.log(references)
    for (const reference of references) {
      console.log(reference)
      if (reference.sys.type == "Asset") {
        assetMap.set(reference.contentful_id, reference)
      }
    }
  
    return {
      renderNode: {
        [BLOCKS.EMBEDDED_ASSET]: (node, next) => {
          const asset = assetMap.get(node.data.target.sys.id)
          return (
            <img src={asset.url} width="630" alt="My image alt text" />
          );
        },
      },
    };
  }

  return (
    <Layout location={location} title={siteTitle}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.title}</h1>
          <p>{post.createdAt}</p>
        </header>
        <section itemProp="articleBody">{documentToReactComponents(JSON.parse(post.body.raw), renderOptions(post.body.references))}</section>
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={"/" + previous.slug} rel="prev">
                ← {previous.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={"/" + next.slug} rel="next">
                {next.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export const Head = ({ data: { contentfulBlogPost: post } }) => {
  return (
    <Seo
      title={post.title}
      description={post.subtitle}
    />
  )
}

export default BlogPostContentfulTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    contentfulBlogPost(id: { eq: $id }) {
      title
      id
      subtitle
      slug
      createdAt(formatString: "MMMM DD, YYYY")
      body {
        raw
        references {
          id
          contentful_id
          sys {
            type
          }
          url
        }
      }
    }
    previous: contentfulBlogPost(id: { eq: $previousPostId }) {
      slug
      title
    }
    next: contentfulBlogPost(id: { eq: $nextPostId }) {
      slug
      title
    }
  }
`