const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const { documentToReactComponents } = require('@contentful/rich-text-react-renderer');

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/blog-post-contentful.js`)

  // Get all blog posts from contenful
  const result = await graphql(
    `
    {
      allContentfulBlogPost {
        edges {
          node {
            author
            subtitle
            slug
            id
            body {
              raw
            }
            image {
              url
            }
          }
        }
      }
    }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allContentfulBlogPost.edges
  // const temp = posts[0].node.body.raw
  // console.log("thisworks");
  // console.log(documentToReactComponents(JSON.parse(temp)));


  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].node.id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].node.id
      console.log("highschool")
      console.log(post.node.slug)

      createPage({
        path: post.node.slug,
        component: blogPost,
        context: {
          id: post.node.id,
          previousPostId,
          nextPostId,
        },
      })
    })
  }
}


exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `)
}
