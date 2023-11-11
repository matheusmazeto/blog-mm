import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { getAllPosts, sortPostsByDate } from 'utils/blog.server'

export async function loader() {
  const posts = await getAllPosts()

  sortPostsByDate(posts)

  return json({ posts })
}

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>()

  // console.log({ posts })

  return (
    <main>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post?.slug}>
            <Link to={post?.slug} className="text-blue-600 underline">
              {post?.slug}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
