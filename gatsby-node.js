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
      allContentfulBlogPost(sort: {fields: createdAt, order: DESC}) {
        edges {
          node {
            author
            subtitle
            slug
            id
            createdAt(formatString: "MMMM DD, YYYY")
            body {
              raw
              references {
                ... on ContentfulAsset {
                  id
                  contentful_id
                  sys {
                    type
                  }
                  url
                }
              }
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

  // Create blog posts pages

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