const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const { documentToReactComponents } = require('@contentful/rich-text-react-renderer')
const { paginate } = require('gatsby-awesome-pagination')


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
            subtitle
            slug
            id
            createdAt(formatString: "DD MMMM, YYYY")
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

  // Create paginated pages
  paginate({
    createPage, // The Gatsby `createPage` function
    items: posts, // An array of objects
    itemsPerPage: 5, // How many items you want per page
    pathPrefix: '/', // Creates pages like `/blog`, `/blog/2`, etc
    component: path.resolve('./src/templates/index.js'), // Just like `createPage()`
  })


  // Create blog posts pages
  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].node.id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].node.id
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